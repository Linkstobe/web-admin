'use client'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MetricChartData {
  name: string
  [key: string]: number | string
}

interface MetricChartProps {
  label: string
  data: MetricChartData[]
  secondLabel?: string
}

export default function MetricChart({
  label,
  data,
  secondLabel
}: MetricChartProps) {
  return (
    <div 
      className='w-full h-96 py-4'
    >
      <ResponsiveContainer 
        height="100%"
      >
        <LineChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, .1)" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line 
            connectNulls 
            type="monotone" 
            dataKey={label} 
            stroke="#164F62" 
            fill="#164F62" 
            strokeWidth={2} 
          />

          {secondLabel && (
            <Line 
              connectNulls 
              type="monotone" 
              dataKey={secondLabel} 
              stroke="#F24F00" 
              fill="#F24F00" 
              strokeWidth={2} 
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
