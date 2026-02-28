"use client";

import { useState, useEffect, useCallback } from "react";
import { usePublicClient, useBlockNumber } from "wagmi";
import { formatEther, parseAbiItem } from "viem";
import {
  TrendingUp,
  Users,
  Activity,
  Layers,
  ArrowUpRight,
  Loader2,
  Search,
  AlertCircle,
} from "lucide-react";
import { NFT_TERMINAL_ABI, DEPLOYED_CONTRACT_ADDRESS } from "@/lib/contracts";
import { getDeployedContracts } from "@/lib/deployedContracts";

interface TransferEvent {
  from: string;
  to: string;
  tokenId: string;
  blockNumber: bigint;
  timeAgo: string;
}

interface HolderInfo {
  address: string;
  count: number;
  percentage: number;
}

interface MintDay {
  date: string;
  mints: number;
}

function shortenAddr(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export default function AnalyticsPage() {
  const publicClient = usePublicClient();
  const { data: latestBlock } = useBlockNumber({ watch: true });

  const [contractAddress, setContractAddress] = useState("");
  const [loadedAddress, setLoadedAddress] = useState<`0x${string}` | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Live data
  const [totalSupply, setTotalSupply] = useState(0);
  const [maxSupply, setMaxSupply] = useState(0);
  const [mintPrice, setMintPrice] = useState("0");
  const [ownerAddress, setOwnerAddress] = useState("");
  const [transfers, setTransfers] = useState<TransferEvent[]>([]);
  const [holders, setHolders] = useState<HolderInfo[]>([]);
  const [mintHistory, setMintHistory] = useState<MintDay[]>([]);
  const [totalVolume, setTotalVolume] = useState("0");

  // Auto-load deployed contract on mount
  useEffect(() => {
    const contracts = getDeployedContracts();
    if (contracts.length > 0) {
      setContractAddress(contracts[contracts.length - 1].address);
    } else if (DEPLOYED_CONTRACT_ADDRESS) {
      setContractAddress(DEPLOYED_CONTRACT_ADDRESS);
    }
  }, []);

  const fetchAnalytics = useCallback(async (addr: `0x${string}`) => {
    if (!publicClient) return;
    setLoading(true);
    setError("");

    try {
      // Read contract state
      const [supply, max, price, owner] = await Promise.all([
        publicClient.readContract({ address: addr, abi: NFT_TERMINAL_ABI, functionName: "totalSupply" }),
        publicClient.readContract({ address: addr, abi: NFT_TERMINAL_ABI, functionName: "maxSupply" }),
        publicClient.readContract({ address: addr, abi: NFT_TERMINAL_ABI, functionName: "mintPrice" }),
        publicClient.readContract({ address: addr, abi: NFT_TERMINAL_ABI, functionName: "owner" }),
      ]);

      setTotalSupply(Number(supply));
      setMaxSupply(Number(max));
      setMintPrice(formatEther(price as bigint));
      setOwnerAddress(String(owner));

      // Calculate total volume = totalSupply * mintPrice
      const vol = BigInt(supply as bigint) * BigInt(price as bigint);
      setTotalVolume(formatEther(vol));

      // Fetch Transfer events in chunks of 100 blocks (Monad RPC limit)
      const currentBlock = await publicClient.getBlockNumber();
      const scanRange = BigInt(2000); // ~1.1 hours of blocks
      const chunkSize = BigInt(99); // Monad limits eth_getLogs to 100 block range
      const startBlock = currentBlock > scanRange ? currentBlock - scanRange : BigInt(0);

      const transferEvent = parseAbiItem("event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)");

      // Build chunk ranges
      const chunks: { from: bigint; to: bigint }[] = [];
      for (let from = startBlock; from <= currentBlock; from += chunkSize + BigInt(1)) {
        const to = from + chunkSize > currentBlock ? currentBlock : from + chunkSize;
        chunks.push({ from, to });
      }

      // Fetch in parallel batches of 10
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const transferLogs: any[] = [];
      const batchSize = 10;
      for (let i = 0; i < chunks.length; i += batchSize) {
        const batch = chunks.slice(i, i + batchSize);
        const results = await Promise.allSettled(
          batch.map((c) =>
            publicClient.getLogs({
              address: addr,
              event: transferEvent,
              fromBlock: c.from,
              toBlock: c.to,
            })
          )
        );
        for (const r of results) {
          if (r.status === "fulfilled") transferLogs.push(...r.value);
        }
      }

      // Build recent transfers
      const recentTransfers: TransferEvent[] = transferLogs
        .slice(-20)
        .reverse()
        .map((log) => ({
          from: String(log.args.from),
          to: String(log.args.to),
          tokenId: String(log.args.tokenId),
          blockNumber: log.blockNumber,
          timeAgo: `Block ${log.blockNumber.toLocaleString()}`,
        }));
      setTransfers(recentTransfers);

      // Build holder map from transfer events
      const holderMap = new Map<string, number>();
      for (const log of transferLogs) {
        const from = String(log.args.from);
        const to = String(log.args.to);
        if (from !== "0x0000000000000000000000000000000000000000") {
          holderMap.set(from, (holderMap.get(from) || 0) - 1);
        }
        holderMap.set(to, (holderMap.get(to) || 0) + 1);
      }

      const totalMinted = Number(supply);
      const topHolders: HolderInfo[] = Array.from(holderMap.entries())
        .filter(([, count]) => count > 0)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([address, count]) => ({
          address,
          count,
          percentage: totalMinted > 0 ? parseFloat(((count / totalMinted) * 100).toFixed(2)) : 0,
        }));
      setHolders(topHolders);

      // Build mint history by block ranges (approximate days)
      // Group mints (transfers from 0x0) by approximate day
      const mintEvents = transferLogs.filter(
        (log) => String(log.args.from) === "0x0000000000000000000000000000000000000000"
      );
      const blocksPerDay = 43200; // ~2s blocks, ~43200 per day
      const days: MintDay[] = [];
      const now = new Date();
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const dayLabel = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        const dayEndBlock = currentBlock - BigInt(i * blocksPerDay);
        const dayStartBlock = currentBlock - BigInt((i + 1) * blocksPerDay);
        const dayMints = mintEvents.filter(
          (log) => log.blockNumber > dayStartBlock && log.blockNumber <= dayEndBlock
        ).length;
        days.push({ date: dayLabel, mints: dayMints });
      }
      setMintHistory(days);

      setLoadedAddress(addr);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load analytics.";
      setError(msg.length > 200 ? msg.slice(0, 200) + "..." : msg);
    } finally {
      setLoading(false);
    }
  }, [publicClient]);

  const handleLoad = () => {
    if (!contractAddress || !contractAddress.startsWith("0x")) {
      setError("Please enter a valid contract address.");
      return;
    }
    fetchAnalytics(contractAddress as `0x${string}`);
  };

  // Auto-refresh stats every new block
  useEffect(() => {
    if (loadedAddress && latestBlock) {
      // Light refresh — just contract state, not full event scan
      if (!publicClient) return;
      publicClient.readContract({ address: loadedAddress, abi: NFT_TERMINAL_ABI, functionName: "totalSupply" })
        .then((supply) => setTotalSupply(Number(supply)))
        .catch(() => {});
    }
  }, [latestBlock, loadedAddress, publicClient]);

  const uniqueHolders = holders.filter((h) => h.count > 0).length;

  const stats = [
    { label: "Total Minted", value: `${totalSupply.toLocaleString()} / ${maxSupply.toLocaleString()}`, icon: Activity, change: loadedAddress ? "Live" : "" },
    { label: "Unique Holders", value: String(uniqueHolders), icon: Users, change: "" },
    { label: "Total Volume", value: `${parseFloat(totalVolume).toFixed(4)} MON`, icon: TrendingUp, change: "" },
    { label: "Mint Price", value: `${mintPrice} MON`, icon: Layers, change: "" },
  ];

  return (
    <div className="space-y-8 py-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
        <p className="text-gray-400">
          Track mint events, holder distribution, and transfer history in real-time.
        </p>
      </div>

      {/* Contract Input */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Load Collection</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter contract address (0x...)"
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
            className="input-field flex-1"
          />
          <button onClick={handleLoad} disabled={loading} className="btn-primary whitespace-nowrap flex items-center gap-2">
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
            {loading ? "Loading..." : "Load Analytics"}
          </button>
        </div>
        {error && (
          <div className="flex items-center gap-2 text-red-400 text-sm mt-3">
            <AlertCircle size={14} />
            <span>{error}</span>
          </div>
        )}
        {loadedAddress && !error && (
          <p className="text-monad-accent text-xs mt-3">
            Loaded: {loadedAddress} {ownerAddress && `· Owner: ${shortenAddr(ownerAddress)}`}
          </p>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="glass-card p-5">
            <div className="flex items-center justify-between mb-3">
              <stat.icon size={20} className="text-monad-purple-light" />
              {stat.change && (
                <span className="flex items-center gap-1 text-xs font-medium text-monad-accent">
                  <ArrowUpRight size={12} />
                  {stat.change}
                </span>
              )}
            </div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mint History Chart */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Mint History (7 days)</h3>
          {mintHistory.length > 0 ? (
            <div className="space-y-3">
              {mintHistory.map((day) => {
                const maxMints = Math.max(...mintHistory.map((d) => d.mints), 1);
                const widthPercent = Math.max((day.mints / maxMints) * 100, day.mints > 0 ? 8 : 2);
                return (
                  <div key={day.date} className="flex items-center gap-3">
                    <span className="text-sm text-gray-400 w-14 flex-shrink-0">{day.date}</span>
                    <div className="flex-1 bg-monad-dark-secondary rounded-full h-6 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-monad-purple to-monad-accent rounded-full flex items-center justify-end px-2 transition-all duration-500"
                        style={{ width: `${widthPercent}%` }}
                      >
                        <span className="text-xs text-white font-medium">{day.mints}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-sm text-center py-8">Load a collection to see mint history.</p>
          )}
        </div>

        {/* Top Holders */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Top Holders</h3>
          {holders.length > 0 ? (
            <div className="space-y-3">
              <div className="grid grid-cols-12 text-xs text-gray-500 pb-2 border-b border-monad-dark-border">
                <span className="col-span-1">#</span>
                <span className="col-span-5">Address</span>
                <span className="col-span-3 text-right">Held</span>
                <span className="col-span-3 text-right">% Supply</span>
              </div>
              {holders.map((holder, i) => (
                <div key={holder.address} className="grid grid-cols-12 text-sm items-center">
                  <span className="col-span-1 text-gray-500">{i + 1}</span>
                  <span className="col-span-5 text-gray-300 font-mono text-xs">{shortenAddr(holder.address)}</span>
                  <span className="col-span-3 text-right text-white">{holder.count}</span>
                  <span className="col-span-3 text-right text-monad-purple-light">{holder.percentage}%</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm text-center py-8">No holders found. Load a collection first.</p>
          )}
        </div>
      </div>

      {/* Recent Transfers */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Transfers</h3>
        {transfers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-gray-500 border-b border-monad-dark-border">
                  <th className="text-left pb-3 font-medium">From</th>
                  <th className="text-left pb-3 font-medium">To</th>
                  <th className="text-left pb-3 font-medium">Token ID</th>
                  <th className="text-right pb-3 font-medium">Block</th>
                </tr>
              </thead>
              <tbody>
                {transfers.map((tx, i) => (
                  <tr key={i} className="border-b border-monad-dark-border/50 last:border-0">
                    <td className="py-3 text-sm text-gray-300 font-mono">
                      {tx.from === "0x0000000000000000000000000000000000000000" ? "Mint" : shortenAddr(tx.from)}
                    </td>
                    <td className="py-3 text-sm text-gray-300 font-mono">{shortenAddr(tx.to)}</td>
                    <td className="py-3 text-sm text-white">#{tx.tokenId}</td>
                    <td className="py-3 text-sm text-gray-400 text-right">{tx.timeAgo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-sm text-center py-8">No transfers found. Load a collection to see transfer history.</p>
        )}
      </div>
    </div>
  );
}
