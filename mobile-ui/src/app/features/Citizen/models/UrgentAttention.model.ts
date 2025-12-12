
// Status of an urgent attention item
export type UrgentAttentionStatus = "success" | "pending" | "failed";

// Type of urgent attention required
export type UrgentAttentionType = "casual" | "immediate";

// Represents an item requiring urgent attention on the citizen dashboard
export interface UrgentAttention {
  id: number; // Unique identifier for the urgent attention item
  type: UrgentAttentionType; // Type of attention required (casual or immediate)
  message: string; // Message or description of the issue
  date: string; // ISO date string for when the attention is required
  status: UrgentAttentionStatus; // Status of the attention item (success, pending, failed)
}