import { useState } from 'react'
import { ROUTES } from '../data/routes'
import { townById } from '../data/places'
import { progressOf, sortByCloseness } from '../logic'
import MapView from './MapView'
import ChallengeCard from './ChallengeCard'

const FILTERS = [
  { id: 'tots', label: 'Tots' },
  { id: 'setmanal', label: 'Setmanals' },
  { id: 'mensual', label: 'Mensuals' },
  { id: 'llargs', label: 'Llargs' },
  { id: 'premi', label: '🎁 Amb premi' },
]

function matches(ch, filter) {
  if (filter === 'tots') return true
  if (filter === 'premi') return Boolean(ch.sponsor)
  if (filter === 'llargs') return ch.type === 'permanent' || ch.type === 'temporal'
  return ch.type === filter
}

export default function Explore({ store, onOpen }) {
  const [filter, setFilter] = useState('tots')
  const [route, setRoute] = useState(null)
  const home = townById(store.user.town)

  let list = sortByCloseness(store.allChallenges, store.user.town).filter((ch) => matches(ch, filter))
  if (route) list = list.filter((ch) => ch.routeIds?.includes(route.id))

  return (
    <>
      <header className="top">
        <div>
          <div className="hello">Hola, {store.user.name} 👋</div>
          <div className="muted small">Què et ve de gust avui?</div>
        </div>
        <div className="place">📍 {home?.name}</div>
      </header>

      <MapView routes={ROUTES} home={home} height="38vh" onOpenRoute={setRoute} />
      <div className="legend small muted">
        <span><i style={{ background: 'var(--green)' }} /> Fàcil</span>
        <span><i style={{ background: 'var(--primary)' }} /> Mitjana</span>
        <span><i style={{ background: 'var(--red)' }} /> Exigent</span>
        <span>· Toca una ruta per veure-la</span>
      </div>

      <div className="chips scroll">
        {FILTERS.map((f) => (
          <button key={f.id} className={'chip' + (filter === f.id ? ' on' : '')} onClick={() => setFilter(f.id)}>
            {f.label}
          </button>
        ))}
      </div>

      {route && (
        <div className="route-filter">
          Reptes de la ruta <strong>{route.name}</strong>
          <button className="link" onClick={() => setRoute(null)}>Treure filtre ✕</button>
        </div>
      )}

      <div className="list">
        {list.map((ch) => (
          <ChallengeCard key={ch.id} ch={ch} onOpen={() => onOpen(ch.id)}
            progress={store.joined[ch.id] ? progressOf(ch, store.activities, store.joined[ch.id]) : undefined} />
        ))}
        {list.length === 0 && <p className="muted center">No hi ha reptes amb aquest filtre.</p>}
      </div>
    </>
  )
}
