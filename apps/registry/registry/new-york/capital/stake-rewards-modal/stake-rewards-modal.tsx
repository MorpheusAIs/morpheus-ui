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
import { Loader2, TrendingUp } from "lucide-react";
import { formatTokenAmount } from "@morpheus-ui/registry";

interface StakeRewardsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rewards: bigint;
  decimals?: number;
  symbol?: string;
  onStake?: () => void;
  loading?: boolean;
}

export function StakeRewardsModal({
  open,
  onOpenChange,
  rewards,
  decimals = 18,
  symbol = "MOR",
  onStake,
  loading = false,
}: StakeRewardsModalProps) {
  const handleStake = () => {
    onStake?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Stake Rewards
          </DialogTitle>
          <DialogDescription>
            Reinvest your earned rewards to earn compound interest.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="rounded-lg bg-muted p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">
              Rewards to Stake
            </p>
            <p className="text-2xl font-bold font-mono">
              {formatTokenAmount(rewards, decimals, 4)} {symbol}
            </p>
          </div>

          <div className="space-y-2 text-sm">
            <p className="text-muted-foreground">
              By staking your rewards, you will:
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Earn additional rewards on your staked amount</li>
              <li>Increase your share of the capital pool</li>
              <li>Receive compounding returns</li>
            </ul>
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
            onClick={handleStake}
            disabled={loading || rewards <= 0n}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Staking...
              </>
            ) : (
              "Stake Rewards"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
