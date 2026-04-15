import {
  getDashboardStats,
  getOrdersByStatus,
  getRevenueByProductLine,
  getCustomersByCountry
} from '@/lib/data'
import OrdersStatusChart from '@/components/charts/OrdersStatusChart'
import RevenueChart from '@/components/charts/RevenueChart'
import CustomersChart from '@/components/charts/CustomersChart'
import { Users, ShoppingCart, DollarSign } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function Dashboard() {
  const [stats, ordersStatus, revenueByProductLine, customersByCountry] = await Promise.all([
    getDashboardStats(),
    getOrdersByStatus(),
    getRevenueByProductLine(),
    getCustomersByCountry()
  ])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">ClassicModels Dashboard</h1>
            <p className="text-gray-500 mt-2">Overview of sales, orders, and customer statistics</p>
          </div>
          <div className="flex space-x-4">
            <a
              href="/pivot"
              className="bg-white text-blue-600 border border-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 transition-colors"
            >
              Pivot Table
            </a>
            <a
              href="/products"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Manage Products
            </a>
          </div>
        </header>

        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg text-blue-600 mr-4">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <h3 className="text-2xl font-bold text-gray-900">
                ${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center">
            <div className="p-3 bg-green-100 rounded-lg text-green-600 mr-4">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Orders</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {stats.totalOrders.toLocaleString()}
              </h3>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg text-purple-600 mr-4">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Customers</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {stats.totalCustomers.toLocaleString()}
              </h3>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenue by Product Line</h3>
            <RevenueChart data={revenueByProductLine} />
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Orders Status Distribution</h3>
            <OrdersStatusChart data={ordersStatus} />
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Customers by Country</h3>
            <CustomersChart data={customersByCountry} />
          </div>
        </div>
      </div>
    </div>
  )
}
