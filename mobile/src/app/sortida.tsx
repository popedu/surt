import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Chip, Label, ToggleRow, field, text } from '@/components/ui';
import { C, S } from '@/constants/theme';
import { ROUTES } from '@/data/routes';
import { daysAgoISO, fmt, progressOf } from '@/lib/logic';
import { useStore } from '@/lib/store';

const DAYS = [
  { label: 'Avui', ago: 0 },
  { label: 'Ahir', ago: 1 },
  { label: "Abans d'ahir", ago: 2 },
];

const num = (s: string) => Number(s.replace(',', '.'));

// Registre manual. Més endavant: importació automàtica des d'Apple Salut / Garmin / COROS...
export default function AddActivity() {
  const store = useStore();
  const insets = useSafeAreaInsets();
  const [ago, setAgo] = useState(0);
  const [km, setKm] = useState('');
  const [elev, setElev] = useState('');
  const [pet, setPet] = useState(false);
  const [routeId, setRouteId] = useState<string | null>(null);

  const pickRoute = (id: string | null) => {
    setRouteId(id);
    const r = ROUTES.find((x) => x.id === id);
    if (r) {
      setKm(String(r.km));
      setElev(String(r.elev));
    }
  };

  const valid = num(km) > 0;

  const save = () => {
    const a = { date: daysAgoISO(ago), km: num(km), elev: Math.round(num(elev)) || 0, pet, routeId };

    // Quins reptes avancen (o s'acaben) amb aquesta sortida?
    const joined = store.allChallenges.filter((ch) => store.joined[ch.id]);
    const after = [{ ...a, id: 'nova' }, ...store.activities];
    const advanced = joined.filter((ch) => progressOf(ch, after, store.joined[ch.id]) > progressOf(ch, store.activities, store.joined[ch.id]));
    const completed = advanced.filter((ch) =>
      progressOf(ch, after, store.joined[ch.id]) >= ch.goal && progressOf(ch, store.activities, store.joined[ch.id]) < ch.goal);

    store.addActivity(a);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    if (completed.length) store.showToast(`🎉 Has completat «${completed[0].title}»!`);
    else if (advanced.length) store.showToast(`💪 ${fmt(a.km)} km! Has avançat en ${advanced.length} ${advanced.length === 1 ? 'repte' : 'reptes'}`);
    else store.showToast(`👏 ${fmt(a.km)} km guardats. Apunta't a un repte perquè comptin!`);
    router.back();
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
        <View>
          <Label>Quin dia?</Label>
          <View style={styles.row}>
            {DAYS.map((d) => <Chip key={d.ago} label={d.label} on={ago === d.ago} onPress={() => setAgo(d.ago)} />)}
          </View>
        </View>

        <View>
          <Label>Has fet alguna d&apos;aquestes rutes? <Text style={text.small}>(opcional)</Text></Label>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
            <Chip label="Una altra" on={routeId === null} onPress={() => pickRoute(null)} />
            {ROUTES.map((r) => <Chip key={r.id} label={r.name} on={routeId === r.id} onPress={() => pickRoute(r.id)} />)}
          </ScrollView>
        </View>

        <View style={styles.two}>
          <View style={{ flex: 1 }}>
            <Label>Quilòmetres</Label>
            <TextInput style={[field.input, styles.bigInput]} value={km} onChangeText={setKm} keyboardType="decimal-pad"
              placeholder="0" placeholderTextColor={C.muted} />
          </View>
          <View style={{ flex: 1 }}>
            <Label>Desnivell (m+)</Label>
            <TextInput style={[field.input, styles.bigInput]} value={elev} onChangeText={setElev} keyboardType="number-pad"
              placeholder="0" placeholderTextColor={C.muted} />
          </View>
        </View>

        {store.user?.pet && <ToggleRow label="🐕 He sortit amb la meva mascota" value={pet} onChange={setPet} />}

        <Text style={text.small}>Aviat podràs connectar el rellotge i les sortides entraran soles.</Text>
      </ScrollView>
      <View style={[styles.foot, { paddingBottom: insets.bottom + S.md }]}>
        <Button label="Guardar sortida" disabled={!valid} onPress={save} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  body: { padding: S.lg, gap: S.xl },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: S.sm },
  two: { flexDirection: 'row', gap: S.md },
  bigInput: { fontSize: 28, fontWeight: '700', textAlign: 'center' },
  foot: { paddingHorizontal: S.lg, paddingTop: S.md, borderTopWidth: 1, borderTopColor: C.line, backgroundColor: C.card },
});
