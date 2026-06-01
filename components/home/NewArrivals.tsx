// components/home/NewArrivals.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getNewArrivals, getProductPrice } from '@/lib/medusa';
import { MedusaProduct } from '@/models/Product';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=70';

export default function NewArrivals() {
  const [products, setProducts] = useState<MedusaProduct[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    getNewArrivals(6)
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">New Arrivals</h2>
          <p className="text-gray-500 text-base max-w-4xl mx-auto leading-relaxed">
            Check out our new furniture collection! Cozy sofa, fancy chair, wooden casket,
            and many more. The new collection brings an informal elegance to your home.
          </p>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-100 aspect-square mb-4" />
                <div className="h-3 bg-gray-100 rounded w-1/3 mb-2" />
                <div className="h-4 bg-gray-100 rounded w-2/3 mb-2" />
                <div className="h-4 bg-gray-100 rounded w-1/4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.handle}`}  
                className="group block"
              >
                {/* Image */}
                <div className="relative aspect-square bg-gray-100 mb-4 overflow-hidden">
                  <Image
                    src={product.thumbnail || PLACEHOLDER}
                    alt={product.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 25vw"
                    onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER; }}
                  />
                </div>

                {/* No category in basic product list — show variant count instead */}
                <p className="text-sm text-gray-400 mb-1">
                  {product.variants.length} variant{product.variants.length !== 1 ? 's' : ''}
                </p>

                {/* Title */}
                <h3 className="text-base font-bold text-gray-900 mb-1 group-hover:text-[#c17f4a] transition-colors">
                  {product.title}
                </h3>

                {/* Price — Medusa stores cents, divide by 100 */}
                <p className="text-base text-gray-900">
                  ${getProductPrice(product).toFixed(2)}
                </p>
              </Link>
            ))}
          </div>
        )}

        {/* View More */}
        <div className="flex justify-center mt-16">
          <Link
            href="/shop"
            className="border border-[#c17f4a] text-[#c17f4a] text-xs font-bold tracking-widest uppercase px-12 py-4 hover:bg-[#c17f4a] hover:text-white transition-all duration-300"
          >
            VIEW MORE
          </Link>
        </div>

      </div>
    </section>
  );
}