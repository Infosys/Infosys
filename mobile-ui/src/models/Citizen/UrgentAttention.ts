// UrgentAttention.ts
// Types and interfaces for representing urgent attention items for Citizen features.
export type UrgentAttentionStatus = "success" | "pending" | "failed";
// Type for urgency level of attention item
export type UrgentAttentionType = "casual" | "immediate";

// Interface for urgent attention item (notification or alert)
export interface UrgentAttention {
  id: number;
  type: UrgentAttentionType;
  message: string;
  date: string; // ISO date string
  status: UrgentAttentionStatus;
}