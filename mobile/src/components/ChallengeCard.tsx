import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { C, R, S } from '@/constants/theme';
import { townById } from '@/data/places';
import type { Challenge } from '@/data/types';
import { METRIC_UNIT, TYPE_LABEL, fmt, timeLeftLabel } from '@/lib/logic';
import { ProgressBar } from './ui';

type Props = { ch: Challenge; progress?: number; preview?: boolean };

export default function ChallengeCard({ ch, progress, preview }: Props) {
  const town = townById(ch.town);
  const joined = progress !== undefined;
  const done = joined && progress >= ch.goal;

  return (
    <Pressable
      disabled={preview}
      onPress={() => router.push({ pathname: '/repte/[id]', params: { id: ch.id } })}
      style={({ pressed }) => [styles.card, ch.sponsor && styles.sponsored, pressed && { opacity: 0.8 }]}>
      <View style={styles.emoji}>
        <Text style={{ fontSize: 28 }}>{done ? '✅' : ch.emoji}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{ch.title}</Text>
        <Text style={styles.meta}>
          {TYPE_LABEL[ch.type]} · {timeLeftLabel(ch)} · 📍 {town ? town.name : 'Tot el Penedès'}
        </Text>
        {ch.sponsor && <Text style={styles.sponsor}>🎁 {ch.sponsor.prize}</Text>}
        {joined && (
          <View style={styles.progress}>
            <View style={{ flex: 1 }}>
              <ProgressBar value={progress} goal={ch.goal} />
            </View>
            <Text style={styles.meta}>
              {fmt(progress)} / {fmt(ch.goal)} {METRIC_UNIT[ch.metric]}
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row', gap: 14, backgroundColor: C.card, borderWidth: 1, borderColor: C.line,
    borderRadius: R.card, padding: S.lg,
  },
  sponsored: { borderColor: C.primaryLine, backgroundColor: '#FFFAF5' },
  emoji: { width: 52, height: 52, borderRadius: 14, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 17, fontWeight: '700', color: C.ink },
  meta: { fontSize: 13, color: C.muted, marginTop: 3 },
  sponsor: { fontSize: 13, color: '#A8420A', marginTop: 6 },
  progress: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10 },
});
