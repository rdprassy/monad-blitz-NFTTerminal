"use client";

import { useState } from "react";
import {
  TrendingUp,
  Users,
  Activity,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const mockStats = [
  {
    label: "Total Minted",
    value: "2,847",
    change: "+12.5%",
    trend: "up",
    icon: Activity,
  },
  {
    label: "Unique Holders",
    value: "1,203",
    change: "+8.3%",
    trend: "up",
    icon: Users,
  },
  {
    label: "Total Volume",
    value: "142.5 MON",
    change: "+23.1%",
    trend: "up",
    icon: TrendingUp,
  },
  {
    label: "Floor Price",
    value: "0.05 MON",
    change: "-2.1%",
    trend: "down",
    icon: Layers,
  },
];

const mockMintHistory = [
  { date: "Feb 28", mints: 342 },
  { date: "Feb 27", mints: 287 },
  { date: "Feb 26", mints: 415 },
  { date: "Feb 25", mints: 198 },
  { date: "Feb 24", mints: 523 },
  { date: "Feb 23", mints: 367 },
  { date: "Feb 22", mints: 289 },
];

const mockTopHolders = [
  { address: "0x1234...abcd", count: 47, percentage: 1.65 },
  { address: "0x5678...efgh", count: 35, percentage: 1.23 },
  { address: "0x9abc...ijkl", count: 28, percentage: 0.98 },
  { address: "0xdef0...mnop", count: 22, percentage: 0.77 },
  { address: "0x1357...qrst", count: 19, percentage: 0.67 },
];

const mockRecentTransfers = [
  { from: "0xaaa...111", to: "0xbbb...222", tokenId: 1842, time: "2 min ago" },
  { from: "0xccc...333", to: "0xddd...444", tokenId: 927, time: "5 min ago" },
  { from: "0xeee...555", to: "0xfff...666", tokenId: 2103, time: "12 min ago" },
  { from: "0x111...777", to: "0x222...888", tokenId: 556, time: "18 min ago" },
  { from: "0x333...999", to: "0x444...000", tokenId: 1337, time: "25 min ago" },
];

export default function AnalyticsPage() {
  const [contractAddress, setContractAddress] = useState("");
  const handleLoad = () => {
    // In production, this would fetch on-chain data for the contract
  };

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
          <button onClick={handleLoad} className="btn-primary whitespace-nowrap">
            Load Analytics
          </button>
        </div>
      </div>

      {/* Demo Data (always shown for demonstration) */}
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {mockStats.map((stat) => (
          <div key={stat.label} className="glass-card p-5">
            <div className="flex items-center justify-between mb-3">
              <stat.icon size={20} className="text-monad-purple-light" />
              <span
                className={`flex items-center gap-1 text-xs font-medium ${
                  stat.trend === "up" ? "text-monad-accent" : "text-red-400"
                }`}
              >
                {stat.trend === "up" ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {stat.change}
              </span>
            </div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mint History Chart (visual bar representation) */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Mint History (7 days)</h3>
          <div className="space-y-3">
            {mockMintHistory.map((day) => {
              const maxMints = Math.max(...mockMintHistory.map((d) => d.mints));
              const widthPercent = (day.mints / maxMints) * 100;
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
        </div>

        {/* Top Holders */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Top Holders</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-12 text-xs text-gray-500 pb-2 border-b border-monad-dark-border">
              <span className="col-span-1">#</span>
              <span className="col-span-5">Address</span>
              <span className="col-span-3 text-right">Held</span>
              <span className="col-span-3 text-right">% Supply</span>
            </div>
            {mockTopHolders.map((holder, i) => (
              <div key={holder.address} className="grid grid-cols-12 text-sm items-center">
                <span className="col-span-1 text-gray-500">{i + 1}</span>
                <span className="col-span-5 text-gray-300 font-mono text-xs">{holder.address}</span>
                <span className="col-span-3 text-right text-white">{holder.count}</span>
                <span className="col-span-3 text-right text-monad-purple-light">{holder.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transfers */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Transfers</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-gray-500 border-b border-monad-dark-border">
                <th className="text-left pb-3 font-medium">From</th>
                <th className="text-left pb-3 font-medium">To</th>
                <th className="text-left pb-3 font-medium">Token ID</th>
                <th className="text-right pb-3 font-medium">Time</th>
              </tr>
            </thead>
            <tbody>
              {mockRecentTransfers.map((tx, i) => (
                <tr key={i} className="border-b border-monad-dark-border/50 last:border-0">
                  <td className="py-3 text-sm text-gray-300 font-mono">{tx.from}</td>
                  <td className="py-3 text-sm text-gray-300 font-mono">{tx.to}</td>
                  <td className="py-3 text-sm text-white">#{tx.tokenId}</td>
                  <td className="py-3 text-sm text-gray-400 text-right">{tx.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
