import { addDays } from "@/lib/dates";
import type { DateOnlyString, SupportResource } from "@/types";

/**
 * FICTIONAL DEMO CATALOG.
 * Every organization, program, and link here is invented for demonstration
 * (links use the reserved example.org domain). Deadlines roll forward with
 * `today` so the demo never goes stale. In production this is replaced by a
 * verified catalog loaded from Supabase.
 */

/** Residence countries used by the demo regional programs. */
const EUROPE = ["PT", "ES", "FR", "DE", "IT", "NL", "BE", "AT", "IE", "PL", "GR", "FI", "SE", "DK"];
const ANY_LEVEL_FORMAL = ["undergraduate", "graduate", "vocational", "other"] as const;

export const DEMO_RESOURCE_IDS = {
  openDoorsWaiver: "res-open-doors-waiver",
  examVoucher: "res-meridian-exam-voucher",
  examSponsor: "res-northlight-exam-sponsor",
  tuitionGrant: "res-learning-bridge-grant",
  skillsSponsorship: "res-brightpath-sponsorship",
  laptopLoan: "res-community-laptop-loan",
  connectivity: "res-signal-connectivity",
  textbooks: "res-openshelf-textbooks",
  practiceExams: "res-openshelf-practice",
  transport: "res-harbourline-transport",
  intlTravel: "res-harbourline-intl-travel",
  housing: "res-lantern-housing",
  supplies: "res-northlight-supplies",
} as const;

export function getSupportResources(today: DateOnlyString): SupportResource[] {
  const src = (slug: string) => `https://example.org/demo/${slug}`;

  return [
    {
      id: DEMO_RESOURCE_IDS.openDoorsWaiver,
      name: "Open Doors Application Fee Waiver",
      provider: "Open Doors Access Trust",
      kind: "fee_waiver",
      description:
        "Covers application and registration fees for students who cannot pay them.",
      categories: ["application_fees"],
      eligibility: {
        summary: "Any student applying to a program or course. Need-based.",
        opportunityTypes: ["program", "course", "scholarship"],
        needBased: true,
      },
      value: { kind: "full" },
      deadline: addDays(today, 40),
      verification: "verified",
      sourceName: "Open Doors Access Trust",
      sourceUrl: src("open-doors-waiver"),
    },
    {
      id: DEMO_RESOURCE_IDS.examVoucher,
      name: "Examination Access Voucher",
      provider: "Meridian Certification Board",
      kind: "fee_waiver",
      description:
        "A voucher that reduces the registration fee for certification exams.",
      categories: ["exam_fees"],
      eligibility: {
        summary: "Students registering for a certification exam. Need-based.",
        opportunityTypes: ["exam"],
        needBased: true,
      },
      value: { kind: "fixed", amount: 100, currency: "USD" },
      deadline: addDays(today, 25),
      verification: "verified",
      sourceName: "Meridian Certification Board",
      sourceUrl: src("exam-access-voucher"),
    },
    {
      id: DEMO_RESOURCE_IDS.examSponsor,
      name: "Northlight Exam Sponsorship",
      provider: "Northlight Education Fund",
      kind: "sponsorship",
      description: "Sponsors half of an exam fee for eligible learners.",
      categories: ["exam_fees"],
      eligibility: {
        summary: "Open to learners in any country sitting a certification exam.",
        opportunityTypes: ["exam"],
      },
      value: { kind: "percent", percent: 50 },
      deadline: addDays(today, 50),
      verification: "verified",
      sourceName: "Northlight Education Fund",
      sourceUrl: src("northlight-exam-sponsorship"),
    },
    {
      id: DEMO_RESOURCE_IDS.tuitionGrant,
      name: "Learning Bridge Tuition Grant",
      provider: "Learning Bridge Foundation",
      kind: "grant",
      description:
        "A grant toward programme and course fees for students in Europe.",
      categories: ["tuition"],
      eligibility: {
        summary:
          "Residents of Europe in formal or vocational study, for programs and courses. Need-based.",
        countries: EUROPE,
        educationLevels: [...ANY_LEVEL_FORMAL],
        opportunityTypes: ["program", "course"],
        needBased: true,
      },
      value: { kind: "fixed", amount: 600, currency: "EUR" },
      deadline: addDays(today, 30),
      verification: "verified",
      sourceName: "Learning Bridge Foundation",
      sourceUrl: src("learning-bridge-grant"),
    },
    {
      id: DEMO_RESOURCE_IDS.skillsSponsorship,
      name: "Brightpath Skills Sponsorship",
      provider: "Brightpath Skills Alliance",
      kind: "sponsorship",
      description:
        "Industry-funded sponsorship of a quarter of programme fees.",
      categories: ["tuition"],
      eligibility: {
        summary: "Students in any country joining a skills program or course.",
        opportunityTypes: ["program", "course"],
      },
      value: { kind: "percent", percent: 25 },
      deadline: addDays(today, 60),
      verification: "pending",
      sourceName: "Brightpath Skills Alliance",
      sourceUrl: src("brightpath-sponsorship"),
    },
    {
      id: DEMO_RESOURCE_IDS.laptopLoan,
      name: "Community Laptop Library",
      provider: "Community Laptop Library Network",
      kind: "equipment_loan",
      description:
        "Borrow a laptop for the length of your course instead of buying or renting one.",
      categories: ["technology"],
      eligibility: {
        summary: "Students in Europe enrolled in or joining a course or program.",
        countries: EUROPE,
      },
      value: { kind: "full" },
      verification: "verified",
      sourceName: "Community Laptop Library Network",
      sourceUrl: src("laptop-library"),
    },
    {
      id: DEMO_RESOURCE_IDS.connectivity,
      name: "Signal Connectivity Stipend",
      provider: "Signal Connectivity Fund",
      kind: "grant",
      description:
        "A one-off stipend toward internet access and devices for study. Need-based.",
      categories: ["technology"],
      eligibility: {
        summary: "Students in any country. Need-based.",
        needBased: true,
      },
      value: { kind: "fixed", amount: 80, currency: "USD" },
      deadline: addDays(today, 45),
      verification: "verified",
      sourceName: "Signal Connectivity Fund",
      sourceUrl: src("connectivity-stipend"),
    },
    {
      id: DEMO_RESOURCE_IDS.textbooks,
      name: "OpenShelf Open Textbooks",
      provider: "OpenShelf Learning Commons",
      kind: "free_alternative",
      description:
        "Openly licensed textbooks and course readings you can use instead of buying books.",
      categories: ["learning_materials"],
      eligibility: { summary: "Free for everyone." },
      value: { kind: "full" },
      verification: "verified",
      sourceName: "OpenShelf Learning Commons",
      sourceUrl: src("openshelf-textbooks"),
    },
    {
      id: DEMO_RESOURCE_IDS.practiceExams,
      name: "OpenShelf Practice Exam Bank",
      provider: "OpenShelf Learning Commons",
      kind: "free_alternative",
      description:
        "Free community-written practice questions in place of a paid practice bundle.",
      categories: ["learning_materials"],
      eligibility: {
        summary: "Free for everyone preparing for an exam or course.",
        opportunityTypes: ["exam", "course"],
      },
      value: { kind: "full" },
      verification: "verified",
      sourceName: "OpenShelf Learning Commons",
      sourceUrl: src("openshelf-practice-exams"),
    },
    {
      id: DEMO_RESOURCE_IDS.transport,
      name: "Harbourline Student Travel Grant",
      provider: "Harbourline Mobility Fund",
      kind: "grant",
      description:
        "Helps with travel to classes, interviews, and exam centres within Europe.",
      categories: ["transportation"],
      eligibility: {
        summary: "Residents of Europe. Need-based.",
        countries: EUROPE,
        needBased: true,
      },
      value: { kind: "fixed", amount: 150, currency: "EUR" },
      deadline: addDays(today, 35),
      verification: "verified",
      sourceName: "Harbourline Mobility Fund",
      sourceUrl: src("harbourline-travel-grant"),
    },
    {
      id: DEMO_RESOURCE_IDS.intlTravel,
      name: "Harbourline International Travel Award",
      provider: "Harbourline Mobility Fund",
      kind: "grant",
      description: "A travel award for students going abroad for study.",
      categories: ["transportation"],
      eligibility: { summary: "Students in any country travelling abroad to study." },
      value: { kind: "fixed", amount: 100, currency: "USD" },
      deadline: addDays(today, 70),
      verification: "pending",
      sourceName: "Harbourline Mobility Fund",
      sourceUrl: src("harbourline-international-travel"),
    },
    {
      id: DEMO_RESOURCE_IDS.housing,
      name: "Lantern Housing Bursary",
      provider: "Lantern Student Housing Trust",
      kind: "grant",
      description: "A bursary toward short-term accommodation during study.",
      categories: ["housing"],
      eligibility: {
        summary: "Enrolled undergraduate or graduate students in Europe.",
        countries: EUROPE,
        educationLevels: ["undergraduate", "graduate"],
        enrolledOnly: true,
      },
      value: { kind: "fixed", amount: 300, currency: "EUR" },
      deadline: addDays(today, 28),
      verification: "verified",
      sourceName: "Lantern Student Housing Trust",
      sourceUrl: src("lantern-housing-bursary"),
    },
    {
      id: DEMO_RESOURCE_IDS.supplies,
      name: "Northlight Study Supplies Support",
      provider: "Northlight Education Fund",
      kind: "other",
      description: "A small payment toward books, stationery, and study supplies.",
      categories: ["learning_materials"],
      eligibility: { summary: "Open to students in any country." },
      value: { kind: "fixed", amount: 50, currency: "USD" },
      deadline: addDays(today, 20),
      verification: "verified",
      sourceName: "Northlight Education Fund",
      sourceUrl: src("northlight-supplies"),
    },
  ];
}
