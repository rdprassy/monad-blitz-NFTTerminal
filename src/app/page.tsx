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
      <section className="relative pt-28 pb-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="ai-badge mb-6">
            <Sparkles size={12} className="text-monad-purple" />
            Built on Monad Testnet
            <ChevronRight size={12} />
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Your NFT Launchpad for the{" "}
            <span className="gradient-text">Creator Economy</span>
          </h1>

          <p className="text-lg sm:text-xl text-x-secondary max-w-2xl mx-auto mb-10">
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
      <section className="border-y border-x-border">
        <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-x-primary">{stat.value}</div>
              <div className="text-sm text-x-secondary mt-1">{stat.label}</div>
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
            <p className="text-x-secondary max-w-xl mx-auto">
              A unified workflow for minting, whitelisting, analytics, and token gating — all in one streamlined dashboard.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="glass-card p-6 group"
              >
                <div className="w-10 h-10 rounded-full bg-monad-purple/10 flex items-center justify-center mb-4">
                  <feature.icon size={20} className="text-monad-purple" />
                </div>
                <h3 className="text-[15px] font-bold text-x-primary mb-1.5">{feature.title}</h3>
                <p className="text-x-secondary text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-4 border-t border-x-border">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
          </div>

          <div className="space-y-4">
            {[
              { step: "1", title: "Connect Your Wallet", desc: "Connect MetaMask or any EVM wallet to the Monad network." },
              { step: "2", title: "Configure Your Drop", desc: "Set collection name, symbol, supply, price, and metadata URI." },
              { step: "3", title: "Deploy & Launch", desc: "Deploy your ERC-721 contract to Monad with one click." },
              { step: "4", title: "Manage & Analyze", desc: "Track mints, manage allowlists, gate content, and grow your community." },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-4 glass-card p-5">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-monad-purple flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{item.step}</span>
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-x-primary mb-0.5">{item.title}</h3>
                  <p className="text-x-secondary text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass-card p-10">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">
              Ready to Launch?
            </h2>
            <p className="text-x-secondary mb-8 max-w-md mx-auto">
              Join the next wave of NFT creators on Monad. Deploy your first collection in under a minute.
            </p>
            <Link href="/dashboard/deploy" className="btn-primary inline-flex items-center gap-2 text-lg py-3 px-8">
              Deploy Now
              <Rocket size={18} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
