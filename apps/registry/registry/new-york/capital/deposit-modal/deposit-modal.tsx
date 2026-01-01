"use client";

import { useCallback, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { cn, formatTokenAmount } from "@morpheus-ui/registry";

interface DepositModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  balance: bigint;
  decimals?: number;
  symbol?: string;
  onDeposit?: (amount: bigint) => void;
  loading?: boolean;
}

export function DepositModal({
  open,
  onOpenChange,
  balance,
  decimals = 18,
  symbol = "MOR",
  onDeposit,
  loading = false,
}: DepositModalProps) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleAmountChange = useCallback((value: string) => {
    const regex = /^\d*\.?\d{0,18}$/;
    if (regex.test(value) || value === "") {
      setAmount(value);
      setError(null);
    }
  }, []);

  const handleMaxClick = useCallback(() => {
    setAmount(formatTokenAmount(balance, decimals, 18));
  }, [balance, decimals]);

  const handleDeposit = useCallback(() => {
    if (!amount) {
      setError("Please enter an amount");
      return;
    }

    const amountInWei = BigInt(Math.floor(parseFloat(amount) * Math.pow(10, decimals)));

    if (amountInWei > balance) {
      setError("Insufficient balance");
      return;
    }

    if (amountInWei <= 0n) {
      setError("Invalid amount");
      return;
    }

    onDeposit?.(amountInWei);
    onOpenChange(false);
    setAmount("");
  }, [amount, balance, decimals, onDeposit, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Deposit to Capital Pool</DialogTitle>
          <DialogDescription>
            Deposit your MOR tokens to earn rewards.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between">
            <Label>Available Balance</Label>
            <span className="font-mono text-sm">
              {formatTokenAmount(balance, decimals, 4)} {symbol}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="deposit-amount">Amount</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleMaxClick}
                disabled={loading}
              >
                Max
              </Button>
            </div>
            <Input
              id="deposit-amount"
              type="text"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder="0.00"
              disabled={loading}
              className={cn(error && "border-destructive")}
            />
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeposit}
            disabled={loading || !amount}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Depositing...
              </>
            ) : (
              "Deposit"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
