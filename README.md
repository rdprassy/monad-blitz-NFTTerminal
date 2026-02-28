# NFT Terminal

**The all-in-one NFT launchpad on Monad for creators, influencers, and artists.**

> "Your NFT Launchpad for the Creator Economy."
> Launch fast, grow smart — mint, gate, analyze, and scale on Monad.

## Live Demo

- **Primary:** [https://monadblitz.rdprassy.com](https://monadblitz.rdprassy.com)
- **Mirror:** [https://monadblitzapp.vercel.app](https://monadblitzapp.vercel.app/)

---

## Features

- **No-Code Deployment** — Deploy ERC-721 contracts with configurable metadata, pricing, and limits
- **Allowlist Management** — Merkle-tree based whitelisting with CSV upload support
- **Holder Analytics** — Track mint volume, holder distribution, whale concentration, and transfers
- **Token Gating** — Auto-generated code snippets (React, HTML, Node.js, Next.js API) for access control
- **Monad Powered** — High throughput, near-zero gas fees, full EVM compatibility

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router) + TailwindCSS |
| Wallet | wagmi v2 + viem |
| Smart Contracts | Solidity 0.8.27, Hardhat, OpenZeppelin |
| Blockchain | Monad Testnet (Chain ID: 10143) |
| Icons | Lucide React |

---

## Getting Started

### Prerequisites

- **Node.js** v18+ installed ([download](https://nodejs.org))
- **MetaMask** or any EVM wallet browser extension
- **Git** installed

### 1. Clone the Repository

```bash
git clone https://github.com/rdprassy/monad-blitz-NFTTerminal.git
cd monad-blitz-NFTTerminal
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your values if needed. The defaults work for Monad Testnet.

### 4. Run the Development Server

```bash
npm run dev
```

Open **http://localhost:3000** in your browser.

### 5. Add Monad Testnet to MetaMask

| Field | Value |
|-------|-------|
| Network Name | Monad Testnet |
| RPC URL | `https://testnet-rpc.monad.xyz` |
| Chain ID | `10143` |
| Currency Symbol | `MON` |
| Block Explorer | `https://testnet.monadexplorer.com` |

---

## Deployed Contract (Proof of Deployment)

The NFTTerminal smart contract has been successfully deployed to **Monad Testnet**.

| Detail | Value |
|--------|-------|
| **Contract Address** | [`0x44eb47fdca09d1baee865390991155d5abb49abc`](https://testnet.monadexplorer.com/address/0x44eb47fdca09d1baee865390991155d5abb49abc) |
| **Network** | Monad Testnet (Chain ID: 10143) |
| **Deployer** | `0x61bCDe7246C1D4EafEAEf0d2Ae7Fa69D378e5F3D` |
| **Tx Hash** | [`0x6a0aa1712e4401fef5c0f79c480d62cea1ba2419aaa9fb49174921d7d8e5c287`](https://testnet.monadexplorer.com/tx/0x6a0aa1712e4401fef5c0f79c480d62cea1ba2419aaa9fb49174921d7d8e5c287) |
| **Block** | `15689499` |
| **Solidity** | `0.8.27` (EVM: Cancun) |
| **Gas Used** | `2,225,252` |

### On-Chain Contract State

| Parameter | Value |
|-----------|-------|
| Name | NFT Terminal Collection |
| Symbol | NFTC |
| Max Supply | 10,000 |
| Mint Price | 0.01 MON |
| Max Per Wallet | 5 |
| Total Minted | 0 |
| Owner | `0x61bCDe7246C1D4EafEAEf0d2Ae7Fa69D378e5F3D` |

> Verify on Monad Explorer: [https://testnet.monadexplorer.com/address/0x44eb47fdca09d1baee865390991155d5abb49abc](https://testnet.monadexplorer.com/address/0x44eb47fdca09d1baee865390991155d5abb49abc)

---

## Smart Contract Deployment (Optional)

To deploy the NFTTerminal contract directly via Hardhat:

### 1. Set your private key

```bash
# In .env file (NOT .env.local)
PRIVATE_KEY=your_wallet_private_key_here
```

### 2. Compile contracts

```bash
npx hardhat compile
```

### 3. Deploy to Monad Testnet

```bash
npx hardhat run scripts/deploy.ts --network monadTestnet
```

---

## Project Structure

```
monadblitzapp/
├── contracts/              # Solidity smart contracts
│   └── NFTTerminal.sol     # Main ERC-721 contract
├── scripts/                # Hardhat deployment scripts
│   └── deploy.ts
├── src/
│   ├── app/                # Next.js App Router pages
│   │   ├── page.tsx        # Landing page
│   │   └── dashboard/      # Dashboard pages
│   │       ├── page.tsx        # Overview
│   │       ├── deploy/         # Deploy collection
│   │       ├── allowlist/      # Whitelist management
│   │       ├── analytics/      # Analytics dashboard
│   │       ├── gating/         # Token gating snippets
│   │       └── docs/           # Documentation
│   ├── components/         # React components
│   │   ├── layout/         # Navbar, Sidebar, Footer
│   │   └── providers/      # Web3Provider (wagmi)
│   └── lib/                # Utilities and config
│       ├── wagmi.ts        # Wagmi + Monad chain config
│       ├── contracts.ts    # Contract ABI
│       └── utils.ts        # Helper functions
├── hardhat.config.ts       # Hardhat configuration
├── tailwind.config.ts      # TailwindCSS with Monad theme
└── .env.example            # Environment variables template
```

---

## Pushing to GitHub

### First Time Setup

```bash
# 1. Create a new repository on GitHub (https://github.com/new)
#    Name it: monadblitzapp
#    Do NOT initialize with README (we already have one)

# 2. Initialize git and push
git add .
git commit -m "Initial commit: NFT Terminal - Monad NFT Launchpad"
git branch -M main
git remote add origin https://github.com/rdprassy/monadblitzapp.git
git push -u origin main
```

### Subsequent Pushes

```bash
git add .
git commit -m "your commit message"
git push
```

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (http://localhost:3000) |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npx hardhat compile` | Compile Solidity contracts |
| `npx hardhat run scripts/deploy.ts --network monadTestnet` | Deploy to Monad |

---

## Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Vercel auto-detects Next.js — click **Deploy**
5. Your app will be live in ~60 seconds

---

## License

MIT

---

**Built with love on Monad.**
