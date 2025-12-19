
// React hook for debouncing a value. Useful for delaying updates (e.g., search input) until user stops typing.
import { useState, useEffect } from "react";


/**
 * Custom React hook that returns a debounced version of a value.
 * The value will only update after the specified delay has passed without changes.
 *
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds before updating the debounced value
 * @returns The debounced value
 */
export function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value); // State to hold the debounced value

  useEffect(() => {
    // Set a timeout to update the debounced value after the delay
    const handler = setTimeout(() => setDebounced(value), delay);
    // Clear the timeout if value or delay changes before the timeout completes
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounced; // Return the debounced value
}