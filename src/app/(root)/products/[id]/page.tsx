import React from "react";
import Link from "next/link";
import Card from "@/components/Card";
import ProductGallery from "@/components/ProductGallery";
import SizePicker from "@/components/SizePicker";
import CollapsibleSection from "@/components/CollapsibleSection";
import ColorSwatches from "@/components/ColorSwatches";
import { Star, Heart, ShoppingBag, ChevronRight } from "lucide-react";
import {
  getProduct,
  getProductReviews,
  getRecommendedProducts,
  type Review,
  type RecommendedProduct,
} from "@/lib/actions/product";
import {
  type SelectProduct,
  type SelectProductVariant,
  type SelectProductImage,
  type SelectBrand,
  type SelectCategory,
  type SelectGender,
  type SelectColor,
  type SelectSize,
} from "@/lib/db/schema";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params;

  const productData = await getProduct(id);
  if (!productData) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="rounded-md border border-light-300 p-6 text-center">
          <h2 className="text-lg font-medium">Product not found</h2>
          <p className="text-sm text-dark-700 mt-2">The product you requested does not exist.</p>
          <div className="mt-4">
            <Link href="/products" className="text-sm text-dark-900 underline">
              Back to products
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // typed result from action
  const product = productData.product as SelectProduct & {
    brand?: SelectBrand | null;
    category?: SelectCategory | null;
    gender?: SelectGender | null;
  };

  const variants = productData.variants as Array<
    SelectProductVariant & { color?: SelectColor | null; size?: SelectSize | null }
  >;

  const images = productData.images as SelectProductImage[];

  // price range
  const variantPrices = variants
    .map((v) => {
      // price stored as string in action; coerce safely
      const raw = (v.price ?? null) as string | number | null;
      if (raw === null || raw === undefined) return null;
      const n = typeof raw === "string" ? Number(raw) : Number(raw);
      return Number.isFinite(n) ? n : null;
    })
    .filter((p): p is number => typeof p === "number");

  const minPrice = variantPrices.length ? Math.min(...variantPrices) : null;
  const maxPrice = variantPrices.length ? Math.max(...variantPrices) : null;

  type GalleryVariant = {
    id: string;
    color: string;
    label: string;
    images: { id: string; url: string; alt?: string }[];
    sizes: string[];
  };
  const colorMap = new Map<string, GalleryVariant>();

  // group variants by color (typed)
  for (const v of variants) {
    const color = v.color ?? null;
    const colorKey = color?.id ?? `c-${v.id}`;
    const colorLabel = color?.name ?? color?.slug ?? "Default";

    if (!colorMap.has(colorKey)) {
      colorMap.set(colorKey, {
        id: colorKey,
        color: (color?.slug as string) ?? colorLabel.toLowerCase(),
        label: colorLabel,
        images: [],
        sizes: [],
      });
    }

    const gv = colorMap.get(colorKey)!;
    const sizeName = v.size?.name ?? null;
    if (sizeName && !gv.sizes.includes(sizeName)) gv.sizes.push(sizeName);
  }

  // sort helper: numeric-first fallback to locale compare
  const sortSizesAsc = (a: string, b: string) => {
    const na = parseFloat(a);
    const nb = parseFloat(b);
    const bothNumbers = !isNaN(na) && !isNaN(nb);
    if (bothNumbers) return na - nb;
    return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
  };

  // sort sizes within each color group
  for (const [, gv] of colorMap) gv.sizes.sort(sortSizesAsc);

  // map images by variantId (images from action use variantId key)
  const imagesByVariantId = new Map<string | null, { id: string; url: string; alt?: string }[]>();
  for (const img of images) {
    const vid = (img.variantId as string) ?? null;
    const arr = imagesByVariantId.get(vid) ?? [];
    arr.push({ id: String(img.id), url: String(img.url), alt: String(img.url) });
    imagesByVariantId.set(vid, arr);
  }

  // attach variant-level images to color groups
  for (const v of variants) {
    const color = v.color ?? null;
    const colorKey = color?.id ?? `c-${v.id}`;
    const gv = colorMap.get(colorKey)!;
    const variantImgs = imagesByVariantId.get(v.id) ?? [];
    for (const im of variantImgs) {
      if (!gv.images.some((x) => x.id === im.id)) gv.images.push(im);
    }
  }

  // product-level images fallback (variantId === null)
  const productLevelImgs = imagesByVariantId.get(null) ?? [];
  for (const [, gv] of colorMap) {
    if (gv.images.length === 0 && productLevelImgs.length) gv.images.push(...productLevelImgs);
    if (gv.images.length === 0) gv.images.push({ id: `ph-${gv.id}`, url: "/shoes/shoe-1.jpg", alt: `${product.name} - ${gv.label}` });
  }

  const galleryVariants: GalleryVariant[] = Array.from(colorMap.values());

  // server actions for reviews & recommended
  const reviews: Review[] = await getProductReviews(id);
  const recommended: RecommendedProduct[] = await getRecommendedProducts(id);

  // display price / compareAt logic
  const firstVariant = variants[0];
  const firstSaleRaw = (firstVariant?.salePrice ?? null) as string | number | null;
  const compareAtNumber = firstSaleRaw ? Number(firstSaleRaw) : null;
  const displayPrice = minPrice ?? 0;
  const displayCompareAt = compareAtNumber && compareAtNumber > displayPrice ? compareAtNumber : null;
  const discount = displayCompareAt ? Math.round(((displayCompareAt - displayPrice) / displayCompareAt) * 100) : null;

  // unique sizes ascending for SizePicker
  const uniqueSizes = Array.from(new Set(variants.map((v) => v.size?.name).filter(Boolean) as string[]));
  uniqueSizes.sort(sortSizesAsc);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <nav className="mb-6" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-sm text-gray-500">
          <li>
            <Link href="/" className="hover:text-dark-900 font-medium">
              Home
            </Link>
          </li>
          <li>
            <ChevronRight className="h-4 w-4" aria-hidden />
          </li>
          <li>
            <Link href="/products" className="hover:text-dark-900 font-medium">
              Products
            </Link>
          </li>
          <li>
            <ChevronRight className="h-4 w-4" aria-hidden />
          </li>
          <li className="text-dark-900 font-semibold truncate max-w-xs" title={product.name}>
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Gallery */}
        <div className="lg:col-span-7">
          <ProductGallery
            productName={product.name}
            variants={galleryVariants.map((v) => ({ id: v.id, color: v.color, label: v.label, images: v.images }))}
          />
        </div>

        {/* Info */}
        <aside className="lg:col-span-5">
          <div className="sticky top-20 space-y-4">
            <div>
              <h1 className="text-2xl font-semibold">{product.name}</h1>
              {product.brand?.name && <p className="text-sm text-muted-foreground mt-1">{product.brand.name}</p>}
            </div>

            <div className="flex items-center gap-3">
              <div className="text-2xl font-bold">{displayPrice !== null ? `$${Number(displayPrice).toFixed(2)}` : "—"}</div>
              {displayCompareAt && <div className="text-sm text-gray-500 line-through">${Number(displayCompareAt).toFixed(2)}</div>}
              {discount && <div className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">{discount}% off</div>}
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="font-medium">{product.rating ?? "—"}</span>
                <span className="text-xs">({reviews.length})</span>
              </div>

              <div className="flex items-center gap-2">
                <button aria-label="Favorite (UI only)" className="p-2 rounded-md border bg-white">
                  <Heart className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Color</h4>
              <ColorSwatches variants={galleryVariants} showLabels={false} />
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Size</h4>
              <SizePicker sizes={uniqueSizes} />
            </div>

            <div className="flex gap-3 mt-4">
              <button aria-label="Add to bag (UI only)" className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-md bg-dark-900 text-white font-medium">
                <ShoppingBag className="h-4 w-4" />
                Add to bag
              </button>
            </div>

            <CollapsibleSection title="Product Details">
              <p className="text-sm text-gray-700">{product.description ?? "No description available."}</p>
            </CollapsibleSection>

            <CollapsibleSection title="Shipping & Returns">
              <p className="text-sm text-gray-700">Free shipping over $75. Returns accepted within 30 days in original condition.</p>
            </CollapsibleSection>

            <CollapsibleSection title="Reviews">
              {reviews.length === 0 ? (
                <p className="text-sm text-gray-700">Be the first to review this product.</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((r) => (
                    <div key={r.id} className="border rounded p-3">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">{r.author}</div>
                        <div className="text-xs text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</div>
                      </div>
                      <div className="text-sm text-yellow-500 flex items-center gap-1 mt-1">
                        <Star className="h-4 w-4" /> <span>{r.rating.toFixed(1)}</span>
                      </div>
                      {r.title && <div className="mt-2 font-medium">{r.title}</div>}
                      <div className="text-sm text-gray-700 mt-1">{r.content}</div>
                    </div>
                  ))}
                </div>
              )}
            </CollapsibleSection>
          </div>
        </aside>
      </div>

      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-4">You might also like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommended.map((p) => (
            <Link key={p.id} href={`/products/${p.id}`}>
              <Card title={p.title} description="" imageSrc={p.imageUrl} price={p.price ?? undefined} />
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}