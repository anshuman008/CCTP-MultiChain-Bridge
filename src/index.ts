import { MultiChainCCTPBridge } from "./multi-chain-bridge";
import { USDC_CONFIG } from "./config";


const BridgeUSDC = async() => {

    const bridge = new MultiChainCCTPBridge(true);
    await bridge.initialize();


    const SolanaToBase = await bridge.transfer({
        fromChain: "BASE_SEPOLIA",
        toChain:"SOLANA",
        amount:USDC_CONFIG.UNITS
    });

   
    console.log("here is the bridging details----", SolanaToBase);
}

BridgeUSDC();