import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "MON");

  const NFTTerminal = await ethers.getContractFactory("NFTTerminal");

  const name = process.env.COLLECTION_NAME || "My NFT Collection";
  const symbol = process.env.COLLECTION_SYMBOL || "MNFT";
  const maxSupply = process.env.MAX_SUPPLY || "10000";
  const mintPrice = ethers.parseEther(process.env.MINT_PRICE || "0.01");
  const maxPerWallet = process.env.MAX_PER_WALLET || "5";
  const baseURI = process.env.BASE_URI || "ipfs://QmYourHash/";

  console.log("\nDeployment Parameters:");
  console.log("  Name:", name);
  console.log("  Symbol:", symbol);
  console.log("  Max Supply:", maxSupply);
  console.log("  Mint Price:", ethers.formatEther(mintPrice), "MON");
  console.log("  Max Per Wallet:", maxPerWallet);
  console.log("  Base URI:", baseURI);

  const nft = await NFTTerminal.deploy(
    name,
    symbol,
    maxSupply,
    mintPrice,
    maxPerWallet,
    baseURI
  );

  await nft.waitForDeployment();

  const address = await nft.getAddress();
  console.log("\nNFTTerminal deployed to:", address);
  console.log(
    "Explorer:",
    `https://testnet.monadexplorer.com/address/${address}`
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
