import { TOWNS } from '../data/places'

export default function Profile({ store, onShop }) {
  const { user } = store
  const update = (patch) => store.setUser({ ...user, ...patch })

  return (
    <>
      <header className="top">
        <div className="hello">El meu perfil</div>
      </header>

      <div className="card form">
        <div className="profile-head">
          <div className="avatar big">{user.name[0]}</div>
          <input value={user.name} onChange={(e) => update({ name: e.target.value })} aria-label="Nom" />
        </div>
        <label>
          El meu poble
          <select value={user.town} onChange={(e) => update({ town: e.target.value })}>
            {TOWNS.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </label>
        <label className="toggle">
          <input type="checkbox" checked={user.pet} onChange={(e) => update({ pet: e.target.checked })} />
          <span>🐕 Surto amb la meva mascota</span>
        </label>
      </div>

      <div className="card">
        <strong>Connecta el teu rellotge</strong>
        <p className="small muted">Les sortides s'afegiran soles.</p>
        <div className="chips wrap">
          <span className="chip disabled">Strava · aviat</span>
          <span className="chip disabled">COROS · aviat</span>
          <span className="chip disabled">Garmin · aviat</span>
        </div>
      </div>

      <button className="card shop-cta" onClick={onShop}>
        <div className="emoji">🏪</div>
        <div className="grow">
          <strong>Tens un comerç?</strong>
          <div className="small muted">Crea un repte per a la gent del teu poble i dona-hi un premi.</div>
        </div>
        <span>›</span>
      </button>

      <button className="link danger center-block" onClick={() => confirm('Segur? Esborrarà totes les dades de prova.') && store.reset()}>
        Esborrar les meves dades
      </button>
    </>
  )
}
