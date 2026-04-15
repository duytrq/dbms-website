import ProductTable from '@/components/products/ProductTable'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <Link href="/" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mb-2">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
            <p className="text-gray-500 mt-1">View, add, edit, and delete products</p>
          </div>
        </header>

        <main>
          <ProductTable />
        </main>
      </div>
    </div>
  )
}
