// This file provides a custom React hook for debouncing a value
// Useful for delaying updates (e.g., search input) until the user stops typing.

import { useState, useEffect } from "react";

// Custom hook that returns a debounced version of the input value
export function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    // Set a timeout to update the debounced value after the specified delay
    const handler = setTimeout(() => setDebounced(value), delay);
    // Clear the timeout if value or delay changes, or on unmount
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}