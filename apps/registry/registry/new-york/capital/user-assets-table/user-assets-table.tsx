"use client";

import { useMemo } from "react";
import { cn, formatTokenAmount, formatPercentage } from "@morpheus-ui/registry";
import { NetworkBadge } from "../../network-icons/network-icons";

interface Asset {
  chainId: number;
  symbol: string;
  name: string;
  balance: bigint;
  value: number;
  apy: number;
}

interface UserAssetsTableProps {
  assets: Asset[];
  className?: string;
  loading?: boolean;
}

export function UserAssetsTable({
  assets,
  className,
  loading = false,
}: UserAssetsTableProps) {
  const totalValue = useMemo(() => {
    return assets.reduce((sum, asset) => sum + asset.value, 0);
  }, [assets]);

  if (loading) {
    return (
      <div className={cn("rounded-lg border bg-card", className)}>
        <div className="p-4 space-y-3">
          <div className="h-4 w-32 bg-muted rounded animate-pulse" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-muted rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("rounded-lg border bg-card overflow-hidden", className)}>
      <div className="p-4 border-b">
        <h3 className="font-semibold">Your Assets</h3>
        <p className="text-sm text-muted-foreground">
          Total Value: ${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Asset
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Network
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Balance
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Value
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                APY
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {assets.map((asset) => (
              <tr key={`${asset.chainId}-${asset.symbol}`} className="hover:bg-muted/50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">
                        {asset.symbol.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{asset.symbol}</p>
                      <p className="text-xs text-muted-foreground">{asset.name}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <NetworkBadge
                    network={asset.chainId === 8453 ? "base" : "arbitrum"}
                  />
                </td>
                <td className="px-4 py-3 text-right font-mono">
                  {formatTokenAmount(asset.balance, 18, 4)}
                </td>
                <td className="px-4 py-3 text-right font-mono">
                  ${asset.value.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="text-green-600 font-medium">
                    {formatPercentage(asset.apy)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {assets.length === 0 && (
        <div className="p-8 text-center text-muted-foreground">
          No assets found
        </div>
      )}
    </div>
  );
}
