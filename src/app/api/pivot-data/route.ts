import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Perform a raw SQL query to join orderdetails, orders, customers, and products
    // This provides a rich, flat dataset for the pivot table.
    const data: any[] = await prisma.$queryRaw`
      SELECT
        p.productLine as 'Product Line',
        c.country as 'Country',
        c.city as 'City',
        YEAR(o.orderDate) as 'Order Year',
        o.status as 'Order Status',
        CAST(SUM(od.quantityOrdered * od.priceEach) AS DECIMAL(10,2)) as 'Revenue'
      FROM orderdetails od
      JOIN orders o ON od.orderNumber = o.orderNumber
      JOIN customers c ON o.customerNumber = c.customerNumber
      JOIN products p ON od.productCode = p.productCode
      GROUP BY p.productLine, c.country, c.city, YEAR(o.orderDate), o.status
      ORDER BY 'Revenue' DESC
    `;

    // Prisma returns Decimal as objects or BigInts in some contexts, 
    // but with JSON.stringify it usually becomes a string or number.
    // We'll ensure everything is JSON serializable.
    const serializedData = data.map(item => ({
      ...item,
      'Order Year': item['Order Year'] ? Number(item['Order Year']) : null,
      'Revenue': item['Revenue'] ? Number(item['Revenue']) : 0
    }));

    return NextResponse.json(serializedData);
  } catch (error) {
    console.error('Error fetching pivot data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
