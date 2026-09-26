import { useEffect, useState } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import Auth from './Auth'
import ClientsList from './ClientsList'
import Settings from './Settings'
import { auth } from './lib/firebase'
import { getProjects, replaceProjects } from './lib/projects'
import './App.css'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [activeView, setActiveView] = useState('projects')
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [clients, setClients] = useState([])
  const [workspaceError, setWorkspaceError] = useState('')

  useEffect(() => {
    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser)
      if (!nextUser) {
        setClients([])
        setWorkspaceError('')
      }
      setAuthLoading(false)
    })
  }, [])

  useEffect(() => {
    if (!user) return

    let active = true
    getProjects(user.uid)
      .then((projects) => {
        if (!active) return
        setClients(projects)
        setWorkspaceError('')
      })
      .catch(() => {
        if (!active) return
        setClients([])
        setWorkspaceError('Your projects could not be loaded. Please refresh and try again.')
      })

    return () => {
      active = false
    }
  }, [user])

  const openAddForm = () => {
    setActiveView('projects')
    setShowAddForm(true)
    setSidebarOpen(false)
  }

  const showView = (view) => {
    setActiveView(view)
    setShowAddForm(false)
    setSidebarOpen(false)
  }

  if (authLoading) {
    return <main className="app-loading"><span className="brand-mark">CF</span><p>Loading workspace…</p></main>
  }

  if (!user) return <Auth />

  const email = user.email || 'Account'

  return (
    <div className="app-shell">
      <button
        className="mobile-menu-button"
        onClick={() => setSidebarOpen((isOpen) => !isOpen)}
        aria-label="Toggle navigation"
        aria-expanded={sidebarOpen}
      >
        <span></span><span></span><span></span>
      </button>

      {sidebarOpen ? <button className="sidebar-overlay" onClick={() => setSidebarOpen(false)} aria-label="Close navigation" /> : null}

      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <span className="brand-mark">CF</span>
          <span><strong>ClientFlow</strong><small>Project workspace</small></span>
        </div>

        <nav className="sidebar-nav" aria-label="Main navigation">
          <button className={`nav-item ${activeView === 'projects' ? 'active' : ''}`} onClick={() => showView('projects')}>
            <span className="nav-icon" aria-hidden="true">▦</span>
            Projects
          </button>
          <button className="nav-item" onClick={openAddForm}>
            <span className="nav-icon" aria-hidden="true">＋</span>
            Add project
          </button>
          <button className={`nav-item ${activeView === 'settings' ? 'active' : ''}`} onClick={() => showView('settings')}>
            <span className="nav-icon" aria-hidden="true">⚙</span>
            Settings
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-account"><span>{email.charAt(0).toUpperCase()}</span><div><strong>{email}</strong><small>Secure workspace</small></div></div>
          <button onClick={() => signOut(auth)}>Sign out</button>
        </div>
      </aside>

      <main className="main-content">
        {activeView === 'settings' ? (
          <Settings
            clients={clients}
            email={email}
            onImport={async (projects) => {
              const imported = await replaceProjects(projects, user.uid, clients.map((project) => project.id))
              setClients(imported)
            }}
          />
        ) : (
          <ClientsList
            clients={clients}
            setClients={setClients}
            userId={user.uid}
            loadError={workspaceError}
            showAddForm={showAddForm}
            onShowAddForm={setShowAddForm}
          />
        )}
      </main>
    </div>
  )
}

export default App
