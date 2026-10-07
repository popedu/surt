import { townById } from './data/places'

const DAY = 86400000

export const todayISO = () => toISO(new Date())

export function toISO(d) {
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

// 'YYYY-MM-DD' -> Date local a les 00:00
export function fromISO(s) {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}

// Interval [start, end) en què compten les sortides d'un repte
export function periodOf(ch, joinedAt, now = new Date()) {
  const y = now.getFullYear()
  const m = now.getMonth()
  switch (ch.type) {
    case 'setmanal': {
      const offset = (now.getDay() + 6) % 7 // dilluns = 0
      const start = new Date(y, m, now.getDate() - offset)
      return { start, end: new Date(start.getTime() + 7 * DAY) }
    }
    case 'mensual':
      return { start: new Date(y, m, 1), end: new Date(y, m + 1, 1) }
    case 'temporal':
      return { start: fromISO(ch.start), end: new Date(fromISO(ch.end).getTime() + DAY) }
    default: // permanent: compta des que t'hi apuntes
      return { start: joinedAt ? fromISO(joinedAt) : new Date(0), end: null }
  }
}

export function timeLeftLabel(ch, now = new Date()) {
  if (ch.type === 'permanent') return 'Sense data límit'
  const { start, end } = periodOf(ch, null, now)
  if (now < start) return `Comença d'aquí ${Math.ceil((start - now) / DAY)} dies`
  const days = Math.ceil((end - now) / DAY)
  if (days <= 1) return 'Acaba avui'
  return `Queden ${days} dies`
}

export const TYPE_LABEL = {
  setmanal: 'Setmanal',
  mensual: 'Mensual',
  temporal: 'De temporada',
  permanent: 'Permanent',
}

export const METRIC_UNIT = {
  km: 'km',
  desnivell: 'm+',
  sortides: 'sortides',
  km_mascota: 'km amb mascota',
  ruta: 'vegades',
  rutes_diferents: 'rutes',
}

export function fmt(n) {
  return Number.isInteger(n) ? n.toLocaleString('ca') : n.toLocaleString('ca', { maximumFractionDigits: 1 })
}

export function progressOf(ch, activities, joinedAt) {
  const { start, end } = periodOf(ch, joinedAt)
  const acts = activities.filter((a) => {
    const d = fromISO(a.date)
    return d >= start && (!end || d < end)
  })
  const onRoute = (a) => a.routeId && ch.routeIds?.includes(a.routeId)
  switch (ch.metric) {
    case 'km': return round(sum(acts, (a) => a.km))
    case 'desnivell': return sum(acts, (a) => a.elev)
    case 'sortides': return acts.length
    case 'km_mascota': return round(sum(acts.filter((a) => a.pet), (a) => a.km))
    case 'ruta': return acts.filter(onRoute).length
    case 'rutes_diferents': return new Set(acts.filter(onRoute).map((a) => a.routeId)).size
    default: return 0
  }
}

const sum = (arr, f) => arr.reduce((t, x) => t + (Number(f(x)) || 0), 0)
const round = (n) => Math.round(n * 10) / 10

export const pct = (value, goal) => Math.min(100, Math.round((value / goal) * 100))

// --- Participants de mostra (fins que hi hagi backend) ---------------------

const NAMES = ['Laia', 'Marc', 'Núria', 'Pol', 'Clara', 'Jordi', 'Anna', 'Oriol', 'Marta', 'Arnau',
  'Júlia', 'Pere', 'Mireia', 'Xavi', 'Berta', 'Roger', 'Ona', 'Gerard', 'Carla', 'Joan']

function seeded(str) {
  let h = 2166136261
  for (const c of str) h = Math.imul(h ^ c.charCodeAt(0), 16777619)
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    return ((h ^= h >>> 16) >>> 0) / 4294967296
  }
}

export function fakeParticipants(ch) {
  const rnd = seeded(ch.id)
  const count = 5 + Math.floor(rnd() * 10)
  const used = new Set()
  const people = []
  while (people.length < count) {
    const name = NAMES[Math.floor(rnd() * NAMES.length)]
    const initial = 'ABCDEFGHIJLMNOPRSTV'[Math.floor(rnd() * 19)]
    const full = `${name} ${initial}.`
    if (used.has(full)) continue
    used.add(full)
    let value = ch.goal * (0.1 + rnd() * 1.0)
    value = ['km', 'km_mascota'].includes(ch.metric) ? round(value) : Math.round(value)
    people.push({ name: full, value: Math.min(value, ch.goal) })
  }
  return people
}

// --- Distàncies -------------------------------------------------------------

export function distanceKm(a, b) {
  const R = 6371
  const toRad = (x) => (x * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

// Primer els del teu poble, després els de tota la comarca, després la resta per proximitat
export function sortByCloseness(challenges, userTownId) {
  const home = townById(userTownId)
  const score = (ch) => {
    if (ch.town === userTownId) return -1
    if (!ch.town) return 0
    const t = townById(ch.town)
    return home && t ? 1 + distanceKm(home, t) : 999
  }
  return [...challenges].sort((a, b) => score(a) - score(b))
}
