import { fmtCr } from '../lib/api'

// Retainer vs VAS donut. Pure SVG, no library.
export default function Donut({ rows }) {
  const ret = rows.reduce((a, r) => a + Math.max(0, r.ur), 0)
  const vas = rows.reduce((a, r) => a + Math.max(0, r.uv), 0)
  const tot = ret + vas || 1
  const retFrac = ret / tot
  const r = 52, c = 2 * Math.PI * r
  const retLen = retFrac * c
  return (
    <div className="panel">
      <h3>Retainer vs VAS</h3>
      <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
        <svg width="140" height="140" viewBox="0 0 140 140">
          <circle cx="70" cy="70" r={r} fill="none" stroke="#ffd200" strokeWidth="20" />
          <circle cx="70" cy="70" r={r} fill="none" stroke="#141414" strokeWidth="20"
            strokeDasharray={`${retLen} ${c - retLen}`} strokeDashoffset={c / 4}
            transform="rotate(-90 70 70)" style={{ transition: 'stroke-dasharray .5s' }} />
          <text x="70" y="66" textAnchor="middle" fontSize="20" fontWeight="800" fill="#141414">{fmtCr(tot)}</text>
          <text x="70" y="84" textAnchor="middle" fontSize="10" fill="#8a8a85" letterSpacing="1">CR TOTAL</text>
        </svg>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700 }}>
              <span style={{ width: 13, height: 13, background: '#141414', display: 'inline-block' }} />
              Retainer
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, marginLeft: 21 }}>{fmtCr(ret)} Cr <span style={{ fontSize: 12, color: '#8a8a85', fontWeight: 600 }}>· {Math.round(retFrac * 100)}%</span></div>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700 }}>
              <span style={{ width: 13, height: 13, background: '#ffd200', display: 'inline-block' }} />
              VAS
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, marginLeft: 21 }}>{fmtCr(vas)} Cr <span style={{ fontSize: 12, color: '#8a8a85', fontWeight: 600 }}>· {Math.round((1 - retFrac) * 100)}%</span></div>
          </div>
        </div>
      </div>
    </div>
  )
}
