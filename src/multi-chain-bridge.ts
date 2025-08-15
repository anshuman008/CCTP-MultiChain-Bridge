import { Network, wormhole } from "@wormhole-foundation/sdk";
import evm from "@wormhole-foundation/sdk/evm";
import solana from "@wormhole-foundation/sdk/solana";
import { getSigner } from "./getsigner";
import {
  CCTP_SUPPORTED_CHAINS,
  CHAIN_CONFIGS,
  TIMEOUTS,
} from "./config";

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
  destinationTxs?: string[];
  status: "initiated" | "attested" | "completed" | "failed";
  error?: string;
}

export class MultiChainCCTPBridge {
  private wh: any;
  private network: Network;

  constructor(isTestnet: boolean = false) {
    this.network = isTestnet ? "Testnet" : "Mainnet";
  }

  async initialize() {
    this.wh = await wormhole(this.network, [evm, solana]);
  }

  async transfer(params: BridgeTransferParams): Promise<TransferResult> {
    const { fromChain, toChain, amount, recipientAddress } = params;

    try {
      this.validateChains(fromChain, toChain);

      const sourceChain = this.wh.getChain(CCTP_SUPPORTED_CHAINS[fromChain]);
      const destinationChain = this.wh.getChain(CCTP_SUPPORTED_CHAINS[toChain]);

      console.log(`Bridging ${amount} USDC from ${fromChain} to ${toChain}`);

      const sourceSigner = await getSigner(sourceChain);
      const destinationSigner = await getSigner(destinationChain);

      const recipient = recipientAddress || destinationSigner.address;

      const transfer = await this.wh.circleTransfer(
        amount,
        sourceSigner.address,
        recipient,
        false
      );

      const sourceTransaction = await transfer.initiateTransfer(
        sourceSigner.signer
      );
      console.log("Burn transaction:--", sourceTransaction);

      const attestationId = await transfer.fetchAttestation(
        TIMEOUTS.ATTESTATION
      );
      console.log("Attestation received:", attestationId);

      const destinationTxs = await transfer.completeTransfer(
        destinationSigner.signer
      );
      console.log("Mint transaction:---", destinationTxs);

      return {
        transferId: `${fromChain}-${toChain}-${Date.now()}`,
        sourceTransaction,
        attestationId,
        destinationTxs,
        status: "completed",
      };
    } catch (e) {
      console.log("bridging failedf!!", e);
      return {
        transferId: `${fromChain}-${toChain}-${Date.now()}`,
        sourceTransaction: [],
        status: 'failed',
        error: "Error"
      }; 
    }
  }

  private validateChains(
    fromChain: keyof typeof CCTP_SUPPORTED_CHAINS,
    toChain: keyof typeof CCTP_SUPPORTED_CHAINS
  ) {
    if (fromChain === toChain) {
      throw new Error("Source and destination chains cannot be the same");
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
      throw new Error("Cannot bridge between mainnet and testnet");
    }
  }
}
