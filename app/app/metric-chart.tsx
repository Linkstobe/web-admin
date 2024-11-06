'use client'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MetricChartData {
  name: string
  [key: string]: number | string
}

interface MetricChartProps {
  label: string
  data: MetricChartData[]
}

export default function MetricChart({
  label,
  data
}: MetricChartProps) {
  return (
    <div 
      // style={{ width: '100%', height: 400 }}
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
          <YAxis className='text-rose-800'/>
          <Tooltip />
          <Line connectNulls type="monotone" dataKey={label} stroke="#164F62" fill="#164F62" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
