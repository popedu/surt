import { routeById } from '../data/routes'
import { townById } from '../data/places'
import { TYPE_LABEL, METRIC_UNIT, timeLeftLabel, fmt, fakeParticipants, progressOf, pct } from '../logic'
import MapView from './MapView'
import ProgressBar from './ProgressBar'

export default function ChallengeDetail({ ch, store, onClose, onAddActivity }) {
  const joinedAt = store.joined[ch.id]
  const joined = Boolean(joinedAt)
  const mine = joined ? progressOf(ch, store.activities, joinedAt) : 0
  const unit = METRIC_UNIT[ch.metric]
  const routes = (ch.routeIds || []).map(routeById).filter(Boolean)
  const town = townById(ch.town)

  const others = fakeParticipants(ch)
  const people = [...others, ...(joined ? [{ name: `${store.user.name} (tu)`, value: mine, me: true }] : [])]
    .sort((a, b) => b.value - a.value)
  const together = people.reduce((t, p) => t + p.value, 0)
  const togetherGoal = ch.goal * people.length
  const finished = people.filter((p) => p.value >= ch.goal).length

  return (
    <div className="sheet">
      <header className="sheet-head">
        <button className="icon-btn" onClick={onClose} aria-label="Tornar">←</button>
        <span>{TYPE_LABEL[ch.type]}</span>
        <span style={{ width: 40 }} />
      </header>

      <div className="sheet-body">
        <div className="hero">
          <div className="hero-emoji">{ch.emoji}</div>
          <h1>{ch.title}</h1>
          <p className="muted">📍 {town ? town.name : 'Tot el Penedès'} · {timeLeftLabel(ch)}</p>
        </div>

        <p>{ch.description}</p>

        {ch.sponsor && (
          <div className="card sponsor-box">
            <div className="small muted">Repte ofert per</div>
            <strong>{ch.sponsor.name}</strong>
            <div>🎁 {ch.sponsor.prize}</div>
          </div>
        )}

        {routes.length > 0 && (
          <>
            <h2>{routes.length > 1 ? 'Les rutes' : 'La ruta'}</h2>
            <MapView routes={routes} height={220} />
            <ul className="route-list">
              {routes.map((r) => (
                <li key={r.id}>
                  <strong>{r.name}</strong> · {r.km} km · {r.elev} m+ · {r.level}
                  <div className="small muted">{r.description}</div>
                </li>
              ))}
            </ul>
          </>
        )}

        {joined && (
          <div className="card my-progress">
            <div className="small muted">El teu progrés</div>
            <div className="big-number">
              {fmt(mine)} <span>/ {fmt(ch.goal)} {unit}</span>
            </div>
            <ProgressBar value={mine} goal={ch.goal} big />
            <div className="small">
              {mine >= ch.goal ? '🎉 Repte completat! Molt bé!' : `Et falten ${fmt(Math.round((ch.goal - mine) * 10) / 10)} ${unit}. Tu pots!`}
            </div>
          </div>
        )}

        <div className="card">
          <div className="small muted">Entre tots</div>
          <div className="big-number small-big">
            {fmt(Math.round(together))} <span>{unit}</span>
          </div>
          <ProgressBar value={together} goal={togetherGoal} color="var(--green)" big />
          <div className="small">
            {people.length} persones apuntades · {finished} ja l'han acabat · {pct(together, togetherGoal)}% de l'objectiu comú
          </div>
        </div>

        <h2>Companys de repte</h2>
        <p className="small muted">Aquí no hi ha guanyadors: cadascú al seu ritme. Envia ànims!</p>
        <ul className="people">
          {people.map((p) => {
            const key = `${ch.id}:${p.name}`
            const cheered = store.cheers[key]
            return (
              <li key={p.name} className={p.me ? 'me' : ''}>
                <div className="avatar">{p.name[0]}</div>
                <div className="grow">
                  <div className="row-between">
                    <span>{p.name}</span>
                    <span className="small muted">{fmt(p.value)} {unit}</span>
                  </div>
                  <ProgressBar value={p.value} goal={ch.goal} color={p.me ? 'var(--primary)' : 'var(--green)'} />
                </div>
                {!p.me && (
                  <button className={'cheer' + (cheered ? ' on' : '')} disabled={cheered}
                    onClick={() => store.cheer(key)} aria-label={`Envia ànims a ${p.name}`}>
                    👏
                  </button>
                )}
              </li>
            )
          })}
        </ul>

        {joined && (
          <button className="link danger" onClick={() => store.leave(ch.id)}>Deixar el repte</button>
        )}
      </div>

      <footer className="sheet-foot">
        {joined ? (
          <button className="btn primary" onClick={onAddActivity}>＋ Afegir una sortida</button>
        ) : (
          <button className="btn primary" onClick={() => store.join(ch.id)}>Apunta-m'hi!</button>
        )}
      </footer>
    </div>
  )
}
