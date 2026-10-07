import { router } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import TownPicker from '@/components/TownPicker';
import { Card, Chip, Label, ToggleRow, field, text } from '@/components/ui';
import { C, R, S, TAB_BAR } from '@/constants/theme';
import type { User } from '@/data/types';
import { useStore } from '@/lib/store';

export default function Profile() {
  const store = useStore();
  const insets = useSafeAreaInsets();
  const user = store.user!;
  const update = (patch: Partial<User>) => store.setUser({ ...user, ...patch });

  const confirmReset = () =>
    Alert.alert('Esborrar les dades?', "S'esborraran el perfil, els reptes i les sortides d'aquest mòbil.", [
      { text: 'Cancel·la', style: 'cancel' },
      { text: 'Esborra', style: 'destructive', onPress: store.reset },
    ]);

  return (
    <ScrollView contentContainerStyle={[styles.body, { paddingTop: insets.top + S.md, paddingBottom: insets.bottom + TAB_BAR + 40 }]}
      keyboardShouldPersistTaps="handled">
      <Text style={text.h1}>El meu perfil</Text>

      <Card style={{ gap: S.lg }}>
        <View style={styles.head}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user.name[0]?.toUpperCase()}</Text>
          </View>
          <TextInput style={[field.input, { flex: 1, fontWeight: '700' }]} value={user.name}
            onChangeText={(name) => update({ name })} accessibilityLabel="Nom" />
        </View>
        <View>
          <Label>El meu poble</Label>
          <TownPicker value={user.town} onChange={(town) => update({ town })} />
        </View>
        <ToggleRow label="🐕 Surto amb la meva mascota" value={user.pet} onChange={(pet) => update({ pet })} />
      </Card>

      <Card style={{ gap: S.sm }}>
        <Text style={[text.body, { fontWeight: '700' }]}>Connecta el teu rellotge</Text>
        <Text style={text.small}>Quan acabis l&apos;activitat, apareixerà sola a Surt.</Text>
        <View style={styles.chips}>
          <Chip label="Apple Salut · aviat" disabled />
          <Chip label="Garmin · aviat" disabled />
          <Chip label="COROS · aviat" disabled />
          <Chip label="Polar · aviat" disabled />
          <Chip label="Suunto · aviat" disabled />
        </View>
      </Card>

      <Pressable onPress={() => router.push('/comerc')} style={({ pressed }) => [styles.shop, pressed && { opacity: 0.8 }]}>
        <Text style={{ fontSize: 30 }}>🏪</Text>
        <View style={{ flex: 1 }}>
          <Text style={[text.body, { fontWeight: '700' }]}>Tens un comerç?</Text>
          <Text style={text.small}>Crea un repte per a la gent del teu poble i dona-hi un premi.</Text>
        </View>
        <Text style={{ fontSize: 24, color: C.muted }}>›</Text>
      </Pressable>

      <Pressable onPress={confirmReset} style={{ alignSelf: 'center', padding: S.md }}>
        <Text style={{ color: C.red, fontSize: 15 }}>Esborrar les meves dades</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  body: { paddingHorizontal: S.lg, gap: S.lg },
  head: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: C.greenSoft, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 24, fontWeight: '800', color: C.green },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: S.sm, marginTop: S.xs },
  shop: {
    flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: C.card, borderWidth: 1,
    borderColor: C.line, borderRadius: R.card, padding: S.lg,
  },
});
