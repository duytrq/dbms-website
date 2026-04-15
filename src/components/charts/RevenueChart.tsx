'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'

interface RevenueChartProps {
  data: {
    productLine: string
    revenue: number
  }[]
}

export default function RevenueChart({ data }: RevenueChartProps) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="productLine" />
          <YAxis />
          <Tooltip formatter={(value: any) => `$${Number(value).toLocaleString()}`} />
          <Legend />
          <Bar dataKey="revenue" fill="#82ca9d" name="Revenue ($)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
