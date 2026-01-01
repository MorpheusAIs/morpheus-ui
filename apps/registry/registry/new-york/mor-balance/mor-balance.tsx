"use client";

import { useMemo } from "react";
import { useAccount, useBalance } from "wagmi";
import { NetworkBadge } from "../network-icons/network-icons";
import { cn, formatTokenAmount, shortenAddress } from "@morpheus-ui/registry";
import { MAINNET_CONTRACTS, getChainConfig } from "@morpheus-ui/registry";

interface MorBalanceProps {
  className?: string;
  showAddress?: boolean;
  chainId?: number;
}

export function MorBalance({
  className,
  showAddress = false,
  chainId = 8453,
}: MorBalanceProps) {
  const { address } = useAccount();
  const contracts = MAINNET_CONTRACTS[chainId as keyof typeof MAINNET_CONTRACTS];
  const chainConfig = getChainConfig(chainId as keyof typeof getChainConfig);

  const { data: balance, isLoading } = useBalance({
    address,
    token: contracts?.MORToken,
    chainId,
  });

  const formattedBalance = useMemo(() => {
    if (!balance?.value) return "0";
    return formatTokenAmount(balance.value, balance.decimals, 4);
  }, [balance]);

  if (!address) {
    return (
      <div className={cn("text-sm text-muted-foreground", className)}>
        Connect wallet to view balance
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={cn("animate-pulse", className)}>
        <div className="h-4 w-24 bg-muted rounded" />
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center gap-1.5">
        <NetworkBadge network="base" />
      </div>
      <span className="font-mono font-medium">
        {formattedBalance} MOR
      </span>
      {showAddress && (
        <span className="text-xs text-muted-foreground">
          ({shortenAddress(address)})
        </span>
      )}
    </div>
  );
}

interface MultiChainBalanceProps {
  className?: string;
  showAddress?: boolean;
}

export function MultiChainBalance({
  className,
  showAddress = false,
}: MultiChainBalanceProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <MorBalance
        chainId={8453}
        showAddress={showAddress}
      />
      <MorBalance
        chainId={42161}
        showAddress={showAddress}
      />
    </div>
  );
}
