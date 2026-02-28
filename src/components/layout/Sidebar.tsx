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
    <aside className="hidden lg:flex flex-col w-64 min-h-screen border-r border-x-border bg-monad-dark pt-16 px-3">
      <div className="flex-1 space-y-0.5 pt-4">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-full text-sm transition-colors duration-200",
                isActive
                  ? "font-bold text-x-primary bg-x-hover"
                  : "font-medium text-x-secondary hover:text-x-primary hover:bg-x-hover"
              )}
            >
              <item.icon size={20} />
              {item.label}
            </Link>
          );
        })}
      </div>

      <div className="pb-6">
        <div className="border border-x-border rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-monad-accent" />
            <span className="text-xs text-x-primary font-bold">Monad Testnet</span>
          </div>
          <p className="text-xs text-x-secondary">Chain ID: 10143</p>
        </div>
      </div>
    </aside>
  );
}
