"use client";

import "chart.js/auto";
import { Chart } from "react-chartjs-2";
import { ChartData, ChartOptions } from "chart.js";
import { use, useEffect, useState } from "react";

export default function ChartComponent({ data }: { data: ChartData }) {

  const options: ChartOptions = {
    plugins: {
      legend: {
        display: false, // Show legend (toggle as needed)
        position: "top", // Position of the legend
        labels: {
          font: {
            size: 14, // Legend font size
          },
          color: "#fff", // Legend text color
        },
      },
      title: {
        display: true,
        text: "Audio Features", // Customize your chart title
        font: {
          size: 20,
          weight: "bold",
        },
        color: "#fff",
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.7)", // Tooltip background color
        titleFont: {
          size: 16,
          weight: "bold",
        },
        bodyFont: {
          size: 14,
        },
        bodySpacing: 5,
        padding: 10,
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(200, 200, 200, 0.3)", // X-axis grid line color
        //   borderDash: [5, 5], // Dashed grid lines (5px dash, 5px gap)
        },
        ticks: {
          color: "#fff", // X-axis tick color
          font: {
            size: 12, // X-axis font size
          },
        },
      },
      y: {
        grid: {
          color: "rgba(200, 200, 200, 0.3)", // Y-axis grid line color
        //   borderDash: [5, 5], // Dashed grid lines (5px dash, 5px gap)
        },
        ticks: {
          color: "#fff", // Y-axis tick color
          font: {
            size: 12, // Y-axis font size
          },
        },
      },
    },
    animation: {
      duration: 1000, // Animation duration in milliseconds
      onComplete: () => console.log('Animation complete!'), 
    },
  };
  return (
    <div className="w-full">
      <Chart type="bar" data={data} options={options} />
    </div>
  );
}
