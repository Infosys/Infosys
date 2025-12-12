// This file defines constants used for filtering and mapping filter options
// in the property search feature.

// List of available filter options for property search
export const FILTER_OPTIONS: string[] = [
  "Property No.",
  "Agent name",
  "Zone",
  "Ward",
];

// Default filter option
export const DEFAULT_FILTER = "Property No.";

// Maps filter option labels to their corresponding API parameter names
export const FILTER_PARAM_MAP: Record<string, string> = {
  "Property No.": "propertyNo",
  "Agent name": "assignedAgent",
  "Ward": "wardNo",
  "Zone": "zoneNo",
};