import { useState } from 'react'
import { ROUTES } from '../data/routes'
import { todayISO } from '../logic'

// Registre manual. Més endavant: importació automàtica des de Strava / COROS / Garmin.
export default function AddActivity({ hasPet, onSave, onClose }) {
  const [date, setDate] = useState(todayISO())
  const [km, setKm] = useState('')
  const [elev, setElev] = useState('')
  const [pet, setPet] = useState(false)
  const [routeId, setRouteId] = useState('')

  const pickRoute = (id) => {
    setRouteId(id)
    const r = ROUTES.find((x) => x.id === id)
    if (r) {
      setKm(String(r.km))
      setElev(String(r.elev))
    }
  }

  const valid = Number(km) > 0
  const save = (e) => {
    e.preventDefault()
    if (!valid) return
    onSave({ date, km: Number(km), elev: Number(elev) || 0, pet, routeId: routeId || null })
  }

  return (
    <div className="sheet">
      <header className="sheet-head">
        <button className="icon-btn" onClick={onClose} aria-label="Tancar">✕</button>
        <span>Nova sortida</span>
        <span style={{ width: 40 }} />
      </header>
      <form className="sheet-body form" onSubmit={save}>
        <label>
          Has fet alguna d'aquestes rutes? <span className="muted">(opcional)</span>
          <select value={routeId} onChange={(e) => pickRoute(e.target.value)}>
            <option value="">No, una altra</option>
            {ROUTES.map((r) => (
              <option key={r.id} value={r.id}>{r.name} ({r.km} km)</option>
            ))}
          </select>
        </label>

        <div className="two">
          <label>
            Quilòmetres
            <input type="number" inputMode="decimal" min="0" step="0.1" placeholder="0" value={km}
              onChange={(e) => setKm(e.target.value)} autoFocus />
          </label>
          <label>
            Desnivell (m+)
            <input type="number" inputMode="numeric" min="0" step="10" placeholder="0" value={elev}
              onChange={(e) => setElev(e.target.value)} />
          </label>
        </div>

        <label>
          Dia
          <input type="date" value={date} max={todayISO()} onChange={(e) => setDate(e.target.value)} />
        </label>

        {hasPet && (
          <label className="toggle">
            <input type="checkbox" checked={pet} onChange={(e) => setPet(e.target.checked)} />
            <span>🐕 He sortit amb la meva mascota</span>
          </label>
        )}

        <p className="small muted">Aviat podràs connectar el rellotge (Strava, COROS, Garmin) i això es farà sol.</p>
      </form>
      <footer className="sheet-foot">
        <button className="btn primary" disabled={!valid} onClick={save}>Guardar sortida</button>
      </footer>
    </div>
  )
}
