import { useState } from 'react'
import ClientsList from './ClientsList'
import './App.css'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)

  const openAddForm = () => {
    setShowAddForm(true)
    setSidebarOpen(false)
  }

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
          <button className="nav-item active" onClick={() => setShowAddForm(false)}>
            <span className="nav-icon" aria-hidden="true">▦</span>
            Projects
          </button>
          <button className="nav-item" onClick={openAddForm}>
            <span className="nav-icon" aria-hidden="true">＋</span>
            Add project
          </button>
        </nav>

        <div className="sidebar-footer">
          <span className="status-dot" aria-hidden="true"></span>
          Data saved locally
        </div>
      </aside>

      <main className="main-content">
        <ClientsList showAddForm={showAddForm} onShowAddForm={setShowAddForm} />
      </main>
    </div>
  )
}

export default App
