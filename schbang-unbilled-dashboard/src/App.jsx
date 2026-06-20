import { useEffect, useState, useCallback } from 'react'
import { fetchUnbilled } from './lib/api'
import { Loading, ErrorState, SetupNeeded, NoAccess } from './components/States'
import DirectorView from './components/DirectorView'
import ScopedView from './components/ScopedView'

const API_URL = import.meta.env.VITE_API_URL || ''

export default function App() {
  const [status, setStatus] = useState('loading') // loading | ok | error | setup
  const [error, setError] = useState(null)
  const [email, setEmail] = useState('')
  const [role, setRole] = useState({ type: 'NONE' })
  const [rows, setRows] = useState([])

  const load = useCallback(async () => {
    if (!API_URL || API_URL.indexOf('script.google.com') === -1) {
      setStatus('setup'); return
    }
    setStatus('loading')
    try {
      // ?email= passthrough lets you test a specific role in dev
      const qs = new URLSearchParams(window.location.search)
      const testEmail = qs.get('email')
      const data = await fetchUnbilled(testEmail)
      setEmail(data.email)
      setRole(data.role)
      setRows(data.rows.filter(r => r.total !== 0 || r.status))
      setStatus('ok')
    } catch (e) {
      setError(e); setStatus('error')
    }
  }, [])

  useEffect(() => { load() }, [load])

  const badge = role.type && role.type !== 'NONE' ? role.type : ''

  return (
    <>
      <div className="topbar">
        <div className="brand"><span className="dot" /> SCHBANG · UNBILLED INTELLIGENCE</div>
        <div className="who">
          {status === 'ok' && <><span>{email || 'unknown'}</span>{badge && <span className="role-badge">{badge}</span>}</>}
        </div>
        <button className="refresh" onClick={load}>↻ Refresh</button>
      </div>
      <div className="wrap">
        {status === 'loading' && <Loading />}
        {status === 'setup' && <SetupNeeded />}
        {status === 'error' && <ErrorState error={error} />}
        {status === 'ok' && role.type === 'NONE' && <NoAccess email={email} />}
        {status === 'ok' && role.type === 'DIRECTOR' && <DirectorView rows={rows} />}
        {status === 'ok' && (role.type === 'VP' || role.type === 'HOD') && <ScopedView rows={rows} role={role} />}
      </div>
    </>
  )
}
