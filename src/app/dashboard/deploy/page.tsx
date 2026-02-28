"use client";

import { useState } from "react";
import { useAccount, useWalletClient, usePublicClient, useSwitchChain } from "wagmi";
import { parseEther, createWalletClient, custom, createPublicClient, http } from "viem";
import { Rocket, Loader2, CheckCircle, AlertCircle, ExternalLink } from "lucide-react";
import { monadTestnet } from "@/lib/wagmi";
import { NFT_TERMINAL_ABI } from "@/lib/contracts";
import { NFT_TERMINAL_BYTECODE } from "@/lib/bytecode";
import { addDeployedContract } from "@/lib/deployedContracts";

export default function DeployPage() {
  const { isConnected, chainId, connector } = useAccount();
  const { data: walletClient } = useWalletClient({ chainId });
  const publicClient = usePublicClient({ chainId });
  const { switchChainAsync } = useSwitchChain();

  const [formData, setFormData] = useState({
    name: "",
    symbol: "",
    maxSupply: "10000",
    mintPrice: "0.01",
    maxPerWallet: "5",
    baseURI: "",
  });

  const [deploying, setDeploying] = useState(false);
  const [deployedAddress, setDeployedAddress] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDeploy = async () => {
    if (!isConnected) {
      setError("Please connect your wallet first.");
      return;
    }

    if (!formData.name || !formData.symbol) {
      setError("Collection name and symbol are required.");
      return;
    }

    setDeploying(true);
    setError("");
    setDeployedAddress("");

    try {
      // Switch to Monad Testnet if needed
      if (chainId !== monadTestnet.id) {
        try {
          await switchChainAsync({ chainId: monadTestnet.id });
        } catch {
          setError("Please switch to Monad Testnet (Chain ID 10143) in MetaMask and try again.");
          setDeploying(false);
          return;
        }
      }

      // Get wallet client — either from wagmi or create one directly from the provider
      let client = walletClient;
      if (!client && connector) {
        const provider = await connector.getProvider();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        client = createWalletClient({ chain: monadTestnet, transport: custom(provider as any) });
      }

      if (!client) {
        setError("Could not get wallet client. Please refresh the page and reconnect your wallet.");
        setDeploying(false);
        return;
      }

      // Get accounts from the wallet
      const [account] = await client.getAddresses();

      const pubClient = publicClient ?? createPublicClient({ chain: monadTestnet, transport: http() });

      const mintPriceWei = parseEther(formData.mintPrice || "0");
      const maxSupply = BigInt(formData.maxSupply || "10000");
      const maxPerWallet = BigInt(formData.maxPerWallet || "5");
      const baseURI = formData.baseURI || "ipfs://placeholder/";

      const hash = await client.deployContract({
        account,
        abi: NFT_TERMINAL_ABI,
        bytecode: NFT_TERMINAL_BYTECODE,
        args: [formData.name, formData.symbol, maxSupply, mintPriceWei, maxPerWallet, baseURI],
        chain: monadTestnet,
      });

      setError("");
      setDeployedAddress("pending:" + hash);

      const receipt = await pubClient.waitForTransactionReceipt({ hash });

      if (receipt.contractAddress) {
        setDeployedAddress(receipt.contractAddress);
        addDeployedContract({
          address: receipt.contractAddress,
          name: formData.name,
          symbol: formData.symbol,
          maxSupply: formData.maxSupply,
          mintPrice: formData.mintPrice,
          deployedAt: Date.now(),
          txHash: hash,
        });
      } else {
        setError("Deployment transaction confirmed but no contract address returned.");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Deployment failed. Please try again.";
      setError(message);
    } finally {
      setDeploying(false);
    }
  };

  return (
    <div className="space-y-8 py-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Deploy Collection</h1>
        <p className="text-gray-400">
          Configure and deploy your ERC-721 collection on Monad. No coding required.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6 space-y-5">
            <h2 className="text-lg font-semibold text-white">Collection Details</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Collection Name *</label>
                <input
                  type="text"
                  name="name"
                  placeholder="My NFT Collection"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Symbol *</label>
                <input
                  type="text"
                  name="symbol"
                  placeholder="MNFT"
                  value={formData.symbol}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Max Supply</label>
                <input
                  type="number"
                  name="maxSupply"
                  placeholder="10000"
                  value={formData.maxSupply}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Mint Price (MON)</label>
                <input
                  type="text"
                  name="mintPrice"
                  placeholder="0.01"
                  value={formData.mintPrice}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Max Per Wallet</label>
                <input
                  type="number"
                  name="maxPerWallet"
                  placeholder="5"
                  value={formData.maxPerWallet}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Base Metadata URI</label>
              <input
                type="text"
                name="baseURI"
                placeholder="ipfs://QmYourHash/"
                value={formData.baseURI}
                onChange={handleChange}
                className="input-field"
              />
              <p className="text-xs text-gray-500 mt-1">
                IPFS or HTTP URL pointing to your metadata directory. Each token&apos;s metadata should be at baseURI/tokenId.json
              </p>
            </div>
          </div>

          {/* Deploy Button */}
          <button
            onClick={handleDeploy}
            disabled={deploying || !isConnected}
            className="btn-primary w-full flex items-center justify-center gap-2 text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {deploying ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Deploying to Monad...
              </>
            ) : (
              <>
                <Rocket size={20} />
                Deploy Collection
              </>
            )}
          </button>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl p-4">
              <AlertCircle size={18} />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Pending */}
          {deployedAddress && deployedAddress.startsWith("pending:") && (
            <div className="glass-card p-6 border-monad-purple/30">
              <div className="flex items-center gap-2 text-monad-purple mb-3">
                <Loader2 size={20} className="animate-spin" />
                <span className="font-semibold">Transaction submitted, waiting for confirmation...</span>
              </div>
              <div className="bg-monad-dark-secondary rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">Transaction Hash</p>
                <code className="text-sm text-white font-mono break-all">{deployedAddress.replace("pending:", "")}</code>
              </div>
            </div>
          )}

          {/* Success */}
          {deployedAddress && !deployedAddress.startsWith("pending:") && (
            <div className="glass-card p-6 border-monad-accent/30">
              <div className="flex items-center gap-2 text-monad-accent mb-3">
                <CheckCircle size={20} />
                <span className="font-semibold">Collection Deployed Successfully!</span>
              </div>
              <div className="bg-monad-dark-secondary rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">Contract Address</p>
                <div className="flex items-center gap-2">
                  <code className="text-sm text-white font-mono break-all">{deployedAddress}</code>
                  <a
                    href={`${monadTestnet.blockExplorers.default.url}/address/${deployedAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-monad-purple hover:text-monad-purple-light"
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Preview Card */}
        <div className="space-y-4">
          <div className="glass-card p-6">
            <h3 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wide">Preview</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Name</span>
                <span className="text-white">{formData.name || "—"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Symbol</span>
                <span className="text-white">{formData.symbol || "—"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Supply</span>
                <span className="text-white">{formData.maxSupply || "—"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Price</span>
                <span className="text-white">{formData.mintPrice ? `${formData.mintPrice} MON` : "—"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Per Wallet</span>
                <span className="text-white">{formData.maxPerWallet || "—"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Network</span>
                <span className="text-monad-accent">Monad Testnet</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wide">Contract Features</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-center gap-2">
                <CheckCircle size={14} className="text-monad-accent" />
                ERC-721 Enumerable
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={14} className="text-monad-accent" />
                Merkle Whitelist
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={14} className="text-monad-accent" />
                Public & Presale Mint
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={14} className="text-monad-accent" />
                Configurable Price & Limits
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={14} className="text-monad-accent" />
                Owner Withdrawal
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
