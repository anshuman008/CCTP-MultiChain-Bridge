import { MultiChainCCTPBridge } from "./multi-chain-bridge";
import { USDC_CONFIG } from "./config";

const bridgeUSDC = async () => {
  const bridge = new MultiChainCCTPBridge(true);
  await bridge.initialize();

   // Bridging SOLANA → BASE_SEPOLIA
  const solToBase = await bridge.transfer({
    fromChain: "SOLANA",
    toChain: "BASE_SEPOLIA",
    amount: USDC_CONFIG.UNITS,
  });

  console.log("Bridging completed here is details---", solToBase);


  // Bridging BASE_SEPOLIA → Eth SEPOLIA
  const baseToEth = await bridge.transfer({
    fromChain: "BASE_SEPOLIA",
    toChain: "SEPOLIA",
    amount: USDC_CONFIG.UNITS,
  });

  console.log("Bridging completed here is details---", baseToEth);


  // Bridging SEPOLIA → OPTIMISM_SEPOLIA
  const ethToOptimism = await bridge.transfer({
    fromChain: "SEPOLIA",
    toChain: "OPTIMISM_SEPOLIA",
    amount: USDC_CONFIG.UNITS,
  });

  console.log("Bridging completed here is details---", ethToOptimism);
};


bridgeUSDC().catch(console.error);
