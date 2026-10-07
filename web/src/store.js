import { useEffect, useState } from 'react'
import { CHALLENGES } from './data/challenges'
import { todayISO } from './logic'

// De moment tot es guarda al navegador (localStorage).
// Quan hi hagi backend (p. ex. Supabase), només caldrà canviar aquest fitxer.
const KEY = 'surt:v1'
const EMPTY = { user: null, joined: {}, activities: [], custom: [], cheers: {} }

function load() {
  try {
    return { ...EMPTY, ...JSON.parse(localStorage.getItem(KEY)) }
  } catch {
    return EMPTY
  }
}

export function useStore() {
  const [s, setS] = useState(load)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(s))
    } catch {
      // navegador en mode privat o sense espai: seguim sense guardar
    }
  }, [s])

  return {
    ...s,
    allChallenges: [...s.custom, ...CHALLENGES],
    setUser: (user) => setS((p) => ({ ...p, user })),
    join: (id) => setS((p) => ({ ...p, joined: { ...p.joined, [id]: todayISO() } })),
    leave: (id) =>
      setS((p) => {
        const joined = { ...p.joined }
        delete joined[id]
        return { ...p, joined }
      }),
    addActivity: (a) =>
      setS((p) => ({ ...p, activities: [{ ...a, id: String(Date.now()) }, ...p.activities] })),
    removeActivity: (id) => setS((p) => ({ ...p, activities: p.activities.filter((a) => a.id !== id) })),
    addChallenge: (c) => setS((p) => ({ ...p, custom: [c, ...p.custom] })),
    cheer: (key) => setS((p) => ({ ...p, cheers: { ...p.cheers, [key]: true } })),
    reset: () => setS(EMPTY),
  }
}
