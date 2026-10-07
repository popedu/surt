import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import TownPicker from '@/components/TownPicker';
import { Button, Card, Label, ToggleRow, field, text } from '@/components/ui';
import { C, S } from '@/constants/theme';
import { useStore } from '@/lib/store';

export default function Welcome() {
  const { setUser } = useStore();
  const [name, setName] = useState('');
  const [town, setTown] = useState('');
  const [pet, setPet] = useState(false);
  const valid = Boolean(name.trim() && town);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
          <Text style={styles.logo}>🏃 Surt</Text>
          <Text style={styles.tagline}>Reptes a prop teu per sortir a córrer.{'\n'}Sense competir. Només per sortir.</Text>

          <Card style={{ gap: S.lg }}>
            <View>
              <Label>Com et dius?</Label>
              <TextInput style={field.input} value={name} onChangeText={setName} placeholder="El teu nom"
                placeholderTextColor={C.muted} returnKeyType="done" />
            </View>
            <View>
              <Label>On vius?</Label>
              <TownPicker value={town} onChange={setTown} />
            </View>
            <ToggleRow label="🐕 Surto amb la meva mascota" value={pet} onChange={setPet} />
            <Button label="Som-hi!" disabled={!valid} onPress={() => setUser({ name: name.trim(), town, pet })} />
          </Card>

          <Text style={[text.small, { textAlign: 'center' }]}>De moment només Alt Penedès. Aviat, tot Catalunya.</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  body: { padding: S.lg, paddingTop: S.xxl, gap: S.xl },
  logo: { fontSize: 44, fontWeight: '900', color: C.primary, textAlign: 'center' },
  tagline: { fontSize: 17, lineHeight: 24, color: C.muted, textAlign: 'center' },
});
