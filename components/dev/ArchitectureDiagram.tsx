import { type ArchitectureLayer } from "@/lib/types";

interface ArchitectureDiagramProps {
  layers: ArchitectureLayer[];
  compact?: boolean;
}

const colorClasses: Record<
  ArchitectureLayer["color"],
  {
    bar: string;
    glow: string;
    dotBg: string;
    dot: string;
    label: string;
    itemBorder: string;
    itemBg: string;
    itemAccent: string;
    itemText: string;
  }
> = {
  chem: {
    bar: "bg-gradient-to-r from-chem to-chem-light",
    glow: "shadow-[0_0_50px_-12px] shadow-chem/20",
    dotBg: "bg-chem/10",
    dot: "bg-chem",
    label: "text-chem",
    itemBorder: "border-chem/10",
    itemBg: "bg-chem/[0.03]",
    itemAccent: "bg-chem/30",
    itemText: "text-chem-light/80",
  },
  code: {
    bar: "bg-gradient-to-r from-code to-code-light",
    glow: "shadow-[0_0_50px_-12px] shadow-code/20",
    dotBg: "bg-code/10",
    dot: "bg-code",
    label: "text-code",
    itemBorder: "border-code/10",
    itemBg: "bg-code/[0.03]",
    itemAccent: "bg-code/30",
    itemText: "text-code-light/80",
  },
  ai: {
    bar: "bg-gradient-to-r from-ai to-ai-light",
    glow: "shadow-[0_0_50px_-12px] shadow-ai/20",
    dotBg: "bg-ai/10",
    dot: "bg-ai",
    label: "text-ai",
    itemBorder: "border-ai/10",
    itemBg: "bg-ai/[0.03]",
    itemAccent: "bg-ai/30",
    itemText: "text-ai-light/80",
  },
};

export function ArchitectureDiagram({
  layers,
  compact = false,
}: ArchitectureDiagramProps) {
  if (layers.length === 0) return null;

  if (compact) {
    return (
      <div className="flex flex-col gap-2">
        {layers.map((layer, i) => {
          const c = colorClasses[layer.color];
          const isLast = i === layers.length - 1;

          return (
            <div key={layer.name}>
              <div className="overflow-hidden rounded-lg border border-card-border bg-card">
                <div className={`h-px ${c.bar}`} />
                <div className="px-3 py-2">
                  <div className="flex items-center gap-1.5">
                    <span className={`block h-1 w-1 rounded-full ${c.dot}`} />
                    <span
                      className={`font-mono text-[9px] font-bold uppercase tracking-wider ${c.label}`}
                    >
                      {layer.name}
                    </span>
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {layer.items.map((item) => (
                      <span
                        key={item}
                        className={`rounded-md border px-1.5 py-0.5 font-mono text-[9px] ${c.itemBorder} ${c.itemBg} ${c.itemText}`}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {!isLast && (
                <div className="flex justify-center py-1">
                  <svg
                    className="h-3 w-3 text-card-border"
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path
                      d="M6 2v6M3.5 6L6 8.5 8.5 6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-card-border/60 bg-card/30 p-6">
      <div className="flex flex-col">
        {layers.map((layer, i) => {
          const c = colorClasses[layer.color];
          const isLast = i === layers.length - 1;

          return (
            <div key={layer.name}>
              {/* Layer card */}
              <div
                className={`overflow-hidden rounded-xl border border-card-border bg-card ${c.glow}`}
              >
                {/* Gradient accent bar */}
                <div className={`h-[2px] ${c.bar}`} />

                <div className="px-5 py-4">
                  {/* Header */}
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-lg ${c.dotBg}`}
                    >
                      <span
                        className={`block h-1.5 w-1.5 rounded-full ${c.dot}`}
                      />
                    </span>
                    <span
                      className={`font-mono text-xs font-bold uppercase tracking-wider ${c.label}`}
                    >
                      {layer.name}
                    </span>
                  </div>

                  {/* Items as mini-cards */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {layer.items.map((item) => (
                      <div
                        key={item}
                        className={`flex items-center gap-2 rounded-lg border py-1.5 pl-2.5 pr-3.5 ${c.itemBorder} ${c.itemBg}`}
                      >
                        <div
                          className={`h-3.5 w-[2px] rounded-full ${c.itemAccent}`}
                        />
                        <span
                          className={`font-mono text-[11px] leading-none ${c.itemText}`}
                        >
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Connector */}
              {!isLast && (
                <div className="flex flex-col items-center py-1">
                  <div className="h-4 w-px bg-card-border/60" />
                  <div className="flex h-5 w-5 items-center justify-center rounded-full border border-card-border bg-card">
                    <svg
                      className="h-2 w-2 text-gray-500"
                      viewBox="0 0 8 8"
                      fill="currentColor"
                    >
                      <path d="M4 6.5L1 3h6L4 6.5z" />
                    </svg>
                  </div>
                  <div className="h-4 w-px bg-card-border/60" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
