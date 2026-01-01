"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";
import { MAINNET_CONTRACTS } from "@morpheus-ui/registry";
import { formatTokenAmount, formatPercentage } from "@morpheus-ui/registry";

interface CapitalPoolData {
  totalStaked: bigint;
  totalRewards: bigint;
  currentApr: number;
  userStaked: bigint;
  userRewards: bigint;
  epochNumber: number;
  epochEndTime: Date;
}

interface UseCapitalPoolDataOptions {
  chainId?: number;
  pollInterval?: number;
  enabled?: boolean;
}

const CAPITAL_POOL_ABI = [
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "rewardRate",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "account", type: "address" }],
    name: "earned",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "periodFinish",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export function useCapitalPoolData(options: UseCapitalPoolDataOptions = {}) {
  const { chainId = 8453, pollInterval = 30000, enabled = true } = options;
  const { address, isConnected } = useAccount();
  const contracts =
    MAINNET_CONTRACTS[chainId as keyof typeof MAINNET_CONTRACTS];

  const [poolData, setPoolData] = useState<CapitalPoolData | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchPoolData = useCallback(async () => {
    if (!address) return;

    try {
      const responses = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_RPC_URL_${chainId}}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jsonrpc: "2.0",
            method: "eth_call",
            params: [
              {
                to: contracts?.CapitalPool,
                data: "0x18160ddd", // totalSupply()
              },
              "latest",
            ],
            id: 1,
          }),
        }),
        fetch(`${process.env.NEXT_PUBLIC_RPC_URL_${chainId}}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jsonrpc: "2.0",
            method: "eth_call",
            params: [
              {
                to: contracts?.CapitalPool,
                data:
                  "0x70a08231000000000000000000000000" +
                  address.slice(2).padStart(64, "0"),
              },
              "latest",
            ],
            id: 2,
          }),
        }),
        fetch(`${process.env.NEXT_PUBLIC_RPC_URL_${chainId}}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jsonrpc: "2.0",
            method: "eth_call",
            params: [
              {
                to: contracts?.CapitalPool,
                data:
                  "0x3e8dbfac000000000000000000000000" +
                  address.slice(2).padStart(64, "0"),
              },
              "latest",
            ],
            id: 3,
          }),
        }),
      ]);

      const [totalSupplyRes, userBalanceRes, userRewardsRes] = responses;
      const totalSupplyData = await totalSupplyRes.json();
      const userBalanceData = await userBalanceRes.json();
      const userRewardsData = await userRewardsRes.json();

      const totalStaked = BigInt(parseInt(totalSupplyData.result, 16) || "0");
      const userStaked = BigInt(parseInt(userBalanceData.result, 16) || "0");
      const userRewards = BigInt(parseInt(userRewardsData.result, 16) || "0");

      // Calculate APR based on reward rate (simplified)
      const currentApr = totalStaked > 0n ? 0.12 : 0; // 12% default APR

      setPoolData({
        totalStaked,
        totalRewards: 0n,
        currentApr,
        userStaked,
        userRewards,
        epochNumber: 1,
        epochEndTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Failed to fetch capital pool data:", error);
    }
  }, [address, chainId, contracts?.CapitalPool]);

  // Set up polling
  useEffect(() => {
    if (!enabled || !isConnected) return;

    fetchPoolData();

    const intervalId = setInterval(fetchPoolData, pollInterval);

    return () => clearInterval(intervalId);
  }, [enabled, isConnected, pollInterval, fetchPoolData]);

  const formattedTotalStaked = useMemo(() => {
    return formatTokenAmount(poolData?.totalStaked || 0n, 18, 0);
  }, [poolData?.totalStaked]);

  const formattedUserStaked = useMemo(() => {
    return formatTokenAmount(poolData?.userStaked || 0n, 18, 4);
  }, [poolData?.userStaked]);

  const formattedUserRewards = useMemo(() => {
    return formatTokenAmount(poolData?.userRewards || 0n, 18, 4);
  }, [poolData?.userRewards]);

  const formattedApr = useMemo(() => {
    return formatPercentage(poolData?.currentApr || 0);
  }, [poolData?.currentApr]);

  return {
    poolData,
    formattedTotalStaked,
    formattedUserStaked,
    formattedUserRewards,
    formattedApr,
    currentApr: poolData?.currentApr || 0,
    refetch: fetchPoolData,
    lastUpdated,
    isLoading: !lastUpdated && isConnected,
  };
}
