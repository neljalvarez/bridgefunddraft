import {
  BookOpen,
  Bus,
  Home,
  Laptop,
  type LucideIcon,
  MoreHorizontal,
  GraduationCap,
  ClipboardCheck,
  FileInput,
} from "lucide-react";

import type { BarrierCategory } from "@/types";

export interface BarrierCategoryMeta {
  label: string;
  description: string;
  icon: LucideIcon;
}

export const BARRIER_CATEGORY_META: Record<BarrierCategory, BarrierCategoryMeta> =
  {
    tuition: {
      label: "Tuition",
      description: "Course, program, or school fees.",
      icon: GraduationCap,
    },
    application_fees: {
      label: "Application fees",
      description: "Fees charged to apply or enroll.",
      icon: FileInput,
    },
    exam_fees: {
      label: "Exam fees",
      description: "Registration and testing costs.",
      icon: ClipboardCheck,
    },
    learning_materials: {
      label: "Learning materials",
      description: "Books, supplies, and course resources.",
      icon: BookOpen,
    },
    technology: {
      label: "Technology",
      description: "Devices and connectivity needed to study.",
      icon: Laptop,
    },
    transportation: {
      label: "Transportation",
      description: "Getting to classes, exams, or interviews.",
      icon: Bus,
    },
    housing: {
      label: "Housing",
      description: "Accommodation costs tied to study.",
      icon: Home,
    },
    other: {
      label: "Other",
      description: "Any other cost standing in the way.",
      icon: MoreHorizontal,
    },
  };
