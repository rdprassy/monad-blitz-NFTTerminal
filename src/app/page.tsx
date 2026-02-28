"use client";

import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Rocket,
  Shield,
  BarChart3,
  Zap,
  Code,
  Users,
  ArrowRight,
  ChevronRight,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: Rocket,
    title: "No-Code Deployment",
    description:
      "Deploy ERC-721 mint contracts with configurable metadata, pricing, and limits — zero coding required.",
  },
  {
    icon: Users,
    title: "Allowlist Management",
    description:
      "Merkle-tree based whitelisting with easy CSV upload. Manage pre-sale access in seconds.",
  },
  {
    icon: BarChart3,
    title: "Holder Analytics",
    description:
      "Track mint volume, holder distribution, whale concentration, and transfer history in real-time.",
  },
  {
    icon: Shield,
    title: "Token Gating",
    description:
      "Auto-generated code snippets to restrict content access based on NFT ownership.",
  },
  {
    icon: Zap,
    title: "Monad Powered",
    description:
      "High throughput, near-zero gas fees. Scale your launches without congestion on Monad.",
  },
  {
    icon: Code,
    title: "Plug & Play Snippets",
    description:
      "Ready-to-use React, HTML, and backend code for token gating integration.",
  },
];

const stats = [
  { label: "Gas Cost per Mint", value: "~$0.001" },
  { label: "Deployment Time", value: "<30s" },
  { label: "TPS on Monad", value: "10,000+" },
  { label: "Supported Standards", value: "ERC-721" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-monad-dark">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background gradient blobs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-monad-purple/20 rounded-full blur-3xl" />
        <div className="absolute top-40 right-1/4 w-80 h-80 bg-monad-accent/10 rounded-full blur-3xl" />

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-8 text-sm text-gray-300">
            <Sparkles size={14} className="text-monad-accent" />
            Built on Monad Testnet
            <ChevronRight size={14} />
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Your NFT Launchpad for the{" "}
            <span className="gradient-text">Creator Economy</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            Launch fast, grow smart — mint, gate, analyze, and scale on Monad.
            One dashboard. Infinite creative freedom.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard" className="btn-primary flex items-center gap-2 text-lg py-4 px-8">
              Launch Your Collection
              <ArrowRight size={20} />
            </Link>
            <Link href="/dashboard/docs" className="btn-secondary flex items-center gap-2 text-lg py-4 px-8">
              Read the Docs
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-monad-dark-border bg-monad-dark-secondary/50">
        <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold gradient-text">{stat.value}</div>
              <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything You Need to{" "}
              <span className="gradient-text">Launch NFTs</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              A unified workflow for minting, whitelisting, analytics, and token gating — all in one streamlined dashboard.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="glass-card p-6 hover:border-monad-purple/40 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-monad-purple/10 flex items-center justify-center mb-4 group-hover:bg-monad-purple/20 transition-colors">
                  <feature.icon size={24} className="text-monad-purple-light" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 px-4 bg-monad-dark-secondary/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
          </div>

          <div className="space-y-8">
            {[
              { step: "01", title: "Connect Your Wallet", desc: "Connect MetaMask or any EVM wallet to the Monad network." },
              { step: "02", title: "Configure Your Drop", desc: "Set collection name, symbol, supply, price, and metadata URI." },
              { step: "03", title: "Deploy & Launch", desc: "Deploy your ERC-721 contract to Monad with one click." },
              { step: "04", title: "Manage & Analyze", desc: "Track mints, manage allowlists, gate content, and grow your community." },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-6 glass-card p-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-monad-purple to-monad-accent flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{item.step}</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass-card p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-monad-purple/10 to-monad-accent/5" />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Ready to Launch?
              </h2>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                Join the next wave of NFT creators on Monad. Deploy your first collection in under a minute.
              </p>
              <Link href="/dashboard/deploy" className="btn-primary inline-flex items-center gap-2 text-lg py-4 px-8">
                Deploy Now
                <Rocket size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
