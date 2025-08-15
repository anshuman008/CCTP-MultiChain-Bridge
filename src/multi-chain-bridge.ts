import { Network, wormhole } from '@wormhole-foundation/sdk';
import evm from '@wormhole-foundation/sdk/evm';
import solana from '@wormhole-foundation/sdk/solana';
import { getSigner } from './singer';
import { CCTP_SUPPORTED_CHAINS, CHAIN_CONFIGS, USDC_CONFIG, TIMEOUTS } from './config';

export interface BridgeTransferParams {
  fromChain: keyof typeof CCTP_SUPPORTED_CHAINS;
  toChain: keyof typeof CCTP_SUPPORTED_CHAINS;
  amount: bigint;
  recipientAddress?: string; 
  isTestnet?: boolean;
}

export interface TransferResult {
  transferId: string;
  sourceTransaction: string[];
  attestationId?: string[];
  destinationTransaction?: string[];
  status: 'initiated' | 'attested' | 'completed' | 'failed';
  error?: string;
}


export class MultiChainCCTPBridge {
    private wh: any;
    private network: Network;



    constructor(isTestnet: boolean = false) {
        this.network = isTestnet? "Testnet":"Mainnet";
    }


    async transfer(params: BridgeTransferParams): Promise<TransferResult> {
        const {fromChain,toChain,amount,recipientAddress} = params;

        try{
            this.validateChains(fromChain,toChain);

            const sourceChain = this.wh.getChain(CCTP_SUPPORTED_CHAINS[fromChain]);
            const destination = this.wh.getChain(CCTP_SUPPORTED_CHAINS[toChain]);

            console.log(`Bridging ${amount} USDC from ${fromChain} to ${toChain}`);

        }
        catch(e){
            console.log("bridging failedf!!",e);
        }
    }


      private validateChains(fromChain: keyof typeof CCTP_SUPPORTED_CHAINS, toChain: keyof typeof CCTP_SUPPORTED_CHAINS) {
    if (fromChain === toChain) {
      throw new Error('Source and destination chains cannot be the same');
    }

    if (!CCTP_SUPPORTED_CHAINS[fromChain]) {
      throw new Error(`Unsupported source chain: ${fromChain}`);
    }

    if (!CCTP_SUPPORTED_CHAINS[toChain]) {
      throw new Error(`Unsupported destination chain: ${toChain}`);
    }

    const sourceConfig = CHAIN_CONFIGS[CCTP_SUPPORTED_CHAINS[fromChain]];
    const destConfig = CHAIN_CONFIGS[CCTP_SUPPORTED_CHAINS[toChain]];

    if (sourceConfig.isTestnet !== destConfig.isTestnet) {
      throw new Error('Cannot bridge between mainnet and testnet');
    }
  }
}

export class MultiChainCCTPBridge {
  private wh: any;
  private network: Network;

  constructor(isTestnet: boolean = false) {
    this.network = isTestnet ? 'Testnet' : 'Mainnet';
  }

  async initialize() {

    this.wh = await wormhole(this.network, [evm, solana]);
  }

  async transfer(params: BridgeTransferParams): Promise<TransferResult> {
    const { fromChain, toChain, amount, recipientAddress } = params;

    try {
      this.validateChains(fromChain, toChain);

      // Get chain contexts
      const sourceChain = this.wh.getChain(CCTP_SUPPORTED_CHAINS[fromChain]);
      const destinationChain = this.wh.getChain(CCTP_SUPPORTED_CHAINS[toChain]);

      console.log(`🌉 Bridging ${amount} USDC from ${fromChain} to ${toChain}`);

      // Get signers for both chains
      const sourceSigner = await getSigner(sourceChain);
      const destinationSigner = await getSigner(destinationChain);

      // Use recipient address or default to destination signer address
      const recipient = recipientAddress || destinationSigner.address;

      // Create Circle transfer
      const transfer = await this.wh.circleTransfer(
        amount,
        sourceSigner.address,
        recipient,
        false // automatic mode
      );

      // Step 1: Initiate transfer (burn on source)
      console.log('🔥 Initiating burn on source chain...');
      const sourceTransaction = await transfer.initiateTransfer(sourceSigner.signer);
      console.log('✅ Burn transaction:', sourceTransaction);

      // Step 2: Wait for attestation
      console.log('⏳ Waiting for Circle attestation...');
      const attestationId = await transfer.fetchAttestation(TIMEOUTS.ATTESTATION);
      console.log('✅ Attestation received:', attestationId);

      // Step 3: Complete transfer (mint on destination)
      console.log('🪙 Completing mint on destination chain...');
      const destinationTransaction = await transfer.completeTransfer(destinationSigner.signer);
      console.log('✅ Mint transaction:', destinationTransaction);

      return {
        transferId: `${fromChain}-${toChain}-${Date.now()}`,
        sourceTransaction,
        attestationId,
        destinationTransaction,
        status: 'completed'
      };

    } catch (error) {
      console.error('❌ Bridge transfer failed:', error);
      return {
        transferId: `${fromChain}-${toChain}-${Date.now()}`,
        sourceTransaction: [],
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getSupportedChains(): Promise<string[]> {
    const testnetChains = this.network === 'Testnet';
    return Object.entries(CHAIN_CONFIGS)
      .filter(([_, config]) => config.isTestnet === testnetChains)
      .map(([chainName, config]) => `${config.name} (${chainName})`);
  }

  async getBalance(chain: keyof typeof CCTP_SUPPORTED_CHAINS, address: string): Promise<bigint> {
    try {
      const chainContext = this.wh.getChain(CCTP_SUPPORTED_CHAINS[chain]);
      // This would need to be implemented based on chain type
      // For now, returning 0 as placeholder
      console.log(`Getting USDC balance for ${address} on ${chain}`);
      return 0n; // Placeholder - implement actual balance checking
    } catch (error) {
      console.error(`Failed to get balance on ${chain}:`, error);
      return 0n;
    }
  }

  private validateChains(fromChain: keyof typeof CCTP_SUPPORTED_CHAINS, toChain: keyof typeof CCTP_SUPPORTED_CHAINS) {
    if (fromChain === toChain) {
      throw new Error('Source and destination chains cannot be the same');
    }

    if (!CCTP_SUPPORTED_CHAINS[fromChain]) {
      throw new Error(`Unsupported source chain: ${fromChain}`);
    }

    if (!CCTP_SUPPORTED_CHAINS[toChain]) {
      throw new Error(`Unsupported destination chain: ${toChain}`);
    }

    const sourceConfig = CHAIN_CONFIGS[CCTP_SUPPORTED_CHAINS[fromChain]];
    const destConfig = CHAIN_CONFIGS[CCTP_SUPPORTED_CHAINS[toChain]];

    if (sourceConfig.isTestnet !== destConfig.isTestnet) {
      throw new Error('Cannot bridge between mainnet and testnet');
    }
  }
}