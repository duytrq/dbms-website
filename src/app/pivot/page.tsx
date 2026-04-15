import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import PivotClient from '@/components/PivotClient'

export default function PivotPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6 text-gray-900">
        <header>
          <Link href="/" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mb-2">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Revenue Analysis Pivot Table</h1>
          <p className="text-gray-500 mt-2">
            Analyze sales performance across multiple dimensions. Drag and drop fields like <strong>Product Line</strong>, <strong>Country</strong>, <strong>City</strong>, or <strong>Order Year</strong> to reorganize the table.
          </p>
        </header>

        <main className="min-h-[600px]">
          <PivotClient />
        </main>
      </div>
    </div>
  )
}
