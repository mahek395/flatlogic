/**
 * Seed script — run with:  npx ts-node --project tsconfig.json scripts/seed.ts
 * Or add to package.json: "seed": "ts-node scripts/seed.ts"
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load env variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI as string;
if (!MONGODB_URI) throw new Error('MONGODB_URI not defined in .env.local');

// ── Inline schemas (avoids Next.js module issues) ──────────────────────────
const CategorySchema = new mongoose.Schema({ name: String, slug: String, description: String, image: String }, { timestamps: true });
const ProductSchema  = new mongoose.Schema({
  name: String, description: String, price: Number, originalPrice: Number,
  images: [String], category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  stock: Number, rating: Number, numReviews: Number,
  isFeatured: Boolean, isNewArrival: Boolean, tags: [String]
}, { timestamps: true });
const BlogSchema = new mongoose.Schema({
  title: String, slug: String, content: String, excerpt: String,
  image: String, author: String, tags: [String], publishedAt: Date
}, { timestamps: true });

const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
const Product  = mongoose.models.Product  || mongoose.model('Product', ProductSchema);
const Blog     = mongoose.models.Blog     || mongoose.model('Blog', BlogSchema);

// ── Sample data ─────────────────────────────────────────────────────────────
const categories = [
  { name: 'Light',       slug: 'lighting',    description: 'Lamps, chandeliers, LED lights' },
  { name: 'Furniture',   slug: 'furniture',   description: 'Sofas, chairs, tables and more' },
  { name: 'Decoration',  slug: 'decoration',  description: 'Vases, art, wall decor' },
  { name: 'Bedding',     slug: 'bedding',     description: 'Pillows, duvets, bed sets' },
];

const blogs = [
  {
    title: 'What is Shabby Chic?',
    slug: 'what-is-shabby-chic',
    content: 'Shabby chic is a style of interior design where furniture and furnishings are either chosen for their appearance of age and comfortable use...',
    excerpt: 'Explore the cozy, romantic world of Shabby Chic interior design.',
    image: '/images/blog/article1.jpg',
    author: 'Admin',
    tags: ['interior', 'design', 'style'],
    publishedAt: new Date('2020-03-12'),
  },
  {
    title: 'Best Examples of Maximalism',
    slug: 'best-examples-of-maximalism',
    content: 'Maximalism is the design philosophy that more is more. It embraces bold colors, rich textures, and layered patterns...',
    excerpt: 'Go bold or go home — discover the joy of maximalist interiors.',
    image: '/images/blog/article2.jpg',
    author: 'Admin',
    tags: ['maximalism', 'bold', 'decor'],
    publishedAt: new Date('2020-03-12'),
  },
  {
    title: 'Top Tips for Small Space Living',
    slug: 'top-tips-for-small-space-living',
    content: 'Living in a small space doesn\'t mean sacrificing style. With clever furniture choices and smart storage...',
    excerpt: 'Make the most of every square foot with these expert tips.',
    image: '/images/blog/article3.jpg',
    author: 'Admin',
    tags: ['small-space', 'tips', 'storage'],
    publishedAt: new Date('2020-03-12'),
  },
];

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB');

  // Clear existing data
  await Promise.all([Category.deleteMany({}), Product.deleteMany({}), Blog.deleteMany({})]);
  console.log('🗑️  Cleared existing data');

  // Insert categories
  const insertedCategories = await Category.insertMany(categories);
  console.log(`📂 Inserted ${insertedCategories.length} categories`);

  // Build category map
  const catMap: Record<string, mongoose.Types.ObjectId> = {};
  insertedCategories.forEach((c: any) => { catMap[c.slug] = c._id; });

  // Insert products — matched exactly to screenshots
  // New Arrivals row 1: new (Light $12), NEW CHAIIR (Furniture $123), Awesome Armchair (Furniture $90), Wooden casket (Decoration $20)
  // New Arrivals row 2: Awesome Lamp (Light $40), Soft Pillow (Bedding $30)
  const products = [
    {
      name: 'new',
      description: 'A sleek modern light fitting perfect for contemporary spaces.',
      price: 12,
      images: ['/images/products/new.png'],
      category: catMap['lighting'],
      stock: 30,
      rating: 4.0,
      numReviews: 6,
      isFeatured: false,
      isNewArrival: true,
      tags: ['light', 'modern', 'ceiling'],
    },
    {
      name: 'NEW CHAIIR',
      description: 'A bold statement chair crafted for style and comfort.',
      price: 123,
      images: ['/images/products/NEW_CHAIIR.png'],
      category: catMap['furniture'],
      stock: 10,
      rating: 4.3,
      numReviews: 11,
      isFeatured: true,
      isNewArrival: true,
      tags: ['chair', 'bold', 'statement'],
    },
    {
      name: 'Awesome Armchair',
      description: 'A luxurious armchair with premium fabric and solid wood legs. Perfect for your living room.',
      price: 90,
      originalPrice: 120,
      images: ['/images/products/awesome_armchair.png'],
      category: catMap['furniture'],
      stock: 15,
      rating: 4.5,
      numReviews: 24,
      isFeatured: true,
      isNewArrival: true,
      tags: ['chair', 'living room', 'comfortable'],
    },
    {
      name: 'Wooden casket',
      description: 'Elegant woven wooden casket for storing trinkets or displaying on a shelf.',
      price: 20,
      images: ['/images/products/wooden_casket.png'],
      category: catMap['decoration'],
      stock: 50,
      rating: 4.1,
      numReviews: 9,
      isFeatured: false,
      isNewArrival: true,
      tags: ['wood', 'decor', 'storage', 'woven'],
    },
    {
      name: 'Awesome Lamp',
      description: 'An industrial-style pendant lamp with a warm Edison bulb and metal cage shade.',
      price: 40,
      images: ['/images/products/awesome_lamp.png'],
      category: catMap['lighting'],
      stock: 30,
      rating: 4.2,
      numReviews: 15,
      isFeatured: true,
      isNewArrival: true,
      tags: ['lamp', 'industrial', 'pendant', 'edison'],
    },
    {
      name: 'Soft Pillow',
      description: 'Ultra-soft decorative pillow with a printed fabric cover. Removable and washable.',
      price: 30,
      images: ['/images/products/soft_pillow.png'],
      category: catMap['bedding'],
      stock: 60,
      rating: 4.7,
      numReviews: 55,
      isFeatured: false,
      isNewArrival: true,
      tags: ['pillow', 'bedroom', 'soft', 'printed'],
    },
    // Extra products — not in New Arrivals but available in the shop
    {
      name: 'Modern Sofa',
      description: 'Elegant 3-seater sofa with deep cushions and a minimalist design.',
      price: 450,
      originalPrice: 600,
      images: ['/images/products/sofa.png'],
      category: catMap['furniture'],
      stock: 8,
      rating: 4.8,
      numReviews: 42,
      isFeatured: true,
      isNewArrival: false,
      tags: ['sofa', 'living room', 'modern'],
    },
    {
      name: 'Wooden Coffee Table',
      description: 'Handcrafted solid wood coffee table with a natural finish.',
      price: 180,
      images: ['/images/products/table.png'],
      category: catMap['furniture'],
      stock: 20,
      rating: 4.3,
      numReviews: 18,
      isFeatured: false,
      isNewArrival: false,
      tags: ['table', 'wood', 'living room'],
    },
    {
      name: 'Pendant Light',
      description: 'Stylish pendant light with a warm Edison bulb. Great above kitchen islands.',
      price: 65,
      originalPrice: 85,
      images: ['/images/products/pendant.png'],
      category: catMap['lighting'],
      stock: 25,
      rating: 4.6,
      numReviews: 31,
      isFeatured: true,
      isNewArrival: false,
      tags: ['pendant', 'kitchen', 'light'],
    },
    {
      name: 'Ceramic Vase',
      description: 'Hand-painted ceramic vase, perfect for dried or fresh flower arrangements.',
      price: 35,
      images: ['/images/products/vase.png'],
      category: catMap['decoration'],
      stock: 40,
      rating: 4.4,
      numReviews: 22,
      isFeatured: true,
      isNewArrival: false,
      tags: ['vase', 'ceramic', 'flowers'],
    },
  ];

  const insertedProducts = await Product.insertMany(products);
  console.log(`📦 Inserted ${insertedProducts.length} products`);

  // Insert blogs
  const insertedBlogs = await Blog.insertMany(blogs);
  console.log(`📝 Inserted ${insertedBlogs.length} blog posts`);

  console.log('\n🎉 Seed complete! Your database is ready.');
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});