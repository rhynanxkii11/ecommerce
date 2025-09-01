"use client";
import React, { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toggleArrayParam, removeParams, getArrayParam } from "@/lib/utils/query";

const GENDERS = [
  { label: "Men", value: "men" },
  { label: "Women", value: "women" },
  { label: "Unisex", value: "unisex" },
];

const SIZES = ["7", "8", "9", "10", "11", "12"];
const COLORS = [
  { label: "Black", value: "black" },
  { label: "White", value: "white" },
  { label: "Red", value: "red" },
  { label: "Blue", value: "blue" },
  { label: "Green", value: "green" },
];

const PRICES = [
  { id: "0-50", label: "$0 - $50" },
  { id: "50-100", label: "$50 - $100" },
  { id: "100-150", label: "$100 - $150" },
  { id: "150-", label: "Over $150" },
] as const;

const Filters = () => {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const currentSearch = sp ? sp.toString() : "";
  const search = useMemo(() => `?${sp.toString()}`, [sp]);

  const [drawerOpen, setDrawerOpen] = useState(false);

  const activeCounts = {
    gender: getArrayParam(search, "gender").length,
    size: getArrayParam(search, "size").length,
    color: getArrayParam(search, "color").length,
    price: getArrayParam(search, "price").length,
  };

  function onToggle(key: string, value: string) {
    const next = toggleArrayParam(pathname, currentSearch, key, value);
    router.push(next);
  }

  function onClearFilters() {
    const next = removeParams(pathname, currentSearch, [
      "gender",
      "size",
      "color",
      "priceMin",
      "priceMax",
      "search",
      "sort",
      "page",
    ]);
    router.push(next);
  }

  return (
    <>
      {/* Mobile filter button */}
      <div className="flex items-center gap-3 md:hidden mb-4">
        <button
          onClick={() => setDrawerOpen(true)}
          className="px-3 py-2 rounded-md bg-white border text-sm shadow-sm"
          aria-label="Open filters"
        >
          Filters
        </button>
        <button onClick={onClearFilters} className="px-3 py-2 rounded-md bg-white border text-sm">
          Clear
        </button>
      </div>

      {/* Sidebar for md+ */}
      <aside className="hidden md:block w-64 pr-6">
        <div className="sticky top-20 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Filters</h3>
            <button onClick={onClearFilters} className="text-sm text-gray-600">
              Clear all
            </button>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Gender{activeCounts.gender > 0 && ` (${activeCounts.gender})`}</h4>
            <div className="space-y-2">
              {GENDERS.map((g) => {
                const checked = getArrayParam(search, "gender").includes(g.value);
                return (
                    <label key={g.value} className="flex items-center gap-2 text-sm">
                    <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => onToggle("gender", g.value)}
                        className="h-4 w-4 rounded border-gray-300 accent-dark-900 focus:ring-2 focus:ring-[--color-dark-500]"
                    />
                    <span>{g.label}</span>
                    </label>
                );
                })}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Size{activeCounts.size > 0 && ` (${activeCounts.size})`}</h4>
            <div className="flex flex-wrap gap-2">
              {SIZES.map((s) => {
                const checked = getArrayParam(search, "size").includes(s);
                return (
                  <label
                    key={s}
                    className={`px-2 py-1 border rounded text-sm cursor-pointer ${checked ? "bg-dark-900 text-white" : "bg-white"}`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => onToggle("size", s)}
                      className="sr-only"
                    />
                    <span>{s}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Color{activeCounts.color > 0 && ` (${activeCounts.color})`}</h4>
            <div className="flex flex-col gap-2">
              {COLORS.map((c) => {
                const checked = getArrayParam(search, "color").includes(c.value);
                return (
                    <label key={c.value} className="flex items-center gap-2 text-sm">
                    <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => onToggle("color", c.value)}
                        className="h-4 w-4 rounded border-gray-300 accent-dark-900 focus:ring-2 focus:ring-[--color-dark-500]"
                    />
                    <span>{c.label}</span>
                    </label>
                );
                })}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Price{activeCounts.price > 0 && ` (${activeCounts.price})`}</h4>
            <div className="flex flex-col gap-2">
              {PRICES.map((p) => {
                const checked = getArrayParam(search, "price").includes(p.id);
                return (
                    <li key={p.id} className="flex items-center gap-2">
                    <input
                        id={`m-price-${p.id}`}
                        type="checkbox"
                        className="h-4 w-4 accent-dark-900"
                        checked={checked}
                        onChange={() => onToggle("price", p.id)}
                    />
                    <label htmlFor={`m-price-${p.id}`} className="text-body">
                        {p.label}
                    </label>
                    </li>
                );
                })}
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setDrawerOpen(false)}
            aria-hidden
          />
          <div className="absolute left-0 top-0 bottom-0 w-80 bg-white p-4 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Filters</h3>
              <button onClick={() => setDrawerOpen(false)} className="text-sm">Close</button>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium mb-2">Gender{activeCounts.gender > 0 && ` (${activeCounts.gender})`}</h4>
                <div className="space-y-2">
                  {GENDERS.map((g) => {
                    const checked = getArrayParam(search, "gender").includes(g.value);
                    return (
                      <label key={g.value} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => onToggle("gender", g.value)}
                          className="h-4 w-4 rounded focus:ring-2 focus:ring-[--color-dark-500]"
                        />
                        <span>{g.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Size{activeCounts.size > 0 && ` (${activeCounts.size})`}</h4>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map((s) => {
                    const checked = getArrayParam(search, "size").includes(s);
                    return (
                      <label key={s} className={`px-2 py-1 border rounded text-sm cursor-pointer ${checked ? "bg-dark-900 text-white" : "bg-white"}`}>
                        <input type="checkbox" checked={checked} onChange={() => onToggle("size", s)} className="sr-only" />
                        <span>{s}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Color{activeCounts.color > 0 && ` (${activeCounts.color})`}</h4>
                <div className="flex flex-col gap-2">
                  {COLORS.map((c) => {
                    const checked = getArrayParam(search, "color").includes(c.value);
                    return (
                      <label key={c.value} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => onToggle("color", c.value)}
                          className="h-4 w-4 rounded focus:ring-2 focus:ring-[--color-dark-500]"
                        />
                        <span>{c.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Price{activeCounts.price > 0 && ` (${activeCounts.price})`}</h4>
                <div className="flex flex-col gap-2">
                  {PRICES.map((p) => {
                    const checked = getArrayParam(search, "price").includes(p.id);
                    return (
                      <li key={p.id} className="flex items-center gap-2">
                        <input
                          id={`m-price-${p.id}`}
                          type="checkbox"
                          className="h-4 w-4 accent-dark-900"
                          checked={checked}
                          onChange={() => onToggle("price", p.id)}
                        />
                        <label htmlFor={`m-price-${p.id}`} className="text-body">
                          {p.label}
                        </label>
                      </li>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4">
                <button onClick={onClearFilters} className="w-full px-3 py-2 border rounded">Clear all</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Filters;