// Projection-health by department: % of unbilled value that has a projection filled.
export default function HealthBars({ rows }) {
  const g = {}
  rows.forEach(r => {
    const k = r.dept || '(none)'
    g[k] = g[k] || { tot: 0, done: 0 }
    g[k].tot += r.total
    if (r.status === 'Projected') g[k].done += r.total
  })
  const arr = Object.entries(g)
    .map(([k, v]) => ({ k, pct: v.tot ? Math.round(v.done / v.tot * 100) : 0, tot: v.tot }))
    .sort((a, b) => b.tot - a.tot)
  return (
    <div className="panel">
      <h3>Projection health by department</h3>
      <div className="bars">
        {arr.map(a => (
          <div className="barrow" key={a.k} style={{ gridTemplateColumns: '160px 1fr 48px' }}>
            <div className="nm">{a.k}</div>
            <div className="track">
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, background: a.pct >= 60 ? '#1f9d63' : a.pct >= 25 ? '#d98a00' : '#cc4444', width: a.pct + '%', transition: 'width .4s' }} />
            </div>
            <div className="amt" style={{ fontSize: 12 }}>{a.pct}%</div>
          </div>
        ))}
      </div>
      <div className="legend2">
        <span><i style={{ background: '#1f9d63' }} /> 60%+</span>
        <span><i style={{ background: '#d98a00' }} /> 25–59%</span>
        <span><i style={{ background: '#cc4444' }} /> under 25%</span>
      </div>
    </div>
  )
}
