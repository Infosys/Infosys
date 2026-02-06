// Utility functions for fetching and organizing localization messages by role and module
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

// API base URL and supported locales
const BASE_URL = env.LOCALIZATION_HOST + '/localization/v1/messages';
const LOCALES = ['en', 'hi', 'kn'];
const HEADERS = {
    'Content-Type': 'application/json',
    'X-Tenant-ID': 'pg'
};

// Modules to fetch for each user role
const MODULES_BY_ROLE: Record<"CITIZEN"|"AGENT", string[]> = {
    CITIZEN: [
        'citizen.commons', 
        'citizen.my-properties', 
        'citizen.home',
        'under-construction',
        'profile',
        'citizen.no-property'
    ],
    AGENT: [
        'common',
        'under-construction',
        'profile',
        'under-construction',
    ]
};

// Fetch all messages for a given module and locale
export async function fetchModuleMessages(module: string, locale: string): Promise<LocalizationMessage[]> {
    const url = `${BASE_URL}?module=${encodeURIComponent(module)}&locale=${encodeURIComponent(locale)}&limit=10000`;
    try {
        const response = await axios.get(url, { headers: HEADERS });
        return response.data?.messages ?? [];
    } catch (e) {
        console.error(`Error fetching ${module} (${locale})`, e);
        return [];
    }
}

// Fetch all localization messages for all modules/locales for a given role
export async function fetchLocalizationForRole(role: "CITIZEN" | "AGENT"): Promise<LocalizationMap> {
    const normalizedRole = role.toUpperCase() as "CITIZEN"|"AGENT";
    const modules = MODULES_BY_ROLE[normalizedRole] ?? [];
    const map: LocalizationMap = {};

    await Promise.all(
        modules.map(module =>
            Promise.all(
                LOCALES.map(async locale => {
                    const list = await fetchModuleMessages(module, locale);
                    if (!map[module]) map[module] = {};
                    if (!map[module][locale]) map[module][locale] = {};
                    list.forEach(msg => {
                        map[module][locale][msg.code] = msg.message;
                    });
                })
            )
        )
    );

    return map;
}

export { MODULES_BY_ROLE, LOCALES };
