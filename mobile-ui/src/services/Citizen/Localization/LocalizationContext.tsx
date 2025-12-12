// React context for localization messages (per role)
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { fetchLocalizationForRole, type LocalizationMap } from './Localize';

// Type for localization context value
type LocalizationContextType = {
  messages: LocalizationMap;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

// Context to provide localization state and actions
const LocalizationContext = createContext<LocalizationContextType>({
  messages: {},
  loading: true,
  error: null,
  refresh: async () => {},
});

type Props = { children: ReactNode; role: 'CITIZEN' | 'AGENT' };

// Helpers for sessionStorage (persist localization per role)
const getSessionKey = (role: 'CITIZEN' | 'AGENT') => `localization_${role}`;

// Save messages to sessionStorage
function saveMessagesToSession(role: 'CITIZEN' | 'AGENT', messages: LocalizationMap) {
  sessionStorage.setItem(getSessionKey(role), JSON.stringify(messages));
}

// Retrieve messages from sessionStorage
export function getMessagesFromSession(
  role: 'CITIZEN' | 'AGENT'
): LocalizationMap | null {
  const raw = sessionStorage.getItem(getSessionKey(role));
  return raw ? JSON.parse(raw) : null;
}

// Provider to load and supply localization messages for a given role
export const LocalizationProvider: React.FC<Props> = ({ children, role }) => {
  const [messages, setMessages] = useState<LocalizationMap>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load from sessionStorage first; if not present, fetch from API
  const loadMessages = async () => {
    setLoading(true);
    setError(null);
    try {
      let map = getMessagesFromSession(role);
      if (!map) {
        map = await fetchLocalizationForRole(role);
        setMessages(map);
        saveMessagesToSession(role, map);
      }
    } catch (e: any) {
      setError(e?.message || 'Localization load failure');
      setMessages({});
    } finally {
      setLoading(false);
    }
  };

  // Refetch from API and update sessionStorage (for manual refresh)
  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const map = await fetchLocalizationForRole(role);
      setMessages(map);
      saveMessagesToSession(role, map);
    } catch (e: any) {
      setError(e?.message || 'Localization refresh failure');
      setMessages({});
    } finally {
      setLoading(false);
    }
  };

  // On role change, load messages using async function
  useEffect(() => {
    if (!role) {
      setMessages({});
      setLoading(false);
      return;
    }
    loadMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  return (
    <LocalizationContext.Provider value={{ messages, loading, error, refresh }}>
      {children}
    </LocalizationContext.Provider>
  );
};

// Hook to access localization context in components
export function useLocalization() {
  return useContext(LocalizationContext);
}