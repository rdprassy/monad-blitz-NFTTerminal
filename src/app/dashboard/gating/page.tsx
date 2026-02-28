"use client";

import { useState } from "react";
import { Copy, CheckCircle, Code, Globe, Server } from "lucide-react";

const snippets = {
  react: {
    label: "React / Next.js",
    icon: Code,
    language: "tsx",
    code: `import { useAccount, useReadContract } from 'wagmi';

const NFT_CONTRACT = "0xYOUR_CONTRACT_ADDRESS";
const NFT_ABI = [
  {
    inputs: [{ name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
];

function TokenGatedContent() {
  const { address } = useAccount();

  const { data: balance } = useReadContract({
    address: NFT_CONTRACT,
    abi: NFT_ABI,
    functionName: "balanceOf",
    args: [address],
  });

  const hasAccess = balance && Number(balance) > 0;

  if (!hasAccess) {
    return (
      <div className="text-center p-8">
        <h2>Access Restricted</h2>
        <p>You need to hold an NFT from this collection to view this content.</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Welcome, NFT Holder!</h2>
      {/* Your gated content here */}
    </div>
  );
}

export default TokenGatedContent;`,
  },
  html: {
    label: "Vanilla HTML / JS",
    icon: Globe,
    language: "html",
    code: `<script src="https://cdn.ethers.io/lib/ethers-5.7.2.umd.min.js"></script>
<script>
  const NFT_CONTRACT = "0xYOUR_CONTRACT_ADDRESS";
  const NFT_ABI = ["function balanceOf(address) view returns (uint256)"];
  const RPC_URL = "https://testnet-rpc.monad.xyz";

  async function checkAccess() {
    if (!window.ethereum) {
      document.getElementById("gated-content").innerHTML =
        "<p>Please install MetaMask to continue.</p>";
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const address = await signer.getAddress();

    const contract = new ethers.Contract(NFT_CONTRACT, NFT_ABI, provider);
    const balance = await contract.balanceOf(address);

    const gatedEl = document.getElementById("gated-content");
    if (balance.gt(0)) {
      gatedEl.innerHTML = "<h2>Welcome, NFT Holder!</h2><p>Your gated content here.</p>";
    } else {
      gatedEl.innerHTML = "<p>You need to hold an NFT to access this content.</p>";
    }
  }

  checkAccess();
</script>

<div id="gated-content">Loading...</div>`,
  },
  backend: {
    label: "Node.js Backend",
    icon: Server,
    language: "javascript",
    code: `const { ethers } = require("ethers");

const NFT_CONTRACT = "0xYOUR_CONTRACT_ADDRESS";
const NFT_ABI = ["function balanceOf(address) view returns (uint256)"];
const RPC_URL = "https://testnet-rpc.monad.xyz";

async function verifyNFTOwnership(walletAddress) {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const contract = new ethers.Contract(NFT_CONTRACT, NFT_ABI, provider);
  const balance = await contract.balanceOf(walletAddress);
  return Number(balance) > 0;
}

// Express.js middleware example
function tokenGateMiddleware(req, res, next) {
  const walletAddress = req.headers["x-wallet-address"];

  if (!walletAddress) {
    return res.status(401).json({ error: "Wallet address required" });
  }

  verifyNFTOwnership(walletAddress)
    .then((hasAccess) => {
      if (hasAccess) {
        next();
      } else {
        res.status(403).json({ error: "NFT ownership required" });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: "Verification failed" });
    });
}

// Usage:
// app.get("/secret", tokenGateMiddleware, (req, res) => {
//   res.json({ message: "Welcome to the exclusive content!" });
// });

module.exports = { verifyNFTOwnership, tokenGateMiddleware };`,
  },
  nextapi: {
    label: "Next.js API Route",
    icon: Server,
    language: "typescript",
    code: `// app/api/gate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createPublicClient, http } from "viem";

const NFT_CONTRACT = "0xYOUR_CONTRACT_ADDRESS" as \`0x\${string}\`;
const NFT_ABI = [
  {
    inputs: [{ name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

const client = createPublicClient({
  transport: http("https://testnet-rpc.monad.xyz"),
});

export async function GET(request: NextRequest) {
  const walletAddress = request.headers.get("x-wallet-address");

  if (!walletAddress) {
    return NextResponse.json(
      { error: "Wallet address required" },
      { status: 401 }
    );
  }

  try {
    const balance = await client.readContract({
      address: NFT_CONTRACT,
      abi: NFT_ABI,
      functionName: "balanceOf",
      args: [walletAddress as \`0x\${string}\`],
    });

    if (Number(balance) > 0) {
      return NextResponse.json({
        access: true,
        message: "Welcome, NFT holder!",
      });
    }

    return NextResponse.json(
      { access: false, error: "NFT ownership required" },
      { status: 403 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    );
  }
}`,
  },
};

type SnippetKey = keyof typeof snippets;

export default function GatingPage() {
  const [activeTab, setActiveTab] = useState<SnippetKey>("react");
  const [contractAddress, setContractAddress] = useState("");
  const [copied, setCopied] = useState(false);

  const currentSnippet = snippets[activeTab];

  const getCustomizedCode = () => {
    if (contractAddress) {
      return currentSnippet.code.replace(/0xYOUR_CONTRACT_ADDRESS/g, contractAddress);
    }
    return currentSnippet.code;
  };

  const copyCode = () => {
    navigator.clipboard.writeText(getCustomizedCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 py-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Token Gating</h1>
        <p className="text-gray-400">
          Generate plug-and-play code snippets to restrict access based on NFT ownership.
        </p>
      </div>

      {/* Contract Address Input */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Your Contract Address</h2>
        <input
          type="text"
          placeholder="0x... (paste your deployed contract address)"
          value={contractAddress}
          onChange={(e) => setContractAddress(e.target.value)}
          className="input-field"
        />
        <p className="text-xs text-gray-500 mt-2">
          Enter your contract address to auto-populate it in the code snippets below.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {(Object.keys(snippets) as SnippetKey[]).map((key) => {
          const snippet = snippets[key];
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-monad-purple/15 text-monad-purple-light border border-monad-purple/20"
                  : "text-gray-400 hover:text-white border border-monad-dark-border hover:border-monad-dark-border"
              }`}
            >
              <snippet.icon size={16} />
              {snippet.label}
            </button>
          );
        })}
      </div>

      {/* Code Block */}
      <div className="glass-card overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-monad-dark-border bg-monad-dark-secondary/50">
          <div className="flex items-center gap-2">
            <currentSnippet.icon size={16} className="text-monad-purple-light" />
            <span className="text-sm text-gray-300">{currentSnippet.label}</span>
            <span className="text-xs text-gray-500 bg-monad-dark-secondary px-2 py-0.5 rounded">
              {currentSnippet.language}
            </span>
          </div>
          <button
            onClick={copyCode}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
          >
            {copied ? (
              <>
                <CheckCircle size={14} className="text-monad-accent" />
                Copied!
              </>
            ) : (
              <>
                <Copy size={14} />
                Copy
              </>
            )}
          </button>
        </div>
        <pre className="p-4 overflow-x-auto text-sm leading-relaxed">
          <code className="text-gray-300 font-mono">{getCustomizedCode()}</code>
        </pre>
      </div>

      {/* How to Use */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4">How to Integrate</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="w-10 h-10 rounded-xl bg-monad-purple/10 flex items-center justify-center mb-3">
              <span className="text-monad-purple font-bold">1</span>
            </div>
            <h4 className="text-sm font-semibold text-white mb-1">Deploy Your Collection</h4>
            <p className="text-xs text-gray-400">
              Deploy an ERC-721 collection using the Deploy page and get your contract address.
            </p>
          </div>
          <div>
            <div className="w-10 h-10 rounded-xl bg-monad-purple/10 flex items-center justify-center mb-3">
              <span className="text-monad-purple font-bold">2</span>
            </div>
            <h4 className="text-sm font-semibold text-white mb-1">Choose a Snippet</h4>
            <p className="text-xs text-gray-400">
              Select the integration type that fits your stack — React, HTML, or backend.
            </p>
          </div>
          <div>
            <div className="w-10 h-10 rounded-xl bg-monad-purple/10 flex items-center justify-center mb-3">
              <span className="text-monad-purple font-bold">3</span>
            </div>
            <h4 className="text-sm font-semibold text-white mb-1">Copy & Paste</h4>
            <p className="text-xs text-gray-400">
              Paste the snippet into your project. It checks NFT ownership and gates content automatically.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
