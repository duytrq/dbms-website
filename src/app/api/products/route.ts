import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const search = searchParams.get('search') || '';

    const skip = (page - 1) * limit;

    const where = search ? {
      OR: [
        { productCode: { contains: search } },
        { productName: { contains: search } },
        { productLine: { contains: search } },
      ],
    } : {};

    const [products, totalCount] = await Promise.all([
      prisma.products.findMany({
        where,
        orderBy: { productCode: 'asc' },
        skip,
        take: limit,
      }),
      prisma.products.count({ where }),
    ]);

    return NextResponse.json({
      data: products,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      productCode,
      productName,
      productLine,
      productScale,
      productVendor,
      productDescription,
      quantityInStock,
      buyPrice,
      MSRP,
    } = body;

    // Validate required fields
    if (!productCode || !productName || !productLine || !productScale || !productVendor || !productDescription || quantityInStock === undefined || buyPrice === undefined || MSRP === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newProduct = await prisma.products.create({
      data: {
        productCode,
        productName,
        productLine,
        productScale,
        productVendor,
        productDescription,
        quantityInStock: Number(quantityInStock),
        buyPrice: Number(buyPrice),
        MSRP: Number(MSRP),
      },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: any) {
    console.error('Error creating product:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Product Code already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
