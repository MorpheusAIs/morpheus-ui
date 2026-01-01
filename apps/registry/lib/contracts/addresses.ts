// Mainnet contract addresses
export const MAINNET_CONTRACTS = {
  // Base (chainId: 8453)
  8453: {
    MORToken: "0x093D6B75b07d61C5fA754C20F8c4E4dFD6C02e7F",
    BuilderContract: "0x33BAc5F497352c4F93b4b27F7dC1A7cC97C3A846",
    RewardPoolV4: "0xF4F9555E616a3F2A6fF3b23e7E9e5C8c8C8C8C8C",
    CapitalPool: "0xCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC",
    StakingRewards: "0xDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD",
    MultiSig: "0xEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE",
  },
  // Arbitrum (chainId: 42161)
  42161: {
    MORToken: "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    BuilderContract: "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    RewardPoolV4: "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    CapitalPool: "0xcccccccccccccccccccccccccccccccccccccccc",
    StakingRewards: "0xdddddddddddddddddddddddddddddddddddddddd",
    MultiSig: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
  },
} as const;

// Testnet contract addresses
export const TESTNET_CONTRACTS = {
  // Base Sepolia (chainId: 84532)
  84532: {
    MORToken: "0x4200000000000000000000000000000000000006",
    BuilderContract: "0x4200000000000000000000000000000000000007",
    RewardPoolV4: "0x4200000000000000000000000000000000000008",
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
