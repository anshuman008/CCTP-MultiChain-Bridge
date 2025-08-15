import { wormhole } from '@wormhole-foundation/sdk';
import evm from '@wormhole-foundation/sdk/evm';
import solana from '@wormhole-foundation/sdk/solana';
import '@wormhole-foundation/sdk-evm-cctp';
import '@wormhole-foundation/sdk-solana-cctp';

async function debugChains() {
  try {

    console.log('Debugging available chains-----');
    
    const wh = await wormhole('Testnet', [evm, solana]);
        
    const testChains = [
      "Sepolia",
      "BASE_SEPOLIA",
      "Arbitrum",
      "Base",
      "Optimism",
      "ArbitrumSepolia",
      "OptimismSepolia"
    ];
    
    for (const chainName of testChains) {
      try {
        const chain = wh.getChain(chainName as any);

        console.log("here is chain details---", chain);
        
        console.log(`${chainName}: ${chain.platform.utils()._platform}`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.log(`Error-- ${chainName}: ${errorMessage}`);
      }
    }
    
  } catch (error) {
    console.error('Debug failed', error);
  }
}

debugChains();
