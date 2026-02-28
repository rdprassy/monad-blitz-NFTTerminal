"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-monad-dark">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 pt-20 px-4 sm:px-6 lg:px-8 pb-12 min-h-screen">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
