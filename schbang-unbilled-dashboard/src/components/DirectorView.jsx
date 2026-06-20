import { useState } from 'react'
import Kpis from './Kpis'
import BarPanel from './BarPanel'
import EstimateTable from './EstimateTable'

export default function DirectorView({ rows }) {
  const [dept, setDept] = useState('ALL')
  const view = dept === 'ALL' ? rows : rows.filter(r => r.dept === dept)
  const depts = [...new Set(rows.map(r => r.dept))].filter(Boolean).sort()
  const cnt = d => rows.filter(r => r.dept === d).length
  const scopeTxt = dept === 'ALL' ? 'Company-wide · all departments' : 'Filtered: ' + dept

  return (
    <>
      <div className="ctx">Company-wide summary</div>
      <h1>Unbilled — Director &amp; Finance HOD</h1>
      <div className="scopeline">{scopeTxt}</div>
      <Kpis rows={view} />
      <div className="cols2">
        <BarPanel rows={view} groupKey="dept" title="Unbilled by Department" />
        <BarPanel rows={view} groupKey="sbu" title="Unbilled by SBU" />
      </div>
      <div className="drill">
        <div className="h">Deep-dive into a department</div>
        <div className="chipset">
          <div className={'chip' + (dept === 'ALL' ? ' on' : '')} onClick={() => setDept('ALL')}>All Departments</div>
          {depts.map(d => (
            <div key={d} className={'chip' + (dept === d ? ' on' : '')} onClick={() => setDept(d)}>
              {d}<span className="c">{cnt(d)}</span>
            </div>
          ))}
        </div>
      </div>
      <EstimateTable rows={view} cols={{ sbu: true, dept: true }} />
    </>
  )
}
