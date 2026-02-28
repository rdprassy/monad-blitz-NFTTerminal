const STORAGE_KEY = "nft_terminal_deployed_contracts";

export interface DeployedContract {
  address: string;
  name: string;
  symbol: string;
  maxSupply: string;
  mintPrice: string;
  deployedAt: number; // timestamp
  txHash: string;
}

export function getDeployedContracts(): DeployedContract[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addDeployedContract(contract: DeployedContract): void {
  const contracts = getDeployedContracts();
  // Avoid duplicates
  if (contracts.some((c) => c.address.toLowerCase() === contract.address.toLowerCase())) return;
  contracts.push(contract);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(contracts));
}
