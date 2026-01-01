// Mainnet contract addresses
export const MAINNET_CONTRACTS = {
  // Base (chainId: 8453)
  8453: {
    MORToken: "0x7431aDa8a591C955a994a21710752EF9b882b8e3",
    BuilderContract: "0x42BB446eAE6dca7723a9eBdb81EA88aFe77eF4B9", // BuildersV4
    BuildersTreasuryV2: "0x9eba628581896ce086cb8f1A513ea6097A8FC561",
    FeeConfig: "0x845FBB4B3e2207BF03087b8B94D2430AB11088eE",
    RewardPoolV4: "0xDC99a8596e395E52aba2BD08C623E1e428Dc3980", // RewardPool
    CapitalPool: "0xCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC",
    StakingRewards: "0xDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD",
    MultiSig: "0xEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE",
  },
  // Arbitrum (chainId: 42161)
  42161: {
    MORToken: "0x092baadb7def4c3981454dd9c0a0d7ff07bcfc86",
    BuilderContract: "0xC0eD68f163d44B6e9985F0041fDf6f67c6BCFF3f", // BuildersV4
    BuildersTreasuryV2: "0xCBE3d2c3AdE62cf7aa396e8cA93D2A8bff96E257",
    FeeConfig: "0xc03d87085E254695754a74D2CF76579e167Eb895",
    RewardPoolV4: "0x281bc6F84952Abe53F6921dcD76c879d3C4b6375", // RewardPool
    CapitalPool: "0xcccccccccccccccccccccccccccccccccccccccc",
    StakingRewards: "0xdddddddddddddddddddddddddddddddddddddddd",
    MultiSig: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
  },
} as const;

// Testnet contract addresses
export const TESTNET_CONTRACTS = {
  // Base Sepolia (chainId: 84532)
  84532: {
    MORToken: "0x5c80ddd187054e1e4abbffcd750498e81d34ffa3",
    BuilderContract: "0x6C3401D71CEd4b4fEFD1033EA5F83e9B3E7e4381", // BuildersV4
    BuildersTreasuryV2: "0x05BfFa864b11e8Cd33367a4E95D75309b76434EB",
    FeeConfig: "0x926993cf1ffe3978500d95db591ac7a58d33c772",
    RewardPoolV4: "0x10777866547c53CBD69b02c5c76369d7e24e7b10", // RewardPool
    CapitalPool: "0x4200000000000000000000000000000000000009",
    StakingRewards: "0x4200000000000000000000000000000000000010",
    MultiSig: "0x4200000000000000000000000000000000000011",
  },
} as const;

// Chain configurations
export const CHAIN_CONFIG = {
  8453: {
    name: "Base",
    rpcUrl: "https://mainnet.base.org",
    explorerUrl: "https://basescan.org",
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
  },
  42161: {
    name: "Arbitrum",
    rpcUrl: "https://arb1.arbitrum.io/rpc",
    explorerUrl: "https://arbiscan.io",
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
  },
  84532: {
    name: "Base Sepolia",
    rpcUrl: "https://sepolia.base.org",
    explorerUrl: "https://sepolia.basescan.org",
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
  },
} as const;

// Helper type for chain IDs
export type ChainId = keyof typeof CHAIN_CONFIG;

// Helper function to get contracts for a chain
export function getContracts(chainId: ChainId) {
  const mainnet = MAINNET_CONTRACTS[chainId as keyof typeof MAINNET_CONTRACTS];
  const testnet =
    TESTNET_CONTRACTS[chainId as keyof typeof TESTNET_CONTRACTS];
  return mainnet || testnet || null;
}

// Helper function to get chain config
export function getChainConfig(chainId: ChainId) {
  return CHAIN_CONFIG[chainId as keyof typeof CHAIN_CONFIG] || null;
}

// Supported chains
export const SUPPORTED_CHAINS = [8453, 42161, 84532] as const;
export type SupportedChainId = (typeof SUPPORTED_CHAINS)[number];
