import prisma from './prisma'

export async function getDashboardStats() {
  const totalRevenueResult = await prisma.payments.aggregate({
    _sum: { amount: true }
  })
  const totalRevenue = totalRevenueResult._sum.amount?.toNumber() ?? 0

  const totalCustomers = await prisma.customers.count()
  const totalOrders = await prisma.orders.count()

  return {
    totalRevenue,
    totalCustomers,
    totalOrders
  }
}

export async function getOrdersByStatus() {
  const orders = await prisma.orders.groupBy({
    by: ['status'],
    _count: {
      status: true
    }
  })
  
  return orders.map(o => ({
    status: o.status,
    count: o._count.status
  }))
}

export async function getCustomersByCountry() {
  const customers = await prisma.customers.groupBy({
    by: ['country'],
    _count: {
      country: true
    },
    orderBy: {
      _count: {
        country: 'desc'
      }
    },
    take: 7
  })

  return customers.map(c => ({
    country: c.country,
    count: c._count.country
  }))
}

export async function getRevenueByProductLine() {
  // Using raw query to join orderdetails and products to get revenue per product line
  const result: { productLine: string; revenue: number }[] = await prisma.$queryRaw`
    SELECT p.productLine, SUM(od.quantityOrdered * od.priceEach) as revenue
    FROM orderdetails od
    JOIN products p ON od.productCode = p.productCode
    GROUP BY p.productLine
    ORDER BY revenue DESC
  `
  return result.map(r => ({
    productLine: r.productLine,
    revenue: Number(r.revenue)
  }))
}
