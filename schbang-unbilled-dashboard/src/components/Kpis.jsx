import { fmtCr } from '../lib/api'

export default function Kpis({ rows }) {
  const ret = rows.reduce((a, r) => a + r.ur, 0)
  const vas = rows.reduce((a, r) => a + r.uv, 0)
  const tot = ret + vas
  const filled = rows.filter(r => r.status === 'Projected').reduce((a, r) => a + r.total, 0)
  const health = tot ? Math.round(filled / tot * 100) : 0
  const awaiting = rows.filter(r => r.status !== 'Projected' && r.status !== 'Billed/Removed').length
  const pct = v => tot ? Math.round(v / tot * 100) : 0
  return (
    <div className="kpis">
      <div className="kpi accent">
        <div className="lab">Total Unbilled</div>
        <div className="val">{fmtCr(tot)}<small>Cr</small></div>
        <div className="sub">{rows.length} estimate lines</div>
      </div>
      <div className="kpi">
        <div className="lab">Retainer</div>
        <div className="val">{fmtCr(ret)}<small>Cr</small></div>
        <div className="sub">{pct(ret)}% of unbilled</div>
      </div>
      <div className="kpi">
        <div className="lab">VAS</div>
        <div className="val">{fmtCr(vas)}<small>Cr</small></div>
        <div className="sub">{pct(vas)}% of unbilled</div>
      </div>
      <div className="kpi">
        <div className="lab">Projection Health</div>
        <div className="val">{health}<small>%</small></div>
        <div className="gauge"><i style={{ width: health + '%' }} /></div>
        <div className="sub">{awaiting} lines awaiting comment</div>
      </div>
    </div>
  )
}
