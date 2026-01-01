// Chain IDs
export const CHAIN_IDS = {
  BASE_MAINNET: 8453,
  ARBITRUM_MAINNET: 42161,
  BASE_SEPOLIA: 84532,
} as const;

export type ChainId = (typeof CHAIN_IDS)[keyof typeof CHAIN_IDS];

// Network type
export type Network = "base" | "arbitrum";

// Token information
export interface TokenInfo {
  symbol: string;
  name: string;
  decimals: number;
  address: Record<ChainId, string>;
}

// Contract addresses by chain
export interface ContractAddresses {
  MORToken: Record<ChainId, string>;
  BuilderContract: Record<ChainId, string>;
  RewardPoolV4: Record<ChainId, string>;
  CapitalPool: Record<ChainId, string>;
  StakingRewards: Record<ChainId, string>;
  MultiSig: Record<ChainId, string>;
}

// Balance information
export interface BalanceInfo {
  chainId: ChainId;
  address: string;
  balance: bigint;
  formattedBalance: string;
  symbol: string;
  decimals: number;
}

// Staking information
export interface StakingInfo {
  stakedAmount: bigint;
  pendingRewards: bigint;
  formattedStakedAmount: string;
  formattedPendingRewards: string;
  lastUpdateTime: bigint;
}

// Capital pool data
export interface CapitalPoolData {
  totalStaked: bigint;
  totalRewards: bigint;
  currentApr: number;
  userStaked: bigint;
  userRewards: bigint;
  epochNumber: number;
  epochEndTime: Date;
  formattedTotalStaked: string;
  formattedUserStaked: string;
  formattedUserRewards: string;
  formattedApr: string;
}

// Transaction status
export type TransactionStatus = "idle" | "pending" | "confirming" | "success" | "error";

// Bridge information
export interface BridgeInfo {
  sourceChainId: ChainId;
  destinationChainId: ChainId;
  amount: bigint;
  status: TransactionStatus;
  hash?: string;
}

// Asset information for display
export interface AssetInfo {
  chainId: ChainId;
  symbol: string;
  name: string;
  balance: bigint;
  value: number;
  apy: number;
  formattedBalance: string;
}

// Chart data point
export interface ChartDataPoint {
  timestamp: Date;
  value: number;
  label?: string;
}

// User preferences
export interface UserPreferences {
  theme: "light" | "dark" | "system";
  currency: string;
  locale: string;
}

// Error types
export interface MorpheusError {
  code: string;
  message: string;
  details?: unknown;
}

export function createError(code: string, message: string, details?: unknown): MorpheusError {
  return { code, message, details };
}
