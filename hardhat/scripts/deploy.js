async function main() {
    const LatencyCheck = await ethers.getContractFactory("LatencyCheck");
    const latencyCheck = await LatencyCheck.deploy();

    await latencyCheck.deployed();
    console.log("LatencyCheck deployed to:", latencyCheck.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });