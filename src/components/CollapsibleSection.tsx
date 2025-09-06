"use client";
import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function CollapsibleSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-t pt-4">
      <button
        onClick={() => setOpen((s) => !s)}
        className="w-full flex items-center justify-between text-left"
        aria-expanded={open}
      >
        <h3 className="text-sm font-medium">{title}</h3>
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : "rotate-0"}`} />
      </button>
      {open && <div className="mt-3 text-sm text-gray-700">{children}</div>}
    </div>
  );
}