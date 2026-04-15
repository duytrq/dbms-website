'use client'

import { useState, useEffect } from 'react'
import PivotTableUI from 'react-pivottable/PivotTableUI'
import 'react-pivottable/pivottable.css'

export default function PivotTableWrapper() {
  const [data, setData] = useState<any[]>([])
  const [pivotState, setPivotState] = useState<any>({
    rows: ['Product Line'],
    cols: ['Country'],
    vals: ['Revenue'],
    aggregatorName: 'Sum'
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/pivot-data')
      .then(res => res.json())
      .then(fetchedData => {
        if (Array.isArray(fetchedData)) {
          setData(fetchedData)
        } else {
          console.error('API did not return an array:', fetchedData)
          setData([])
        }
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to fetch pivot data', err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading sales data for pivot table...</div>
  }

  if (data.length === 0) {
    return <div className="p-8 text-center text-red-500">No data found or failed to load. Please check console for details.</div>
  }

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm overflow-auto">
      <PivotTableUI
        data={data}
        onChange={(s: any) => setPivotState(s)}
        {...pivotState}
      />
      <style jsx global>{`
        .pvtTable {
          width: 100%;
          border-collapse: collapse;
          font-family: inherit;
        }
        .pvtAxisContainer, .pvtVals {
          background-color: #f9fafb !important;
          border: 1px solid #e5e7eb !important;
          padding: 8px !important;
        }
        .pvtAttr {
          background-color: #3b82f6 !important;
          color: white !important;
          border-radius: 4px !important;
          padding: 2px 8px !important;
          margin: 2px !important;
          border: none !important;
        }
        .pvtCheckContainer {
           background: white !important;
           border: 1px solid #e5e7eb !important;
        }
        select {
          border: 1px solid #e5e7eb !important;
          border-radius: 4px !important;
          padding: 2px !important;
          background-color: white !important;
          color: #111827 !important;
        }
      `}</style>
    </div>
  )
}
