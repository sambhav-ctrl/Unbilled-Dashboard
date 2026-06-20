import Kpis from './Kpis'
import BarPanel from './BarPanel'
import EstimateTable from './EstimateTable'

// Reusable scoped detail view: KPIs + one light split bar + the estimate table (hero).
// Used three ways: Director drilling into a dept/SBU, an HOD's own dept, a VP's own SBU.
export default function DetailView({ rows, title, subtitle, scopeKind, onBack }) {
  // scopeKind: 'dept' (HOD / dept drill) or 'sbu' (VP / sbu drill) — controls table cols
  const isSbu = scopeKind === 'sbu'
  return (
    <>
      {onBack && (
        <div className="backbar" onClick={onBack}>← Back to summary</div>
      )}
      <div className="ctx">{isSbu ? 'SBU view · scoped' : 'Department view · scoped'}</div>
      <h1>{title}</h1>
      <div className="scopeline">{subtitle}</div>
      <Kpis rows={rows} />
      {/* light visual only — table is the hero */}
      <BarPanel rows={rows} groupKey={isSbu ? 'dept' : 'brand'}
        title={isSbu ? 'Unbilled by department (within SBU)' : 'Top brands by unbilled'} />
      <EstimateTable rows={rows} cols={{ sbu: isSbu, dept: !isSbu }} />
    </>
  )
}
