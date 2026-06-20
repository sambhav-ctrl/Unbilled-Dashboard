import { useEffect, useState, useCallback } from 'react'
import { fetchUnbilled } from './lib/api'
import { Loading, ErrorState, SetupNeeded, NoAccess } from './components/States'
import SummaryView from './components/SummaryView'
import DetailView from './components/DetailView'

const API_URL = import.meta.env.VITE_API_URL || ''

export default function App() {
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState(null)
  const [email, setEmail] = useState('')
  const [role, setRole] = useState({ type: 'NONE' })
  const [rows, setRows] = useState([])
  const [drill, setDrill] = useState(null) // {kind:'dept'|'sbu', value} when director drills in

  const load = useCallback(async () => {
    if (!API_URL || API_URL.indexOf('script.google.com') === -1) { setStatus('setup'); return }
    setStatus('loading')
    try {
      const qs = new URLSearchParams(window.location.search)
      const testEmail = qs.get('email')
      const data = await fetchUnbilled(testEmail)
      setEmail(data.email)
      setRole(data.role)
      setRows(data.rows.filter(r => r.total !== 0 || r.status))
      setDrill(null)
      setStatus('ok')
    } catch (e) { setError(e); setStatus('error') }
  }, [])

  useEffect(() => { load() }, [load])

  const badge = role.type && role.type !== 'NONE' ? role.type : ''

  function renderBody() {
    if (status === 'loading') return <Loading />
    if (status === 'setup') return <SetupNeeded />
    if (status === 'error') return <ErrorState error={error} />
    if (role.type === 'NONE') return <NoAccess email={email} />

    // Director / Finance HOD: summary, with drill-in to a detail view
    if (role.type === 'DIRECTOR') {
      if (drill) {
        const dRows = rows.filter(r => r[drill.kind] === drill.value)
        return (
          <DetailView
            rows={dRows}
            scopeKind={drill.kind}
            title={`Unbilled — ${drill.value}`}
            subtitle={`${drill.value} · ${dRows.length} estimate lines · drilled from company summary`}
            onBack={() => setDrill(null)}
          />
        )
      }
      return <SummaryView rows={rows} onDrill={(d) => setDrill({ kind: 'dept', value: d })} />
    }

    // HOD: land directly on their department detail (no summary, no back)
    if (role.type === 'HOD') {
      const scope = (role.depts || []).join(', ') || 'your department'
      return (
        <DetailView
          rows={rows}
          scopeKind="dept"
          title="Unbilled — Department HOD"
          subtitle={`Scope: ${scope} · read-only mirror of recorded comments`}
        />
      )
    }

    // VP: land directly on their SBU detail
    if (role.type === 'VP') {
      const scope = (role.sbus || []).join(', ') || 'your SBU'
      return (
        <DetailView
          rows={rows}
          scopeKind="sbu"
          title="Unbilled — SBU Head / VP"
          subtitle={`Scope: ${scope} · other SBUs not visible`}
        />
      )
    }
    return null
  }

  return (
    <>
      <div className="topbar">
        <div className="brand"><span className="dot" /> SCHBANG · UNBILLED INTELLIGENCE</div>
        <div className="who">
          {status === 'ok' && <><span>{email || 'unknown'}</span>{badge && <span className="role-badge">{badge}</span>}</>}
        </div>
        <button className="refresh" onClick={load}>↻ Refresh</button>
      </div>
      <div className="wrap">{renderBody()}</div>
    </>
  )
}
