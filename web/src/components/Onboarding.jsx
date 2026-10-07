import { useState } from 'react'
import { TOWNS } from '../data/places'

export default function Onboarding({ onDone }) {
  const [name, setName] = useState('')
  const [town, setTown] = useState('')
  const [pet, setPet] = useState(false)
  const valid = name.trim() && town

  const submit = (e) => {
    e.preventDefault()
    if (valid) onDone({ name: name.trim(), town, pet })
  }

  return (
    <div className="onboarding">
      <div className="logo">🏃 Surt</div>
      <p className="tagline">Reptes a prop teu per sortir a córrer.<br />Sense competir. Només per sortir.</p>
      <form className="card form" onSubmit={submit}>
        <label>
          Com et dius?
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="El teu nom" autoFocus />
        </label>
        <label>
          On vius?
          <select value={town} onChange={(e) => setTown(e.target.value)}>
            <option value="" disabled>Tria el teu poble</option>
            {TOWNS.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </label>
        <label className="toggle">
          <input type="checkbox" checked={pet} onChange={(e) => setPet(e.target.checked)} />
          <span>🐕 Surto amb la meva mascota</span>
        </label>
        <button className="btn primary" disabled={!valid}>Som-hi!</button>
      </form>
      <p className="small muted center">De moment només Alt Penedès. Aviat, tot Catalunya.</p>
    </div>
  )
}
