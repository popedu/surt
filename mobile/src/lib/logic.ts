import { TOWNS, townById } from '@/data/places';
import type { Activity, Challenge, ChallengeType, Metric } from '@/data/types';

const DAY = 86400000;

export function toISO(d: Date) {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export const todayISO = () => toISO(new Date());

export function daysAgoISO(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return toISO(d);
}

// 'YYYY-MM-DD' -> Date local a les 00:00
export function fromISO(s: string) {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

// Interval [start, end) en què compten les sortides d'un repte
export function periodOf(ch: Pick<Challenge, 'type' | 'start' | 'end'>, joinedAt?: string, now = new Date()) {
  const y = now.getFullYear();
  const m = now.getMonth();
  switch (ch.type) {
    case 'setmanal': {
      const offset = (now.getDay() + 6) % 7; // dilluns = 0
      const start = new Date(y, m, now.getDate() - offset);
      return { start, end: new Date(start.getTime() + 7 * DAY) as Date | null };
    }
    case 'mensual':
      return { start: new Date(y, m, 1), end: new Date(y, m + 1, 1) as Date | null };
    case 'temporal':
      return { start: fromISO(ch.start!), end: new Date(fromISO(ch.end!).getTime() + DAY) as Date | null };
    default: // permanent: compta des que t'hi apuntes
      return { start: joinedAt ? fromISO(joinedAt) : new Date(0), end: null as Date | null };
  }
}

export function timeLeftLabel(ch: Challenge, now = new Date()) {
  if (ch.type === 'permanent') return 'Sense data límit';
  const { start, end } = periodOf(ch, undefined, now);
  if (now < start) return `Comença d'aquí ${Math.ceil((start.getTime() - now.getTime()) / DAY)} dies`;
  const days = Math.ceil((end!.getTime() - now.getTime()) / DAY);
  if (days <= 1) return 'Acaba avui';
  return `Queden ${days} dies`;
}

export const TYPE_LABEL: Record<ChallengeType, string> = {
  setmanal: 'Setmanal',
  mensual: 'Mensual',
  temporal: 'De temporada',
  permanent: 'Permanent',
};

export const METRIC_UNIT: Record<Metric, string> = {
  km: 'km',
  desnivell: 'm+',
  sortides: 'sortides',
  km_mascota: 'km amb mascota',
  ruta: 'vegades',
  rutes_diferents: 'rutes',
};

const round = (n: number) => Math.round(n * 10) / 10;
const sum = <T,>(arr: T[], f: (x: T) => number) => arr.reduce((t, x) => t + (Number(f(x)) || 0), 0);

export function fmt(n: number) {
  return round(n).toLocaleString('ca-ES', { maximumFractionDigits: 1 });
}

export const pct = (value: number, goal: number) => Math.min(100, Math.round((value / goal) * 100));

export function progressOf(ch: Challenge, activities: Activity[], joinedAt?: string) {
  const { start, end } = periodOf(ch, joinedAt);
  const acts = activities.filter((a) => {
    const d = fromISO(a.date);
    return d >= start && (!end || d < end);
  });
  const onRoute = (a: Activity) => Boolean(a.routeId && ch.routeIds?.includes(a.routeId));
  switch (ch.metric) {
    case 'km': return round(sum(acts, (a) => a.km));
    case 'desnivell': return sum(acts, (a) => a.elev);
    case 'sortides': return acts.length;
    case 'km_mascota': return round(sum(acts.filter((a) => a.pet), (a) => a.km));
    case 'ruta': return acts.filter(onRoute).length;
    case 'rutes_diferents': return new Set(acts.filter(onRoute).map((a) => a.routeId)).size;
  }
}

// --- Participants de mostra (fins que hi hagi backend) ---------------------

const NAMES = ['Laia', 'Marc', 'Núria', 'Pol', 'Clara', 'Jordi', 'Anna', 'Oriol', 'Marta', 'Arnau',
  'Júlia', 'Pere', 'Mireia', 'Xavi', 'Berta', 'Roger', 'Ona', 'Gerard', 'Carla', 'Joan'];

function seeded(str: string) {
  let h = 2166136261;
  for (const c of str) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

export type Participant = { name: string; value: number; me?: boolean };

export function fakeParticipants(ch: Challenge): Participant[] {
  const rnd = seeded(ch.id);
  const count = 5 + Math.floor(rnd() * 10);
  const used = new Set<string>();
  const people: Participant[] = [];
  while (people.length < count) {
    const name = `${NAMES[Math.floor(rnd() * NAMES.length)]} ${'ABCDEFGHIJLMNOPRSTV'[Math.floor(rnd() * 19)]}.`;
    if (used.has(name)) continue;
    used.add(name);
    let value = ch.goal * (0.1 + rnd());
    value = ch.metric === 'km' || ch.metric === 'km_mascota' ? round(value) : Math.round(value);
    people.push({ name, value: Math.min(value, ch.goal) });
  }
  return people;
}

// --- Distàncies -------------------------------------------------------------

type LatLng = { lat: number; lng: number };

export function distanceKm(a: LatLng, b: LatLng) {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}

export function nearestTown(p: LatLng) {
  return TOWNS.reduce((best, t) => (distanceKm(p, t) < distanceKm(p, best) ? t : best));
}

// Primer els del teu poble, després els de tota la comarca, després la resta per proximitat
export function sortByCloseness(challenges: Challenge[], userTownId: string) {
  const home = townById(userTownId);
  const score = (ch: Challenge) => {
    if (ch.town === userTownId) return -1;
    if (!ch.town) return 0;
    const t = townById(ch.town);
    return home && t ? 1 + distanceKm(home, t) : 999;
  };
  return [...challenges].sort((a, b) => score(a) - score(b));
}
