import type { ApplicationStatus, VerificationStatus } from "@/types";

export type BadgeTone = "neutral" | "info" | "success" | "warning" | "danger";

export interface StatusMeta {
  label: string;
  tone: BadgeTone;
}

export const APPLICATION_STATUS_META: Record<ApplicationStatus, StatusMeta> = {
  draft: { label: "Draft", tone: "neutral" },
  submitted: { label: "Submitted", tone: "info" },
  under_review: { label: "Under review", tone: "warning" },
  approved: { label: "Approved", tone: "success" },
  declined: { label: "Declined", tone: "danger" },
  withdrawn: { label: "Withdrawn", tone: "neutral" },
};

export const VERIFICATION_STATUS_META: Record<VerificationStatus, StatusMeta> = {
  pending: { label: "Pending verification", tone: "warning" },
  verified: { label: "Verified", tone: "success" },
  rejected: { label: "Rejected", tone: "danger" },
};
