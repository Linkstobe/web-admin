'use client'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartData } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { Pie } from "react-chartjs-2"

type Metric = {
  name: string
  value: number
}

interface AnalyticsPieChartProps {
  metrics: Metric[]
  backgroundColor: string[]
  hoverBackgroundColor: string[]
  label: string
}

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels)

export default function AnalyticsPieChart ({
  metrics,
  backgroundColor,
  hoverBackgroundColor,
  label
}: AnalyticsPieChartProps) {
  const data = metrics.map(({ value }) => value)
  const labels = metrics.map(({ name }) => name)

  const chartData: ChartData<'pie', number[], string> = {
    labels,
    datasets: [
      {
        label,
        data,
        backgroundColor,
        hoverBackgroundColor
      },
    ],
  }

  const total = data.reduce((sum, value) => sum + value, 0)

  return (
    <div>
      <Pie
        style={{ height: "100%", maxHeight: "500px" }}
        data={chartData}
        className='text-rose-800'
        options={{
          plugins: {
            legend: {
              display: true,
              position: 'right',
              labels: {
                boxWidth: 10,
                padding: 10,
                font: { size: 12 },
              },
            },
            tooltip: {
              callbacks: {
                label: function(context: any) {
                  const name = context.label
                  const value = context.raw
                  return `${name}: ${value}`
                },
              },
            },
            datalabels: {
              formatter: (value: number) => {
                const percentage = ((value / total) * 100).toFixed(2)
                return `${percentage}%`
              },
              color: '#fff',
              font: { weight: 700 },
              anchor: 'end',
              align: 'start',
            },
          },
        }}
      />
    </div>
  )
}