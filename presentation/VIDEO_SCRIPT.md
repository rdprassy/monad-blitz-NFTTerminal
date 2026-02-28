# NFT Terminal — Video Walkthrough Script

Use this script to record a screen recording walkthrough of the NFT Terminal application.

**Recommended tools for recording:**
- **macOS**: QuickTime Player → File → New Screen Recording (built-in, free)
- **Loom**: loom.com (free, records screen + face cam)
- **OBS Studio**: obsproject.com (free, professional)

**Tips:**
- Record at 1920x1080 resolution
- Use a clean browser (no extra tabs/bookmarks visible)
- Have MetaMask installed and connected to Monad Testnet
- Run `npm run dev` before starting

---

## Scene 1: Introduction (30 seconds)

**Show:** Presentation slide 1 (open `presentation/index.html` in browser)

**Say:**
> "Hi, I'm going to walk you through NFT Terminal — the all-in-one NFT launchpad built on Monad. This application lets creators deploy ERC-721 collections, manage allowlists, track analytics, and generate token gating code — all from a single dashboard, with no coding required."

---

## Scene 2: Landing Page (45 seconds)

**Show:** Navigate to `http://localhost:3000`

**Say:**
> "Here's our landing page. At the top, we have the navbar with the NFT Terminal logo and a Connect Wallet button. The hero section highlights the key value prop — deploy, mint, gate, and analyze NFT collections on Monad."

**Actions:**
1. Scroll down slowly through the landing page
2. Point out the stats section, feature cards, and the CTA

**Say:**
> "We showcase key stats, a feature grid covering No-Code Deploy, Allowlist Management, Analytics, Token Gating, and more. At the bottom there's a call-to-action to launch the app."

---

## Scene 3: Connect Wallet (30 seconds)

**Show:** Click "Connect Wallet" button in the navbar

**Say:**
> "Let me connect my Monad Testnet wallet. I click Connect Wallet, MetaMask pops up, and I approve the connection."

**Actions:**
1. Click "Connect Wallet"
2. Approve in MetaMask
3. Show the wallet address appearing in the navbar

**Say:**
> "Now you can see my wallet address displayed in the top right. The app is connected to Monad Testnet, chain ID 10143."

---

## Scene 4: Dashboard Overview (30 seconds)

**Show:** Navigate to `http://localhost:3000/dashboard`

**Say:**
> "This is the main dashboard. On the left, we have the sidebar with all navigation options: Overview, Deploy Collection, Allowlist, Analytics, Token Gating, and Docs."

**Actions:**
1. Point out the sidebar menu items
2. Point out the stats cards
3. Point out the quick action buttons

**Say:**
> "The overview shows key metrics — collections deployed, total minted, unique holders, and trading volume. Below are quick action shortcuts to jump to any feature."

---

## Scene 5: Deploy Collection (60 seconds)

**Show:** Click "Deploy Collection" in the sidebar → navigate to `/dashboard/deploy`

**Say:**
> "This is the no-code deployment page. Creators fill in a simple form to deploy their own ERC-721 smart contract on Monad."

**Actions:**
1. Fill in the form fields:
   - Collection Name: "Demo Collection"
   - Symbol: "DEMO"
   - Max Supply: "1000"
   - Mint Price: "0.05"
   - Max Per Wallet: "3"
   - Base URI: "ipfs://QmExample/"
2. Show the live preview updating
3. Click "Deploy Collection"

**Say:**
> "I'm entering my collection parameters. Notice the live preview card on the right updates as I type. The contract supports configurable supply, pricing, wallet limits, and IPFS metadata. When I click Deploy, the transaction goes to Monad Testnet. No Solidity knowledge needed."

---

## Scene 6: Allowlist Management (45 seconds)

**Show:** Navigate to `/dashboard/allowlist`

**Say:**
> "The Allowlist page lets you manage your whitelist using Merkle trees — the industry standard for gas-efficient whitelisting."

**Actions:**
1. Type a wallet address in the input field and click Add
2. Add 2-3 more addresses
3. Click "Generate Merkle Root"
4. Click the copy button on the Merkle root

**Say:**
> "You can add addresses manually or upload a CSV file with hundreds of addresses at once. Each address is validated for correct Ethereum format. Once your list is ready, click Generate Merkle Root. This hash gets set on your smart contract to enable whitelist minting. You can also export the full list as a CSV backup."

---

## Scene 7: Analytics Dashboard (45 seconds)

**Show:** Navigate to `/dashboard/analytics`

**Say:**
> "The Analytics Dashboard gives you real-time insights into your collection's performance."

**Actions:**
1. Enter a contract address in the lookup field
2. Show the stats cards (Total Minted, Unique Holders, Volume, Transfers)
3. Scroll through the mint history chart
4. Show the top holders table
5. Show the recent transfers feed

**Say:**
> "You can look up any ERC-721 contract on Monad. The dashboard shows total mints, unique holders, trading volume, and 24-hour transfer count. Below that, there's a mint history visualization, a top holders leaderboard to spot whales, and a live transfer feed."

---

## Scene 8: Token Gating (45 seconds)

**Show:** Navigate to `/dashboard/gating`

**Say:**
> "Token Gating is one of the most powerful features. It generates ready-to-use code snippets that restrict content access based on NFT ownership."

**Actions:**
1. Click through the four tabs: React, HTML, Node.js, Next.js API
2. Show the code snippet for React
3. Click the copy button

**Say:**
> "We provide four integration types. React and Next.js snippets use wagmi hooks. The HTML snippet works for static sites with ethers.js. The Node.js snippet is Express middleware for backend gating. And the Next.js API route handles serverless verification. Each snippet is copy-paste ready — just replace the contract address with your own."

---

## Scene 9: Documentation (20 seconds)

**Show:** Navigate to `/dashboard/docs`

**Say:**
> "Finally, the Docs page has comprehensive FAQ sections covering Getting Started, Smart Contracts, Allowlisting, Analytics, Token Gating, and Monad-specific guidance. Everything a creator needs to get up and running."

---

## Scene 10: Smart Contract Proof (30 seconds)

**Show:** Open Monad Explorer: `https://testnet.monadexplorer.com/address/0x44eb47fdca09d1baee865390991155d5abb49abc`

**Say:**
> "Let me show you the actual deployed contract on Monad Explorer. Here's our NFTTerminal contract at address 0x44eb47...b49abc. You can see the deployment transaction, the contract's on-chain state, and all interactions. The contract is live and ready for minting."

---

## Scene 11: Closing (20 seconds)

**Show:** Switch back to the landing page or presentation slide 13

**Say:**
> "That's NFT Terminal — a complete no-code NFT launchpad on Monad. Deploy collections, manage allowlists, track analytics, and set up token gating — all from one dashboard. The code is open source on GitHub at rdprassy/monadblitzapp. Thanks for watching!"

---

## Total estimated time: ~6 minutes
