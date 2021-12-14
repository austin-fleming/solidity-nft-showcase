const main = async () => {
  const contractFactory = await hre.ethers.getContractFactory("NFTContract"); // compile contract and add export artifacts
  const nftContract = await contractFactory.deploy();
  await nftContract.deployed();

  console.log("Contract deployed to:", nftContract.address);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

runMain();
