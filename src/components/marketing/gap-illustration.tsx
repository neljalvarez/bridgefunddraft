import { Card } from "@/components/ui/card";

/** Illustrative example only: fictional amounts for a fictional program. */
const EXAMPLE_ROWS = [
  { label: "Program tuition", amount: "$800", state: "covered" },
  { label: "Application fee", amount: "$60", state: "gap" },
  { label: "Laptop rental", amount: "$190", state: "gap" },
  { label: "Transport pass", amount: "$100", state: "gap" },
] as const;

function BridgeScene() {
  return (
    <svg
      viewBox="0 0 480 190"
      role="img"
      aria-label="A student on one side of a gap, an educational opportunity on the other, and a bridge of verified support spanning the gap"
      className="h-auto w-full"
    >
      {/* Platforms */}
      <rect x="0" y="120" width="150" height="70" rx="6" fill="#142B49" />
      <rect x="330" y="84" width="150" height="106" rx="6" fill="#142B49" />

      {/* The gap */}
      <rect x="150" y="150" width="180" height="40" fill="#EFF6FF" />
      <text x="240" y="176" textAnchor="middle" fontSize="12" fontWeight="600" fill="#B45309">
        The financial gap
      </text>

      {/* Bridge of verified support (draws itself once) */}
      <path
        d="M150 120 Q240 40 330 84"
        pathLength={1}
        fill="none"
        stroke="#2563EB"
        strokeWidth="4"
        strokeLinecap="round"
        className="animate-draw-bridge"
      />
      <g stroke="#2563EB" strokeWidth="2" strokeLinecap="round" opacity="0.55">
        <line x1="180" y1="86" x2="180" y2="150" />
        <line x1="210" y1="75" x2="210" y2="150" />
        <line x1="240" y1="72" x2="240" y2="150" />
        <line x1="270" y1="74" x2="270" y2="150" />
        <line x1="300" y1="79" x2="300" y2="150" />
      </g>

      {/* Student */}
      <circle cx="60" cy="96" r="9" fill="#2563EB" />
      <rect x="53" y="106" width="14" height="14" rx="4" fill="#2563EB" />
      <text x="75" y="145" textAnchor="middle" fontSize="12" fontWeight="600" fill="#fff">
        You are here
      </text>

      {/* Opportunity */}
      <path d="M385 56 L405 44 L425 56 L405 68 Z" fill="#fff" />
      <path d="M393 62 v10 q12 8 24 0 v-10" fill="none" stroke="#fff" strokeWidth="2" />
      <text x="405" y="116" textAnchor="middle" fontSize="12" fontWeight="600" fill="#fff">
        The opportunity
      </text>
      <text x="405" y="134" textAnchor="middle" fontSize="11" fill="#fff" opacity="0.7">
        out of reach
      </text>
    </svg>
  );
}

export function GapIllustration() {
  return (
    <Card className="overflow-hidden">
      <div className="bg-card p-3 sm:p-4">
        <BridgeScene />
      </div>

      <div className="border-t border-border p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-navy">Example: a summer program</p>
            <p className="text-xs text-muted-foreground">Total cost $1,150, split by expense</p>
          </div>
          <span className="rounded-full border border-amber-200 bg-warning-soft px-2.5 py-0.5 text-xs font-medium text-warning-foreground">
            Illustrative
          </span>
        </div>

        <ul className="mt-4 divide-y divide-border">
          {EXAMPLE_ROWS.map(({ label, amount, state }) => (
            <li key={label} className="flex items-center justify-between py-2.5 text-sm">
              <span className="text-foreground">{label}</span>
              <span className="flex items-center gap-3">
                <span className="font-medium text-navy">{amount}</span>
                <span
                  className={
                    state === "covered"
                      ? "w-24 rounded-full bg-success-soft px-2 py-0.5 text-center text-xs font-medium text-success-foreground"
                      : "w-24 rounded-full bg-accent px-2 py-0.5 text-center text-xs font-medium text-blue-700"
                  }
                >
                  {state === "covered" ? "Covered" : "Needs support"}
                </span>
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-muted-foreground">
          Fictional amounts, shown to explain the concept.
        </p>
      </div>
    </Card>
  );
}
