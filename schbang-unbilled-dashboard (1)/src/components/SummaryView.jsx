import Kpis from './Kpis'
import BarPanel from './BarPanel'
import Donut from './Donut'
import HealthBars from './HealthBars'

// Director / Finance HOD summary: visuals + drill buttons. NO estimate table.
// Clicking a department calls onDrill(dept) which swaps to the DetailView.
export default function SummaryView({ rows, onDrill }) {
  const depts = [...new Set(rows.map(r => r.dept))].filter(Boolean).sort()
  const cnt = d => rows.filter(r => r.dept === d).length
  return (
    <>
      <div className="ctx">Company-wide summary</div>
      <h1>Unbilled — Director &amp; Finance HOD</h1>
      <div className="scopeline">Company-wide · click any department to deep-dive</div>
      <Kpis rows={rows} />
      <div className="cols2">
        <Donut rows={rows} />
        <BarPanel rows={rows} groupKey="dept" title="Unbilled by department" />
      </div>
      <HealthBars rows={rows} />
      <div className="drill">
        <div className="h">Deep-dive into a department</div>
        <div className="chipset">
          {depts.map(d => (
            <div key={d} className="chip" onClick={() => onDrill(d)}>
              {d}<span className="c">{cnt(d)}</span>
            </div>
          ))}
        </div>
        <div className="sub">Opens that department's full detail view with every estimate.</div>
      </div>
    </>
  )
}
