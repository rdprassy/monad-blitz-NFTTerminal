"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Rocket,
  Gem,
  Users,
  BarChart3,
  Shield,
  BookOpen,
} from "lucide-react";

const sidebarItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Deploy Collection", href: "/dashboard/deploy", icon: Rocket },
  { label: "Mint NFTs", href: "/dashboard/mint", icon: Gem },
  { label: "Allowlist", href: "/dashboard/allowlist", icon: Users },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { label: "Token Gating", href: "/dashboard/gating", icon: Shield },
  { label: "Docs", href: "/dashboard/docs", icon: BookOpen },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-monad-dark-secondary border-r border-monad-dark-border pt-20 px-4">
      <div className="flex-1 space-y-1">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-monad-purple/15 text-monad-purple-light border border-monad-purple/20"
                  : "text-gray-400 hover:text-white hover:bg-monad-dark-card"
              )}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </div>

      <div className="pb-6">
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-monad-accent animate-pulse" />
            <span className="text-xs text-gray-400">Monad Testnet</span>
          </div>
          <p className="text-xs text-gray-500">Chain ID: 10143</p>
        </div>
      </div>
    </aside>
  );
}
