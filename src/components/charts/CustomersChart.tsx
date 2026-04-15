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

interface CustomersChartProps {
  data: {
    country: string
    count: number
  }[]
}

export default function CustomersChart({ data }: CustomersChartProps) {
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
          layout="vertical"
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="country" type="category" width={80} />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#8884d8" name="Customers" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
