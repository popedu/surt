import { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, Polyline, UrlTile } from 'react-native-maps';

import { C, R } from '@/constants/theme';
import { COMARCA_CENTER } from '@/data/places';
import { LEVEL_COLOR } from '@/data/routes';
import type { Route, Town } from '@/data/types';

type Props = {
  routes: Route[];
  home?: Town;
  height?: number;
  selectedId?: string | null;
  onSelectRoute?: (r: Route) => void;
};

const toLatLng = ([latitude, longitude]: [number, number]) => ({ latitude, longitude });

export default function RouteMap({ routes, home, height = 260, selectedId, onSelectRoute }: Props) {
  const ref = useRef<MapView>(null);
  const coords = routes.flatMap((r) => r.points.map(toLatLng));

  const fit = () =>
    ref.current?.fitToCoordinates(coords, {
      edgePadding: { top: 40, right: 40, bottom: 40, left: 40 },
      animated: false,
    });

  return (
    <View style={[styles.wrap, { height }]}>
      <MapView
        ref={ref}
        style={StyleSheet.absoluteFill}
        initialRegion={{ latitude: COMARCA_CENTER.lat, longitude: COMARCA_CENTER.lng, latitudeDelta: 0.3, longitudeDelta: 0.3 }}
        onMapReady={fit}
        pitchEnabled={false}
        rotateEnabled={false}
        toolbarEnabled={false}>
        {/* Mapa topogràfic (corbes de nivell) per sobre del mapa base */}
        <UrlTile urlTemplate="https://tile.opentopomap.org/{z}/{x}/{y}.png" maximumZ={17} zIndex={-1} />

        {routes.map((r) => (
          <Polyline
            key={r.id}
            coordinates={r.points.map(toLatLng)}
            strokeColor={LEVEL_COLOR[r.level]}
            strokeWidth={selectedId === r.id ? 7 : 5}
            tappable={Boolean(onSelectRoute)}
            onPress={() => onSelectRoute?.(r)}
          />
        ))}

        {routes.map((r) => (
          <Marker key={r.id + '-start'} coordinate={toLatLng(r.points[0])} onPress={() => onSelectRoute?.(r)}
            anchor={{ x: 0.5, y: 0.5 }} tracksViewChanges={false}>
            <View style={[styles.dot, { backgroundColor: LEVEL_COLOR[r.level] }]} />
          </Marker>
        ))}

        {home && (
          <Marker coordinate={{ latitude: home.lat, longitude: home.lng }} anchor={{ x: 0.5, y: 0.5 }}
            title="Tu ets aquí" tracksViewChanges={false}>
            <View style={styles.home} />
          </Marker>
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { borderRadius: R.card, overflow: 'hidden', borderWidth: 1, borderColor: C.line, backgroundColor: C.track },
  dot: { width: 14, height: 14, borderRadius: 7, borderWidth: 2, borderColor: '#fff' },
  home: { width: 18, height: 18, borderRadius: 9, borderWidth: 3, borderColor: '#fff', backgroundColor: C.blue },
});
