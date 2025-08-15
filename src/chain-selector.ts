import { CHAIN_CONFIGS } from "./config";

export interface ChainInfo {
  id: string;
  name: string;
  type: 'evm' | 'solana';
  isTestnet: boolean;
  symbol: string;
}

export function getAvailableChains(isTestnet: boolean = false): ChainInfo[] {
  return Object.entries(CHAIN_CONFIGS)
    .filter(([_, config]) => config.isTestnet === isTestnet)
    .map(([chainId, config]) => ({
      id: chainId,
      name: config.name,
      type: config.type as 'evm' | 'solana',
      isTestnet: config.isTestnet,
      symbol: config.symbol,
    }));
}

export function validateChainPair(fromChain: string, toChain: string, isTestnet: boolean = false): boolean {
  const availableChains = getAvailableChains(isTestnet);
  const fromChainExists = availableChains.some(chain => chain.id === fromChain);
  const toChainExists = availableChains.some(chain => chain.id === toChain);
  
  return fromChainExists && toChainExists && fromChain !== toChain;
}