import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(value: number | bigint, decimals = 2): string {
  const num = typeof value === "bigint" ? Number(value) : value;
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

export function formatAddress(address: string, chars = 4): string {
  if (!address) return "";
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export function shortenAddress(address: string): string {
  return formatAddress(address, 6);
}

export function formatTokenAmount(
  amount: bigint,
  decimals: number,
  displayDecimals = 4
): string {
  const formatted = Number(amount) / Math.pow(10, decimals);
  return formatted.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: displayDecimals,
  });
}

export function formatPercentage(value: number, decimals = 2): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  return `${Math.floor(seconds / 86400)}d`;
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

export function calculateApr(
  totalRewards: bigint,
  totalStaked: bigint,
  durationSeconds: number
): number {
  if (totalStaked === 0n) return 0;
  const yearlyRewards =
    (totalRewards * BigInt(365 * 24 * 60 * 60)) / BigInt(durationSeconds);
  return Number(yearlyRewards) / Number(totalStaked);
}
