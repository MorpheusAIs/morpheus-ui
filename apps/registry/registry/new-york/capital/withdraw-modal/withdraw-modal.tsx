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

interface WithdrawModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stakedBalance: bigint;
  decimals?: number;
  symbol?: string;
  onWithdraw?: (amount: bigint) => void;
  loading?: boolean;
}

export function WithdrawModal({
  open,
  onOpenChange,
  stakedBalance,
  decimals = 18,
  symbol = "MOR",
  onWithdraw,
  loading = false,
}: WithdrawModalProps) {
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
    setAmount(formatTokenAmount(stakedBalance, decimals, 18));
  }, [stakedBalance, decimals]);

  const handleWithdraw = useCallback(() => {
    if (!amount) {
      setError("Please enter an amount");
      return;
    }

    const amountInWei = BigInt(Math.floor(parseFloat(amount) * Math.pow(10, decimals)));

    if (amountInWei > stakedBalance) {
      setError("Cannot withdraw more than staked balance");
      return;
    }

    if (amountInWei <= 0n) {
      setError("Invalid amount");
      return;
    }

    onWithdraw?.(amountInWei);
    onOpenChange(false);
    setAmount("");
  }, [amount, decimals, onWithdraw, onOpenChange, stakedBalance]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Withdraw from Capital Pool</DialogTitle>
          <DialogDescription>
            Withdraw your staked MOR tokens. This may trigger unstaking penalties.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between">
            <Label>Staked Balance</Label>
            <span className="font-mono text-sm">
              {formatTokenAmount(stakedBalance, decimals, 4)} {symbol}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="withdraw-amount">Amount</Label>
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
              id="withdraw-amount"
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

          <p className="text-xs text-muted-foreground">
            Withdrawn tokens will be available after the unstaking period.
          </p>
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
            onClick={handleWithdraw}
            disabled={loading || !amount}
            variant="destructive"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Withdrawing...
              </>
            ) : (
              "Withdraw"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
