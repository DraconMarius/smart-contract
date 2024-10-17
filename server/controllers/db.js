const router = require("express").Router();
const { Net, Entry } = require("../db/models");

const configs = {
    Eth: {
        rpc: `https://eth-sepolia.g.alchemy.com/v2/`,
        contract: `0xB3A2bF2c143970c10618ED8E4007b68D55e63eb0`
    },
    Polygon: {
        rpc: `https://polygon-amoy.g.alchemy.com/v2/`,
        contract: `0xB13a80d106f97669D53E64004DC4507c8D2C02BD`
    },
    Arbitrum: {
        rpc: `https://arb-sepolia.g.alchemy.com/v2/`,
        contract: `0xD830Bf02536F8F7c22E359A6d775219F52374FE9`
    },
    // Optimism: {
    //     apiKey: Key,
    //     network: Network.OPT_SEPOLIA
    // },
    Base: {
        rpc: `https://base-sepolia.g.alchemy.com/v2/`,
        contract: `0xfE45f33b94953D779De8CB97D87f4e700f7684aC`
    }
};

const getID = async (net) => {
    try {
        const results = await Net.findOne({
            where: {
                name: net
            }
        });
        // idRes = results.get({ plain: true }); //<--- get plain true to return json data value
        console.log(results.dataValues.id)
        return (
            results.dataValues.id);
    } catch (err) {
        console.error(err);
        throw err;
    }
};

router.get("/getDb", async (req, res) => {
    console.log('==================getting DB data==================');

    try {
        const results = await Promise.all(
            Object.entries(configs).map(async ([net, _config]) => {
                const idData = await getID(net);

                // Query for Avg and Tx data for the given network
                const entryData = await Entry.findAll({
                    where: { net_id: idData },
                    order: [['timestamp', 'DESC']]
                });

                return { [net]: entryData };
            })
        );

        // Combine the results into a single object
        const combinedResults = results.reduce((acc, result) => ({ ...acc, ...result }), {});
        console.log(combinedResults);

        res.json(combinedResults);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;