// React hook for login page localization (loads and caches messages)
import { useEffect, useState } from "react";
import { fetchLocalization, type LocalizationMap } from "./LocalizeLogin";

const MAP_STORAGE_KEY = "loginLocalizationMap";
const LOCALE_STORAGE_KEY = "loginLocale";

export const useLoginLocalization = (locale: string) => {
    const [messages, setMessages] = useState<{ [code: string]: string }>({});
    const mapStr = sessionStorage.getItem(MAP_STORAGE_KEY);
    let map: LocalizationMap | null = mapStr ? JSON.parse(mapStr) : null;

    // Load messages for the given locale from session or fetch if missing
    const loadMessages = async () => {
        if (!map || !map["login-page"] || !map["login-page"][locale]) {
            // Fetch and store
            map = await fetchLocalization();
            sessionStorage.setItem(MAP_STORAGE_KEY, JSON.stringify(map));
        }
        if (map["login-page"] && map["login-page"][locale]) {
            setMessages(map["login-page"][locale]);
        }
    };

    useEffect(() => {
        loadMessages();
        localStorage.setItem(LOCALE_STORAGE_KEY, locale); // Persist selected locale
    }, [locale]);

    // Helper to get localized string by code
    const t = (code: string, fallback?: string) => messages[code] || fallback || code;

    return { t, messages };
};