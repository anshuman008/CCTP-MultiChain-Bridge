import { Chain } from '@wormhole-foundation/sdk';

export const CCTP_SUPPORTED_CHAINS = {
  ETHEREUM: 'Ethereum' as Chain,
  ARBITRUM: 'Arbitrum' as Chain,
  AVALANCHE_MAINNET: 'Avalanche' as Chain,
  BASE: 'Base' as Chain,
  OPTIMISM: 'Optimism' as Chain,
  POLYGON_MAINNET: 'Polygon' as Chain,
  SOLANA_MAINNET: 'Solana' as Chain,
  
  // devnets and testnets
  SEPOLIA: 'Sepolia' as Chain,
  ARBITRUM_SEPOLIA: 'ArbitrumSepolia' as Chain,
  AVALANCHE_TESTNET: 'Avalanche' as Chain,
  BASE_SEPOLIA: 'BaseSepolia' as Chain,
  OPTIMISM_SEPOLIA: 'OptimismSepolia' as Chain,
  POLYGON_TESTNET: 'Polygon' as Chain, 
  SOLANA: 'Solana' as Chain, 
} as const;

export const CHAIN_CONFIGS = {
  [CCTP_SUPPORTED_CHAINS.ETHEREUM]: {
    name: 'Ethereum Mainnet',
    type: 'evm',
    symbol: 'ETH',
    isTestnet: false,
  },
  [CCTP_SUPPORTED_CHAINS.BASE]: {
    name: 'Base',
    type: 'evm', 
    symbol: 'ETH',
    isTestnet: false,
  },
  [CCTP_SUPPORTED_CHAINS.ARBITRUM]: {
    name: 'Arbitrum One',
    type: 'evm',
    symbol: 'ETH', 
    isTestnet: false,
  },
  [CCTP_SUPPORTED_CHAINS.SOLANA_MAINNET]: {
    name: 'Solana Mainnet',
    type: 'solana',
    symbol: 'SOL',
    isTestnet: false,
  },
  [CCTP_SUPPORTED_CHAINS.AVALANCHE_MAINNET]: {
    name: 'Avalanche Mainnet',
    type: 'evm',
    symbol: 'AVAX',
    isTestnet: false,
  },
  [CCTP_SUPPORTED_CHAINS.POLYGON_MAINNET]: {
    name: 'Polygon Mainnet',
    type: 'evm',
    symbol: 'MATIC',
    isTestnet: false,
  },

  [CCTP_SUPPORTED_CHAINS.SEPOLIA]: {
    name: 'Sepolia Testnet',
    type: 'evm',
    symbol: 'ETH',
    isTestnet: true,
  },
  [CCTP_SUPPORTED_CHAINS.BASE_SEPOLIA]: {
    name: 'Base Sepolia',
    type: 'evm',
    symbol: 'ETH', 
    isTestnet: true,
  },
  [CCTP_SUPPORTED_CHAINS.OPTIMISM_SEPOLIA]: {
    name: 'Optimism Sepolia',
    type: 'evm',
    symbol: 'ETH',
    isTestnet: true,
  },
  [CCTP_SUPPORTED_CHAINS.ARBITRUM_SEPOLIA]: {
    name: 'Arbitrum Sepolia',
    type: 'evm',
    symbol: 'ETH',
    isTestnet: true,
  },
  [CCTP_SUPPORTED_CHAINS.AVALANCHE_TESTNET]: {
    name: 'Avalanche Testnet',
    type: 'evm',
    symbol: 'AVAX',
    isTestnet: true,
  },
  [CCTP_SUPPORTED_CHAINS.POLYGON_TESTNET]: {
    name: 'Polygon Testnet',
    type: 'evm',
    symbol: 'MATIC',
    isTestnet: true,
  },
  [CCTP_SUPPORTED_CHAINS.SOLANA]: {
    name: 'Solana Testnet',
    type: 'solana',
    symbol: 'SOL',
    isTestnet: true,
  },
} as const;

export const USDC_CONFIG = {
//@ts-ignore
  UNITS: 1000000n,
  DECIMALS: 6,
} as const;

export const TIMEOUTS = {
  ATTESTATION: 300_000, 
  FINALIZATION: 60_000,
} as const;

