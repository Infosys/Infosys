import type { UrgentAttention } from "../models/UrgentAttention.model";
import type { Property } from "../models/Property.model";

// Represents the main data structure for the citizen home/dashboard view
export interface CitizenHomeData {
  activeLicenses: number; // Number of active licenses for the citizen
  numberOfProperties: number; // Total number of properties owned
  properties: Property[]; // List of property objects
  urgentAttention: UrgentAttention[]; // List of items requiring urgent attention
}