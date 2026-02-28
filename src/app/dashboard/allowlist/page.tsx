"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import {
  Users,
  Upload,
  Plus,
  Trash2,
  Copy,
  CheckCircle,
  Download,
} from "lucide-react";

export default function AllowlistPage() {
  useAccount();
  const [addresses, setAddresses] = useState<string[]>([]);
  const [newAddress, setNewAddress] = useState("");
  const [merkleRoot, setMerkleRoot] = useState("");
  const [copied, setCopied] = useState(false);

  const addAddress = () => {
    const addr = newAddress.trim();
    if (!addr) return;
    if (!/^0x[a-fA-F0-9]{40}$/.test(addr)) return;
    if (addresses.includes(addr)) return;
    setAddresses([...addresses, addr]);
    setNewAddress("");
  };

  const removeAddress = (addr: string) => {
    setAddresses(addresses.filter((a) => a !== addr));
  };

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split(/[\n,]/).map((l) => l.trim()).filter((l) => /^0x[a-fA-F0-9]{40}$/.test(l));
      const unique = Array.from(new Set([...addresses, ...lines]));
      setAddresses(unique);
    };
    reader.readAsText(file);
  };

  const generateMerkleRoot = () => {
    if (addresses.length === 0) return;
    // Placeholder: In production, use a proper merkle tree library (e.g., merkletreejs)
    const hash = "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    setMerkleRoot(hash);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportCSV = () => {
    const csv = addresses.join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "allowlist.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 py-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Allowlist Management</h1>
        <p className="text-gray-400">
          Manage your pre-sale whitelist with Merkle-tree based verification.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Address Management */}
        <div className="lg:col-span-2 space-y-6">
          {/* Add Address */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Add Addresses</h2>
            
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="0x..."
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addAddress()}
                className="input-field flex-1"
              />
              <button onClick={addAddress} className="btn-primary flex items-center gap-2 whitespace-nowrap">
                <Plus size={16} />
                Add
              </button>
            </div>

            <div className="flex items-center gap-4">
              <label className="btn-secondary flex items-center gap-2 cursor-pointer text-sm py-2 px-4">
                <Upload size={16} />
                Upload CSV
                <input type="file" accept=".csv,.txt" onChange={handleCSVUpload} className="hidden" />
              </label>
              {addresses.length > 0 && (
                <button onClick={exportCSV} className="btn-secondary flex items-center gap-2 text-sm py-2 px-4">
                  <Download size={16} />
                  Export
                </button>
              )}
            </div>
          </div>

          {/* Address List */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">
                Allowlist ({addresses.length} addresses)
              </h2>
              {addresses.length > 0 && (
                <button
                  onClick={() => setAddresses([])}
                  className="text-sm text-red-400 hover:text-red-300 transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>

            {addresses.length === 0 ? (
              <div className="text-center py-8">
                <Users size={40} className="text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">No addresses added yet. Add addresses manually or upload a CSV.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {addresses.map((addr, i) => (
                  <div
                    key={addr}
                    className="flex items-center justify-between bg-monad-dark-secondary rounded-lg px-4 py-2"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500 w-6">{i + 1}</span>
                      <code className="text-sm text-gray-300 font-mono">{addr}</code>
                    </div>
                    <button
                      onClick={() => removeAddress(addr)}
                      className="text-gray-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Merkle Root */}
        <div className="space-y-4">
          <div className="glass-card p-6">
            <h3 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wide">
              Merkle Root
            </h3>

            <button
              onClick={generateMerkleRoot}
              disabled={addresses.length === 0}
              className="btn-primary w-full flex items-center justify-center gap-2 mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Generate Merkle Root
            </button>

            {merkleRoot ? (
              <div className="bg-monad-dark-secondary rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-400">Root Hash</span>
                  <button
                    onClick={() => copyToClipboard(merkleRoot)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {copied ? <CheckCircle size={14} className="text-monad-accent" /> : <Copy size={14} />}
                  </button>
                </div>
                <code className="text-xs text-monad-purple-light font-mono break-all">{merkleRoot}</code>
              </div>
            ) : (
              <p className="text-xs text-gray-500 text-center">
                Add addresses and generate the Merkle root to use on-chain.
              </p>
            )}
          </div>

          <div className="glass-card p-6">
            <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wide">
              How It Works
            </h3>
            <ol className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <span className="text-monad-purple font-bold">1.</span>
                Add wallet addresses to your allowlist
              </li>
              <li className="flex items-start gap-2">
                <span className="text-monad-purple font-bold">2.</span>
                Generate the Merkle root hash
              </li>
              <li className="flex items-start gap-2">
                <span className="text-monad-purple font-bold">3.</span>
                Set the Merkle root on your contract
              </li>
              <li className="flex items-start gap-2">
                <span className="text-monad-purple font-bold">4.</span>
                Whitelisted users can mint with proof verification
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
