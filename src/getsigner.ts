import {
  ChainAddress,
  ChainContext,
  Network,
  Signer,
  Wormhole,
  Chain,
} from '@wormhole-foundation/sdk';
import evm from '@wormhole-foundation/sdk/evm';
import solana from '@wormhole-foundation/sdk/solana';
import { config } from 'dotenv';
config(); 

export interface SignerStuff<N extends Network, C extends Chain> {
  chain: ChainContext<N, C>;
  signer: Signer<N, C>;
  address: ChainAddress<C>;
}

const CHAIN_ENV_KEYS = {
  'Ethereum': 'ETHEREUM_PRIVATE_KEY',
  'Base': 'BASE_PRIVATE_KEY', 
  'Arbitrum': 'ARBITRUM_PRIVATE_KEY',
  'Optimism': 'OPTIMISM_PRIVATE_KEY',
  'Polygon': 'POLYGON_PRIVATE_KEY',
  'Avalanche': 'AVALANCHE_PRIVATE_KEY',
  
  'Sepolia': 'SEPOLIA_PRIVATE_KEY',
  'BaseSepolia': 'BASE_SEPOLIA_PRIVATE_KEY',
  'ArbitrumSepolia': 'ARBITRUM_SEPOLIA_PRIVATE_KEY', 
  'OptimismSepolia': 'OPTIMISM_SEPOLIA_PRIVATE_KEY',
  'PolygonMumbai': 'POLYGON_MUMBAI_PRIVATE_KEY',
  'AvalancheFuji': 'AVALANCHE_FUJI_PRIVATE_KEY',
  
  'Solana': 'SOLANA_PRIVATE_KEY', 
  'SolanaDevnet': 'SOLANA_DEVNET_PRIVATE_KEY', 
} as const;



function getEnvForChain(chainName: string, platform: string): string {
  const chainSpecificKey = CHAIN_ENV_KEYS[chainName as keyof typeof CHAIN_ENV_KEYS];
  if (chainSpecificKey && process.env[chainSpecificKey]) {
    return process.env[chainSpecificKey]!;
  }



  const suggestedKey = chainSpecificKey || `${chainName.toUpperCase()}_PRIVATE_KEY`;
  throw new Error(`Missing private key for ${chainName}. Please set environment variable: ${suggestedKey}`);
}

function validatePrivateKey(privateKey: string, platform: string, chainName: string): void {
  if (!privateKey || privateKey.trim().length === 0) {
    throw new Error(`Empty private key for ${chainName}`);
  }

  switch (platform) {
    case 'Evm':
      const evmKey = privateKey.startsWith('0x') ? privateKey.slice(2) : privateKey;
      if (!/^[a-fA-F0-9]{64}$/.test(evmKey)) {
        throw new Error(`Invalid EVM private key format for ${chainName}. Expected 64 hex characters.`);
      }
      break;
    
    case 'Solana':
      if (privateKey.startsWith('[') && privateKey.endsWith(']')) {
        try {
          const keyArray = JSON.parse(privateKey);
          if (!Array.isArray(keyArray) || keyArray.length !== 64) {
            throw new Error(`Invalid Solana private key JSON array for ${chainName}. Expected 64 numbers.`);
          }
        } catch {
          throw new Error(`Invalid JSON format for Solana private key for ${chainName}`);
        }
      } else {
        if (privateKey.length < 80 || privateKey.length > 90) {
          console.warn(`Solana private key for ${chainName} has unusual length. Ensure it's valid base58.`);
        }
      }
      break;
  }
}

export async function getSigner<N extends Network, C extends Chain>(
  chain: ChainContext<N, C>
): Promise<SignerStuff<N, C>> {
  const platform = chain.platform.utils()._platform;
  const chainName = chain.chain;

  console.log(`Getting signer for ${chainName} (${platform})`);

  const privateKey = getEnvForChain(chainName, platform);
  
  validatePrivateKey(privateKey, platform, chainName);

  let signer: Signer;

  try {
    switch (platform) {
      case 'Solana':
        const solanaRpc = await chain.getRpc();
        signer = await (await solana()).getSigner(solanaRpc, privateKey);
        break;

      case 'Evm':
        const evmRpc = await chain.getRpc();
        signer = await (await evm()).getSigner(evmRpc, privateKey);
        break;

      default:
        throw new Error(`Unsupported platform: ${platform} for chain ${chainName}`);
    }

    const address = Wormhole.chainAddress(chain.chain, signer.address());
    console.log(`Signer created for ${chainName}: ${address.address.toString()}`);

    return {
      chain,
      signer: signer as Signer<N, C>,
      address,
    };

  } catch (error) {
    console.error(`Failed to create signer for ${chainName}:`, error);
    throw new Error(`Signer creation failed for ${chainName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export type SupportedChain = keyof typeof CHAIN_ENV_KEYS;
