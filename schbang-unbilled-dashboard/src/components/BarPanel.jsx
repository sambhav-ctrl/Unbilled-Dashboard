import { fmtCr } from '../lib/api'

export default function BarPanel({ rows, groupKey, title }) {
  const g = {}
  rows.forEach(r => {
    const k = r[groupKey] || '(none)'
    g[k] = g[k] || { ret: 0, vas: 0 }
    g[k].ret += r.ur; g[k].vas += r.uv
  })
  const arr = Object.entries(g)
    .map(([k, v]) => ({ k, ...v, t: v.ret + v.vas }))
    .sort((a, b) => b.t - a.t)
  const max = Math.max(...arr.map(a => Math.abs(a.t)), 1)
  return (
    <div className="panel">
      <h3>{title}</h3>
      <div className="bars">
        {arr.map(a => (
          <div className="barrow" key={a.k}>
            <div className="nm">{a.k}</div>
            <div className="track">
              <div className="ret" style={{ width: Math.max(0, a.ret) / max * 100 + '%' }} />
              <div className="vas" style={{ left: Math.max(0, a.ret) / max * 100 + '%', width: Math.max(0, a.vas) / max * 100 + '%' }} />
            </div>
            <div className="amt">{fmtCr(a.t)} Cr</div>
          </div>
        ))}
      </div>
      <div className="legend2">
        <span><i className="r" /> Retainer</span>
        <span><i className="v" /> VAS</span>
      </div>
    </div>
  )
}
