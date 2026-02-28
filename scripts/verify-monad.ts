import { ethers } from "hardhat";

async function main() {
  console.log("=== Monad Testnet Connectivity Check ===\n");

  const network = await ethers.provider.getNetwork();
  console.log("Chain ID:", network.chainId.toString());

  const blockNumber = await ethers.provider.getBlockNumber();
  console.log("Latest Block:", blockNumber);

  const feeData = await ethers.provider.getFeeData();
  console.log("Gas Price:", ethers.formatUnits(feeData.gasPrice || 0n, "gwei"), "Gwei");

  const block = await ethers.provider.getBlock("latest");
  if (block) {
    console.log("Block Timestamp:", new Date(block.timestamp * 1000).toISOString());
    console.log("Block Hash:", block.hash);
    console.log("Transactions in Block:", block.transactions.length);
  }

  console.log("\n=== All checks passed! Monad Testnet is connected. ===");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Connection failed:", error.message);
    process.exit(1);
  });
