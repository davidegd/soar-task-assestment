"use client";

import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
import type { ChartData } from "@/types";

Chart.register(...registerables);

interface BalanceHistoryChartProps {
  data: ChartData;
  className?: string;
}

export function BalanceHistoryChart({ data, className }: BalanceHistoryChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: data.labels,
        datasets: [
          {
            label: "Balance",
            data: data.datasets[0].data,
            borderColor: data.datasets[0].borderColor || "#4F46E5",
            backgroundColor: data.datasets[0].backgroundColor || "rgba(79, 70, 229, 0.1)",
            fill: true,
            tension: 0.4,
            borderWidth: 2,
            pointBackgroundColor: "#4F46E5",
            pointBorderColor: "#fff",
            pointBorderWidth: 1,
            pointRadius: 4,
            pointHoverRadius: 6,
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
            backgroundColor: "#fff",
            titleColor: "#1F2937",
            bodyColor: "#1F2937",
            borderColor: "#E5E7EB",
            borderWidth: 1,
            padding: 12,
            boxPadding: 6,
            usePointStyle: true,
            callbacks: {
              label: (context) => `$${context.raw}`,
            },
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
          },
          y: {
            beginAtZero: true,
            grid: {
              tickBorderDash: [4],
              drawTicks: false,
            },
            ticks: {
              callback: (value) => (value === 0 ? "0" : `${value}`),
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
  }, [data]);

  return (
    <div className={className}>
      <canvas ref={chartRef} className="chart-container" />
    </div>
  );
}
