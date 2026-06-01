import Medusa from '@medusajs/js-sdk';

const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';

export const sdk = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  debug: process.env.NODE_ENV === 'development',
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
});

// ─── PRODUCTS ─────────────────────────────────────────────

export async function getNewArrivals(limit = 6) {
  const { products } = await sdk.store.product.list({
    limit,
    order: '-created_at',
  });
  return products;
}

export async function getProductByHandle(handle: string) {
  const { products } = await sdk.store.product.list({ handle });
  return products[0] ?? null;
}

export async function getProductById(id: string) {
  const { product } = await sdk.store.product.retrieve(id);
  return product;
}

// ─── HELPER ───────────────────────────────────────────────

export function getProductPrice(product: Awaited<ReturnType<typeof getProductById>>) {
  const prices = product?.variants?.flatMap((v) => v.prices ?? []) ?? [];
  if (!prices.length) return 0;
  return Math.min(...prices.map((p) => p.amount ?? 0)) / 100;
}