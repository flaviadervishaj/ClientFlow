import { useState } from 'react'
import ClientsList from './ClientsList'
import './App.css'

function App() {
  // State to control sidebar visibility on mobile
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // State to control Add Client form (shared with ClientsList)
  const [showAddForm, setShowAddForm] = useState(false)

  // Function to toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  // Function to close sidebar when clicking outside on mobile
  const closeSidebar = () => {
    setSidebarOpen(false)
  }

  // Function to handle Add Client click from sidebar
  const handleAddClientClick = () => {
    setShowAddForm(true)
    // Close sidebar on mobile after clicking
    if (window.innerWidth <= 768) {
      setSidebarOpen(false)
    }
  }

  return (
    <div className="app-container">
      {/* Hamburger Menu Button (visible only on mobile) */}
      <button 
        className="hamburger-button"
        onClick={toggleSidebar}
        aria-label="Toggle menu"
      >
        <span className="hamburger-icon"></span>
        <span className="hamburger-icon"></span>
        <span className="hamburger-icon"></span>
      </button>

      {/* Overlay (visible when sidebar is open on mobile) */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar */}
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

      {/* Main content */}
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
