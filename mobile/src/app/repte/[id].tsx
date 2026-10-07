import { Stack, router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import RouteMap from '@/components/RouteMap';
import { Button, Card, ProgressBar, text } from '@/components/ui';
import { C, S } from '@/constants/theme';
import { townById } from '@/data/places';
import { routeById } from '@/data/routes';
import type { Route } from '@/data/types';
import { METRIC_UNIT, TYPE_LABEL, fakeParticipants, fmt, pct, progressOf, timeLeftLabel, type Participant } from '@/lib/logic';
import { useStore } from '@/lib/store';

export default function ChallengeDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const store = useStore();
  const insets = useSafeAreaInsets();
  const ch = store.allChallenges.find((c) => c.id === id);

  if (!ch) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={text.muted}>Aquest repte ja no existeix.</Text>
      </View>
    );
  }

  const joinedAt = store.joined[ch.id];
  const joined = Boolean(joinedAt);
  const mine = joined ? progressOf(ch, store.activities, joinedAt) : 0;
  const unit = METRIC_UNIT[ch.metric];
  const routes = (ch.routeIds ?? []).map(routeById).filter((r): r is Route => Boolean(r));
  const town = townById(ch.town);

  const people: Participant[] = [
    ...fakeParticipants(ch),
    ...(joined ? [{ name: `${store.user!.name} (tu)`, value: mine, me: true }] : []),
  ].sort((a, b) => b.value - a.value);
  const together = people.reduce((t, p) => t + p.value, 0);
  const togetherGoal = ch.goal * people.length;
  const finished = people.filter((p) => p.value >= ch.goal).length;
  const left = Math.max(0, ch.goal - mine);

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ title: TYPE_LABEL[ch.type] }} />
      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.hero}>
          <Text style={{ fontSize: 56 }}>{ch.emoji}</Text>
          <Text style={[text.h1, { textAlign: 'center' }]}>{ch.title}</Text>
          <Text style={text.muted}>📍 {town ? town.name : 'Tot el Penedès'} · {timeLeftLabel(ch)}</Text>
        </View>

        <Text style={text.body}>{ch.description}</Text>

        {ch.sponsor && (
          <Card style={styles.sponsor}>
            <Text style={text.small}>Repte ofert per</Text>
            <Text style={[text.body, { fontWeight: '700' }]}>{ch.sponsor.name}</Text>
            <Text style={text.body}>🎁 {ch.sponsor.prize}</Text>
          </Card>
        )}

        {routes.length > 0 && (
          <>
            <Text style={text.h2}>{routes.length > 1 ? 'Les rutes' : 'La ruta'}</Text>
            <RouteMap routes={routes} height={220} />
            {routes.map((r) => (
              <View key={r.id} style={{ marginTop: S.sm }}>
                <Text style={[text.body, { fontWeight: '600' }]}>{r.name} · {r.km} km · {r.elev} m+</Text>
                <Text style={text.small}>{r.description}</Text>
              </View>
            ))}
          </>
        )}

        {joined && (
          <Card style={{ borderColor: C.primaryLine }}>
            <Text style={text.small}>El teu progrés</Text>
            <Text style={styles.big}>
              {fmt(mine)} <Text style={styles.bigUnit}>/ {fmt(ch.goal)} {unit}</Text>
            </Text>
            <ProgressBar value={mine} goal={ch.goal} big />
            <Text style={text.body}>{left === 0 ? '🎉 Repte completat! Molt bé!' : `Et falten ${fmt(left)} ${unit}. Tu pots!`}</Text>
          </Card>
        )}

        <Card>
          <Text style={text.small}>Entre tots</Text>
          <Text style={[styles.big, { fontSize: 26 }]}>
            {fmt(together)} <Text style={styles.bigUnit}>{unit}</Text>
          </Text>
          <ProgressBar value={together} goal={togetherGoal} color={C.green} big />
          <Text style={text.small}>
            {people.length} persones · {finished} ja l&apos;han acabat · {pct(together, togetherGoal)}% de l&apos;objectiu comú
          </Text>
        </Card>

        <Text style={text.h2}>Companys de repte</Text>
        <Text style={[text.small, { marginTop: -S.xs }]}>Aquí no hi ha guanyadors: cadascú al seu ritme. Envia ànims!</Text>
        {people.map((p) => {
          const key = `${ch.id}:${p.name}`;
          const cheered = Boolean(store.cheers[key]);
          return (
            <View key={p.name} style={[styles.person, p.me && styles.me]}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{p.name[0]}</Text>
              </View>
              <View style={{ flex: 1, gap: 6 }}>
                <View style={styles.row}>
                  <Text style={text.body} numberOfLines={1}>{p.name}</Text>
                  <Text style={text.small}>{fmt(p.value)} {unit}</Text>
                </View>
                <ProgressBar value={p.value} goal={ch.goal} color={p.me ? C.primary : C.green} />
              </View>
              {!p.me && (
                <Pressable onPress={() => store.cheer(key)} disabled={cheered} accessibilityLabel={`Envia ànims a ${p.name}`}
                  style={[styles.cheer, cheered && styles.cheerOn]}>
                  <Text style={{ fontSize: 18, opacity: cheered ? 1 : 0.45 }}>👏</Text>
                </Pressable>
              )}
            </View>
          );
        })}

        {joined && (
          <Pressable onPress={() => store.leave(ch.id)} style={{ alignSelf: 'center', padding: S.md }}>
            <Text style={{ color: C.red }}>Deixar el repte</Text>
          </Pressable>
        )}
      </ScrollView>

      <View style={[styles.foot, { paddingBottom: insets.bottom + S.md }]}>
        {joined ? (
          <Button label="＋ Afegir una sortida" onPress={() => router.push('/sortida')} />
        ) : (
          <Button label="Apunta-m'hi!" onPress={() => {
            store.join(ch.id);
            store.showToast('💪 Ja hi ets! Les sortides d\'ara en endavant hi compten.');
          }} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  body: { padding: S.lg, gap: S.md, paddingBottom: S.xxl },
  hero: { alignItems: 'center', gap: S.xs, paddingVertical: S.sm },
  sponsor: { backgroundColor: C.primarySoft, borderColor: C.primaryLine, gap: 4 },
  big: { fontSize: 32, fontWeight: '800', color: C.ink, marginTop: 2 },
  bigUnit: { fontSize: 16, fontWeight: '500', color: C.muted },
  person: { flexDirection: 'row', alignItems: 'center', gap: S.md, paddingVertical: 4 },
  me: { backgroundColor: C.primarySoft, borderRadius: 14, padding: S.sm, marginHorizontal: -S.sm },
  avatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: C.greenSoft, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontWeight: '800', color: C.green, fontSize: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: S.sm },
  cheer: {
    width: 44, height: 38, borderRadius: 19, borderWidth: 1, borderColor: C.line, backgroundColor: C.card,
    alignItems: 'center', justifyContent: 'center',
  },
  cheerOn: { backgroundColor: C.primarySoft, borderColor: C.primaryLine },
  foot: { paddingHorizontal: S.lg, paddingTop: S.md, borderTopWidth: 1, borderTopColor: C.line, backgroundColor: C.card },
});
