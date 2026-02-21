"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const routes = [
  { href: "/", label: "Index" },
  { href: "/dev", label: "Developer" },
  { href: "/hr", label: "Career" },
  { href: "/hire", label: "Hire Me" },
  { href: "/blog", label: "Blog" },
  { href: "/madmax", label: "Lab" },
];

const accentText: Record<string, string> = {
  "/": "text-white",
  "/dev": "text-code",
  "/hr": "text-amber",
  "/hire": "text-chem",
  "/blog": "text-code",
  "/madmax": "text-mad",
};

const accentPill: Record<string, string> = {
  "/": "bg-white/8",
  "/dev": "bg-code/10",
  "/hr": "bg-amber/10",
  "/hire": "bg-chem/10",
  "/blog": "bg-code/10",
  "/madmax": "bg-mad/10",
};

const accentDot: Record<string, string> = {
  "/": "bg-white",
  "/dev": "bg-code",
  "/hr": "bg-amber",
  "/hire": "bg-chem",
  "/blog": "bg-code",
  "/madmax": "bg-mad",
};

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && menuOpen) setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <nav
        aria-label="메인 내비게이션"
        className={`fixed top-0 right-0 left-0 z-50 transition-all duration-500 ease-out ${
          scrolled
            ? "border-b border-white/[0.06] bg-dark/80 py-3 backdrop-blur-2xl"
            : "py-5"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
          {/* Logo */}
          <Link href="/" className="group relative flex items-baseline gap-0.5">
            <span className="font-playfair text-lg font-bold tracking-tight text-white transition-opacity duration-300 group-hover:opacity-80">
              Portfolio
            </span>
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-chem transition-transform duration-300 group-hover:scale-150" />
          </Link>

          {/* Desktop pill nav */}
          <div className="hidden items-center gap-0.5 rounded-full border border-white/[0.06] bg-white/[0.02] p-1 md:flex">
            {routes.map((route) => {
              const isActive = pathname === route.href;
              return (
                <Link
                  key={route.href}
                  href={route.href}
                  className="relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200"
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className={`absolute inset-0 rounded-full ${accentPill[pathname] ?? "bg-white/8"}`}
                      transition={{
                        type: "spring",
                        bounce: 0.18,
                        duration: 0.5,
                      }}
                    />
                  )}
                  <span
                    className={`relative z-10 ${
                      isActive
                        ? accentText[pathname] ?? "text-white"
                        : "text-gray-500 transition-colors duration-200 hover:text-gray-300"
                    }`}
                  >
                    {route.label}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="relative z-50 flex h-9 w-9 items-center justify-center md:hidden"
            aria-label={menuOpen ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={menuOpen}
          >
            <div className="flex w-5 flex-col items-end gap-[5px]">
              <motion.span
                animate={
                  menuOpen
                    ? { rotate: 45, y: 7, width: 20 }
                    : { rotate: 0, y: 0, width: 20 }
                }
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="block h-[1.5px] rounded-full bg-gray-400"
              />
              <motion.span
                animate={
                  menuOpen
                    ? { opacity: 0, x: 8 }
                    : { opacity: 1, x: 0 }
                }
                transition={{ duration: 0.15 }}
                className="block h-[1.5px] w-3.5 rounded-full bg-gray-400"
              />
              <motion.span
                animate={
                  menuOpen
                    ? { rotate: -45, y: -7, width: 20 }
                    : { rotate: 0, y: 0, width: 20 }
                }
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="block h-[1.5px] rounded-full bg-gray-400"
              />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile full-screen overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 flex flex-col justify-center bg-dark/[0.98] backdrop-blur-3xl"
          >
            <div className="mx-auto w-full max-w-sm px-8">
              <nav className="flex flex-col gap-1">
                {routes.map((route, i) => {
                  const isActive = pathname === route.href;
                  const num = String(i + 1).padStart(2, "0");
                  return (
                    <motion.div
                      key={route.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{
                        duration: 0.35,
                        delay: i * 0.06,
                        ease: [0.16, 1, 0.3, 1] as const,
                      }}
                    >
                      <Link
                        href={route.href}
                        className={`group flex items-center gap-4 rounded-xl px-4 py-4 transition-colors duration-200 ${
                          isActive
                            ? "bg-white/[0.04]"
                            : "hover:bg-white/[0.02]"
                        }`}
                      >
                        <span className="font-mono text-xs text-gray-600">
                          {num}
                        </span>
                        <span
                          className={`text-2xl font-semibold tracking-tight ${
                            isActive
                              ? accentText[pathname] ?? "text-white"
                              : "text-gray-500 transition-colors duration-200 group-hover:text-white"
                          }`}
                        >
                          {route.label}
                        </span>
                        {isActive && (
                          <motion.span
                            layoutId="mobile-dot"
                            className={`ml-auto h-1.5 w-1.5 rounded-full ${accentDot[pathname] ?? "bg-white"}`}
                          />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Mobile footer hint */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="mt-12 px-4 font-mono text-[10px] tracking-wider text-gray-700"
              >
                // press ESC to close
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
