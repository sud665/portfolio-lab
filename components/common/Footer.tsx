import { Github, Mail } from "lucide-react";

interface FooterProps {
  name: string;
  github: string;
  email: string;
}

export function Footer({ name, github, email }: FooterProps) {
  return (
    <footer className="border-t border-card-border bg-card px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4">
        <div className="flex items-center gap-4">
          {github && (
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 transition-colors hover:text-white"
              aria-label="GitHub"
            >
              <Github size={20} />
            </a>
          )}
          {email && (
            <a
              href={`mailto:${email}`}
              className="text-gray-400 transition-colors hover:text-white"
              aria-label="Email"
            >
              <Mail size={20} />
            </a>
          )}
        </div>
        <p className="text-sm text-gray-500">
          &copy; 2025 {name} &mdash; Built with Next.js
        </p>
      </div>
    </footer>
  );
}
