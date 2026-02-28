import { createPublicClient, createWalletClient, http, formatEther, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { readFileSync } from "fs";

// Load compiled contract artifact
const artifact = JSON.parse(
  readFileSync("./artifacts/contracts/NFTTerminal.sol/NFTTerminal.json", "utf8")
);

const PRIVATE_KEY = process.env.PRIVATE_KEY;
if (!PRIVATE_KEY) {
  console.error("ERROR: PRIVATE_KEY not set in .env");
  process.exit(1);
}

const monadTestnet = {
  id: 10143,
  name: "Monad Testnet",
  nativeCurrency: { name: "Monad", symbol: "MON", decimals: 18 },
  rpcUrls: { default: { http: ["https://testnet-rpc.monad.xyz"] } },
};

const account = privateKeyToAccount(`0x${PRIVATE_KEY.replace("0x", "")}`);

const publicClient = createPublicClient({
  chain: monadTestnet,
  transport: http(),
});

const walletClient = createWalletClient({
  account,
  chain: monadTestnet,
  transport: http(),
});

// Deployment parameters
const COLLECTION_NAME = "NFT Terminal Collection";
const COLLECTION_SYMBOL = "NFTC";
const MAX_SUPPLY = 10000n;
const MINT_PRICE = parseEther("0.01");
const MAX_PER_WALLET = 5n;
const BASE_URI = "ipfs://QmPlaceholder/";

async function main() {
  console.log("=== NFT Terminal — Contract Deployment ===\n");
  console.log("Deployer:", account.address);

  const balance = await publicClient.getBalance({ address: account.address });
  console.log("Balance:", formatEther(balance), "MON\n");

  console.log("Deployment Parameters:");
  console.log("  Name:", COLLECTION_NAME);
  console.log("  Symbol:", COLLECTION_SYMBOL);
  console.log("  Max Supply:", MAX_SUPPLY.toString());
  console.log("  Mint Price:", formatEther(MINT_PRICE), "MON");
  console.log("  Max Per Wallet:", MAX_PER_WALLET.toString());
  console.log("  Base URI:", BASE_URI);
  console.log("\nDeploying...");

  // Encode constructor arguments
  const { abi, bytecode } = artifact;

  const hash = await walletClient.deployContract({
    abi,
    bytecode: bytecode,
    args: [COLLECTION_NAME, COLLECTION_SYMBOL, MAX_SUPPLY, MINT_PRICE, MAX_PER_WALLET, BASE_URI],
  });

  console.log("Transaction Hash:", hash);
  console.log("Waiting for confirmation...");

  const receipt = await publicClient.waitForTransactionReceipt({ hash });

  console.log("\n=== Deployment Successful! ===");
  console.log("Contract Address:", receipt.contractAddress);
  console.log("Block Number:", receipt.blockNumber.toString());
  console.log("Gas Used:", receipt.gasUsed.toString());
  console.log("Explorer:", `https://testnet.monadexplorer.com/address/${receipt.contractAddress}`);
}

main().catch((err) => {
  console.error("\nDeployment failed:", err.message);
  process.exit(1);
});
