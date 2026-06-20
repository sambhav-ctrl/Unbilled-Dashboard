export function Loading({ msg = 'Loading unbilled data…' }) {
  return <div className="state"><div className="spinner" /><p>{msg}</p></div>
}
export function ErrorState({ error }) {
  return (
    <div className="state error">
      <h2>Couldn't load data</h2>
      <p>{String(error?.message || error)}. Check that the Web App is deployed with access set to
      your organisation and the URL is correct, then hit Refresh.</p>
    </div>
  )
}
export function SetupNeeded() {
  return (
    <>
      <div className="setup">
        <b>One step left to go live.</b> Set <code>VITE_API_URL</code> in your <code>.env</code>
        (or in Cloudflare Pages → Settings → Environment variables) to your deployed Apps Script
        Web App <code>/exec</code> URL, then redeploy.
      </div>
      <div className="state">
        <h2>Not connected yet</h2>
        <p>Once the API URL is set, this dashboard loads live unbilled data from CENTRAL,
        scoped to whoever is signed in.</p>
      </div>
    </>
  )
}
export function NoAccess({ email }) {
  return (
    <div className="state">
      <h2>No access configured</h2>
      <p>{email || 'This login'} isn't mapped to a role yet. Add this email to the MAPPING tab
      as a VP, HOD, or director and refresh.</p>
    </div>
  )
}
