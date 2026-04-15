import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ productCode: string }> }) {
  try {
    const { productCode } = await params;
    const product = await prisma.products.findUnique({
      where: { productCode },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ productCode: string }> }) {
  try {
    const { productCode } = await params;
    const body = await request.json();
    const {
      productName,
      productLine,
      productScale,
      productVendor,
      productDescription,
      quantityInStock,
      buyPrice,
      MSRP,
    } = body;

    // Validate if the product exists
    const existingProduct = await prisma.products.findUnique({
      where: { productCode },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const updatedProduct = await prisma.products.update({
      where: { productCode },
      data: {
        productName: productName ?? existingProduct.productName,
        productLine: productLine ?? existingProduct.productLine,
        productScale: productScale ?? existingProduct.productScale,
        productVendor: productVendor ?? existingProduct.productVendor,
        productDescription: productDescription ?? existingProduct.productDescription,
        quantityInStock: quantityInStock !== undefined ? Number(quantityInStock) : existingProduct.quantityInStock,
        buyPrice: buyPrice !== undefined ? Number(buyPrice) : existingProduct.buyPrice,
        MSRP: MSRP !== undefined ? Number(MSRP) : existingProduct.MSRP,
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ productCode: string }> }) {
  try {
    const { productCode } = await params;

    // Validate if the product exists
    const existingProduct = await prisma.products.findUnique({
      where: { productCode },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    await prisma.products.delete({
      where: { productCode },
    });

    return NextResponse.json({ message: 'Product deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    if (error.code === 'P2003') {
      return NextResponse.json({ error: 'Cannot delete product due to foreign key constraints (e.g. exists in order details)' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
