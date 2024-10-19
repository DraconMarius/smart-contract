require('dotenv').config();
const path = require("path");
const cron = require('node-cron');

const express = require('express');
const session = require("express-session");
const { ethers } = require('ethers');
const { calcAge, getTime } = require('./util/age');
const SequalizeStore = require("connect-session-sequelize")(session.Store);
const WebSocket = require('ws');
const app = express();
const routes = require("./controllers/index.js");
const sequelize = require('./db/config/connection');
const PORT = process.env.PORT || 3001;
// const { Alchemy, Network, Wallet } = require('alchemy-sdk');
const Net = require("./db/models/net");
const Entry = require("./db/models/entry");
const Key = process.env.ALCHEMY_API_KEY;


//alchemy instance
// const alchemy = new Alchemy(configs.Eth);
const configs = {
    Eth: {
        rpc: `https://eth-sepolia.g.alchemy.com/v2/${Key}`,
        contract: `0xB3A2bF2c143970c10618ED8E4007b68D55e63eb0`
    },
    Polygon: {
        rpc: `https://polygon-amoy.g.alchemy.com/v2/${Key}`,
        contract: `0xB13a80d106f97669D53E64004DC4507c8D2C02BD`
    },
    Arbitrum: {
        rpc: `https://arb-sepolia.g.alchemy.com/v2/${Key}`,
        contract: `0xD830Bf02536F8F7c22E359A6d775219F52374FE9`
    },
    // Optimism: {
    //     apiKey: Key,
    //     network: Network.OPT_SEPOLIA
    // },
    Base: {
        rpc: `https://base-sepolia.g.alchemy.com/v2/${Key}`,
        contract: `0xfE45f33b94953D779De8CB97D87f4e700f7684aC`
    }
};

// ABI of the smart contract
const contractABI = [
    "function checkLatency() public",
    "event ContractCalled(address indexed caller, uint256 timestamp)"
];

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
}
const sess = {
    secret: process.env.SECRET,
    cookies: {},
    resave: false,
    saveUninitialized: true,
    store: new SequalizeStore({
        db: sequelize,
    })
};

app.use(session(sess));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use(routes)

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
})

const notifyClients = (data) => {
    console.log('Notifying clients:', data);
    if (wss) {
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data));
            }
        });
    }
};

const getID = async (net) => {
    try {
        const results = await Net.findOne({
            where: {
                name: net
            }
        });
        idRes = results.get({ plain: true }); //<--- get plain true to return json data value
        console.log(idRes)
        console.log(idRes.id)
        const resultID = idRes.id
        return (
            resultID);
    } catch (err) {
        console.error(err);
        throw err;
    }
};

const saveToDb = async (net, txHash, startT, endT, latency, caller) => {
    const idData = await getID(net);

    const newEntry = await Entry.create({
        net_id: idData,
        tx_hash: txHash,
        start_time: startT,
        end_time: endT,
        latency,
        caller,
        timestamp: getTime()
    })

    return newEntry;
}

let wss

sequelize.sync({ force: false })
    .then(() => Net.sync())
    .then(() => Entry.sync())
    .then(() => {
        const server = app.listen(PORT, () => {
            console.log(`Server is listening on port ${PORT}`);
        });
        wss = new WebSocket.Server({ server });

        wss.on('connection', (ws) => {
            console.log('Frontend connected');

            ws.on('close', () => {
                console.log('Frontend disconnected');
            });
        });
    });

Object.entries(configs).map(async ([net, config]) => {
    console.log(`Setting up provider for ${net}`);

    const alchemyProvider = new ethers.providers.JsonRpcProvider(config.rpc);

    const wallet = new ethers.Wallet(process.env.SECRET_KEY, alchemyProvider);
    // Create contract instance
    const contract = new ethers.Contract(config.contract, contractABI, wallet);

    // Listen for the ContractCalled event
    contract.on("ContractCalled", (caller, timestamp, event) => {
        const now = Date.now();  // Get current time in milliseconds
        const latency = calcAge(timestamp.toNumber() * 1000, now)
        const txHash = event.transactionHash;
        // console.log(txHash, event.transactionHash)
        saveToDb(net, txHash, new Date(timestamp.toNumber() * 1000), now, latency, caller);

        console.log(`${net} Transaction Hash from event: ${txHash}`);
        console.log(`Event received! Latency: ${latency}`);
        console.log(`Caller Address: ${caller}`);
        console.log(`Timestamp: ${new Date(timestamp.toNumber() * 1000).toLocaleString()}`);
        notifyClients({ message: `Contract function called, transaction confirmed for ${net}` })
    });
    cron.schedule('0,30 * * * *', async () => {
        console.log('Calling contract function every 30 minutes');

        try {
            // Call the 'checkLatency' function in the contract
            if (net === "Polygon") {

                const tx = await contract.checkLatency({
                    maxPriorityFeePerGas: ethers.utils.parseUnits('26', 'gwei'),
                    maxFeePerGas: ethers.utils.parseUnits('26', 'gwei'),
                    gasLimit: "300000"
                });

                // Wait for the transaction to be mined
                const receipt = await tx.wait();
                console.log(`Transaction mined ${net}:`, receipt.transactionHash);
            } else {
                const tx = await contract.checkLatency({
                    gasLimit: "300000"
                });

                // Wait for the transaction to be mined
                const receipt = await tx.wait();
                console.log(`Transaction mined ${net}:`, receipt.transactionHash);
            }

            // notifyClients({ message: 'Contract function called, transaction confirmed.' });

        } catch (err) {
            console.error('Error calling contract function:', err);
        }

    });
});
