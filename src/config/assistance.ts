/**
 * The four kinds of "help" BridgeFund keeps strictly apart.
 * Only approved + delivered assistance ever counts toward funding.
 */
export type AssistanceKind = "potential" | "approved" | "delivered" | "estimated";

export interface AssistanceMeta {
  label: string;
  description: string;
  /** Whether this amount reduces the remaining gap as real funding. */
  counted: boolean;
  /** Tailwind classes for the colour swatch / bar segment. */
  swatch: string;
}

export const ASSISTANCE_META: Record<AssistanceKind, AssistanceMeta> = {
  delivered: {
    label: "Delivered assistance",
    description:
      "Support you have actually received. Included in confirmed assistance.",
    counted: true,
    swatch: "bg-success",
  },
  approved: {
    label: "Approved assistance",
    description:
      "Confirmed by the provider but not delivered yet. Included in confirmed assistance.",
    counted: true,
    swatch: "bg-green-300",
  },
  potential: {
    label: "Potential savings",
    description:
      "Support you may be eligible for that is planned or still pending a decision. Never counted as funding.",
    counted: false,
    swatch: "bg-hatched",
  },
  estimated: {
    label: "Estimated savings",
    description:
      "Reductions you plan yourself, such as free alternatives. Estimates, not funds.",
    counted: false,
    swatch: "bg-blue-300",
  },
};

export const ASSISTANCE_ORDER: AssistanceKind[] = [
  "delivered",
  "approved",
  "potential",
  "estimated",
];
