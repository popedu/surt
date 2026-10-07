import { routeById } from '../data/routes'
import { fmt, fromISO, periodOf, progressOf } from '../logic'
import ChallengeCard from './ChallengeCard'

export default function Mine({ store, onOpen, onExplore }) {
  const mine = store.allChallenges.filter((ch) => store.joined[ch.id])
  const week = periodOf({ type: 'setmanal' })
  const thisWeek = store.activities.filter((a) => fromISO(a.date) >= week.start)
  const weekKm = thisWeek.reduce((t, a) => t + a.km, 0)
  const weekElev = thisWeek.reduce((t, a) => t + a.elev, 0)

  return (
    <>
      <header className="top">
        <div className="hello">Els meus reptes</div>
      </header>

      <div className="stats">
        <div className="stat"><b>{thisWeek.length}</b><span>sortides</span></div>
        <div className="stat"><b>{fmt(Math.round(weekKm * 10) / 10)}</b><span>km</span></div>
        <div className="stat"><b>{fmt(weekElev)}</b><span>m+</span></div>
      </div>
      <p className="small muted center">Aquesta setmana</p>

      <div className="list">
        {mine.map((ch) => (
          <ChallengeCard key={ch.id} ch={ch} onOpen={() => onOpen(ch.id)}
            progress={progressOf(ch, store.activities, store.joined[ch.id])} />
        ))}
        {mine.length === 0 && (
          <div className="card empty">
            <div className="hero-emoji">🌄</div>
            <p>Encara no t'has apuntat a cap repte.</p>
            <button className="btn primary" onClick={onExplore}>Busca'n un a prop teu</button>
          </div>
        )}
      </div>

      {store.activities.length > 0 && (
        <>
          <h2 className="pad">Últimes sortides</h2>
          <ul className="activities">
            {store.activities.slice(0, 10).map((a) => (
              <li key={a.id}>
                <div>
                  <strong>{fmt(a.km)} km</strong> · {fmt(a.elev)} m+ {a.pet && '· 🐕'}
                  <div className="small muted">
                    {fromISO(a.date).toLocaleDateString('ca', { weekday: 'long', day: 'numeric', month: 'long' })}
                    {a.routeId && ` · ${routeById(a.routeId)?.name}`}
                  </div>
                </div>
                <button className="icon-btn small" onClick={() => store.removeActivity(a.id)} aria-label="Esborrar sortida">🗑</button>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  )
}
