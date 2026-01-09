import { useState } from 'react'
import ClientsList from './ClientsList'
import './App.css'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
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
        aria-label="Toggle menu"
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

      <div className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-container">
            <div className="logo-icon">CF</div>
            <h2 className="logo-text">ClientFlow</h2>
          </div>
        </div>
        <ul className="sidebar-menu">
          <li className="sidebar-menu-item active">
            <span className="menu-icon">📋</span>
            <span>Projects</span>
          </li>
          <li 
            className="sidebar-menu-item"
            onClick={handleAddClientClick}
          >
            <span className="menu-icon">➕</span>
            <span>Add Project</span>
          </li>
        </ul>
      </div>

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
