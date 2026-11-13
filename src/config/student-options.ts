import {
  BookOpen,
  Gift,
  GraduationCap,
  Handshake,
  Laptop,
  type LucideIcon,
  ReceiptText,
  Sparkles,
  Wallet,
} from "lucide-react";

import type {
  EducationLevel,
  EnrollmentStatus,
  FieldOfStudy,
  OpportunityType,
  SupportResourceKind,
} from "@/types";

export const OPPORTUNITY_TYPE_LABELS: Record<OpportunityType, string> = {
  program: "Program",
  scholarship: "Scholarship",
  course: "Course",
  exam: "Exam",
};

export const EDUCATION_LEVEL_LABELS: Record<EducationLevel, string> = {
  secondary: "Secondary / high school",
  vocational: "Vocational or technical",
  undergraduate: "Undergraduate",
  graduate: "Graduate (master’s)",
  doctoral: "Doctoral",
  other: "Other / self-directed learning",
};

export const FIELD_OF_STUDY_LABELS: Record<FieldOfStudy, string> = {
  stem: "Science, technology, engineering, math",
  business: "Business and economics",
  health: "Health and medicine",
  social_sciences: "Social sciences",
  humanities: "Humanities",
  arts: "Arts and design",
  trades: "Trades and applied skills",
  other: "Other",
};

export const ENROLLMENT_LABELS: Record<EnrollmentStatus, string> = {
  enrolled: "Currently enrolled in education",
  applying: "Applying to programs",
  not_enrolled: "Not currently enrolled",
};

export interface ResourceKindMeta {
  label: string;
  /** Short explanation of how this kind of support helps. */
  description: string;
  icon: LucideIcon;
  /** Student-directed estimates that need no provider approval. */
  selfDirected: boolean;
}

export const RESOURCE_KIND_META: Record<SupportResourceKind, ResourceKindMeta> = {
  fee_waiver: {
    label: "Fee waiver",
    description: "The provider removes or reduces a fee.",
    icon: ReceiptText,
    selfDirected: false,
  },
  sponsorship: {
    label: "Sponsorship",
    description: "A sponsor pays part or all of a cost.",
    icon: Handshake,
    selfDirected: false,
  },
  grant: {
    label: "Grant",
    description: "Funding you don’t repay.",
    icon: Wallet,
    selfDirected: false,
  },
  free_alternative: {
    label: "Free alternative",
    description: "A free option you can use instead of paying.",
    icon: BookOpen,
    selfDirected: true,
  },
  equipment_loan: {
    label: "Equipment loan",
    description: "Borrow equipment instead of buying or renting it.",
    icon: Laptop,
    selfDirected: false,
  },
  other: {
    label: "Other support",
    description: "Another verified form of help.",
    icon: Gift,
    selfDirected: false,
  },
};

export const GENERIC_ICON = Sparkles;
export const EDUCATION_ICON = GraduationCap;
