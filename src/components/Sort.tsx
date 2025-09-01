"use client";
import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { setParam, withUpdatedParams } from "@/lib/utils/query";

const OPTIONS = [
  { label: "Featured", value: "featured" },
  { label: "Newest", value: "newest" },
  { label: "Price: Low → High", value: "price_asc" },
  { label: "Price: High → Low", value: "price_desc" },
];

const Sort = () => {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const currentSearch = sp ? sp.toString() : "";

  const currentSort = (() => {
    const q = new URLSearchParams(currentSearch);
    return q.get("sort") ?? "featured";
  })();

  function onChangeSort(value: string) {
    // set sort and reset page to 1
    const next = withUpdatedParams(pathname, currentSearch, { sort: value, page: "1" });
    router.push(next);
  }

  return (
    <div className="flex items-center gap-3">
      <label className="text-sm">Sort</label>
      <select
        value={currentSort}
        onChange={(e) => onChangeSort(e.target.value)}
        className="px-3 py-2 border rounded-md bg-white text-sm"
        aria-label="Sort products"
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Sort;