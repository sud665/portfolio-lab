import Link from "next/link";
import { Github, Mail, ArrowUpRight } from "lucide-react";

interface FooterProps {
  name: string;
  github: string;
  email: string;
}

const navLinks = [
  { href: "/dev", label: "Developer" },
  { href: "/hr", label: "Career" },
  { href: "/hire", label: "Hire Me" },
  { href: "/blog", label: "Blog" },
];

export function Footer({ name, github, email }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-card-border">
      {/* Gradient accent line */}
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 left-0 h-px bg-gradient-to-r from-transparent via-code to-transparent opacity-30"
      />

      <div className="mx-auto max-w-6xl px-6 py-14 md:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
          {/* Brand column */}
          <div>
            <Link
              href="/"
              className="group inline-flex items-baseline gap-0.5"
            >
              <span className="font-playfair text-lg font-bold tracking-tight text-white transition-opacity duration-300 group-hover:opacity-80">
                Portfolio
              </span>
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-chem transition-transform duration-300 group-hover:scale-150" />
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-gray-500">
              화학공학의 도메인 지식 위에 풀스택 개발과 AI를 결합하는 개발자.
            </p>
            {/* Status badge */}
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-chem/15 bg-chem/5 px-3 py-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-chem opacity-40" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-chem" />
              </span>
              <span className="text-[11px] font-medium text-chem/80">
                Available for work
              </span>
            </div>
          </div>

          {/* Navigate column */}
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-600">
              Navigate
            </h3>
            <nav className="mt-4 flex flex-col gap-2.5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex w-fit items-center gap-1 text-sm text-gray-400 transition-colors duration-200 hover:text-white"
                >
                  {link.label}
                  <ArrowUpRight
                    size={12}
                    className="opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-60"
                  />
                </Link>
              ))}
            </nav>
          </div>

          {/* Connect column */}
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-600">
              Connect
            </h3>
            <div className="mt-4 flex flex-col gap-2.5">
              {github && (
                <a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex w-fit items-center gap-2 text-sm text-gray-400 transition-colors duration-200 hover:text-white"
                >
                  <Github size={15} className="shrink-0" />
                  GitHub
                  <ArrowUpRight
                    size={12}
                    className="opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-60"
                  />
                </a>
              )}
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="group flex w-fit items-center gap-2 text-sm text-gray-400 transition-colors duration-200 hover:text-white"
                >
                  <Mail size={15} className="shrink-0" />
                  Email
                  <ArrowUpRight
                    size={12}
                    className="opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-60"
                  />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-card-border pt-6 md:flex-row">
          <p className="font-mono text-xs text-gray-600">
            &copy; {year} {name}
          </p>
          <p className="font-mono text-xs text-gray-700">
            // Next.js &middot; React &middot; Tailwind
          </p>
        </div>
      </div>
    </footer>
  );
}
