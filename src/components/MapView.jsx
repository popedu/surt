import { useEffect } from 'react'
import { MapContainer, TileLayer, Polyline, CircleMarker, Popup, Tooltip, useMap } from 'react-leaflet'
import { LEVEL_COLOR } from '../data/routes'
import { COMARCA_CENTER } from '../data/places'

function FitBounds({ points }) {
  const map = useMap()
  const key = points.flat().join(',')
  useEffect(() => {
    if (points.length > 1) map.fitBounds(points, { padding: [28, 28], maxZoom: 14 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, key])
  return null
}

export default function MapView({ routes, home, height = 260, onOpenRoute }) {
  const points = routes.flatMap((r) => r.points)
  return (
    <div className="map" style={{ height }}>
      <MapContainer center={COMARCA_CENTER} zoom={11} scrollWheelZoom={false} style={{ height: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://opentopomap.org">OpenTopoMap</a>'
          url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
          maxZoom={17}
        />
        <FitBounds points={points} />
        {routes.map((r) => (
          <Polyline key={r.id} positions={r.points} pathOptions={{ color: LEVEL_COLOR[r.level], weight: 5, opacity: 0.85 }}>
            <Popup>
              <strong>{r.name}</strong>
              <br />
              {r.km} km · {r.elev} m+ · {r.level}
              {onOpenRoute && (
                <>
                  <br />
                  <button className="link" onClick={() => onOpenRoute(r)}>Veure reptes d'aquesta ruta</button>
                </>
              )}
            </Popup>
          </Polyline>
        ))}
        {routes.map((r) => (
          <CircleMarker key={r.id + '-start'} center={r.points[0]} radius={6}
            pathOptions={{ color: '#fff', weight: 2, fillColor: LEVEL_COLOR[r.level], fillOpacity: 1 }} />
        ))}
        {home && (
          <CircleMarker center={[home.lat, home.lng]} radius={8}
            pathOptions={{ color: '#fff', weight: 3, fillColor: '#1c7ed6', fillOpacity: 1 }}>
            <Tooltip direction="top" offset={[0, -6]}>Tu ets aquí</Tooltip>
          </CircleMarker>
        )}
      </MapContainer>
    </div>
  )
}
