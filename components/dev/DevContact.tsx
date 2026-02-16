import { Github, Mail } from "lucide-react";

import { ScrollReveal } from "@/components/common/ScrollReveal";

interface DevContactProps {
  github?: string;
  email?: string;
}

export function DevContact({ github, email }: DevContactProps) {
  return (
    <section aria-label="연락처" className="mx-auto max-w-5xl px-6 py-20">
      <ScrollReveal>
        <div className="text-center">
          <h2 className="font-playfair text-3xl font-bold text-white">
            함께 만들어 나갈 다음 코드
          </h2>
          <div className="mt-8 flex justify-center gap-4">
            {github && (
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg border border-code/30 bg-code/10 px-6 py-3 text-sm text-code transition-colors hover:bg-code/20">
                <Github size={18} aria-hidden="true" />
                GitHub
              </a>
            )}
            {email && (
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-2 rounded-lg border border-code/30 bg-code/10 px-6 py-3 text-sm text-code transition-colors hover:bg-code/20">
                <Mail size={18} aria-hidden="true" />
                Email
              </a>
            )}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
