import { createPublicClient, http, formatGwei } from "viem";

const monadTestnet = {
  id: 10143,
  name: "Monad Testnet",
  nativeCurrency: { name: "Monad", symbol: "MON", decimals: 18 },
  rpcUrls: { default: { http: ["https://testnet-rpc.monad.xyz"] } },
};

const client = createPublicClient({
  chain: monadTestnet,
  transport: http(),
});

async function main() {
  console.log("=== Monad Testnet Connectivity Check ===\n");

  const chainId = await client.getChainId();
  console.log("Chain ID:", chainId, chainId === 10143 ? "✅" : "❌");

  const blockNumber = await client.getBlockNumber();
  console.log("Latest Block:", blockNumber.toString(), "✅");

  const gasPrice = await client.getGasPrice();
  console.log("Gas Price:", formatGwei(gasPrice), "Gwei ✅");

  const block = await client.getBlock({ blockTag: "latest" });
  console.log("Block Hash:", block.hash);
  console.log("Block Timestamp:", new Date(Number(block.timestamp) * 1000).toISOString());
  console.log("Transactions in Block:", block.transactions.length);

  // Test a read call — check the zero address balance
  const balance = await client.getBalance({ address: "0x0000000000000000000000000000000000000000" });
  console.log("Zero Address Balance:", (Number(balance) / 1e18).toFixed(4), "MON");

  console.log("\n=== All checks passed! Monad Testnet is live and connected. ===");
}

main().catch((err) => {
  console.error("❌ Connection failed:", err.message);
  process.exit(1);
});
