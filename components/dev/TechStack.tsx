import { ScrollReveal } from "@/components/common/ScrollReveal";
import { techStacks } from "@/lib/constants";

export function TechStack() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <ScrollReveal>
        <h2 className="mb-12 text-center font-playfair text-3xl font-bold text-white">
          Tech Stack
        </h2>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <div className="overflow-hidden rounded-xl border border-card-border bg-card">
          {/* Terminal-style header */}
          <div className="flex items-center gap-2 border-b border-card-border px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
            <span className="ml-2 font-mono text-xs text-gray-600">
              stack.config
            </span>
          </div>

          {/* Category rows */}
          <div className="divide-y divide-card-border/50">
            {techStacks.map((stack) => (
              <div
                key={stack.category}
                className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:gap-6">
                <span className="w-20 shrink-0 font-mono text-[11px] uppercase tracking-wider text-gray-500">
                  {stack.category}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {stack.items.map((item) => (
                    <span
                      key={item.name}
                      className={`rounded-md border px-2.5 py-0.5 font-mono text-xs ${
                        item.highlight
                          ? "border-ai/30 bg-ai/10 text-ai"
                          : "border-code/15 bg-code/5 text-code-light"
                      }`}>
                      {item.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
