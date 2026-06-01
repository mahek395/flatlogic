import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';
import '@/models/Category';

// GET /api/products  — list with optional filtering
export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const category  = searchParams.get('category');
    const search    = searchParams.get('search');
    const featured  = searchParams.get('featured');
    const newArrival = searchParams.get('newArrival');
    const page      = parseInt(searchParams.get('page') || '1');
    const limit     = parseInt(searchParams.get('limit') || '12');
    const skip      = (page - 1) * limit;

    // Build dynamic filter
    const filter: Record<string, unknown> = {};
    if (category)   filter.category   = category;
    if (featured)   filter.isFeatured = true;
    if (newArrival) filter.isNewArrival = true;
    if (search)     filter.$text = { $search: search };

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('category', 'name slug')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Product.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
  console.log(error);

  return NextResponse.json(
    {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    },
    { status: 500 }
  );
}
}

// POST /api/products  — create a new product (admin only — auth to be added in Phase 4)
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const product = await Product.create(body);

    return NextResponse.json(
      { success: true, data: product },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create product';
    return NextResponse.json({ success: false, message }, { status: 400 });
  }
}