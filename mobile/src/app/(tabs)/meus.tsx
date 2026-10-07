import { router } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AddButton from '@/components/AddButton';
import ChallengeCard from '@/components/ChallengeCard';
import { Button, Card, text } from '@/components/ui';
import { C, R, S, TAB_BAR } from '@/constants/theme';
import { routeById } from '@/data/routes';
import type { Activity } from '@/data/types';
import { fmt, fromISO, periodOf, progressOf } from '@/lib/logic';
import { useStore } from '@/lib/store';

export default function Mine() {
  const store = useStore();
  const insets = useSafeAreaInsets();
  const mine = store.allChallenges.filter((ch) => store.joined[ch.id]);
  const week = periodOf({ type: 'setmanal' });
  const thisWeek = store.activities.filter((a) => fromISO(a.date) >= week.start);
  const weekKm = thisWeek.reduce((t, a) => t + a.km, 0);
  const weekElev = thisWeek.reduce((t, a) => t + a.elev, 0);

  const confirmDelete = (a: Activity) =>
    Alert.alert('Esborrar la sortida?', `${fmt(a.km)} km del ${fromISO(a.date).toLocaleDateString('ca-ES')}`, [
      { text: 'Cancel·la', style: 'cancel' },
      { text: 'Esborra', style: 'destructive', onPress: () => store.removeActivity(a.id) },
    ]);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={[styles.body, { paddingTop: insets.top + S.md, paddingBottom: insets.bottom + TAB_BAR + 100 }]}>
        <Text style={text.h1}>Els meus reptes</Text>

        <View>
          <View style={styles.stats}>
            <Stat value={String(thisWeek.length)} label="sortides" />
            <Stat value={fmt(weekKm)} label="km" />
            <Stat value={fmt(weekElev)} label="m+" />
          </View>
          <Text style={[text.small, { textAlign: 'center', marginTop: 6 }]}>Aquesta setmana</Text>
        </View>

        {mine.map((ch) => (
          <ChallengeCard key={ch.id} ch={ch} progress={progressOf(ch, store.activities, store.joined[ch.id])} />
        ))}

        {mine.length === 0 && (
          <Card style={{ alignItems: 'center', gap: S.md }}>
            <Text style={{ fontSize: 44 }}>🌄</Text>
            <Text style={text.body}>Encara no t&apos;has apuntat a cap repte.</Text>
            <Button label="Busca'n un a prop teu" onPress={() => router.navigate('/')} style={{ alignSelf: 'stretch' }} />
          </Card>
        )}

        {store.activities.length > 0 && (
          <>
            <Text style={text.h2}>Últimes sortides</Text>
            {store.activities.slice(0, 10).map((a) => (
              <Pressable key={a.id} onLongPress={() => confirmDelete(a)} style={styles.activity}>
                <View style={{ flex: 1 }}>
                  <Text style={text.body}>
                    <Text style={{ fontWeight: '700' }}>{fmt(a.km)} km</Text> · {fmt(a.elev)} m+ {a.pet ? '· 🐕' : ''}
                  </Text>
                  <Text style={text.small}>
                    {fromISO(a.date).toLocaleDateString('ca-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                    {a.routeId ? ` · ${routeById(a.routeId)?.name}` : ''}
                  </Text>
                </View>
                <Pressable onPress={() => confirmDelete(a)} hitSlop={10} accessibilityLabel="Esborrar sortida">
                  <Text style={{ fontSize: 16, color: C.muted }}>🗑</Text>
                </Pressable>
              </Pressable>
            ))}
          </>
        )}
      </ScrollView>
      <AddButton />
    </View>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={text.small}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  body: { paddingHorizontal: S.lg, gap: S.md },
  stats: { flexDirection: 'row', gap: 10, marginTop: S.sm },
  stat: {
    flex: 1, backgroundColor: C.card, borderWidth: 1, borderColor: C.line, borderRadius: R.card,
    paddingVertical: 14, alignItems: 'center',
  },
  statValue: { fontSize: 26, fontWeight: '800', color: C.ink },
  activity: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: C.card, borderWidth: 1, borderColor: C.line,
    borderRadius: 14, padding: 14,
  },
});
