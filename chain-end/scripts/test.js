const main = async () => {
  console.log("#### 🧪 STARTING TEST 🧪 ####");

  console.group("\nDeploying contract: ");
  const contractFactory = await hre.ethers.getContractFactory("NFTContract"); // compile contract and add export artifacts
  const nftContract = await contractFactory.deploy();
  await nftContract.deployed();
  console.log("Contract deployed to:", nftContract.address);
  console.groupEnd();

  console.group("\nCreate NFT:");
  const txn01 = await nftContract.makeAnNFT();
  await txn01.wait();
  console.groupEnd();

  console.group("\nCreate another NFT:");
  const txn02 = await nftContract.makeAnNFT();
  await txn02.wait();
  console.groupEnd();

  console.log("\n#### ✅ TEST COMPLETE ✅ ####");
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
