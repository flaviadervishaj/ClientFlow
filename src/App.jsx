import { useState } from 'react'
import ClientsList from './ClientsList'
import './App.css'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)

  const toggleSidebar = () => {
    setSidebarOpen((isOpen) => !isOpen)
  }

  const closeSidebar = () => {
    setSidebarOpen(false)
  }

  const handleAddClientClick = () => {
    setShowAddForm(true)
    if (window.innerWidth <= 768) {
      setSidebarOpen(false)
    }
  }

  return (
    <div className="app-container">
      <button 
        className="hamburger-button"
        onClick={toggleSidebar}
        aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={sidebarOpen}
      >
        <span className="hamburger-icon"></span>
        <span className="hamburger-icon"></span>
        <span className="hamburger-icon"></span>
      </button>

      {sidebarOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={closeSidebar}
        ></div>
      )}

      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-container">
            <div className="logo-icon">CF</div>
            <h2 className="logo-text">ClientFlow</h2>
          </div>
        </div>
        <nav className="sidebar-menu" aria-label="Main navigation">
          <button className="sidebar-menu-item active" type="button">
            <span className="menu-icon">📋</span>
            <span>Projects</span>
          </button>
          <button
            type="button"
            className="sidebar-menu-item"
            onClick={handleAddClientClick}
          >
            <span className="menu-icon">➕</span>
            <span>Add Project</span>
          </button>
        </nav>
        <p className="sidebar-footer">Simple client project management</p>
      </aside>

      <div className="main-content">
        <ClientsList 
          showAddForm={showAddForm}
          onShowAddForm={setShowAddForm}
        />
      </div>
    </div>
  );
}

export default App
