// This file provides a utility function to filter a list of properties
// based on a selected filter and search value.

import { PROPERTY_FILTER_MAP } from "./filterMap";

// Filters the properties array based on the selected filter and search value
export function filterProperties(
  properties: any[],
  selectedFilter: string,
  searchValue: string
): any[] {
  // Get the filter function for the selected filter
  const filterFn = PROPERTY_FILTER_MAP[selectedFilter] || (() => "");
  // If search value is empty, return all properties
  if (!searchValue.trim()) return properties;
  // Convert search value to lowercase for case-insensitive comparison
  const searchLower = searchValue.trim().toLowerCase();
  // Filter properties where the filter value includes the search value
  return properties.filter(property => {
    const val = filterFn(property)?.toString().toLowerCase();
    return val.includes(searchLower);
  });
}