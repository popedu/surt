import * as Location from 'expo-location';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { C, R, S } from '@/constants/theme';
import { TOWNS, townById } from '@/data/places';
import { nearestTown } from '@/lib/logic';
import { field } from './ui';

const normalize = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

// Tria el poble: amb la ubicació del mòbil (un toc) o cercant pel nom
export default function TownPicker({ value, onChange }: { value: string; onChange: (id: string) => void }) {
  const [open, setOpen] = useState(!value);
  const [query, setQuery] = useState('');
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pick = (id: string) => {
    onChange(id);
    setOpen(false);
    setQuery('');
  };

  const useLocation = async () => {
    setError(null);
    setLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Sense permís d\'ubicació. Cerca el teu poble pel nom.');
        return;
      }
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      pick(nearestTown({ lat: pos.coords.latitude, lng: pos.coords.longitude }).id);
    } catch {
      setError('No t\'hem pogut localitzar. Cerca el teu poble pel nom.');
    } finally {
      setLocating(false);
    }
  };

  if (!open) {
    return (
      <Pressable style={[field.input, styles.closed]} onPress={() => setOpen(true)}>
        <Text style={styles.closedText}>📍 {townById(value)?.name}</Text>
        <Text style={{ color: C.primary, fontWeight: '600' }}>Canviar</Text>
      </Pressable>
    );
  }

  const results = TOWNS.filter((t) => normalize(t.name).includes(normalize(query))).slice(0, query ? 6 : 4);

  return (
    <View style={{ gap: S.sm }}>
      <Pressable style={styles.locate} onPress={useLocation} disabled={locating}>
        {locating ? <ActivityIndicator color={C.primary} /> : <Text style={styles.locateText}>📍 Fes servir la meva ubicació</Text>}
      </Pressable>
      {error && <Text style={{ color: C.red, fontSize: 13 }}>{error}</Text>}
      <TextInput style={field.input} value={query} onChangeText={setQuery} placeholder="O cerca el teu poble…"
        placeholderTextColor={C.muted} autoCorrect={false} />
      <View style={styles.list}>
        {results.map((t) => (
          <Pressable key={t.id} onPress={() => pick(t.id)} style={({ pressed }) => [styles.item, pressed && { backgroundColor: C.bg }]}>
            <Text style={[styles.itemText, t.id === value && { fontWeight: '700' }]}>{t.name}</Text>
          </Pressable>
        ))}
        {results.length === 0 && <Text style={[styles.itemText, { color: C.muted, padding: S.md }]}>De moment només Alt Penedès</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  closed: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  closedText: { fontSize: 17, color: C.ink, flex: 1 },
  locate: {
    backgroundColor: C.primarySoft, borderRadius: R.field, paddingVertical: 14, alignItems: 'center',
    borderWidth: 1, borderColor: C.primaryLine,
  },
  locateText: { color: '#A8420A', fontWeight: '700', fontSize: 16 },
  list: { backgroundColor: C.card, borderRadius: R.field, borderWidth: 1, borderColor: C.line, overflow: 'hidden' },
  item: { paddingVertical: 13, paddingHorizontal: 14, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.line },
  itemText: { fontSize: 16, color: C.ink },
});
