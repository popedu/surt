import { useState } from 'react'
import { TOWNS } from '../data/places'
import { METRIC_UNIT } from '../logic'
import ChallengeCard from './ChallengeCard'

const METRICS = [
  { id: 'km', label: 'Quilòmetres', emoji: '📏', goal: 40 },
  { id: 'desnivell', label: 'Desnivell', emoji: '⛰️', goal: 800 },
  { id: 'sortides', label: 'Nombre de sortides', emoji: '👟', goal: 4 },
  { id: 'km_mascota', label: 'Km amb mascota', emoji: '🐕', goal: 15 },
]

// Formulari perquè un comerç creï un repte patrocinat.
// A la versió real: revisió manual + pagament abans de publicar-lo.
export default function ShopForm({ defaultTown, onPublish, onClose }) {
  const [shop, setShop] = useState('')
  const [town, setTown] = useState(defaultTown)
  const [metric, setMetric] = useState('km')
  const [goal, setGoal] = useState('40')
  const [type, setType] = useState('mensual')
  const [prize, setPrize] = useState('')
  const [reward, setReward] = useState('tothom')

  const m = METRICS.find((x) => x.id === metric)
  const preview = {
    id: 'shop-' + Date.now(),
    emoji: '🎁',
    title: `Repte ${shop || 'del teu comerç'}: ${goal || 0} ${METRIC_UNIT[metric]}`,
    type,
    metric,
    goal: Number(goal) || 1,
    town,
    description: `Repte ofert per ${shop}. ${reward === 'tothom' ? 'Tothom qui l\'acabi té premi.' : 'Sorteig entre tothom qui l\'acabi.'}`,
    sponsor: {
      name: shop,
      prize: prize ? `${prize} ${reward === 'tothom' ? "per a tothom qui l'acabi" : "(sorteig entre qui l'acabi)"}` : 'El teu premi aquí',
      reward,
    },
  }
  const valid = shop.trim() && prize.trim() && Number(goal) > 0

  return (
    <div className="sheet">
      <header className="sheet-head">
        <button className="icon-btn" onClick={onClose} aria-label="Tancar">✕</button>
        <span>Repte per a comerços</span>
        <span style={{ width: 40 }} />
      </header>
      <div className="sheet-body form">
        <p className="muted">
          Crea un repte amb el nom del teu comerç. La gent del poble el veurà a l'app i, qui l'acabi, passarà per la botiga a buscar el premi.
        </p>
        <label>
          Nom del comerç
          <input value={shop} onChange={(e) => setShop(e.target.value)} placeholder="P. ex. Forn de Cal Pep" />
        </label>
        <label>
          Poble
          <select value={town} onChange={(e) => setTown(e.target.value)}>
            {TOWNS.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </label>

        <div className="field-label">Què es compta?</div>
        <div className="chips wrap">
          {METRICS.map((x) => (
            <button type="button" key={x.id} className={'chip' + (metric === x.id ? ' on' : '')}
              onClick={() => { setMetric(x.id); setGoal(String(x.goal)) }}>
              {x.emoji} {x.label}
            </button>
          ))}
        </div>

        <div className="two">
          <label>
            Objectiu ({METRIC_UNIT[metric]})
            <input type="number" min="1" value={goal} onChange={(e) => setGoal(e.target.value)} />
          </label>
          <label>
            Durada
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="setmanal">Una setmana</option>
              <option value="mensual">Un mes</option>
            </select>
          </label>
        </div>

        <label>
          Premi
          <input value={prize} onChange={(e) => setPrize(e.target.value)} placeholder="P. ex. Un cafè i un croissant" />
        </label>
        <div className="chips">
          <button type="button" className={'chip' + (reward === 'tothom' ? ' on' : '')} onClick={() => setReward('tothom')}>
            Per a tothom qui l'acabi
          </button>
          <button type="button" className={'chip' + (reward === 'sorteig' ? ' on' : '')} onClick={() => setReward('sorteig')}>
            Sorteig
          </button>
        </div>

        <div className="field-label">Així es veurà {m.emoji}</div>
        <ChallengeCard ch={preview} onOpen={() => {}} />
        <p className="small muted">A la versió real, el repte es revisa i es paga abans de publicar-se.</p>
      </div>
      <footer className="sheet-foot">
        <button className="btn primary" disabled={!valid} onClick={() => onPublish(preview)}>Publicar repte</button>
      </footer>
    </div>
  )
}
