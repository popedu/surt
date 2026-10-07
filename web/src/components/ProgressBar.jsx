export default function ProgressBar({ value, goal, color, big }) {
  const p = Math.min(100, Math.round((value / goal) * 100))
  return (
    <div className={'bar' + (big ? ' bar-big' : '')}>
      <div className="bar-fill" style={{ width: `${p}%`, background: color }} />
    </div>
  )
}
