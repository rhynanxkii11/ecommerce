import React from "react";
import Card from "@/components/Card";
import Filters from "@/components/Filter";
import Sort from "@/components/Sort";
import { parseFilterParams } from "@/lib/utils/query";

const MOCK_PRODUCTS = [
  {
    id: "p-1",
    title: "Nike Court Runner",
    description: "Lightweight running shoe for daily training.",
    imageSrc: "/shoes/shoe-1.jpg",
    price: 89.99,
    gender: "men",
    colors: ["black", "white"],
    sizes: ["8", "9", "10"],
    createdAt: new Date("2025-06-01").toISOString(),
    slug: "court-runner",
  },
  {
    id: "p-2",
    title: "Nike Trail Blazer",
    description: "Rugged outsole for off-road adventures.",
    imageSrc: "/shoes/shoe-2.webp",
    price: 109.99,
    gender: "men",
    colors: ["red", "black"],
    sizes: ["9", "10", "11"],
    createdAt: new Date("2025-07-10").toISOString(),
    slug: "trail-blazer",
  },
  {
    id: "p-3",
    title: "Nike City Slip-On",
    description: "Comfortable slip-on for city life.",
    imageSrc: "/shoes/shoe-3.webp",
    price: 69.99,
    gender: "women",
    colors: ["white"],
    sizes: ["7", "8", "9"],
    createdAt: new Date("2025-05-15").toISOString(),
    slug: "city-slip-on",
  },
  {
    id: "p-4",
    title: "Nike Air Zoom",
    description: "Performance sneaker with responsive cushioning.",
    imageSrc: "/shoes/shoe-4.webp",
    price: 129.99,
    gender: "unisex",
    colors: ["blue", "white"],
    sizes: ["8", "9", "10", "11"],
    createdAt: new Date("2025-08-02").toISOString(),
    slug: "air-zoom",
  },
  {
    id: "p-5",
    title: "Nike Everyday Trainer",
    description: "Versatile trainer for everyday wear.",
    imageSrc: "/shoes/shoe-5.avif",
    price: 74.99,
    gender: "men",
    colors: ["black", "blue"],
    sizes: ["9", "10", "11", "12"],
    createdAt: new Date("2025-04-20").toISOString(),
    slug: "everyday-trainer",
  },
];

const Page = async ({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) => {
  const sp = await searchParams;
  const filters = parseFilterParams(sp);

  // filtering
  const filtered = MOCK_PRODUCTS.filter((p) => {
    if (filters.genderSlugs.length && !filters.genderSlugs.includes(p.gender)) return false;
    if (filters.sizeSlugs.length && !p.sizes.some((s: string) => filters.sizeSlugs.includes(s))) return false;
    if (filters.colorSlugs.length && !p.colors.some((c: string) => filters.colorSlugs.includes(c))) return false;
    if (filters.search && !`${p.title} ${p.description}`.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.priceMin !== undefined && p.price < filters.priceMin) return false;
    if (filters.priceMax !== undefined && p.price > filters.priceMax) return false;
    if (filters.priceRanges.length) {
      // product must match at least one requested price range
      const anyMatch = filters.priceRanges.some(([min, max]) => {
        if (min !== undefined && p.price < min) return false;
        if (max !== undefined && p.price > max) return false;
        return true;
      });
      if (!anyMatch) return false;
    }
    return true;
  });

  // sorting
  const sorted = filtered.slice();
  if (filters.sort === "price_asc") sorted.sort((a, b) => a.price - b.price);
  else if (filters.sort === "price_desc") sorted.sort((a, b) => b.price - a.price);
  else if (filters.sort === "newest") sorted.sort((a, b) => Number(new Date(b.createdAt)) - Number(new Date(a.createdAt)));

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">New{MOCK_PRODUCTS.length > 0 && ` (${MOCK_PRODUCTS.length})`}</h1>

      <div className="flex flex-col md:flex-row md:items-start md:gap-8">
        <Filters />

        <div className="flex-1">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {filters.genderSlugs.map((g) => (
                <span key={`g-${g}`} className="px-2 py-1 bg-light-200 text-sm rounded">
                  {g}
                </span>
              ))}
              {filters.colorSlugs.map((c) => (
                <span key={`c-${c}`} className="px-2 py-1 bg-light-200 text-sm rounded">
                  {c}
                </span>
              ))}
              {filters.sizeSlugs.map((s) => (
                <span key={`s-${s}`} className="px-2 py-1 bg-light-200 text-sm rounded">
                  Size: {s}
                </span>
              ))}
              {filters.search && (
                <span className="px-2 py-1 bg-light-200 text-sm rounded">Searching: {filters.search}</span>
              )}
            </div>

            <div className="flex items-center gap-4">
              <Sort />
            </div>
          </div>

          {sorted.length === 0 ? (
            <div className="rounded-md border border-light-300 p-6 text-center">
              <p className="text-lg font-medium">No products match your filters.</p>
              <p className="text-sm text-dark-700 mt-2">Try clearing filters or choose different options.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sorted.map((product) => (
                <Card
                  key={product.id}
                  title={product.title}
                  description={product.description}
                  imageSrc={product.imageSrc}
                  price={product.price}
                  href={`/products/${product.slug}`}
                  meta={`${product.colors.length} Colour`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default Page;