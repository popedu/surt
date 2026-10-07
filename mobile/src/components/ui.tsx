// Peces petites reutilitzables
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Switch, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { C, R, S } from '@/constants/theme';

export function ProgressBar({ value, goal, color = C.primary, big }: { value: number; goal: number; color?: string; big?: boolean }) {
  const p = Math.max(0, Math.min(100, (value / goal) * 100));
  return (
    <View style={[styles.track, big && styles.trackBig]}>
      <View style={[styles.fill, { width: `${p}%`, backgroundColor: color }]} />
    </View>
  );
}

export function Chip({ label, on, onPress, disabled }: { label: string; on?: boolean; onPress?: () => void; disabled?: boolean }) {
  return (
    <Pressable onPress={onPress} disabled={disabled}
      style={[styles.chip, on && styles.chipOn, disabled && styles.chipDisabled]}>
      <Text style={[styles.chipText, on && { color: '#fff' }, disabled && { color: C.muted }]}>{label}</Text>
    </Pressable>
  );
}

export function Button({ label, onPress, disabled, style }: { label: string; onPress: () => void; disabled?: boolean; style?: StyleProp<ViewStyle> }) {
  return (
    <Pressable onPress={onPress} disabled={disabled}
      style={({ pressed }) => [styles.btn, disabled && { opacity: 0.4 }, pressed && { opacity: 0.85 }, style]}>
      <Text style={styles.btnText}>{label}</Text>
    </Pressable>
  );
}

export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function ToggleRow({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <Pressable style={styles.toggle} onPress={() => onChange(!value)}>
      <Text style={styles.toggleText}>{label}</Text>
      <Switch value={value} onValueChange={onChange} trackColor={{ true: C.primary }} />
    </Pressable>
  );
}

export function Label({ children }: { children: ReactNode }) {
  return <Text style={styles.label}>{children}</Text>;
}

export const styles = StyleSheet.create({
  track: { height: 8, backgroundColor: C.track, borderRadius: R.pill, overflow: 'hidden' },
  trackBig: { height: 14, marginVertical: S.sm },
  fill: { height: '100%', borderRadius: R.pill },
  chip: {
    borderWidth: 1, borderColor: C.line, backgroundColor: C.card, borderRadius: R.pill,
    paddingVertical: 9, paddingHorizontal: 14,
  },
  chipOn: { backgroundColor: C.ink, borderColor: C.ink },
  chipDisabled: { backgroundColor: 'transparent', borderStyle: 'dashed' },
  chipText: { fontSize: 15, color: C.ink },
  btn: { backgroundColor: C.primary, borderRadius: 16, paddingVertical: 16, alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  card: { backgroundColor: C.card, borderWidth: 1, borderColor: C.line, borderRadius: R.card, padding: S.lg },
  toggle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: S.md, paddingVertical: S.xs },
  toggleText: { fontSize: 16, color: C.ink, flex: 1 },
  label: { fontSize: 15, fontWeight: '600', color: C.ink, marginBottom: 6 },
});

export const text = StyleSheet.create({
  h1: { fontSize: 28, fontWeight: '800', color: C.ink },
  h2: { fontSize: 19, fontWeight: '700', color: C.ink, marginTop: S.xl, marginBottom: S.sm },
  body: { fontSize: 16, lineHeight: 23, color: C.ink },
  muted: { fontSize: 14, color: C.muted },
  small: { fontSize: 13, color: C.muted },
});

export const field = StyleSheet.create({
  input: {
    backgroundColor: C.card, borderWidth: 1, borderColor: C.line, borderRadius: R.field,
    paddingHorizontal: 14, paddingVertical: 14, fontSize: 17, color: C.ink,
  },
});
