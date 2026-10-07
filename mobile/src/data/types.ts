export type Town = { id: string; name: string; lat: number; lng: number };

export type Level = 'fàcil' | 'mitjana' | 'exigent';

export type Route = {
  id: string;
  name: string;
  town: string;
  kind: 'running' | 'trail';
  level: Level;
  km: number;
  elev: number;
  description: string;
  tags?: string[];
  points: [number, number][];
};

export type ChallengeType = 'setmanal' | 'mensual' | 'temporal' | 'permanent';

export type Metric = 'km' | 'desnivell' | 'sortides' | 'km_mascota' | 'ruta' | 'rutes_diferents';

export type Sponsor = { name: string; prize: string; reward: 'tothom' | 'sorteig' };

export type Challenge = {
  id: string;
  emoji: string;
  title: string;
  type: ChallengeType;
  metric: Metric;
  goal: number;
  town: string | null; // null = tot el Penedès
  description: string;
  routeIds?: string[];
  start?: string; // només per a 'temporal' (YYYY-MM-DD)
  end?: string;
  sponsor?: Sponsor;
};

export type Activity = {
  id: string;
  date: string; // YYYY-MM-DD
  km: number;
  elev: number;
  pet: boolean;
  routeId: string | null;
};

export type User = { name: string; town: string; pet: boolean };
