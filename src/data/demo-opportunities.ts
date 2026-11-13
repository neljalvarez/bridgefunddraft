import { addDays } from "@/lib/dates";
import type {
  DateOnlyString,
  StudentProfile,
  SupportClaim,
  TrackedOpportunity,
} from "@/types";

import { DEMO_RESOURCE_IDS as R } from "./support-resources";

/**
 * FICTIONAL DEMO OPPORTUNITIES.
 * Invented providers and amounts, flagged `isDemo` so the UI labels them and
 * they can be removed in one click. They exercise every assistance state:
 * delivered, approved, pending (potential), and estimated.
 */

export const DEMO_PROFILE: StudentProfile = {
  residenceCountry: "PT",
  educationLevel: "undergraduate",
  fieldOfStudy: "stem",
  enrollment: "enrolled",
  openToNeedBased: true,
};

export const DEMO_SAVED_RESOURCE_IDS = [R.tuitionGrant, R.laptopLoan];

export function createDemoOpportunities(
  today: DateOnlyString,
): TrackedOpportunity[] {
  const stamp = `${today}T00:00:00.000Z`;

  const claim = (
    partial: Pick<
      SupportClaim,
      "id" | "resourceId" | "resourceName" | "kind" | "expenseId" | "status" | "amount"
    > &
      Partial<SupportClaim>,
  ): SupportClaim => ({ updatedAt: stamp, ...partial });

  const summerProgramme: TrackedOpportunity = {
    id: "demo-opp-summer-programme",
    title: "Applied Data Science Summer Programme (demo)",
    provider: "Aldermere Institute (fictional)",
    country: "DE",
    type: "program",
    deadline: addDays(today, 45),
    url: "https://example.org/demo/aldermere-summer-programme",
    description:
      "A three-week fictional summer programme used to demonstrate BridgeFund. Not a real opportunity.",
    currency: "EUR",
    personalContribution: 200,
    status: "active",
    lastStep: 6,
    isDemo: true,
    createdAt: stamp,
    updatedAt: stamp,
    expenses: [
      { id: "demo-e-fee", name: "Programme fee", amount: 1200, currency: "EUR", category: "tuition", mandatory: true, deadline: addDays(today, 30) },
      { id: "demo-e-app", name: "Application fee", amount: 75, currency: "EUR", category: "application_fees", mandatory: true, deadline: addDays(today, 12) },
      { id: "demo-e-laptop", name: "Laptop for coursework", amount: 650, currency: "EUR", category: "technology", mandatory: true },
      { id: "demo-e-travel", name: "Travel to campus", amount: 220, currency: "EUR", category: "transportation", mandatory: true, deadline: addDays(today, 40) },
      { id: "demo-e-stay", name: "Accommodation (3 weeks)", amount: 480, currency: "EUR", category: "housing", mandatory: true },
      { id: "demo-e-books", name: "Course books", amount: 90, currency: "EUR", category: "learning_materials", mandatory: false },
    ],
    claims: [
      claim({ id: "demo-c-waiver", resourceId: R.openDoorsWaiver, resourceName: "Open Doors Application Fee Waiver", kind: "fee_waiver", expenseId: "demo-e-app", status: "received", amount: 75, confirmedAmount: 75, receivedAt: addDays(today, -5) }),
      claim({ id: "demo-c-grant", resourceId: R.tuitionGrant, resourceName: "Learning Bridge Tuition Grant", kind: "grant", expenseId: "demo-e-fee", status: "approved", amount: 600, confirmedAmount: 600 }),
      claim({ id: "demo-c-sponsor", resourceId: R.skillsSponsorship, resourceName: "Brightpath Skills Sponsorship", kind: "sponsorship", expenseId: "demo-e-fee", status: "applied", amount: 300 }),
      claim({ id: "demo-c-laptop", resourceId: R.laptopLoan, resourceName: "Community Laptop Library", kind: "equipment_loan", expenseId: "demo-e-laptop", status: "applied", amount: 650 }),
      claim({ id: "demo-c-travel", resourceId: R.transport, resourceName: "Harbourline Student Travel Grant", kind: "grant", expenseId: "demo-e-travel", status: "planned", amount: 150 }),
      claim({ id: "demo-c-stay", resourceId: R.housing, resourceName: "Lantern Housing Bursary", kind: "grant", expenseId: "demo-e-stay", status: "planned", amount: 300 }),
      claim({ id: "demo-c-books", resourceId: R.textbooks, resourceName: "OpenShelf Open Textbooks", kind: "free_alternative", expenseId: "demo-e-books", status: "planned", amount: 90 }),
    ],
  };

  const certificationExam: TrackedOpportunity = {
    id: "demo-opp-certification-exam",
    title: "Cloud Practitioner Certification Exam (demo)",
    provider: "Meridian Certification Board (fictional)",
    country: "PT",
    type: "exam",
    deadline: addDays(today, 34),
    url: "https://example.org/demo/meridian-cloud-practitioner",
    description:
      "A fictional certification exam used to demonstrate multi-currency costs. Not a real exam.",
    currency: "USD",
    personalContribution: 20,
    status: "active",
    lastStep: 6,
    isDemo: true,
    createdAt: stamp,
    updatedAt: stamp,
    expenses: [
      { id: "demo-x-fee", name: "Exam registration", amount: 180, currency: "USD", category: "exam_fees", mandatory: true, deadline: addDays(today, 34) },
      { id: "demo-x-prep", name: "Practice exam bundle", amount: 60, currency: "USD", category: "learning_materials", mandatory: false },
      { id: "demo-x-travel", name: "Travel to test centre", amount: 45, currency: "EUR", category: "transportation", mandatory: true },
    ],
    claims: [
      claim({ id: "demo-c-voucher", resourceId: R.examVoucher, resourceName: "Examination Access Voucher", kind: "fee_waiver", expenseId: "demo-x-fee", status: "applied", amount: 100 }),
      claim({ id: "demo-c-xsponsor", resourceId: R.examSponsor, resourceName: "Northlight Exam Sponsorship", kind: "sponsorship", expenseId: "demo-x-fee", status: "planned", amount: 90 }),
      claim({ id: "demo-c-practice", resourceId: R.practiceExams, resourceName: "OpenShelf Practice Exam Bank", kind: "free_alternative", expenseId: "demo-x-prep", status: "planned", amount: 60 }),
    ],
  };

  return [summerProgramme, certificationExam];
}
