"use client"
import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartData, ChartOptions } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

type planCountItem = {
  plan: string
  count: number
}

interface PieChartProps {
  planCount: planCountItem[]
}

export default function PieChart ({
  planCount
}: PieChartProps) {
  const labels = planCount.map(item => item.plan.charAt(0).toUpperCase() + item.plan.slice(1));
  const data = planCount.map(item => item.count);

  const total = data.reduce((acc, count) => acc + count, 0);

  const chartData: ChartData<'pie', number[], string> = {
    labels: labels,
    datasets: [
      {
        label: 'Quantidade',
        data: data,
        backgroundColor: ['#20B120', '#164F62', '#299FC7'],
        hoverBackgroundColor: ['#20B120', '#164F62', '#299FC7'],
      },
    ],
  };

  const chartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const count = tooltipItem.raw as number;
            return `${tooltipItem.label}: ${count}`;
          },
        },
      },
      datalabels: {
        color: '#fff',
        font: {
          size: 14,
          weight: 'bold',
        },
        formatter: (value: number) => {
          const percentage = ((value / total) * 100).toFixed(1);
          return `${percentage}%`;
        },
        anchor: 'center',
        align: 'center',
      },
    },
  };

  return (
    <Pie 
      data={chartData} 
      options={chartOptions} 
      style={{ height: "100%", maxHeight: "400px"}}
    />
  );
}
