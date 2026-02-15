"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/dev", label: "Dev" },
  { href: "/hr", label: "HR" },
  { href: "/hire", label: "Hire" },
];

function getAccentClass(href: string) {
  switch (href) {
    case "/dev":
      return "text-code border-code";
    case "/hr":
      return "text-amber border-amber";
    case "/hire":
      return "text-chem border-chem";
    default:
      return "text-white border-white";
  }
}

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 50);
    }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && menuOpen) setMenuOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  return (
    <nav
      className={`fixed top-0 right-0 left-0 z-50 border-b border-white/5 transition-all duration-300 ${
        scrolled ? "py-3" : "py-5"
      }`}
      style={{ background: "rgba(10,10,15,0.8)", backdropFilter: "blur(24px)" }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
        <Link href="/" className="text-xl font-extrabold tracking-tight">
          <span className="bg-gradient-to-r from-chem via-code to-ai bg-clip-text text-transparent">
            Portfolio
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => {
            const isActive = pathname === link.href;
            const accent = getAccentClass(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? `${accent} border-b-2`
                    : "border-b-2 border-transparent text-gray-400 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Mobile hamburger */}
        <button
          className="text-gray-400 hover:text-white md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="메뉴 토글"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden md:hidden"
            style={{ background: "rgba(10,10,15,0.95)" }}
          >
            <div className="flex flex-col gap-2 px-6 py-4">
              {links.map((link) => {
                const isActive = pathname === link.href;
                const accent = getAccentClass(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`rounded-lg px-4 py-3 text-lg font-medium transition-colors ${
                      isActive ? accent : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
