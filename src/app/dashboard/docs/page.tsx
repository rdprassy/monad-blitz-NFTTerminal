"use client";

import { BookOpen, Shield, BarChart3, Users, Code, Zap, Rocket } from "lucide-react";

const sections = [
  {
    title: "Getting Started",
    icon: Rocket,
    items: [
      {
        q: "What is NFT Terminal?",
        a: "NFT Terminal is a no-code NFT launchpad built on Monad. It lets creators deploy ERC-721 collections, manage allowlists, track analytics, and generate token gating snippets — all from one dashboard.",
      },
      {
        q: "How do I connect my wallet?",
        a: 'Click "Connect Wallet" in the top navigation bar. MetaMask or any EVM-compatible wallet will work. Make sure you\'re connected to the Monad Testnet (Chain ID: 10143).',
      },
      {
        q: "Do I need MON tokens?",
        a: "Yes, you need MON tokens on the Monad Testnet to pay for gas fees when deploying contracts and minting NFTs. Gas fees on Monad are near-zero.",
      },
    ],
  },
  {
    title: "Deploying Collections",
    icon: Code,
    items: [
      {
        q: "How do I deploy a collection?",
        a: "Go to Dashboard → Deploy Collection. Fill in your collection name, symbol, max supply, mint price, max per wallet, and base metadata URI. Click Deploy and confirm the transaction in your wallet.",
      },
      {
        q: "What metadata format should I use?",
        a: "Use the standard ERC-721 metadata format. Each token should have a JSON file at baseURI/{tokenId}.json with name, description, image, and optional attributes fields.",
      },
      {
        q: "Can I update my collection after deployment?",
        a: "Yes! The contract owner can update the base URI, mint price, toggle public/whitelist mint, set Merkle roots, and withdraw funds.",
      },
    ],
  },
  {
    title: "Allowlist & Whitelisting",
    icon: Users,
    items: [
      {
        q: "How does the allowlist work?",
        a: "NFT Terminal uses Merkle-tree based verification. Add addresses to your allowlist, generate a Merkle root, and set it on your contract. Whitelisted addresses can mint by providing their Merkle proof.",
      },
      {
        q: "Can I upload addresses in bulk?",
        a: "Yes, you can upload a CSV file with wallet addresses. The system automatically validates and deduplicates them.",
      },
    ],
  },
  {
    title: "Analytics",
    icon: BarChart3,
    items: [
      {
        q: "What metrics can I track?",
        a: "Total mints, unique holders, volume, floor price, mint history over time, top holders (whale tracking), and recent transfers.",
      },
      {
        q: "Is the data real-time?",
        a: "Analytics data is fetched from on-chain events. In the full version, real-time indexing via Envio provides instant updates.",
      },
    ],
  },
  {
    title: "Token Gating",
    icon: Shield,
    items: [
      {
        q: "What is token gating?",
        a: "Token gating restricts access to content, features, or communities based on NFT ownership. If a user holds an NFT from your collection, they get access.",
      },
      {
        q: "What integrations are supported?",
        a: "NFT Terminal generates ready-to-use code snippets for React/Next.js, vanilla HTML/JS, Node.js backends, and Next.js API routes.",
      },
    ],
  },
  {
    title: "Monad Network",
    icon: Zap,
    items: [
      {
        q: "Why Monad?",
        a: "Monad offers 10,000+ TPS with near-zero gas fees while maintaining full EVM compatibility. This means your Solidity contracts work out of the box, but with massively better performance.",
      },
      {
        q: "How do I add Monad to MetaMask?",
        a: "Network Name: Monad Testnet | RPC URL: https://testnet-rpc.monad.xyz | Chain ID: 10143 | Currency: MON | Explorer: https://testnet.monadexplorer.com",
      },
    ],
  },
];

export default function DocsPage() {
  return (
    <div className="space-y-8 py-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Documentation</h1>
        <p className="text-gray-400">
          Everything you need to know about using NFT Terminal on Monad.
        </p>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {sections.map((section) => (
          <a
            key={section.title}
            href={`#${section.title.toLowerCase().replace(/\s+/g, "-")}`}
            className="glass-card p-4 text-center hover:border-monad-purple/40 transition-all"
          >
            <section.icon size={20} className="text-monad-purple-light mx-auto mb-2" />
            <span className="text-xs text-gray-300">{section.title}</span>
          </a>
        ))}
      </div>

      {/* FAQ Sections */}
      <div className="space-y-8">
        {sections.map((section) => (
          <div
            key={section.title}
            id={section.title.toLowerCase().replace(/\s+/g, "-")}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-monad-purple/10 flex items-center justify-center">
                <section.icon size={20} className="text-monad-purple-light" />
              </div>
              <h2 className="text-xl font-semibold text-white">{section.title}</h2>
            </div>

            <div className="space-y-6">
              {section.items.map((item) => (
                <div key={item.q}>
                  <h3 className="text-sm font-semibold text-white mb-2">{item.q}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Need Help */}
      <div className="glass-card p-8 text-center">
        <BookOpen size={40} className="text-monad-purple-light mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Need More Help?</h3>
        <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
          Join our community on Discord or Twitter for support, feature requests, and updates.
        </p>
        <div className="flex items-center justify-center gap-4">
          <a href="https://discord.gg" target="_blank" rel="noopener noreferrer" className="btn-primary text-sm py-2 px-4">
            Join Discord
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="btn-secondary text-sm py-2 px-4">
            Follow on Twitter
          </a>
        </div>
      </div>
    </div>
  );
}
