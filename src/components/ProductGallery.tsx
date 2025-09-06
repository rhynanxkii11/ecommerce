"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ImageOff, Check } from "lucide-react";

type ImageItem = { id: string; url: string; alt?: string };
type Variant = { id: string; color: string; label: string; images: ImageItem[] };

export default function ProductGallery({
  productName,
  variants,
  selectedVariantId,
  onSelectVariant,
}: {
  productName: string;
  variants: Variant[];
  selectedVariantId?: string;
  onSelectVariant?: (id: string) => void;
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [broken, setBroken] = useState<Record<string, boolean>>({});
  const thumbsRef = useRef<HTMLDivElement | null>(null);

  // Find the selected variant by id, fallback to first
  const selectedVariant =
    variants.find((v) => v.id === selectedVariantId) ?? variants[0];

  useEffect(() => {
    setSelectedIndex(0);
  }, [selectedVariantId]);

  const images = useMemo(() => selectedVariant?.images ?? [], [selectedVariant]);

  function handleThumbClick(i: number) {
    setSelectedIndex(i);
  }

  function onImgError(id: string) {
    setBroken((b) => ({ ...b, [id]: true }));
  }

  // keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") setSelectedIndex((s) => Math.max(0, s - 1));
      if (e.key === "ArrowRight") setSelectedIndex((s) => Math.min((images.length || 1) - 1, s + 1));
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [images.length]);

  return (
    <div className="space-y-4">
      <div className="w-full bg-white rounded-md overflow-hidden">
        {images.length > 0 && !broken[images[selectedIndex]?.id] ? (
          <div className="relative w-full aspect-[4/3] bg-gray-50">
            <Image
              src={images[selectedIndex].url}
              alt={images[selectedIndex].alt ?? productName}
              fill
              sizes="(min-width: 1024px) 800px, 100vw"
              className="object-contain"
              onError={() => onImgError(images[selectedIndex].id)}
              priority
            />
          </div>
        ) : images.length > 0 && broken[images[selectedIndex]?.id] ? (
          <div className="flex items-center justify-center h-80 bg-gray-50">
            <ImageOff className="h-12 w-12 text-gray-400" />
          </div>
        ) : (
          <div className="flex items-center justify-center h-80 bg-gray-50">
            <ImageOff className="h-12 w-12 text-gray-400" />
          </div>
        )}
      </div>

      {/* thumbnails */}
      <div
        ref={thumbsRef}
        className="flex gap-2 overflow-x-auto pb-2"
        role="list"
        aria-label="Product thumbnails"
      >
        {images.map((img, i) => {
          const isBroken = broken[img.id];
          const selected = i === selectedIndex;
          return (
            <button
              key={img.id}
              onClick={() => handleThumbClick(i)}
              className={`relative rounded-md overflow-hidden h-20 w-28 flex-shrink-0 border ${selected ? "ring-2 ring-offset-2 ring-dark-900" : "border-gray-200"}`}
              aria-label={`View image ${i + 1}`}
            >
              {!isBroken ? (
                <Image
                  src={img.url}
                  alt={img.alt ?? productName}
                  fill
                  sizes="120px"
                  className="object-cover"
                  onError={() => onImgError(img.id)}
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-100">
                  <ImageOff className="h-6 w-6 text-gray-400" />
                </div>
              )}
              {selected && (
                <span className="absolute -top-2 -right-2 bg-dark-900 text-white rounded-full p-1">
                  <Check className="h-3 w-3" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}