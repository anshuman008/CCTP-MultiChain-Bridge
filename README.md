# CCPT-CROSS-CHAIN-BRIDGING

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A robust, production-ready cross-chain bridge implementation using **Wormhole SDK** and **CCTP (Circle's Cross-Chain Transfer Protocol)** for seamless USDC transfers across multiple blockchain networks.

## 🚀 Features

- **Multi-Chain Support**: Bridge USDC between Ethereum, Base, Arbitrum, Optimism, Polygon, Avalanche, and Solana
- **Testnet & Mainnet**: Full support for both production and development environments
- **TypeScript**: Built with TypeScript for type safety and better development experience
- **CCTP Integration**: Leverages Circle's official cross-chain transfer protocol
- **Automated Attestation**: Handles cross-chain message attestation automatically
- **Error Handling**: Comprehensive error handling with detailed logging
- **Chain Validation**: Built-in validation to prevent invalid bridge operations

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Source Chain  │───▶│  Wormhole SDK    │───▶│ Destination     │
│   (e.g., Solana)│    │  + CCTP Bridge   │    │ Chain (e.g.,   │
│                 │    │                  │    │ Base Sepolia)   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Core Components

- **`MultiChainCCTPBridge`**: Main bridge class handling cross-chain transfers
- **`getSigner`**: Unified signer management for EVM and Solana chains
- **`config.ts`**: Centralized configuration for supported chains and timeouts
- **`debugchains.ts`**: Chain debugging and validation utilities

## 📋 Supported Chains

### Mainnet Networks
| Chain | Type | Symbol | Status |
|-------|------|--------|---------|
| Ethereum | EVM | ETH | ✅ |
| Base | EVM | ETH | ✅ |
| Arbitrum | EVM | ETH | ✅ |
| Optimism | EVM | ETH | ✅ |
| Polygon | EVM | MATIC | ✅ |
| Avalanche | EVM | AVAX | ✅ |
| Solana | Solana | SOL | ✅ |

### Testnet Networks
| Chain | Type | Symbol | Status |
|-------|------|--------|---------|
| Sepolia | EVM | ETH | ✅ |
| Base Sepolia | EVM | ETH | ✅ |
| Arbitrum Sepolia | EVM | ETH | ✅ |
| Optimism Sepolia | EVM | ETH | ✅ |
| Polygon Mumbai | EVM | MATIC | ✅ |
| Avalanche Fuji | EVM | AVAX | ✅ |
| Solana Devnet | Solana | SOL | ✅ |

## 🛠️ Installation

### Prerequisites

- Node.js 18+ 
- npm or yarn
- TypeScript knowledge (recommended)

### Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd ccpt-mutichain-bridge
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Configuration**
Create a `.env` file in the root directory:

```bash
# EVM Chains (64 hex characters, with or without 0x prefix)
ETHEREUM_PRIVATE_KEY=your_ethereum_private_key_here
BASE_PRIVATE_KEY=your_base_private_key_here
ARBITRUM_PRIVATE_KEY=your_arbitrum_private_key_here
OPTIMISM_PRIVATE_KEY=your_optimism_private_key_here
POLYGON_PRIVATE_KEY=your_polygon_private_key_here
AVALANCHE_PRIVATE_KEY=your_avalanche_private_key_here

# Testnet EVM Chains
SEPOLIA_PRIVATE_KEY=your_sepolia_private_key_here
BASE_SEPOLIA_PRIVATE_KEY=your_base_sepolia_private_key_here
ARBITRUM_SEPOLIA_PRIVATE_KEY=your_arbitrum_sepolia_private_key_here
OPTIMISM_SEPOLIA_PRIVATE_KEY=your_optimism_sepolia_private_key_here
POLYGON_MUMBAI_PRIVATE_KEY=your_polygon_mumbai_private_key_here
AVALANCHE_FUJI_PRIVATE_KEY=your_avalanche_fuji_private_key_here

# Solana (Base58 encoded string, typically 88 characters)
SOLANA_PRIVATE_KEY=your_solana_private_key_here
SOLANA_DEVNET_PRIVATE_KEY=your_solana_devnet_private_key_here
```

## 🔑 Private Key Format Requirements

### EVM Chains
- **Format**: 64 hexadecimal characters
- **Examples**: 
  ```
  1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
  0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
  ```

### Solana
- **Format**: Base58 encoded string (typically 87-88 characters)
- **Valid characters**: `123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz`
- **Invalid characters**: `_` (underscore), `-` (hyphen), `0` (zero), `O` (capital O), `I` (capital I), `l` (lowercase L)
- **Alternative format**: JSON array of 64 numbers: `[1,2,3,...]`

## 🚀 Usage

### Basic Bridge Transfer

```typescript
import { MultiChainCCTPBridge } from "./multi-chain-bridge";
import { USDC_CONFIG } from "./config";

const bridge = new MultiChainCCTPBridge(true); // true for testnet
await bridge.initialize();

const result = await bridge.transfer({
    fromChain: "SOLANA",
    toChain: "BASE_SEPOLIA",
    amount: USDC_CONFIG.UNITS, // 1,000,000 USDC (6 decimals)
    recipientAddress: "optional_recipient_address"
});

console.log("Transfer result:", result);
```

### Available Scripts

```bash
# Start the bridge (default: Solana to Base Sepolia)
npm start

# Debug available chains and their configurations
npm run debug

# Build the project
npm run build
```

### Programmatic Usage

```typescript
import { MultiChainCCTPBridge } from "./multi-chain-bridge";

class BridgeService {
    private bridge: MultiChainCCTPBridge;

    constructor(isTestnet: boolean = false) {
        this.bridge = new MultiChainCCTPBridge(isTestnet);
    }

    async initialize() {
        await this.bridge.initialize();
    }

    async transferUSDC(fromChain: string, toChain: string, amount: bigint) {
        return await this.bridge.transfer({
            fromChain,
            toChain,
            amount
        });
    }
}
```

## 🔧 Configuration

### USDC Configuration
```typescript
export const USDC_CONFIG = {
    UNITS: 1000000n,    // 1,000,000 USDC
    DECIMALS: 6,        // USDC has 6 decimal places
} as const;
```

### Timeout Configuration
```typescript
export const TIMEOUTS = {
    ATTESTATION: 300_000,   // 5 minutes for attestation
    FINALIZATION: 60_000,   // 1 minute for finalization
} as const;
```

### Chain Configuration
Each chain has detailed configuration including:
- Network type (EVM/Solana)
- Native token symbol
- Testnet/Mainnet status
- Platform-specific settings

## 📊 Transfer Flow

1. **Initialization**: Bridge connects to source and destination chains
2. **Validation**: Chain compatibility and private key validation
3. **Burn**: USDC is burned on the source chain
4. **Attestation**: Cross-chain message attestation (automated)
5. **Mint**: USDC is minted on the destination chain
6. **Completion**: Transfer status and transaction details returned

## 🐛 Troubleshooting

### Common Issues

#### 1. Private Key Format Errors
```
Error: Invalid Solana private key format. Contains invalid characters: _, l, _, _, _
```
**Solution**: Ensure your private keys contain only valid characters:
- EVM: 64 hex characters
- Solana: Base58 characters only (no underscores, hyphens, or special chars)

#### 2. Missing Environment Variables
```
Error: Missing private key for Solana. Please set environment variable: SOLANA_PRIVATE_KEY
```
**Solution**: Check your `.env` file and ensure all required private keys are set

#### 3. Chain Validation Errors
```
Error: Cannot bridge between mainnet and testnet
```
**Solution**: Use consistent network types (either all testnet or all mainnet)

#### 4. RPC Connection Issues
```
Error: Failed to create signer for Solana
```
**Solution**: Check network connectivity and RPC endpoint availability

### Debug Mode

Use the debug script to troubleshoot chain configurations:

```bash
npm run debug
```

This will show:
- Available chains
- Platform types
- Connection status
- Configuration details

## 🧪 Testing

### Testnet Usage
```typescript
const bridge = new MultiChainCCTPBridge(true); // true = testnet
```

### Mainnet Usage
```typescript
const bridge = new MultiChainCCTPBridge(false); // false = mainnet
```

## 📁 Project Structure

```
ccpt-mutichain-bridge/
├── src/
│   ├── index.ts              # Main entry point
│   ├── multi-chain-bridge.ts # Core bridge implementation
│   ├── getsigner.ts          # Signer management
│   ├── config.ts             # Configuration and constants
│   └── debugchains.ts        # Chain debugging utilities
├── package.json              # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── .env                     # Environment variables (create this)
└── README.md               # This file
```

## 🔒 Security Considerations

- **Private Keys**: Never commit private keys to version control
- **Environment Variables**: Use `.env` files for sensitive data
- **Network Validation**: Always validate chain compatibility before transfers
- **Error Handling**: Implement proper error handling for production use
- **Rate Limiting**: Consider implementing rate limiting for high-frequency transfers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Add proper error handling
- Include JSDoc comments for public methods
- Test on testnet before mainnet deployment
- Update documentation for new features

## 📚 Dependencies

- **@wormhole-foundation/sdk**: Core Wormhole SDK for cross-chain functionality
- **dotenv**: Environment variable management
- **TypeScript**: Type safety and modern JavaScript features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Wormhole Foundation**: For the excellent cross-chain SDK
- **Circle**: For the CCTP protocol enabling USDC transfers
- **Open Source Community**: For contributions and feedback

## 📞 Support

- **Issues**: [GitHub Issues](link-to-issues)
- **Discussions**: [GitHub Discussions](link-to-discussions)
- **Documentation**: [Wormhole SDK Docs](https://docs.wormhole.com/)
