import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-monad-dark-border bg-monad-dark-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-monad-purple to-monad-accent flex items-center justify-center">
                <span className="text-white font-bold text-sm">NT</span>
              </div>
              <span className="text-white font-bold text-xl">NFT Terminal</span>
            </div>
            <p className="text-gray-400 text-sm max-w-md">
              The all-in-one NFT launchpad on Monad. Deploy, mint, gate, and analyze — all from a single dashboard.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Product</h4>
            <div className="space-y-2">
              <Link href="/dashboard/deploy" className="block text-gray-400 hover:text-white text-sm transition-colors">Deploy</Link>
              <Link href="/dashboard/analytics" className="block text-gray-400 hover:text-white text-sm transition-colors">Analytics</Link>
              <Link href="/dashboard/gating" className="block text-gray-400 hover:text-white text-sm transition-colors">Token Gating</Link>
              <Link href="/dashboard/docs" className="block text-gray-400 hover:text-white text-sm transition-colors">Docs</Link>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Community</h4>
            <div className="space-y-2">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="block text-gray-400 hover:text-white text-sm transition-colors">Twitter</a>
              <a href="https://discord.gg" target="_blank" rel="noopener noreferrer" className="block text-gray-400 hover:text-white text-sm transition-colors">Discord</a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="block text-gray-400 hover:text-white text-sm transition-colors">GitHub</a>
            </div>
          </div>
        </div>

        <div className="border-t border-monad-dark-border mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">Built on Monad. Powered by the community.</p>
          <p className="text-gray-500 text-xs">NFT Terminal &copy; {new Date().getFullYear()}</p>
        </div>
      </div>
    </footer>
  );
}
