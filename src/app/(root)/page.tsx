import React from "react";
import Card from "@/components/Card";
import Filters from "@/components/Filter";
import Sort from "@/components/Sort";
import { parseFilterParams } from "@/lib/utils/query";
import { getAllProducts } from "@/lib/actions/product";
const Page = async ({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) => {
  const sp = await searchParams;
  const filters = parseFilterParams(sp);

  const { products, totalCount } = await getAllProducts(filters);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">New{totalCount > 0 && ` (${totalCount})`}</h1>

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

          {products.length === 0 ? (
            <div className="rounded-md border border-light-300 p-6 text-center">
              <p className="text-lg font-medium">No products match your filters.</p>
              <p className="text-sm text-dark-700 mt-2">Try clearing filters or choose different options.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => {
                const price =
                  product.minPrice !== null && product.maxPrice !== null && product.minPrice !== product.maxPrice
                    ? `$${product.minPrice.toFixed(2)} - $${product.maxPrice.toFixed(2)}`
                    : product.minPrice !== null
                    ? product.minPrice
                    : undefined;
                return (
                  <Card
                  key={product.id}
                  title={product.name}
                  subtitle={product.subtitle ?? ""}
                  imageSrc={product.imageUrl ?? "/shoes/shoe-1.jpg"}
                  price={price}
                  href={`/products/${product.id}`}
                />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default Page;