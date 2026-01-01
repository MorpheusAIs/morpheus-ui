"use client";

import { cn } from "@morpheus-ui/registry";

export interface NetworkIconProps {
  network: "base" | "arbitrum";
  className?: string;
  size?: number;
}

export function NetworkIcon({ network, className, size = 24 }: NetworkIconProps) {
  if (network === "base") {
    return (
      <svg
        className={cn("", className)}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Base network logo"
      >
        <circle cx="12" cy="12" r="12" fill="#0052FF" />
        <path
          d="M6.5 12L10 8.5V15.5L6.5 12Z"
          fill="white"
          fillOpacity="0.7"
        />
        <path d="M17.5 12L14 8.5V15.5L17.5 12Z" fill="white" />
      </svg>
    );
  }

  return (
    <svg
      className={cn("", className)}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Arbitrum network logo"
    >
      <circle cx="12" cy="12" r="12" fill="#28A0F0" />
      <path
        d="M16 8L12 12L8 16"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 8L12 12L16 16"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export interface NetworkBadgeProps {
  network: "base" | "arbitrum";
  className?: string;
}

export function NetworkBadge({ network, className }: NetworkBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium",
        network === "base"
          ? "bg-blue-100 text-blue-700"
          : "bg-sky-100 text-sky-700",
        className
      )}
    >
      <NetworkIcon network={network} size={14} />
      <span className="capitalize">{network}</span>
    </div>
  );
}
