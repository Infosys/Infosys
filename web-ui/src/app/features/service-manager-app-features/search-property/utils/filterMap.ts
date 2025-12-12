// This file defines a mapping from filter option labels to functions
// that extract the corresponding value from a property object.

// Maps filter option labels to functions that extract the relevant property field
export const PROPERTY_FILTER_MAP: Record<string, (property: any) => string> = {
  "Property No.": property => property.Property.PropertyNo ?? "",
  "Agent name": property => property.AgentName ?? "",
  "Zone": property => property.Property.Address?.ZoneNo ?? "",
  "Ward": property => property.Property.Address?.WardNo ?? "",
};