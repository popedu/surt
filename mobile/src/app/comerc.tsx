import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ChallengeCard from '@/components/ChallengeCard';
import TownPicker from '@/components/TownPicker';
import { Button, Chip, Label, field, text } from '@/components/ui';
import { C, S } from '@/constants/theme';
import type { Challenge, Metric } from '@/data/types';
import { METRIC_UNIT } from '@/lib/logic';
import { useStore } from '@/lib/store';

const METRICS: { id: Metric; label: string; goal: number }[] = [
  { id: 'km', label: '📏 Quilòmetres', goal: 40 },
  { id: 'desnivell', label: '⛰️ Desnivell', goal: 800 },
  { id: 'sortides', label: '👟 Sortides', goal: 4 },
  { id: 'km_mascota', label: '🐕 Km amb mascota', goal: 15 },
];

// Formulari perquè un comerç creï un repte patrocinat.
// A la versió real: revisió + pagament abans de publicar-lo.
export default function ShopForm() {
  const store = useStore();
  const insets = useSafeAreaInsets();
  const [shop, setShop] = useState('');
  const [town, setTown] = useState(store.user!.town);
  const [metric, setMetric] = useState<Metric>('km');
  const [goal, setGoal] = useState('40');
  const [type, setType] = useState<'setmanal' | 'mensual'>('mensual');
  const [prize, setPrize] = useState('');
  const [reward, setReward] = useState<'tothom' | 'sorteig'>('tothom');

  const forAll = reward === 'tothom';
  const preview: Challenge = {
    id: 'preview',
    emoji: '🎁',
    title: `Repte ${shop || 'del teu comerç'}: ${goal || 0} ${METRIC_UNIT[metric]}`,
    type,
    metric,
    goal: Number(goal) || 1,
    town,
    description: `Repte ofert per ${shop}. ${forAll ? "Tothom qui l'acabi té premi." : "Sorteig entre tothom qui l'acabi."}`,
    sponsor: {
      name: shop,
      prize: prize ? `${prize} ${forAll ? "per a tothom qui l'acabi" : "(sorteig entre qui l'acabi)"}` : 'El teu premi aquí',
      reward,
    },
  };
  const valid = Boolean(shop.trim() && prize.trim() && Number(goal) > 0);

  const publish = () => {
    const id = 'comerc-' + Date.now();
    store.addChallenge({ ...preview, id });
    store.showToast('🏪 Repte publicat! Ja el veu la gent del poble.');
    router.replace({ pathname: '/repte/[id]', params: { id } });
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
        <Text style={text.muted}>
          Crea un repte amb el nom del teu comerç. La gent del poble el veurà a l&apos;app i, qui l&apos;acabi, passarà per la botiga a buscar el premi.
        </Text>

        <View>
          <Label>Nom del comerç</Label>
          <TextInput style={field.input} value={shop} onChangeText={setShop} placeholder="P. ex. Forn de Cal Pep" placeholderTextColor={C.muted} />
        </View>

        <View>
          <Label>Poble</Label>
          <TownPicker value={town} onChange={setTown} />
        </View>

        <View>
          <Label>Què es compta?</Label>
          <View style={styles.row}>
            {METRICS.map((m) => (
              <Chip key={m.id} label={m.label} on={metric === m.id} onPress={() => { setMetric(m.id); setGoal(String(m.goal)); }} />
            ))}
          </View>
        </View>

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Label>Objectiu ({METRIC_UNIT[metric]})</Label>
            <TextInput style={field.input} value={goal} onChangeText={setGoal} keyboardType="number-pad" />
          </View>
          <View style={{ flex: 1 }}>
            <Label>Durada</Label>
            <View style={styles.row}>
              <Chip label="Setmana" on={type === 'setmanal'} onPress={() => setType('setmanal')} />
              <Chip label="Mes" on={type === 'mensual'} onPress={() => setType('mensual')} />
            </View>
          </View>
        </View>

        <View>
          <Label>Premi</Label>
          <TextInput style={field.input} value={prize} onChangeText={setPrize} placeholder="P. ex. Un cafè i un croissant" placeholderTextColor={C.muted} />
          <View style={[styles.row, { marginTop: S.sm }]}>
            <Chip label="Per a tothom qui l'acabi" on={forAll} onPress={() => setReward('tothom')} />
            <Chip label="Sorteig" on={!forAll} onPress={() => setReward('sorteig')} />
          </View>
        </View>

        <View style={{ gap: S.sm }}>
          <Label>Així es veurà</Label>
          <ChallengeCard ch={preview} preview />
          <Text style={text.small}>A la versió real, el repte es revisa i es paga abans de publicar-se.</Text>
        </View>
      </ScrollView>
      <View style={[styles.foot, { paddingBottom: insets.bottom + S.md }]}>
        <Button label="Publicar repte" disabled={!valid} onPress={publish} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  body: { padding: S.lg, gap: S.xl },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: S.sm },
  foot: { paddingHorizontal: S.lg, paddingTop: S.md, borderTopWidth: 1, borderTopColor: C.line, backgroundColor: C.card },
});
