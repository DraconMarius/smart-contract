

// https://polygonscan.com/tx/0x920fd4d7d6480dd1db28bd9c6e7f6c4791476996985288fbf3f730c8038f0ece

// https://arbiscan.io/

// https://optimistic.etherscan.io/

// https://basescan.org/

const scanUrl = {
    Eth: "https://sepolia.etherscan.io/",
    Polygon: "https://amoy.polygonscan.com/",
    Arbitrum: "https://sepolia.arbiscan.io/",
    Optimism: "https://sepolia.optimistic.etherscan.io/",
    Base: "https://sepolia.basescan.org/"
}

const contractAdd = {
    Eth: `0xB3A2bF2c143970c10618ED8E4007b68D55e63eb0`,
    Polygon: `0xB13a80d106f97669D53E64004DC4507c8D2C02BD`,
    Arbitrum: `0xD830Bf02536F8F7c22E359A6d775219F52374FE9`,
    Base: `0xfE45f33b94953D779De8CB97D87f4e700f7684aC`
}

export { scanUrl, contractAdd };