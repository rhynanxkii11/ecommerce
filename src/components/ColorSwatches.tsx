"use client";
import React from "react";
import { Check } from "lucide-react";

export type GalleryVariant = {
  id: string;
  color: string;
  label: string;
  images: { id: string; url: string; alt?: string }[];
  sizes?: string[];
};

export default function ColorSwatches({
  variants,
  selectedId,
  onSelect,
  showLabels = false,
}: {
  variants: GalleryVariant[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  showLabels?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      {variants.map((v) => {
        const isWhite = v.color === "white" || v.color === "#fff" || v.color === "#ffffff";
        const isSelected = selectedId ? selectedId === v.id : false;
        return (
          <button
            key={v.id}
            type="button"
            onClick={() => onSelect?.(v.id)}
            className={`relative h-8 w-8 rounded-full flex-shrink-0 border focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 ${
              isSelected ? "ring-2 ring-offset-1 ring-dark-900" : "border-gray-200"
            }`}
            aria-pressed={isSelected}
            aria-label={`Select color ${v.label}`}
            title={v.label}
          >
            <span
              aria-hidden
              className="absolute inset-0 rounded-full"
              style={{ backgroundColor: isWhite ? "#ffffff" : v.color }}
            />
            {isSelected && (
              <span className="absolute inset-0 flex items-center justify-center">
                <Check className={`h-4 w-4 ${isWhite ? "text-black" : "text-white"}`} />
              </span>
            )}
          </button>
        );
      })}
      {showLabels && (
        <div className="ml-2 flex items-center gap-3">
          {variants.map((v) => (
            <span key={`lbl-${v.id}`} className="text-sm text-gray-700">
              {v.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}