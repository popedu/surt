import { useEffect, useState } from 'react'
import { useStore } from './store'
import { progressOf, fmt } from './logic'
import Onboarding from './components/Onboarding'
import Explore from './components/Explore'
import Mine from './components/Mine'
import Profile from './components/Profile'
import ChallengeDetail from './components/ChallengeDetail'
import AddActivity from './components/AddActivity'
import ShopForm from './components/ShopForm'

const TABS = [
  { id: 'explora', icon: '🧭', label: 'Explora' },
  { id: 'meus', icon: '🏃', label: 'Els meus' },
  { id: 'perfil', icon: '👤', label: 'Perfil' },
]

export default function App() {
  const store = useStore()
  const [tab, setTab] = useState('explora')
  const [openId, setOpenId] = useState(null)
  const [adding, setAdding] = useState(false)
  const [shop, setShop] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3500)
    return () => clearTimeout(t)
  }, [toast])

  if (!store.user) return <div className="app"><Onboarding onDone={store.setUser} /></div>

  const open = store.allChallenges.find((c) => c.id === openId)

  const saveActivity = (a) => {
    const joined = store.allChallenges.filter((ch) => store.joined[ch.id])
    const before = Object.fromEntries(joined.map((ch) => [ch.id, progressOf(ch, store.activities, store.joined[ch.id])]))
    const after = [a, ...store.activities]
    const advanced = joined.filter((ch) => progressOf(ch, after, store.joined[ch.id]) > before[ch.id])
    const completed = advanced.filter((ch) => progressOf(ch, after, store.joined[ch.id]) >= ch.goal && before[ch.id] < ch.goal)

    store.addActivity(a)
    setAdding(false)
    if (completed.length) setToast(`🎉 Has completat «${completed[0].title}»!`)
    else if (advanced.length) setToast(`💪 ${fmt(a.km)} km! Has avançat en ${advanced.length} ${advanced.length === 1 ? 'repte' : 'reptes'}`)
    else setToast(`👏 ${fmt(a.km)} km guardats. Apunta't a un repte perquè comptin!`)
  }

  return (
    <div className="app">
      <main className="screen">
        {tab === 'explora' && <Explore store={store} onOpen={setOpenId} />}
        {tab === 'meus' && <Mine store={store} onOpen={setOpenId} onExplore={() => setTab('explora')} />}
        {tab === 'perfil' && <Profile store={store} onShop={() => setShop(true)} />}
      </main>

      <nav className="bottom-nav">
        {TABS.slice(0, 2).map((t) => (
          <button key={t.id} className={tab === t.id ? 'on' : ''} onClick={() => setTab(t.id)}>
            <span>{t.icon}</span>{t.label}
          </button>
        ))}
        <button className="add" onClick={() => setAdding(true)} aria-label="Afegir sortida">＋</button>
        {TABS.slice(2).map((t) => (
          <button key={t.id} className={tab === t.id ? 'on' : ''} onClick={() => setTab(t.id)}>
            <span>{t.icon}</span>{t.label}
          </button>
        ))}
      </nav>

      {open && (
        <ChallengeDetail ch={open} store={store} onClose={() => setOpenId(null)} onAddActivity={() => setAdding(true)} />
      )}
      {adding && <AddActivity hasPet={store.user.pet} onSave={saveActivity} onClose={() => setAdding(false)} />}
      {shop && (
        <ShopForm
          defaultTown={store.user.town}
          onClose={() => setShop(false)}
          onPublish={(c) => {
            store.addChallenge(c)
            setShop(false)
            setTab('explora')
            setOpenId(c.id)
            setToast('🏪 Repte publicat! Ja el veu la gent del poble.')
          }}
        />
      )}

      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  )
}
