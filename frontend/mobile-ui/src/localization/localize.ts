// localize.ts
// Utilities for transforming and handling localization data, including flattening nested localization structures and API calls.
// Types for Nested Input and Flat Output
// Type for deeply nested localization input structure
export type NestedLocalization = Record<
  string, // type-of-user
  Record<
    string, // lang-code
    Array<
      Record<string, Array<{ key: string; value: string }>>
    >
  >
>;

// Type for flat localization output structure
export interface FlatLocalization {
  code: string;
  message: string;
  module: string;
  locale: string;
}

// 1. Flatten function: converts nested localization data to a flat array
export function flattenLocalization(input: NestedLocalization): FlatLocalization[] {
  const result: FlatLocalization[] = [];
  for (const typeOfUser in input) {
    const langObj = input[typeOfUser];
    for (const langCode in langObj) {
      const modules = langObj[langCode];
      modules.forEach((moduleItem) => {
        for (const moduleName in moduleItem) {
          moduleItem[moduleName].forEach(({ key, value }) => {
            result.push({
              code: key,
              message: value,
              module: `${typeOfUser}.${moduleName}`,
              locale: langCode,
            });
          });
        }
      });
    }
  }
  return result;
}

// 2. API calls for posting and fetching localization data (adapt URL & fetch config as needed)
// Post nested localization data to the server
export async function postLocalizationData(input: NestedLocalization, apiUrl: string) {
  const res = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(`POST failed: ${res.status}`);
  return await res.json();
}

// Get and transform to flat array
// Fetch nested localization data from the server and flatten it
export async function getFlatLocalization(apiUrl: string): Promise<FlatLocalization[]> {
  const res = await fetch(apiUrl);
  if (!res.ok) throw new Error(`GET failed: ${res.status}`);
  const nested: NestedLocalization = await res.json();
  return flattenLocalization(nested);
}

/* ---- USAGE EXAMPLE ----
// Example usage of flattenLocalization, postLocalizationData, and getFlatLocalization
import { flattenLocalization, postLocalizationData, getFlatLocalization } from "./localizationApi";

// Replace with your actual API endpoints
const POST_URL = "https://your-server.com/localization";
const GET_URL = "https://your-server.com/localization";

// 1. Post the nested JSON you have
await postLocalizationData(inputJson, POST_URL);

// 2. Get and use flattened data in the app
const flatData = await getFlatLocalization(GET_URL);
console.log(flatData); // [{code, message, module, locale}, ...]
------------------------ */