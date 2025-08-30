import React from "react";
import Card, { CardProps } from "../components/Card";

const products: CardProps[] = [
  {
    id: 1,
    title: "Court Runner",
    description: "Lightweight running shoe for daily training.",
    meta: "4 Colour",
    imageSrc: "/images/shoe1.jpg",
    price: 89.99,
    href: "/products/court-runner",
  },
  {
    id: 2,
    title: "Trail Blazer",
    description: "Rugged outsole for off-road adventures.",
    meta: "6 Colour",
    imageSrc: "/images/shoe2.jpg",
    price: 109.99,
    href: "/products/trail-blazer",
    badge: { label: "New", tone: "green" },
  },
  {
    id: 3,
    title: "City Slip-On",
    description: "Comfortable slip-on for city life.",
    meta: "5 Colour",
    imageSrc: "/images/shoe3.jpg",
    price: 69.99,
    href: "/products/city-slip-on",
  },
];

export default function Home() {
  return (
    <main className="max-w-7xl px-4 sm:px-6 lg:px-8">
      <section aria-labelledby="latest-shoes">
        <h2 id="latest-shoes" className="text-heading-2 mb-4">
          Latest Shoes
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} {...product} />
          ))}
        </div>
      </section>
    </main>
  );
}