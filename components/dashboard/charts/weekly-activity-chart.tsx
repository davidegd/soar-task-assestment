"use client";

import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
import type { ChartData } from "@/types";

Chart.register(...registerables);

interface WeeklyActivityChartProps {
  data: ChartData;
  className?: string;
}

export function WeeklyActivityChart({ data, className }: WeeklyActivityChartProps) {
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
      type: "bar",
      data: {
        labels: data.labels,
        datasets: [
          {
            label: "Deposit",
            data: data.datasets[0].data,
            backgroundColor: data.datasets[0].backgroundColor || "#4F46E5",
            borderRadius: 100,
            barPercentage: 0.4,
            categoryPercentage: 0.5,
          },
          {
            label: "Withdraw",
            data: data.datasets[1].data,
            backgroundColor: data.datasets[1].backgroundColor || "#1F2937",
            borderRadius: 100,
            barPercentage: 0.4,
            categoryPercentage: 0.5,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
            align: "end",
            labels: {
              boxWidth: 12,
              usePointStyle: true,
              pointStyle: "circle",
            },
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
              label: (context) => `${context.dataset.label}: $${context.raw}`,
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
            grid: {},
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
