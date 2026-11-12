import type { ID, ISODateString } from "./common";

export const USER_ROLES = ["student", "organization", "admin"] as const;
export type UserRole = (typeof USER_ROLES)[number];

/** Roles a person may choose for themselves at registration. */
export const SELF_SERVICE_ROLES = ["student", "organization"] as const;
export type SelfServiceRole = (typeof SELF_SERVICE_ROLES)[number];

export interface UserProfile {
  id: ID;
  role: UserRole;
  fullName: string;
  email: string;
  createdAt: ISODateString;
}
