import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AddButton from '@/components/AddButton';
import ChallengeCard from '@/components/ChallengeCard';
import RouteMap from '@/components/RouteMap';
import { Chip, text } from '@/components/ui';
import { C, R, S, TAB_BAR } from '@/constants/theme';
import { townById } from '@/data/places';
import { LEVEL_COLOR, ROUTES } from '@/data/routes';
import type { Challenge, Route } from '@/data/types';
import { progressOf, sortByCloseness } from '@/lib/logic';
import { useStore } from '@/lib/store';

const FILTERS = [
  { id: 'tots', label: 'Tots' },
  { id: 'setmanal', label: 'Setmanals' },
  { id: 'mensual', label: 'Mensuals' },
  { id: 'llargs', label: 'Llargs' },
  { id: 'premi', label: '🎁 Amb premi' },
] as const;

type Filter = (typeof FILTERS)[number]['id'];

function matches(ch: Challenge, filter: Filter) {
  if (filter === 'tots') return true;
  if (filter === 'premi') return Boolean(ch.sponsor);
  if (filter === 'llargs') return ch.type === 'permanent' || ch.type === 'temporal';
  return ch.type === filter;
}

export default function Explore() {
  const store = useStore();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<Filter>('tots');
  const [route, setRoute] = useState<Route | null>(null);
  const user = store.user!;
  const home = townById(user.town);

  let list = sortByCloseness(store.allChallenges, user.town).filter((ch) => matches(ch, filter));
  if (route) list = list.filter((ch) => ch.routeIds?.includes(route.id));

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + S.md, paddingBottom: insets.bottom + TAB_BAR + 100 }}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={text.h1}>Hola, {user.name} 👋</Text>
            <Text style={text.muted}>Què et ve de gust avui?</Text>
          </View>
          <Text style={styles.place} numberOfLines={1}>📍 {home?.name}</Text>
        </View>

        <View style={styles.pad}>
          <RouteMap routes={ROUTES} home={home} height={300} selectedId={route?.id} onSelectRoute={setRoute} />
        </View>

        {route ? (
          <View style={[styles.pad, styles.routeCard]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.routeName}>{route.name}</Text>
              <Text style={text.small}>
                {route.km} km · {route.elev} m+ · <Text style={{ color: LEVEL_COLOR[route.level] }}>{route.level}</Text>
              </Text>
              <Text style={[text.small, { marginTop: 4 }]}>{route.description}</Text>
            </View>
            <Pressable onPress={() => setRoute(null)} hitSlop={12}>
              <Text style={{ fontSize: 18, color: C.muted }}>✕</Text>
            </Pressable>
          </View>
        ) : (
          <View style={[styles.pad, styles.legend]}>
            {(['fàcil', 'mitjana', 'exigent'] as const).map((l) => (
              <View key={l} style={styles.legendItem}>
                <View style={[styles.legendLine, { backgroundColor: LEVEL_COLOR[l] }]} />
                <Text style={text.small}>{l[0].toUpperCase() + l.slice(1)}</Text>
              </View>
            ))}
            <Text style={text.small}>· Toca una ruta</Text>
          </View>
        )}

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {FILTERS.map((f) => (
            <Chip key={f.id} label={f.label} on={filter === f.id} onPress={() => setFilter(f.id)} />
          ))}
        </ScrollView>

        <View style={[styles.pad, { gap: S.md }]}>
          {route && <Text style={text.muted}>Reptes de la ruta {route.name}</Text>}
          {list.map((ch) => (
            <ChallengeCard key={ch.id} ch={ch}
              progress={store.joined[ch.id] ? progressOf(ch, store.activities, store.joined[ch.id]) : undefined} />
          ))}
          {list.length === 0 && (
            <Text style={[text.muted, { textAlign: 'center', marginTop: S.lg }]}>
              {route ? 'Encara no hi ha reptes en aquesta ruta.' : 'No hi ha reptes amb aquest filtre.'}
            </Text>
          )}
        </View>
      </ScrollView>
      <AddButton />
    </View>
  );
}

const styles = StyleSheet.create({
  pad: { paddingHorizontal: S.lg },
  header: { flexDirection: 'row', alignItems: 'center', gap: S.md, paddingHorizontal: S.lg, marginBottom: S.lg },
  place: {
    maxWidth: '45%', backgroundColor: C.card, borderWidth: 1, borderColor: C.line, borderRadius: R.pill,
    paddingVertical: 6, paddingHorizontal: 12, fontSize: 13, color: C.ink, overflow: 'hidden',
  },
  legend: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 12, marginTop: S.sm },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendLine: { width: 14, height: 4, borderRadius: 2 },
  routeCard: {
    flexDirection: 'row', gap: S.md, marginHorizontal: S.lg, marginTop: S.sm, paddingVertical: S.md,
    backgroundColor: C.card, borderRadius: R.card, borderWidth: 1, borderColor: C.line,
  },
  routeName: { fontSize: 17, fontWeight: '700', color: C.ink },
  chips: { gap: S.sm, paddingHorizontal: S.lg, paddingVertical: S.lg },
});
