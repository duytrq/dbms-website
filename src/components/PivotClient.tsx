'use client'

import dynamic from 'next/dynamic'

// Move the dynamic import to a Client Component
const PivotTableWrapper = dynamic(() => import('@/components/PivotTableWrapper'), {
  ssr: false,
  loading: () => <div className="p-8 text-center text-gray-500 text-gray-900">Initializing Pivot Interface...</div>
})

export default function PivotClient() {
  return <PivotTableWrapper />
}
