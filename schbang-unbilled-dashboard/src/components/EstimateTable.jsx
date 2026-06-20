import { useState } from 'react'
import { fmtFull } from '../lib/api'

function StatusEl({ status }) {
  if (status === 'Projected') return <span className="st proj"><span className="d" />Projected</span>
  if (status === 'Billed/Removed') return <span className="st billed"><span className="d" />Billed</span>
  return <span className="st await"><span className="d" />Awaiting</span>
}
function TypeEl({ r }) {
  if (r.ur > 0 && r.uv > 0) return <span className="pill int">R + V</span>
  if (r.uv > 0) return <span className="pill vas">VAS</span>
  return <span className="pill ret">Retainer</span>
}

export default function EstimateTable({ rows, cols }) {
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState({ k: 'total', dir: -1 })
  const [expand, setExpand] = useState({})

  let view = rows.slice()
  view.sort((a, b) => {
    let av, bv
    if (sort.k === 'total') { av = a.total; bv = b.total }
    else if (sort.k === 'pdate') { av = a.pdate || '~'; bv = b.pdate || '~' }
    else { av = a[sort.k] || ''; bv = b[sort.k] || '' }
    if (av < bv) return -sort.dir
    if (av > bv) return sort.dir
    return 0
  })
  if (search) {
    const q = search.toLowerCase()
    view = view.filter(r => (r.est + r.brand + r.dept + r.comment).toLowerCase().includes(q))
  }
  const span = 2 + (cols.sbu ? 1 : 0) + (cols.dept ? 1 : 0) + 5
  const sortBy = k => setSort(s => s.k === k ? { k, dir: -s.dir } : { k, dir: -1 })
  const arrow = k => sort.k === k ? (sort.dir < 0 ? ' ↓' : ' ↑') : ''
  const Th = ({ k, label, cls }) => (
    <th className={cls} onClick={() => sortBy(k)}>{label}{arrow(k)}</th>
  )

  return (
    <div className="tablecard">
      <div className="tabletop">
        <h3>Estimate-level detail</h3>
        <input className="search" placeholder="Search estimate, brand, comment…"
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <div className="tablescroll">
        <table>
          <thead>
            <tr>
              <Th k="est" label="Estimate" />
              <Th k="brand" label="Brand" />
              {cols.sbu && <Th k="sbu" label="SBU" />}
              {cols.dept && <Th k="dept" label="Dept" />}
              <th>Type</th>
              <Th k="total" label="Unbilled" cls="num" />
              <Th k="pdate" label="Proj. Date" />
              <th>Comment</th>
              <th>Status</th>
              <th>Updated by</th>
            </tr>
          </thead>
          <tbody>
            {view.length === 0 && (
              <tr><td colSpan={span} style={{ padding: 30, textAlign: 'center', color: '#8a8a85' }}>No rows match.</td></tr>
            )}
            {view.map(r => {
              const open = !!expand[r.key]
              return [
                <tr key={r.key}>
                  <td>
                    <span className="est">{r.est}</span>
                    <div className="expand" onClick={() => setExpand(e => ({ ...e, [r.key]: !e[r.key] }))}>
                      {open ? '▾ hide' : '▸ notes'}
                    </div>
                  </td>
                  <td><span className="brand-c">{r.brand}</span></td>
                  {cols.sbu && <td>{r.sbu || '—'}</td>}
                  {cols.dept && <td>{r.dept}</td>}
                  <td><TypeEl r={r} /></td>
                  <td className="num">{fmtFull(r.total)}</td>
                  <td>{r.pdate || <span style={{ color: '#cc4444' }}>—</span>}</td>
                  <td className={r.comment ? 'cmt' : 'cmt empty'}>{r.comment || 'awaiting input'}</td>
                  <td><StatusEl status={r.status} /></td>
                  <td className="by">{r.by || '—'}</td>
                </tr>,
                open && (
                  <tr className="notes-row" key={r.key + '_n'}>
                    <td colSpan={span}>
                      <strong>Notes:</strong> {r.notes || '(none)'} &nbsp;·&nbsp;
                      <strong> GSM:</strong> {r.gsm || '—'} &nbsp;·&nbsp;
                      <strong> Est date:</strong> {r.date || '—'}
                    </td>
                  </tr>
                )
              ]
            })}
          </tbody>
        </table>
      </div>
      <div className="foot">
        <span>{view.length} lines</span>
        <span>Notes hidden · click ▸ to expand</span>
      </div>
    </div>
  )
}
