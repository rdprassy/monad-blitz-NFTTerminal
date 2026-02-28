"use client";

import { useState, useEffect, useCallback } from "react";
import { useAccount, useWalletClient, usePublicClient, useBlockNumber } from "wagmi";
import { formatEther } from "viem";
import {
  Gem,
  Loader2,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Plus,
  Minus,
  Shield,
  Settings,
  Zap,
} from "lucide-react";
import { monadTestnet } from "@/lib/wagmi";
import { NFT_TERMINAL_ABI, DEPLOYED_CONTRACT_ADDRESS } from "@/lib/contracts";
import { getDeployedContracts } from "@/lib/deployedContracts";

export default function MintPage() {
  const { address, isConnected, chainId } = useAccount();
  const { data: walletClient } = useWalletClient({ chainId });
  const publicClient = usePublicClient();
  const { data: latestBlock } = useBlockNumber({ watch: true });

  const [contractAddress, setContractAddress] = useState("");
  const [loadedAddress, setLoadedAddress] = useState<`0x${string}` | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [minting, setMinting] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Contract state
  const [contractName, setContractName] = useState("");
  const [totalSupply, setTotalSupply] = useState(0);
  const [maxSupply, setMaxSupply] = useState(0);
  const [mintPrice, setMintPrice] = useState(BigInt(0));
  const [mintPriceFormatted, setMintPriceFormatted] = useState("0");
  const [maxPerWallet, setMaxPerWallet] = useState(0);
  const [publicMintActive, setPublicMintActive] = useState(false);
  const [whitelistMintActive, setWhitelistMintActive] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [userMinted, setUserMinted] = useState(0);

  // Owner action states
  const [ownerLoading, setOwnerLoading] = useState("");

  // Auto-load deployed contract
  useEffect(() => {
    const contracts = getDeployedContracts();
    if (contracts.length > 0) {
      setContractAddress(contracts[contracts.length - 1].address);
    } else if (DEPLOYED_CONTRACT_ADDRESS) {
      setContractAddress(DEPLOYED_CONTRACT_ADDRESS);
    }
  }, []);

  const loadContract = useCallback(async (addr: `0x${string}`) => {
    if (!publicClient) return;
    setError("");
    try {
      const [name, supply, max, price, perWallet, pubActive, wlActive, owner] = await Promise.all([
        publicClient.readContract({ address: addr, abi: NFT_TERMINAL_ABI, functionName: "name" }),
        publicClient.readContract({ address: addr, abi: NFT_TERMINAL_ABI, functionName: "totalSupply" }),
        publicClient.readContract({ address: addr, abi: NFT_TERMINAL_ABI, functionName: "maxSupply" }),
        publicClient.readContract({ address: addr, abi: NFT_TERMINAL_ABI, functionName: "mintPrice" }),
        publicClient.readContract({ address: addr, abi: NFT_TERMINAL_ABI, functionName: "maxPerWallet" }),
        publicClient.readContract({ address: addr, abi: NFT_TERMINAL_ABI, functionName: "publicMintActive" }),
        publicClient.readContract({ address: addr, abi: NFT_TERMINAL_ABI, functionName: "whitelistMintActive" }),
        publicClient.readContract({ address: addr, abi: NFT_TERMINAL_ABI, functionName: "owner" }),
      ]);

      setContractName(String(name));
      setTotalSupply(Number(supply));
      setMaxSupply(Number(max));
      setMintPrice(BigInt(price as bigint));
      setMintPriceFormatted(formatEther(price as bigint));
      setMaxPerWallet(Number(perWallet));
      setPublicMintActive(Boolean(pubActive));
      setWhitelistMintActive(Boolean(wlActive));
      setIsOwner(address?.toLowerCase() === String(owner).toLowerCase());
      setLoadedAddress(addr);

      // Fetch user's minted count
      if (address) {
        try {
          const minted = await publicClient.readContract({
            address: addr,
            abi: NFT_TERMINAL_ABI,
            functionName: "mintedCount",
            args: [address],
          });
          setUserMinted(Number(minted));
        } catch {
          setUserMinted(0);
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load contract.";
      setError(msg.length > 150 ? msg.slice(0, 150) + "..." : msg);
    }
  }, [publicClient, address]);

  const handleLoad = () => {
    if (!contractAddress || !contractAddress.startsWith("0x")) {
      setError("Enter a valid contract address.");
      return;
    }
    loadContract(contractAddress as `0x${string}`);
  };

  // Auto-refresh on new blocks
  useEffect(() => {
    if (loadedAddress && latestBlock) {
      loadContract(loadedAddress);
    }
  }, [latestBlock, loadedAddress, loadContract]);

  const handleMint = async () => {
    if (!walletClient || !isConnected || !loadedAddress) {
      setError("Connect your wallet first.");
      return;
    }
    if (!publicMintActive) {
      setError("Public minting is not active. The owner needs to enable it first.");
      return;
    }

    setMinting(true);
    setError("");
    setSuccess("");
    setTxHash("");

    try {
      const totalCost = mintPrice * BigInt(quantity);

      const hash = await walletClient.writeContract({
        address: loadedAddress,
        abi: NFT_TERMINAL_ABI,
        functionName: "publicMint",
        args: [BigInt(quantity)],
        value: totalCost,
        chain: monadTestnet,
        account: address!,
      });

      setTxHash(hash);

      if (publicClient) {
        await publicClient.waitForTransactionReceipt({ hash });
        setSuccess(`Successfully minted ${quantity} NFT${quantity > 1 ? "s" : ""}!`);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Minting failed.";
      setError(msg.length > 200 ? msg.slice(0, 200) + "..." : msg);
    } finally {
      setMinting(false);
    }
  };

  const handleOwnerAction = async (action: "togglePublicMint" | "toggleWhitelistMint") => {
    if (!walletClient || !loadedAddress || !address) return;
    setOwnerLoading(action);
    setError("");
    try {
      const hash = await walletClient.writeContract({
        address: loadedAddress,
        abi: NFT_TERMINAL_ABI,
        functionName: action,
        chain: monadTestnet,
        account: address,
      });
      if (publicClient) {
        await publicClient.waitForTransactionReceipt({ hash });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Transaction failed.";
      setError(msg.length > 150 ? msg.slice(0, 150) + "..." : msg);
    } finally {
      setOwnerLoading("");
    }
  };

  const remaining = maxSupply - totalSupply;
  const canMint = publicMintActive && remaining > 0 && quantity + userMinted <= maxPerWallet;
  const totalCostFormatted = (parseFloat(mintPriceFormatted) * quantity).toFixed(4);

  return (
    <div className="space-y-8 py-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Mint NFTs</h1>
        <p className="text-gray-400">
          Mint NFTs from any deployed collection on Monad.
        </p>
      </div>

      {/* Contract Input */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Select Collection</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter contract address (0x...)"
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
            className="input-field flex-1"
          />
          <button onClick={handleLoad} className="btn-primary whitespace-nowrap">
            Load
          </button>
        </div>
      </div>

      {loadedAddress && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Mint Card */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-monad-purple to-monad-accent flex items-center justify-center">
                  <Gem size={24} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{contractName || "NFT Collection"}</h2>
                  <p className="text-sm text-gray-400">{totalSupply.toLocaleString()} / {maxSupply.toLocaleString()} minted</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Mint Progress</span>
                  <span className="text-white">{maxSupply > 0 ? ((totalSupply / maxSupply) * 100).toFixed(1) : 0}%</span>
                </div>
                <div className="w-full bg-monad-dark-secondary rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-monad-purple to-monad-accent rounded-full transition-all duration-500"
                    style={{ width: `${maxSupply > 0 ? (totalSupply / maxSupply) * 100 : 0}%` }}
                  />
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-sm text-gray-400 mb-3">Quantity</label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 rounded-xl border border-monad-dark-border hover:border-monad-purple flex items-center justify-center transition-colors"
                  >
                    <Minus size={18} className="text-white" />
                  </button>
                  <span className="text-3xl font-bold text-white w-16 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(maxPerWallet - userMinted, quantity + 1))}
                    className="w-12 h-12 rounded-xl border border-monad-dark-border hover:border-monad-purple flex items-center justify-center transition-colors"
                  >
                    <Plus size={18} className="text-white" />
                  </button>
                </div>
              </div>

              {/* Cost */}
              <div className="bg-monad-dark-secondary rounded-xl p-4 mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Price per NFT</span>
                  <span className="text-white">{mintPriceFormatted} MON</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Quantity</span>
                  <span className="text-white">× {quantity}</span>
                </div>
                <div className="border-t border-monad-dark-border my-2" />
                <div className="flex justify-between">
                  <span className="text-gray-400 font-semibold">Total</span>
                  <span className="text-white font-bold text-lg">{totalCostFormatted} MON</span>
                </div>
              </div>

              {/* Mint Button */}
              <button
                onClick={handleMint}
                disabled={minting || !isConnected || !canMint}
                className="btn-primary w-full flex items-center justify-center gap-2 text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {minting ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Minting...
                  </>
                ) : (
                  <>
                    <Zap size={20} />
                    Mint {quantity} NFT{quantity > 1 ? "s" : ""}
                  </>
                )}
              </button>

              {!publicMintActive && (
                <p className="text-yellow-400 text-sm text-center mt-3">
                  ⚠ Public minting is not active. {isOwner ? "Use owner controls to enable it." : "Contact the collection owner."}
                </p>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl p-4">
                <AlertCircle size={18} />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="glass-card p-6 border-monad-accent/30">
                <div className="flex items-center gap-2 text-monad-accent mb-3">
                  <CheckCircle size={20} />
                  <span className="font-semibold">{success}</span>
                </div>
                {txHash && (
                  <div className="bg-monad-dark-secondary rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-1">Transaction Hash</p>
                    <div className="flex items-center gap-2">
                      <code className="text-sm text-white font-mono break-all">{txHash}</code>
                      <a
                        href={`${monadTestnet.blockExplorers.default.url}/tx/${txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-monad-purple hover:text-monad-purple-light"
                      >
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Collection Info */}
            <div className="glass-card p-6">
              <h3 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wide">Collection Info</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Name</span>
                  <span className="text-white">{contractName || "—"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Supply</span>
                  <span className="text-white">{totalSupply.toLocaleString()} / {maxSupply.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Remaining</span>
                  <span className="text-monad-accent">{remaining.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Mint Price</span>
                  <span className="text-white">{mintPriceFormatted} MON</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Max Per Wallet</span>
                  <span className="text-white">{maxPerWallet}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">You Minted</span>
                  <span className="text-white">{userMinted} / {maxPerWallet}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Public Mint</span>
                  <span className={publicMintActive ? "text-monad-accent" : "text-red-400"}>
                    {publicMintActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Whitelist Mint</span>
                  <span className={whitelistMintActive ? "text-monad-accent" : "text-red-400"}>
                    {whitelistMintActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>

            {/* Owner Controls */}
            {isOwner && (
              <div className="glass-card p-6 border-monad-purple/30">
                <div className="flex items-center gap-2 mb-4">
                  <Settings size={16} className="text-monad-purple" />
                  <h3 className="text-sm font-semibold text-monad-purple uppercase tracking-wide">Owner Controls</h3>
                </div>
                <div className="space-y-3">
                  <button
                    onClick={() => handleOwnerAction("togglePublicMint")}
                    disabled={!!ownerLoading}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-monad-dark-border hover:border-monad-purple text-sm font-medium text-white transition-all disabled:opacity-50"
                  >
                    {ownerLoading === "togglePublicMint" ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Zap size={14} />
                    )}
                    {publicMintActive ? "Disable" : "Enable"} Public Mint
                  </button>
                  <button
                    onClick={() => handleOwnerAction("toggleWhitelistMint")}
                    disabled={!!ownerLoading}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-monad-dark-border hover:border-monad-purple text-sm font-medium text-white transition-all disabled:opacity-50"
                  >
                    {ownerLoading === "toggleWhitelistMint" ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Shield size={14} />
                    )}
                    {whitelistMintActive ? "Disable" : "Enable"} Whitelist Mint
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {!loadedAddress && (
        <div className="glass-card p-12 text-center">
          <Gem size={48} className="text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">Enter a contract address above to start minting.</p>
        </div>
      )}
    </div>
  );
}
