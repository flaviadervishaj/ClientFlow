import { useRef, useState } from 'react'
import './Settings.css'

const VALID_STATUSES = ['To Do', 'In Progress', 'Done']
const MAX_BATCH_OPERATIONS = 450

const optionalString = (value, maxLength) => (
  value === undefined || (typeof value === 'string' && value.length <= maxLength)
)

const isValidProject = (project) => (
  project &&
  typeof project === 'object' && !Array.isArray(project) &&
  typeof project.name === 'string' &&
  project.name.trim().length > 0 && project.name.trim().length <= 120 &&
  typeof project.email === 'string' &&
  project.email.trim().length <= 254 &&
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(project.email.trim()) &&
  optionalString(project.projectType, 160) &&
  optionalString(project.deadline, 10) &&
  (!project.deadline || /^\d{4}-\d{2}-\d{2}$/.test(project.deadline)) &&
  optionalString(project.description, 2000) &&
  (project.status === undefined || VALID_STATUSES.includes(project.status))
)

function Settings({ clients, email, onImport }) {
  const fileInputRef = useRef(null)
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const handleExport = () => {
    const data = clients.map((project) => ({
      name: project.name,
      email: project.email,
      projectType: project.projectType,
      deadline: project.deadline,
      status: project.status,
      description: project.description,
    }))
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `clientflow-backup-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
    setStatus('Backup downloaded successfully.')
  }

  const handleImport = async (event) => {
    const file = event.target.files[0]
    if (!file) return
    setStatus('')

    try {
      const parsed = JSON.parse(await file.text())
      if (!Array.isArray(parsed) || !parsed.every(isValidProject)) throw new Error('Invalid project backup.')
      if (parsed.length + clients.length > MAX_BATCH_OPERATIONS) throw new Error('Backup is too large for one import.')
      if (!window.confirm(`Replace your current projects with ${parsed.length} imported projects?`)) return

      setLoading(true)
      const normalized = parsed.map((project) => ({
        name: project.name.trim(),
        email: project.email.trim(),
        projectType: typeof project.projectType === 'string' ? project.projectType : '',
        deadline: typeof project.deadline === 'string' ? project.deadline : '',
        status: VALID_STATUSES.includes(project.status) ? project.status : 'To Do',
        description: typeof project.description === 'string' ? project.description : '',
      }))
      try {
        await onImport(normalized)
      } catch {
        setStatus('The import could not be completed. Your projects were not replaced. Please try again.')
        return
      }
      setStatus(`${normalized.length} projects imported successfully.`)
    } catch (error) {
      setStatus(error.message === 'Backup is too large for one import.' ? error.message : 'This file is not a valid ClientFlow backup.')
    } finally {
      setLoading(false)
      event.target.value = ''
    }
  }

  return (
    <div className="settings-page">
      <header className="page-header">
        <div>
          <span className="eyebrow">WORKSPACE</span>
          <h1>Settings</h1>
          <p>Manage your account and keep a portable copy of your project data.</p>
        </div>
      </header>

      <div className="settings-grid">
        <section className="settings-card">
          <div><span className="settings-kicker">ACCOUNT</span><h2>Profile</h2><p>Your workspace is private to this signed-in account.</p></div>
          <div className="account-row"><span className="account-avatar">{email.charAt(0).toUpperCase()}</span><span><strong>{email}</strong><small>Authenticated account</small></span></div>
        </section>

        <section className="settings-card">
          <div><span className="settings-kicker">DATA</span><h2>Backup and restore</h2><p>Export a JSON backup or restore projects from a previous ClientFlow file.</p></div>
          <div className="settings-actions">
            <button className="settings-primary" onClick={handleExport}>Download backup</button>
            <button className="settings-secondary" onClick={() => fileInputRef.current?.click()} disabled={loading}>{loading ? 'Importing…' : 'Import backup'}</button>
            <input ref={fileInputRef} className="sr-only" type="file" accept=".json,application/json" onChange={handleImport} />
          </div>
          {status ? <p className="settings-status" role="status">{status}</p> : null}
        </section>
      </div>
    </div>
  )
}

export default Settings
