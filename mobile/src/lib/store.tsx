import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import { CHALLENGES } from '@/data/challenges';
import type { Activity, Challenge, User } from '@/data/types';
import { todayISO } from './logic';

// De moment tot es guarda al mòbil (AsyncStorage).
// Quan hi hagi backend (Supabase), només caldrà canviar aquest fitxer.
const KEY = 'surt:v1';

type State = {
  user: User | null;
  joined: Record<string, string>; // id repte -> data d'inscripció
  activities: Activity[];
  custom: Challenge[];
  cheers: Record<string, true>;
};

const EMPTY: State = { user: null, joined: {}, activities: [], custom: [], cheers: {} };

function useStoreState() {
  const [s, setS] = useState<State>(EMPTY);
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((raw) => raw && setS({ ...EMPTY, ...JSON.parse(raw) }))
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  useEffect(() => {
    if (ready) AsyncStorage.setItem(KEY, JSON.stringify(s)).catch(() => {});
  }, [s, ready]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  return {
    ...s,
    ready,
    toast,
    showToast: setToast,
    allChallenges: [...s.custom, ...CHALLENGES],
    setUser: (user: User) => setS((p) => ({ ...p, user })),
    join: (id: string) => setS((p) => ({ ...p, joined: { ...p.joined, [id]: todayISO() } })),
    leave: (id: string) =>
      setS((p) => {
        const joined = { ...p.joined };
        delete joined[id];
        return { ...p, joined };
      }),
    addActivity: (a: Omit<Activity, 'id'>) =>
      setS((p) => ({ ...p, activities: [{ ...a, id: String(Date.now()) }, ...p.activities] })),
    removeActivity: (id: string) => setS((p) => ({ ...p, activities: p.activities.filter((a) => a.id !== id) })),
    addChallenge: (c: Challenge) => setS((p) => ({ ...p, custom: [c, ...p.custom] })),
    cheer: (key: string) => setS((p) => ({ ...p, cheers: { ...p.cheers, [key]: true } })),
    reset: () => setS(EMPTY),
  };
}

export type Store = ReturnType<typeof useStoreState>;

const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const store = useStoreState();
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const store = useContext(StoreContext);
  if (!store) throw new Error('useStore fora de StoreProvider');
  return store;
}
