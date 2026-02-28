"use client";

import Link from "next/link";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { shortenAddress } from "@/lib/utils";
import { useState } from "react";
import { Menu, X, Wallet, LogOut } from "lucide-react";

export function Navbar() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleConnect = () => {
    connect({ connector: injected() });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-monad-dark/80 backdrop-blur-md border-b border-x-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-monad-purple flex items-center justify-center">
              <span className="text-white font-bold text-sm">NT</span>
            </div>
            <span className="text-x-primary font-bold text-lg">
              NFT <span className="gradient-text">Terminal</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link href="/dashboard" className="text-x-secondary hover:text-x-primary hover:bg-x-hover transition-colors text-sm font-medium px-3 py-2 rounded-full">
              Dashboard
            </Link>
            <Link href="/dashboard/deploy" className="text-x-secondary hover:text-x-primary hover:bg-x-hover transition-colors text-sm font-medium px-3 py-2 rounded-full">
              Deploy
            </Link>
            <Link href="/dashboard/mint" className="text-x-secondary hover:text-x-primary hover:bg-x-hover transition-colors text-sm font-medium px-3 py-2 rounded-full">
              Mint
            </Link>
            <Link href="/dashboard/analytics" className="text-x-secondary hover:text-x-primary hover:bg-x-hover transition-colors text-sm font-medium px-3 py-2 rounded-full">
              Analytics
            </Link>
            <Link href="/dashboard/gating" className="text-x-secondary hover:text-x-primary hover:bg-x-hover transition-colors text-sm font-medium px-3 py-2 rounded-full">
              Gating
            </Link>
          </div>

          {/* Wallet Button */}
          <div className="flex items-center gap-3">
            {isConnected && address ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-sm rounded-full border border-x-border">
                  <div className="w-2 h-2 rounded-full bg-monad-accent" />
                  <span className="text-x-primary">{shortenAddress(address)}</span>
                </div>
                <button
                  onClick={() => disconnect()}
                  className="p-2 rounded-lg hover:bg-monad-dark-card transition-colors text-gray-400 hover:text-white"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <button onClick={handleConnect} className="btn-primary flex items-center gap-2 text-sm py-2 px-4">
                <Wallet size={16} />
                Connect Wallet
              </button>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-monad-dark-card transition-colors text-gray-400"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-monad-dark-border bg-monad-dark/95 backdrop-blur-xl">
          <div className="px-4 py-4 space-y-3">
            <Link href="/dashboard" className="block text-gray-300 hover:text-white transition-colors text-sm font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
              Dashboard
            </Link>
            <Link href="/dashboard/deploy" className="block text-gray-300 hover:text-white transition-colors text-sm font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
              Deploy Collection
            </Link>
            <Link href="/dashboard/analytics" className="block text-gray-300 hover:text-white transition-colors text-sm font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
              Analytics
            </Link>
            <Link href="/dashboard/gating" className="block text-gray-300 hover:text-white transition-colors text-sm font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
              Token Gating
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
