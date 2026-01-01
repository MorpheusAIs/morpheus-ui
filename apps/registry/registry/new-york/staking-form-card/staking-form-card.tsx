"use client";

import { useCallback, useMemo, useState } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { Loader2, TrendingUp } from "lucide-react";
import { cn, formatTokenAmount } from "@morpheus-ui/registry";
import { MAINNET_CONTRACTS } from "@morpheus-ui/registry";
import { useMorBalances } from "../hooks/use-mor-balances/use-mor-balances";

const STAKING_ABI = [
  {
    inputs: [
      { name: "amount", type: "uint256" },
    ],
    name: "stake",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

interface StakingFormCardProps {
  className?: string;
  chainId?: number;
}

export function StakingFormCard({ className, chainId = 8453 }: StakingFormCardProps) {
  const { address } = useAccount();
  const contracts = MAINNET_CONTRACTS[chainId as keyof typeof MAINNET_CONTRACTS];
  const { balances, formattedTotalBalance } = useMorBalances();

  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { data: hash, isPending, writeContract } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const balance = balances[chainId];

  const handleAmountChange = useCallback((value: string) => {
    // Only allow numbers with up to 18 decimals
    const regex = /^\d*\.?\d{0,18}$/;
    if (regex.test(value) || value === "") {
      setAmount(value);
      setError(null);
    }
  }, []);

  const handleMaxClick = useCallback(() => {
    if (balance) {
      setAmount(balance.formattedBalance);
    }
  }, [balance]);

  const handleStake = useCallback(async () => {
    if (!address || !amount || !contracts?.StakingRewards) {
      setError("Please connect your wallet and enter an amount");
      return;
    }

    const amountInWei = Math.floor(parseFloat(amount) * 1e18);
    if (amountInWei <= 0) {
      setError("Invalid amount");
      return;
    }

    try {
      writeContract({
        address: contracts.StakingRewards,
        abi: STAKING_ABI,
        functionName: "stake",
        args: [BigInt(amountInWei)],
      });
    } catch {
      setError("Failed to submit transaction");
    }
  }, [address, amount, contracts?.StakingRewards, writeContract]);

  const isDisabled = isPending || isConfirming || !address;

  return (
    <div className={cn("rounded-lg border bg-card p-6 shadow-sm", className)}>
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-lg bg-primary/10">
          <TrendingUp className="h-5 w-5 text-primary" />
        </div>
        <h3 className="font-semibold">Stake MOR Tokens</h3>
      </div>

      <div className="space-y-4">
        {/* Balance Display */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Available</span>
          <span className="font-mono">
            {balance?.formattedBalance || "0"} MOR
          </span>
        </div>

        {/* Amount Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="stake-amount" className="text-sm font-medium">
              Amount
            </label>
            <button
              type="button"
              onClick={handleMaxClick}
              className="text-xs text-primary hover:underline"
              disabled={isDisabled}
            >
              Max
            </button>
          </div>
          <div className="relative">
            <input
              id="stake-amount"
              type="text"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder="0.00"
              disabled={isDisabled}
              className={cn(
                "w-full px-3 py-2 font-mono text-lg border rounded-lg",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                "disabled:bg-muted disabled:cursor-not-allowed",
                error && "border-destructive"
              )}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              MOR
            </span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        {/* Success Message */}
        {isSuccess && (
          <p className="text-sm text-green-600">
            Stake successful!
          </p>
        )}

        {/* Submit Button */}
        <button
          onClick={handleStake}
          disabled={isDisabled || !amount}
          className={cn(
            "w-full py-3 px-4 rounded-lg font-medium transition-all",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "bg-primary text-primary-foreground hover:bg-primary-hover"
          )}
        >
          {isPending ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Confirming...
            </span>
          ) : isConfirming ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing...
            </span>
          ) : (
            "Stake"
          )}
        </button>

        {/* Transaction Hash */}
        {hash && (
          <a
            href={`https://basescan.org/tx/${hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-xs text-muted-foreground hover:text-primary text-center"
          >
            View transaction on Basescan
          </a>
        )}
      </div>
    </div>
  );
}
