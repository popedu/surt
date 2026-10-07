import { router } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { C, TAB_BAR } from '@/constants/theme';

// Botó flotant per afegir una sortida, sempre al mateix lloc
export default function AddButton() {
  const insets = useSafeAreaInsets();
  return (
    <Pressable
      accessibilityLabel="Afegir una sortida"
      onPress={() => router.push('/sortida')}
      style={({ pressed }) => [styles.fab, { bottom: insets.bottom + TAB_BAR + 12 }, pressed && { transform: [{ scale: 0.95 }] }]}>
      <Text style={styles.plus}>＋</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute', right: 20, width: 62, height: 62, borderRadius: 31, backgroundColor: C.primary,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: C.primary, shadowOpacity: 0.4, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 6,
  },
  plus: { color: '#fff', fontSize: 32, lineHeight: 36, fontWeight: '600' },
});
