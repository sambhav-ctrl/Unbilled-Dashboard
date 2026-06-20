import Kpis from './Kpis'
import BarPanel from './BarPanel'
import EstimateTable from './EstimateTable'

// VP (scoped to SBU) and HOD (scoped to department) share this view.
export default function ScopedView({ rows, role }) {
  const isVP = role.type === 'VP'
  return (
    <>
      <div className="ctx">{isVP ? 'SBU view · scoped' : 'Department view · scoped'}</div>
      <h1>{isVP ? 'Unbilled — SBU Head / VP' : 'Unbilled — Department HOD'}</h1>
      <div className="scopeline">
        {isVP
          ? `Scope: ${(role.sbus || []).join(', ') || 'your SBU'} · other SBUs not visible`
          : `Scope: ${(role.depts || []).join(', ') || 'your department'} · read-only mirror of recorded comments`}
      </div>
      <Kpis rows={rows} />
      {isVP && <BarPanel rows={rows} groupKey="dept" title="Unbilled by Department (within SBU)" />}
      <EstimateTable rows={rows} cols={{ sbu: false, dept: isVP }} />
    </>
  )
}
