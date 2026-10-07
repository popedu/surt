import { townById } from '../data/places'
import { TYPE_LABEL, METRIC_UNIT, timeLeftLabel, fmt } from '../logic'
import ProgressBar from './ProgressBar'

export default function ChallengeCard({ ch, progress, onOpen }) {
  const town = townById(ch.town)
  const joined = progress !== undefined
  const done = joined && progress >= ch.goal
  return (
    <button className={'card challenge' + (ch.sponsor ? ' sponsored' : '')} onClick={onOpen}>
      <div className="emoji">{done ? '✅' : ch.emoji}</div>
      <div className="grow">
        <div className="title">{ch.title}</div>
        <div className="meta">
          {TYPE_LABEL[ch.type]} · {timeLeftLabel(ch)} · 📍 {town ? town.name : 'Tot el Penedès'}
        </div>
        {ch.sponsor && <div className="sponsor-line">🎁 {ch.sponsor.prize}</div>}
        {joined && (
          <div className="mini-progress">
            <ProgressBar value={progress} goal={ch.goal} />
            <span>{fmt(progress)} / {fmt(ch.goal)} {METRIC_UNIT[ch.metric]}</span>
          </div>
        )}
      </div>
    </button>
  )
}
