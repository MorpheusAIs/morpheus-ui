"use client";

import { useEffect, useState } from "react";
import { cn } from "@morpheus-ui/registry";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
  className?: string;
  loading?: boolean;
  format?: "number" | "currency" | "percentage" | "plain";
}

export function MetricCard({
  title,
  value,
  change,
  icon,
  className,
  loading = false,
  format = "plain",
}: MetricCardProps) {
  const [animatedValue, setAnimatedValue] = useState(value);

  useEffect(() => {
    if (typeof value === "number") {
      setAnimatedValue(value);
    }
  }, [value]);

  const formattedValue = () => {
    if (typeof value !== "number") return value;
    switch (format) {
      case "currency":
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(value);
      case "percentage":
        return `${value.toFixed(2)}%`;
      case "number":
        return value.toLocaleString("en-US", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        });
      default:
        return value;
    }
  };

  if (loading) {
    return (
      <div
        className={cn(
          "rounded-lg border bg-card p-4 shadow-sm",
          className
        )}
      >
        <div className="space-y-2">
          <div className="h-3 w-20 bg-muted rounded animate-pulse" />
          <div className="h-6 w-32 bg-muted rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow-md",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">
            {title}
          </p>
          <p className="text-2xl font-bold tracking-tight">
            {formattedValue()}
          </p>
          {change !== undefined && (
            <div
              className={cn(
                "flex items-center text-xs font-medium",
                change >= 0 ? "text-green-600" : "text-red-600"
              )}
            >
              <span>{change >= 0 ? "↑" : "↓"}</span>
              <span className="ml-1">
                {Math.abs(change).toFixed(2)}%
              </span>
              <span className="ml-1 text-muted-foreground">vs last epoch</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="text-muted-foreground">{icon}</div>
        )}
      </div>
    </div>
  );
}

interface MetricGridProps {
  children: React.ReactNode;
  className?: string;
  columns?: 2 | 3 | 4;
}

export function MetricGrid({
  children,
  className,
  columns = 3,
}: MetricGridProps) {
  return (
    <div
      className={cn(
        "grid gap-4",
        columns === 2 && "grid-cols-1 sm:grid-cols-2",
        columns === 3 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        columns === 4 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
        className
      )}
    >
      {children}
    </div>
  );
}
