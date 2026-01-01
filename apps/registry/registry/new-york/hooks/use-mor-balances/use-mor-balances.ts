"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAccount, useChainId } from "wagmi";
import { formatTokenAmount } from "@morpheus-ui/registry";
import { MAINNET_CONTRACTS, getChainConfig } from "@morpheus-ui/registry";

interface BalanceData {
  address: string;
  chainId: number;
  balance: bigint;
  formattedBalance: string;
  symbol: string;
  decimals: number;
}

interface UseMorBalancesOptions {
  pollInterval?: number;
  enabled?: boolean;
}

export function useMorBalances(options: UseMorBalancesOptions = {}) {
  const { pollInterval = 60000, enabled = true } = options;
  const { address, isConnected } = useAccount();
  const currentChainId = useChainId();

  const [balances, setBalances] = useState<Record<number, BalanceData>>({});
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Fetch balance for a specific chain
  const fetchBalance = useCallback(
    async (chainId: number) => {
      if (!address) return null;

      const contracts =
        MAINNET_CONTRACTS[chainId as keyof typeof MAINNET_CONTRACTS];
      if (!contracts) return null;

      try {
        // Get RPC URL from chain config
        const chainConfig = getChainConfig(chainId as 8453 | 42161 | 84532);
        const rpcUrl = chainConfig?.rpcUrl || `https://mainnet.base.org`;

        const response = await fetch(rpcUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jsonrpc: "2.0",
            method: "eth_call",
            params: [
              {
                to: contracts.MORToken,
                data:
                  "0x70a08231000000000000000000000000" +
                  address.slice(2).padStart(64, "0"),
              },
              "latest",
            ],
            id: 1,
          }),
        });

        const data = await response.json();
        const balance = BigInt(parseInt(data.result, 16) || "0");

        return {
          address,
          chainId,
          balance,
          formattedBalance: formatTokenAmount(balance, 18, 4),
          symbol: "MOR",
          decimals: 18,
        };
      } catch {
        console.error(`Failed to fetch balance on chain ${chainId}`);
        return null;
      }
    },
    [address]
  );

  // Fetch all balances
  const refetch = useCallback(async () => {
    if (!enabled || !isConnected || !address) return;

    const chains = [8453, 42161]; // Base and Arbitrum
    const results = await Promise.all(chains.map((chainId) => fetchBalance(chainId)));

    const newBalances: Record<number, BalanceData> = {};
    results.forEach((result) => {
      if (result) {
        newBalances[result.chainId] = result;
      }
    });

    setBalances(newBalances);
    setLastUpdated(new Date());
  }, [address, enabled, isConnected, fetchBalance]);

  // Set up polling
  useEffect(() => {
    if (!enabled || !isConnected) return;

    refetch();

    const intervalId = setInterval(refetch, pollInterval);

    return () => clearInterval(intervalId);
  }, [enabled, isConnected, pollInterval, refetch]);

  // Total balance across all chains
  const totalBalance = useMemo(() => {
    return Object.values(balances).reduce(
      (total, balance) => total + balance.balance,
      0n
    );
  }, [balances]);

  const formattedTotalBalance = useMemo(() => {
    return formatTokenAmount(totalBalance, 18, 4);
  }, [totalBalance]);

  return {
    balances,
    totalBalance,
    formattedTotalBalance,
    refetch,
    lastUpdated,
    isLoading: !lastUpdated && isConnected,
  };
}
