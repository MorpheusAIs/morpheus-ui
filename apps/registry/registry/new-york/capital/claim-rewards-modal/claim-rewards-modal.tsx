"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Coins } from "lucide-react";
import { formatTokenAmount } from "@morpheus-ui/registry";

interface ClaimRewardsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rewards: bigint;
  decimals?: number;
  symbol?: string;
  onClaim?: () => void;
  loading?: boolean;
}

export function ClaimRewardsModal({
  open,
  onOpenChange,
  rewards,
  decimals = 18,
  symbol = "MOR",
  onClaim,
  loading = false,
}: ClaimRewardsModalProps) {
  const handleClaim = () => {
    onClaim?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-primary" />
            Claim Rewards
          </DialogTitle>
          <DialogDescription>
            Claim your earned MOR token rewards.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="rounded-lg bg-muted p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">
              Available to Claim
            </p>
            <p className="text-2xl font-bold font-mono">
              {formatTokenAmount(rewards, decimals, 4)} {symbol}
            </p>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Rewards are automatically compounded when staked in the capital pool.
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
            onClick={handleClaim}
            disabled={loading || rewards <= 0n}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Claiming...
              </>
            ) : (
              "Claim Rewards"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
