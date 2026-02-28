"use client";

import { useAccount, useBalance, useBlockNumber, usePublicClient } from "wagmi";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Rocket,
  Users,
  BarChart3,
  Shield,
  Layers,
  Activity,
  ArrowUpRight,
  Wallet,
  Cpu,
} from "lucide-react";
import { NFT_TERMINAL_ABI } from "@/lib/contracts";
import { getDeployedContracts, addDeployedContract, DeployedContract } from "@/lib/deployedContracts";

const quickActions = [
  {
    title: "Deploy Collection",
    description: "Launch a new ERC-721 collection on Monad",
    href: "/dashboard/deploy",
    icon: Rocket,
    color: "from-monad-purple to-monad-purple-dark",
  },
  {
    title: "Manage Allowlist",
    description: "Add or remove addresses from your whitelist",
    href: "/dashboard/allowlist",
    icon: Users,
    color: "from-monad-accent to-monad-accent-dark",
  },
  {
    title: "View Analytics",
    description: "Track mint volume, holders, and transfers",
    href: "/dashboard/analytics",
    icon: BarChart3,
    color: "from-blue-500 to-blue-700",
  },
  {
    title: "Token Gating",
    description: "Generate access-control code snippets",
    href: "/dashboard/gating",
    icon: Shield,
    color: "from-orange-500 to-orange-700",
  },
];

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const publicClient = usePublicClient();

  const [totalMinted, setTotalMinted] = useState<string>("0");
  const [contracts, setContracts] = useState<DeployedContract[]>([]);

  // Seed the already-deployed contract on first load
  useEffect(() => {
    addDeployedContract({
      address: "0x44eb47fdca09d1baee865390991155d5abb49abc",
      name: "NFT Terminal",
      symbol: "NFTT",
      maxSupply: "10000",
      mintPrice: "0.01",
      deployedAt: 1740700000000,
      txHash: "",
    });
    setContracts(getDeployedContracts());
  }, []);

  // Refresh contract list when window regains focus (picks up new deploys)
  useEffect(() => {
    const onFocus = () => setContracts(getDeployedContracts());
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  // Fetch total minted across all deployed contracts
  useEffect(() => {
    async function fetchTotalMinted() {
      if (!publicClient || contracts.length === 0) return;
      let total = BigInt(0);
      for (const c of contracts) {
        try {
          const supply = await publicClient.readContract({
            address: c.address as `0x${string}`,
            abi: NFT_TERMINAL_ABI,
            functionName: "totalSupply",
          });
          total += BigInt(supply as bigint);
        } catch {
          // skip inaccessible contracts
        }
      }
      setTotalMinted(String(total));
    }
    fetchTotalMinted();
  }, [publicClient, blockNumber, contracts]);

  const balanceFormatted = balance
    ? `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}`
    : "— MON";

  const stats = [
    { label: "Wallet Balance", value: balanceFormatted, icon: Wallet, change: isConnected ? "Live" : "" },
    { label: "Collections Deployed", value: String(contracts.length), icon: Layers, change: contracts.length > 0 ? contracts[contracts.length - 1].name : "" },
    { label: "Total Minted", value: totalMinted, icon: Activity, change: "" },
    { label: "Block Number", value: blockNumber ? blockNumber.toLocaleString() : "—", icon: Cpu, change: "Monad Testnet" },
  ];

  return (
    <div className="space-y-8 py-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">
          {isConnected
            ? `Welcome back. Connected as ${address?.slice(0, 6)}...${address?.slice(-4)}`
            : "Connect your wallet to get started."}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="glass-card p-5">
            <div className="flex items-center justify-between mb-3">
              <stat.icon size={20} className="text-monad-purple-light" />
              {stat.change && (
                <span className="text-xs text-monad-accent">{stat.change}</span>
              )}
            </div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              href={action.href}
              className="glass-card p-6 hover:border-monad-purple/40 transition-all duration-300 group"
            >
              <div className="flex items-start justify-between">
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-4`}
                >
                  <action.icon size={20} className="text-white" />
                </div>
                <ArrowUpRight
                  size={18}
                  className="text-gray-500 group-hover:text-monad-purple transition-colors"
                />
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">
                {action.title}
              </h3>
              <p className="text-sm text-gray-400">{action.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity Placeholder */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
        <div className="glass-card p-8 text-center">
          <Activity size={40} className="text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-sm">
            No recent activity. Deploy your first collection to get started.
          </p>
          <Link
            href="/dashboard/deploy"
            className="btn-primary inline-flex items-center gap-2 mt-4 text-sm py-2 px-4"
          >
            <Rocket size={16} />
            Deploy Now
          </Link>
        </div>
      </div>
    </div>
  );
}
