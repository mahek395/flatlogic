// app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

const BASE = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL!;
const KEY  = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!;

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const res = await fetch(`${BASE}/store/products/${params.id}`, {
    headers: {
      'Content-Type': 'application/json',
      'x-publishable-api-key': KEY,
    },
  });

  if (!res.ok) {
    return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
  }

  const data = await res.json();
  return NextResponse.json({ success: true, data: data.product });
}