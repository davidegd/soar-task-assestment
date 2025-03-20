"use client";

import { useEffect, useRef, memo } from "react";
import { Chart, registerables } from "chart.js";
import type { ChartData } from "@/types";
import { useTheme } from "next-themes";

Chart.register(...registerables);

interface ExpenseStatisticsChartProps {
  data: ChartData;
  className?: string;
}

export const ExpenseStatisticsChart = memo(function ExpenseStatisticsChart({
  data,
  className,
}: ExpenseStatisticsChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const { theme } = useTheme();

  const isDarkTheme = theme === "dark";

  useEffect(() => {
    if (!chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    chartInstance.current = new Chart(ctx, {
      type: "pie",
      data: {
        labels: data.labels,
        datasets: [
          {
            data: data.datasets[0].data,
            backgroundColor: data.datasets[0].backgroundColor || [
              "#312E81",
              "#4F46E5",
              "#F97316",
              "#1F2937",
            ],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: isDarkTheme ? "#1F2937" : "#fff",
            titleColor: isDarkTheme ? "#fff" : "#1F2937",
            bodyColor: isDarkTheme ? "#fff" : "#1F2937",
            borderColor: isDarkTheme ? "#374151" : "#E5E7EB",
            borderWidth: 1,
            padding: 12,
            boxPadding: 6,
            usePointStyle: true,
            callbacks: {
              label: (context) => {
                const label = context.label || "";
                const value = context.raw as number;
                const percentage = Math.round(value);
                return `${label}: ${percentage}%`;
              },
            },
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, isDarkTheme]);

  return (
    <div className={className}>
      <canvas ref={chartRef} className="chart-container" />
    </div>
  );
});
