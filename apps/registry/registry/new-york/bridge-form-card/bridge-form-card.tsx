"use client";

import { useCallback, useMemo, useState } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { Loader2, ArrowRightLeft } from "lucide-react";
import { NetworkBadge } from "../network-icons/network-icons";
import { cn } from "@morpheus-ui/registry";
import { MAINNET_CONTRACTS } from "@morpheus-ui/registry";

const BRIDGE_ABI = [
  {
    inputs: [
      { name: "amount", type: "uint256" },
      { name: "destinationChainId", type: "uint256" },
    ],
    name: "bridge",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

interface BridgeFormCardProps {
  className?: string;
}

export function BridgeFormCard({ className }: BridgeFormCardProps) {
  const { address } = useAccount();
  const [amount, setAmount] = useState("");
  const [sourceChain, setSourceChain] = useState<number>(8453);
  const [destinationChain, setDestinationChain] = useState<number>(42161);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { data: hash, isPending, writeContract } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const sourceContracts =
    MAINNET_CONTRACTS[sourceChain as keyof typeof MAINNET_CONTRACTS];
  const destContracts =
    MAINNET_CONTRACTS[destinationChain as keyof typeof MAINNET_CONTRACTS];

  const handleAmountChange = useCallback((value: string) => {
    const regex = /^\d*\.?\d{0,18}$/;
    if (regex.test(value) || value === "") {
      setAmount(value);
      setError(null);
    }
  }, []);

  const handleSwapChains = useCallback(() => {
    setSourceChain((prev) => (prev === 8453 ? 42161 : 8453));
    setDestinationChain((prev) => (prev === 8453 ? 42161 : 8453));
  }, []);

  const handleBridge = useCallback(async () => {
    if (!address || !amount || !sourceContracts?.MORToken) {
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
        address: sourceContracts.MORToken,
        abi: BRIDGE_ABI,
        functionName: "bridge",
        args: [BigInt(amountInWei), BigInt(destinationChain)],
      });
      setSuccess(true);
    } catch {
      setError("Failed to submit bridge transaction");
    }
  }, [address, amount, destinationChain, sourceContracts?.MORToken, writeContract]);

  const isDisabled = isPending || isConfirming || !address;

  return (
    <div className={cn("rounded-lg border bg-card p-6 shadow-sm", className)}>
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-lg bg-primary/10">
          <ArrowRightLeft className="h-5 w-5 text-primary" />
        </div>
        <h3 className="font-semibold">Bridge MOR Tokens</h3>
      </div>

      <div className="space-y-4">
        {/* Source Chain */}
        <div className="space-y-2">
          <label className="text-sm font-medium">From</label>
          <div className="flex items-center gap-2">
            <NetworkBadge network={sourceChain === 8453 ? "base" : "arbitrum"} />
            <select
              value={sourceChain}
              onChange={(e) => setSourceChain(Number(e.target.value))}
              disabled={isDisabled}
              className="flex-1 px-3 py-2 border rounded-lg bg-background"
            >
              <option value={8453}>Base</option>
              <option value={42161}>Arbitrum</option>
            </select>
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleSwapChains}
            disabled={isDisabled}
            className="p-2 rounded-full border bg-muted hover:bg-muted/80 transition-colors"
          >
            <ArrowRightLeft className="h-4 w-4" />
          </button>
        </div>

        {/* Destination Chain */}
        <div className="space-y-2">
          <label className="text-sm font-medium">To</label>
          <div className="flex items-center gap-2">
            <NetworkBadge
              network={destinationChain === 8453 ? "base" : "arbitrum"}
            />
            <select
              value={destinationChain}
              onChange={(e) => setDestinationChain(Number(e.target.value))}
              disabled={isDisabled}
              className="flex-1 px-3 py-2 border rounded-lg bg-background"
            >
              <option value={8453}>Base</option>
              <option value={42161}>Arbitrum</option>
            </select>
          </div>
        </div>

        {/* Amount Input */}
        <div className="space-y-2">
          <label htmlFor="bridge-amount" className="text-sm font-medium">
            Amount
          </label>
          <input
            id="bridge-amount"
            type="text"
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            placeholder="0.00"
            disabled={isDisabled}
            className={cn(
              "w-full px-3 py-2 font-mono text-lg border rounded-lg",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
              "disabled:bg-muted disabled:cursor-not-allowed"
            )}
          />
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        {/* Success Message */}
        {isSuccess && (
          <p className="text-sm text-green-600">
            Bridge successful!
          </p>
        )}

        {/* Submit Button */}
        <button
          onClick={handleBridge}
          disabled={isDisabled || !amount}
          className={cn(
            "w-full py-3 px-4 rounded-lg font-medium transition-all",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "bg-primary text-primary-foreground hover:bg-primary-hover"
          )}
        >
          {isPending || isConfirming ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              {isPending ? "Confirming..." : "Processing..."}
            </span>
          ) : (
            "Bridge"
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
