"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

const NAV_LINKS = [
  { label: "Men", href: "/?gender=men" },
  { label: "Women", href: "/?gender=women" },
  { label: "Kids", href: "/?gender=unisex" },
  { label: "Collections", href: "/collections" },
  { label: "Contact", href: "/contact" },
] as const;

function isLinkActive(href: string, pathname: string, search: string) {
  const [pathPart, queryPart] = href.split("?");
  if (pathPart !== pathname && !pathname.startsWith(pathPart)) return false;
  if (!queryPart) return true;
  const params = new URLSearchParams(search);
  const q = new URLSearchParams(queryPart);
  for (const [k, v] of q.entries()) {
    if (!params.getAll(k).includes(v)) return false;
  }
  return true;
}

function toHrefObject(href: string) {
  const [pathPart, queryPart] = href.split("?");
  if (!queryPart) return pathPart;
  const params = Object.fromEntries(new URLSearchParams(queryPart));
  return { pathname: pathPart, query: params };
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() || "/";
  const sp = useSearchParams();
  const search = sp ? sp.toString() : "";

  useEffect(() => {
    setOpen(false);
  }, [pathname, search]);

  return (
    <header className="sticky top-0 z-50 bg-light-100">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8" aria-label="Primary">
        <Link href="/" aria-label="Home" className="flex items-center">
          <Image src="/logo.svg" alt="Logo" width={28} height={28} priority className="invert" />
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((l) => {
            const active = isLinkActive(l.href, pathname, search);
            const hrefObj = toHrefObject(l.href);
            return (
              <li key={l.href}>
                <Link
                  href={hrefObj}
                  className={`text-body transition-colors ${active ? "text-dark-900 font-semibold" : "text-dark-700 hover:text-dark-900"}`}
                  aria-current={active ? "page" : undefined}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden items-center gap-6 md:flex">
          <button className="text-body text-dark-900 transition-colors hover:text-dark-700" aria-label="Open search">Search</button>
          <Link href="/cart" className="text-body text-dark-900 transition-colors hover:text-dark-700" aria-label="View cart">
            My Cart
            <span className="ml-2 inline-flex items-center justify-center rounded-full bg-dark-900 text-white text-xs w-5 h-5">2</span>
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 md:hidden"
          aria-controls="mobile-menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <span className={`block h-0.5 w-6 bg-dark-900 transform transition-all ${open ? "rotate-45 translate-y-1.5" : "-translate-y-1"}`} />
          <span className={`block h-0.5 w-6 bg-dark-900 transition-opacity ${open ? "opacity-0" : "opacity-100"}`} />
          <span className={`block h-0.5 w-6 bg-dark-900 transform transition-all ${open ? "-rotate-45 -translate-y-1.5" : "translate-y-1"}`} />
        </button>
      </nav>

      <div id="mobile-menu" className={`border-t border-light-300 md:hidden ${open ? "block" : "hidden"}`}>
        <ul className="space-y-2 px-4 py-3">
          {NAV_LINKS.map((l) => {
            const active = isLinkActive(l.href, pathname, search);
            const hrefObj = toHrefObject(l.href);
            return (
              <li key={l.href}>
                <Link href={hrefObj} className={`block py-2 text-body ${active ? "text-dark-900 font-semibold" : "text-dark-700 hover:text-dark-900"}`}>
                  {l.label}
                </Link>
              </li>
            );
          })}
          <li className="flex items-center justify-between pt-2">
            <button className="text-body" aria-label="Open search">Search</button>
            <Link href="/cart" className="text-body" aria-label="View cart">
              Cart
              <span className="ml-2 inline-flex items-center justify-center rounded-full bg-dark-900 text-white text-xs w-5 h-5">2</span>
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}