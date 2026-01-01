"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { MAINNET_CONTRACTS } from "@morpheus-ui/registry";
import { formatTokenAmount } from "@morpheus-ui/registry";

interface StakingData {
  stakedAmount: bigint;
  pendingRewards: bigint;
  lastUpdateTime: bigint;
  rewardPerTokenStored: bigint;
}

interface UseStakingDataOptions {
  chainId?: number;
  pollInterval?: number;
  enabled?: boolean;
}

const STAKING_ABI = [
  {
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
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
] as const;

export function useStakingData(options: UseStakingDataOptions = {}) {
  const { chainId = 8453, pollInterval = 30000, enabled = true } = options;
  const { address, isConnected } = useAccount();
  const contracts =
    MAINNET_CONTRACTS[chainId as keyof typeof MAINNET_CONTRACTS];

  const [stakingData, setStakingData] = useState<StakingData | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Read staked amount
  const { data: stakedAmount, refetch: refetchStaked } = useReadContract({
    address: contracts?.StakingRewards,
    abi: STAKING_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    chainId,
  });

  // Read pending rewards
  const { data: pendingRewards, refetch: refetchRewards } = useReadContract({
    address: contracts?.StakingRewards,
    abi: STAKING_ABI,
    functionName: "earned",
    args: address ? [address] : undefined,
    chainId,
  });

  const refetch = useCallback(async () => {
    if (!enabled || !isConnected || !address) return;

    await Promise.all([refetchStaked(), refetchRewards()]);

    setStakingData({
      stakedAmount: (stakedAmount as bigint) || 0n,
      pendingRewards: (pendingRewards as bigint) || 0n,
      lastUpdateTime: 0n,
      rewardPerTokenStored: 0n,
    });
    setLastUpdated(new Date());
  }, [
    address,
    enabled,
    isConnected,
    pendingRewards,
    refetchRewards,
    refetchStaked,
    stakedAmount,
  ]);

  // Set up polling
  useEffect(() => {
    if (!enabled || !isConnected) return;

    refetch();

    const intervalId = setInterval(refetch, pollInterval);

    return () => clearInterval(intervalId);
  }, [enabled, isConnected, pollInterval, refetch]);

  const formattedStakedAmount = useMemo(() => {
    return formatTokenAmount(
      stakingData?.stakedAmount || 0n,
      18,
      4
    );
  }, [stakingData?.stakedAmount]);

  const formattedPendingRewards = useMemo(() => {
    return formatTokenAmount(
      stakingData?.pendingRewards || 0n,
      18,
      4
    );
  }, [stakingData?.pendingRewards]);

  return {
    stakedAmount: stakingData?.stakedAmount || 0n,
    pendingRewards: stakingData?.pendingRewards || 0n,
    formattedStakedAmount,
    formattedPendingRewards,
    refetch,
    lastUpdated,
    isLoading: !lastUpdated && isConnected,
  };
}
