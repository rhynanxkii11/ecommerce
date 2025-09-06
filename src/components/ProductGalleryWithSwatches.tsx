"use client";
import React, { useState } from "react";
import ProductGallery from "./ProductGallery";
import ColorSwatches, { GalleryVariant } from "./ColorSwatches";

export default function ProductGalleryWithSwatches({
  productName,
  variants,
}: {
  productName: string;
  variants: GalleryVariant[];
}) {
  const [selectedId, setSelectedId] = useState(variants[0]?.id ?? "");

  const selectedVariant = variants.find((v) => v.id === selectedId) ?? variants[0];

  return (
    <div className="space-y-4">
      <ProductGallery
        productName={productName}
        variants={variants}
        selectedVariantId={selectedVariant.id}
        onSelectVariant={setSelectedId}
      />
      <ColorSwatches
        variants={variants}
        selectedId={selectedVariant.id}
        onSelect={setSelectedId}
        showLabels={false}
      />
    </div>
  );
}