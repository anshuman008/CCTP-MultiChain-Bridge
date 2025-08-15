import { MultiChainCCTPBridge } from "./multi-chain-bridge";
import { USDC_CONFIG } from "./config";

// Helper function to extract key info from bridge response
const extractBridgeInfo = (response:any, fromChain:any, toChain:any) => {
    return {
        from: fromChain,
        to: toChain,
        txHash: response?.transactionHash || response?.txHash || 'N/A',
        status: response?.status || 'completed',
        amount: response?.amount || USDC_CONFIG.UNITS,
        timestamp: new Date().toLocaleTimeString()
    };
};

// Helper function for compact logging
const logBridgeResult = (info:any, step:any) => {
    console.log(`\n🌉 Bridge Step ${step}: ${info.from} → ${info.to}`);
    console.log(`   ✅ Status: ${info.status}`);
    console.log(`   💰 Amount: ${info.amount} USDC`);
    console.log(`   🔗 Tx Hash: ${info.txHash.slice(0, 10)}...${info.txHash.slice(-6)}`);
    console.log(`   ⏰ Time: ${info.timestamp}`);
    console.log(`   ${'─'.repeat(50)}`);
};

const BridgeUSDC = async () => {
    try {
        console.log('🚀 Initializing Multi-Chain CCTP Bridge...\n');
        
        const bridge = new MultiChainCCTPBridge(true);
        await bridge.initialize();
        
        console.log('✅ Bridge initialized successfully!\n');
        console.log(`💸 Starting bridge sequence with ${USDC_CONFIG.UNITS} USDC\n`);
        console.log('═'.repeat(60));

        // Step 1: Solana to Base Sepolia
        console.log('\n📡 Step 1: Bridging from Solana to Base Sepolia...');
        const solanaToBase = await bridge.transfer({
            fromChain: "SOLANA",
            toChain: "BASE_SEPOLIA",
            amount: USDC_CONFIG.UNITS
        });
        
        const step1Info = extractBridgeInfo(solanaToBase, "SOLANA", "BASE_SEPOLIA");
        logBridgeResult(step1Info, 1);

        // Step 2: Base Sepolia to Ethereum Sepolia
        console.log('\n📡 Step 2: Bridging from Base Sepolia to Ethereum Sepolia...');
        const baseToEthSepolia = await bridge.transfer({
            fromChain: "BASE_SEPOLIA",
            toChain: "SEPOLIA",
            amount: USDC_CONFIG.UNITS
        });
        
        const step2Info = extractBridgeInfo(baseToEthSepolia, "BASE_SEPOLIA", "SEPOLIA");
        logBridgeResult(step2Info, 2);

        // Step 3: Ethereum Sepolia to Optimism Sepolia
        console.log('\n📡 Step 3: Bridging from Ethereum Sepolia to Optimism Sepolia...');
        const ethToOptimism = await bridge.transfer({
            fromChain: "SEPOLIA",
            toChain: "OPTIMISM_SEPOLIA",
            amount: USDC_CONFIG.UNITS
        });
        
        const step3Info = extractBridgeInfo(ethToOptimism, "SEPOLIA", "OPTIMISM_SEPOLIA");
        logBridgeResult(step3Info, 3);

        // Summary
        console.log('\n🎉 All bridge transfers completed successfully!');
        console.log('═'.repeat(60));
        console.log('\n📊 Bridge Summary:');
        console.log(`   • Total Steps: 3`);
        console.log(`   • Total Amount Bridged: ${USDC_CONFIG.UNITS} USDC per step`);
        console.log(`   • Chain Route: SOLANA → BASE_SEPOLIA → SEPOLIA → OPTIMISM_SEPOLIA`);
        console.log('\n✨ Bridge sequence completed at:', new Date().toLocaleString());

    } catch (error) {
        console.error('\n❌ Bridge Error:', error);
        console.error('🔍 Full error details:', error);
        process.exit(1);
    }
};

// Execute with proper error handling
BridgeUSDC()
    .then(() => {
        console.log('\n🏁 Script execution completed successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n💥 Unexpected error:', error);
        process.exit(1);
    });