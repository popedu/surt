import { NativeTabs } from 'expo-router/unstable-native-tabs';

import { C } from '@/constants/theme';

export default function TabsLayout() {
  return (
    <NativeTabs tintColor={C.primary}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Explora</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'map', selected: 'map.fill' }} md="explore" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="meus">
        <NativeTabs.Trigger.Label>Els meus</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="figure.run" md="directions_run" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="perfil">
        <NativeTabs.Trigger.Label>Perfil</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'person', selected: 'person.fill' }} md="person" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
