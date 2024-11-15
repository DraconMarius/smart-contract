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
const Error = require("./db/models/error");

const Key = process.env.ALCHEMY_API_KEY;



const configs = {
    Eth: {
        rpc: `https://eth-sepolia.g.alchemy.com/v2/${Key}`,
        contract: `0xE61DD73008A3c66fBF9A9f7c5785f2B68139475d`
    },
    Polygon: {
        rpc: `https://polygon-amoy.g.alchemy.com/v2/${Key}`,
        contract: `0xB134BB71d6DE99dB9C18F87f61bD7313b20670F6`
    },
    Arbitrum: {
        rpc: `https://arb-sepolia.g.alchemy.com/v2/${Key}`,
        contract: `0xa51c0FB50104Ac305Ed394974eb9bfAD0f9F66e7`
    },
    // Optimism: {
    //     apiKey: `https://opt-sepolia.g.alchemy.com/v2/${Key}`,
    //     network: Network.OPT_SEPOLIA
    // },
    Base: {
        rpc: `https://base-sepolia.g.alchemy.com/v2/${Key}`,
        contract: `0xfda7803d2c773d755F96CB14685aCcB34b85ed87`
    }
};

// ABI of the smart contract
const contractABI = [
    "function checkLatency() public",
    "function readLatency() public view returns (uint256)",
    "event ContractCalled(address indexed caller, uint256 timestamp)",
    "event ContractRead(address indexed reader, uint256 timestamp)"
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

const saveToDb = async (net, txHash, startT, endT, writeLatency, readLatency, caller) => {
    const idData = await getID(net);

    const newEntry = await Entry.create({
        net_id: idData,
        tx_hash: txHash,
        start_time: startT,
        end_time: endT,
        write_latency: writeLatency,
        read_latency: readLatency,
        caller,
        timestamp: getTime()
    });
    return newEntry;
};

let wss

sequelize.sync({ force: false })
    .then(() => Net.sync())
    .then(() => Entry.sync())
    .then(() => Error.sync())
    .then(() => {
        const server = app.listen(PORT, () => {
            console.log(`Server is listening on port ${PORT}`);
        });
        wss = new WebSocket.Server({ server });

        //ping to keep connection open instead
        setInterval(() => {
            if (wss) {
                wss.clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({ type: 'ping' }));
                    }
                });
            }
        }, 30000);

        wss.on('connection', (ws) => {
            console.log('Frontend connected');

            ws.on('close', () => {
                console.log('Frontend disconnected');
            });
        });


        Object.entries(configs).map(async ([net, config]) => {
            console.log(`Setting up provider for ${net}`);

            const alchemyProvider = new ethers.providers.JsonRpcProvider(config.rpc);

            const wallet = new ethers.Wallet(process.env.SECRET_KEY, alchemyProvider);
            // Create contract instance
            const contract = new ethers.Contract(config.contract, contractABI, wallet);


            let callT

            // Listen for the ContractCalled event
            contract.on("ContractCalled", async (caller, timestamp, event) => {
                const writeLatency = calcAge(callT, timestamp.toNumber() * 1000);
                const txHash = event.transactionHash;

                notifyClients({ message: 'event listened', log: `Contract called, saving write latency for ${net}` });
                console.log(`${net} Transaction Hash from event: ${txHash}`);

                try {
                    // Call readLatency and convert it to a string before saving
                    const readLatencyBN = await contract.readLatency();
                    const readLatency = `${readLatencyBN.toString()} milliseconds`;

                    await saveToDb(net, txHash, callT, new Date(timestamp.toNumber() * 1000), writeLatency.toString(), readLatency, caller);
                    notifyClients({ message: 'update', log: `Latencies saved for ${net}` });
                } catch (err) {
                    console.error(`Error calling readLatency for ${net}:`, err);
                    notifyClients({ message: 'error', log: `Error: readLatency not retrieved for ${net}`, error: err });
                }
            });



            cron.schedule('0,30 * * * *', async () => {
                console.log('Calling contract function every 30 minutes');
                callT = Date.now();
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
                            gasLimit: "350000"
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
    });
