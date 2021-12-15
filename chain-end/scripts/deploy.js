const main = async () => {
  console.log("#### 🚀 STARTING DEPLOY 🚀 ####");

  console.group("\nDeploying contract: ");
  const contractFactory = await hre.ethers.getContractFactory("NFTContract"); // compile contract and add export artifacts
  const nftContract = await contractFactory.deploy();
  await nftContract.deployed();
  console.log("Contract deployed to:", nftContract.address);
  console.groupEnd();

  console.group("\nMinting NFT #1...");
  const txn01 = await nftContract.makeAnNFT();
  await txn01.wait();
  console.log("minted!");
  console.groupEnd();

  console.group("\nMinting NFT #2...");
  const txn02 = await nftContract.makeAnNFT();
  await txn02.wait();
  console.log("Minted!");
  console.groupEnd();

  console.log("\n#### ✅ DEPLOY COMPLETE ✅ ####");
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
