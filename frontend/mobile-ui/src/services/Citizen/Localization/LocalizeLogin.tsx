// Utility functions for fetching login page localization messages
import axios from 'axios';
import env from '../../../config/env';

// Single localization message structure
export type LocalizationMessage = {
  code: string;
  message: string;
  module: string;
  locale: string;
};

// Nested map: module -> locale -> code -> message
export type LocalizationMap = {
  [module: string]: {
    [locale: string]: {
      [code: string]: string;
    };
  };
};

// API base URL, supported locales, and headers
const BASE_URL = `${env.LOCALIZATION_HOST}/localization/v1/messages`;
const LOCALES = ['en', 'hi', 'kn'];
const HEADERS = {
  'Content-Type': 'application/json',
  'X-Tenant-ID': 'pg',
};

// Fetch all login-page messages for a given locale
export async function fetchModuleMessages(
  locale: string
): Promise<LocalizationMessage[]> {
  // login-page is the module
  const url = `${BASE_URL}?module=login-page&locale=${encodeURIComponent(
    locale
  )}&limit=100`;
  try {
    const response = await axios.get(url, { headers: HEADERS });
    return response.data?.messages ?? [];
  } catch (e) {
    console.error(`Error fetching login-page (${locale})`, e);
    return [];
  }
}

// Fetch all login-page localization messages for all locales
export async function fetchLocalization(): Promise<LocalizationMap> {
  const map: LocalizationMap = {};
  const module = 'login-page';

  await Promise.all(
    LOCALES.map(async (locale) => {
      const list = await fetchModuleMessages(locale);
      if (!map[module]) map[module] = {};
      if (!map[module][locale]) map[module][locale] = {};
      list.forEach((msg) => {
        map[module][locale][msg.code] = msg.message;
      });
    })
  );

  return map;
}
