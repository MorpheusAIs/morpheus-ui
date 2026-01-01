"use client";

import { useMemo } from "react";
import { cn } from "@morpheus-ui/registry";

interface ChartDataPoint {
  timestamp: Date;
  value: number;
  label?: string;
}

interface ChartSectionProps {
  title: string;
  data: ChartDataPoint[];
  className?: string;
  color?: string;
  showLegend?: boolean;
  loading?: boolean;
}

export function ChartSection({
  title,
  data,
  className,
  color = "#14b8a6",
  showLegend = true,
  loading = false,
}: ChartSectionProps) {
  const maxValue = useMemo(() => {
    return Math.max(...data.map((d) => d.value), 1);
  }, [data]);

  const chartHeight = 200;
  const chartWidth = 100; // percentage

  const points = useMemo(() => {
    return data
      .map((point, index) => {
        const x = (index / (data.length - 1)) * 100;
        const y = chartHeight - (point.value / maxValue) * chartHeight;
        return `${x},${y}`;
      })
      .join(" ");
  }, [data, maxValue]);

  const areaPoints = useMemo(() => {
    return `0,${chartHeight} ${points} 100,${chartHeight}`;
  }, [points]);

  if (loading) {
    return (
      <div className={cn("rounded-lg border bg-card p-6", className)}>
        <div className="h-4 w-32 bg-muted rounded animate-pulse mb-4" />
        <div className="h-[200px] bg-muted rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className={cn("rounded-lg border bg-card p-6", className)}>
      <h3 className="font-semibold mb-4">{title}</h3>
      <div className="relative">
        <svg
          viewBox={`0 0 100 ${chartHeight}`}
          className="w-full h-[200px]"
          preserveAspectRatio="none"
        >
          {/* Gradient definition */}
          <defs>
            <linearGradient id={`gradient-${title.replace(/\s/g, "")}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Area fill */}
          <polygon
            points={areaPoints}
            fill={`url(#gradient-${title.replace(/\s/g, "")})`}
          />

          {/* Line */}
          <polyline
            points={points}
            fill="none"
            stroke={color}
            strokeWidth="0.5"
            vectorEffect="non-scaling-stroke"
          />

          {/* Data points */}
          {data.map((point, index) => {
            const x = (index / (data.length - 1)) * 100;
            const y = chartHeight - (point.value / maxValue) * chartHeight;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="1"
                fill={color}
                className="opacity-0 hover:opacity-100 transition-opacity"
              />
            );
          })}
        </svg>

        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[8px] text-muted-foreground pointer-events-none">
          <span>{maxValue.toFixed(2)}</span>
          <span>{(maxValue / 2).toFixed(2)}</span>
          <span>0</span>
        </div>
      </div>

      {showLegend && data.length > 0 && (
        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {data[0].timestamp.toLocaleDateString()}
          </span>
          <span>
            {data[data.length - 1].timestamp.toLocaleDateString()}
          </span>
        </div>
      )}
    </div>
  );
}

interface StackedBarChartProps {
  title: string;
  data: { label: string; values: { name: string; value: number; color: string }[] }[];
  className?: string;
  loading?: boolean;
}

export function StackedBarChart({
  title,
  data,
  className,
  loading = false,
}: StackedBarChartProps) {
  const maxValue = useMemo(() => {
    return Math.max(...data.map((bar) => bar.values.reduce((sum, v) => sum + v.value, 0)));
  }, [data]);

  if (loading) {
    return (
      <div className={cn("rounded-lg border bg-card p-6", className)}>
        <div className="h-4 w-32 bg-muted rounded animate-pulse mb-4" />
        <div className="h-[200px] bg-muted rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className={cn("rounded-lg border bg-card p-6", className)}>
      <h3 className="font-semibold mb-4">{title}</h3>
      <div className="space-y-3">
        {data.map((bar, index) => {
          const total = bar.values.reduce((sum, v) => sum + v.value, 0);
          let accumulated = 0;

          return (
            <div key={index} className="flex items-center gap-2">
              <span className="w-16 text-xs text-muted-foreground truncate">
                {bar.label}
              </span>
              <div className="flex-1 h-6 rounded overflow-hidden flex bg-muted">
                {bar.values.map((value, vIndex) => {
                  const width = (value.value / maxValue) * 100;
                  const left = (accumulated / maxValue) * 100;
                  accumulated += value.value;

                  return (
                    <div
                      key={vIndex}
                      style={{
                        width: `${width}%`,
                        backgroundColor: value.color,
                      }}
                      className="h-full transition-all hover:opacity-80"
                      title={`${value.name}: ${value.value.toLocaleString()}`}
                    />
                  );
                })}
              </div>
              <span className="w-16 text-xs text-right font-mono">
                {total.toLocaleString()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
