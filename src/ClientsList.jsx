import { useEffect, useState } from 'react'
import ClientDetails from './ClientDetails'
import AddClient from './AddClient'
import EditClient from './EditClient'
import './ClientsList.css'

const VALID_STATUSES = ['To Do', 'In Progress', 'Done']

const defaultClients = [
  { id: 1, name: 'John Smith', email: 'john.smith@example.com', projectType: 'E-commerce Website', deadline: '2026-10-28', status: 'In Progress', description: 'Modern e-commerce platform with shopping cart and payment integration.' },
  { id: 2, name: 'Sarah Johnson', email: 'sarah.j@example.com', projectType: 'Streaming Platform', deadline: '2026-12-12', status: 'To Do', description: 'Video streaming website with user subscriptions and a recommendation engine.' },
  { id: 3, name: 'Mike Wilson', email: 'mike.wilson@example.com', projectType: 'Restaurant Website', deadline: '2026-06-10', status: 'Done', description: 'Restaurant website with an online menu and reservation system.' },
  { id: 4, name: 'Emily Davis', email: 'emily.davis@example.com', projectType: 'Personal Blog', deadline: '2026-11-30', status: 'In Progress', description: 'Blogging platform with article management and a comment system.' },
  { id: 5, name: 'David Brown', email: 'david.brown@example.com', projectType: 'Portfolio Website', deadline: '2027-01-15', status: 'To Do', description: 'Creative portfolio showcase with image galleries and a contact form.' },
  { id: 6, name: 'Lisa Anderson', email: 'lisa.anderson@example.com', projectType: 'Hotel Booking System', deadline: '2026-05-25', status: 'Done', description: 'Hotel booking website with room availability and online reservations.' },
]

const convertOldStatus = (status = '') => {
  const statusLower = status.toLowerCase()
  if (statusLower === 'active') return 'In Progress'
  if (statusLower === 'inactive' || statusLower === 'pending') return 'To Do'
  return VALID_STATUSES.includes(status) ? status : 'To Do'
}

const isValidImportedProject = (project) => (
  project &&
  typeof project === 'object' &&
  typeof project.name === 'string' &&
  project.name.trim().length > 0 &&
  typeof project.email === 'string' &&
  project.email.trim().length > 0
)

function ClientsList({ showAddForm: showAddFormProp, onShowAddForm }) {
  const [clients, setClients] = useState(() => {
    const savedClients = localStorage.getItem('clients')
    if (!savedClients) return defaultClients

    try {
      const parsed = JSON.parse(savedClients)
      if (!Array.isArray(parsed)) return defaultClients

      return parsed.filter(isValidImportedProject).map((client, index) => ({
        id: Number.isFinite(Number(client.id)) ? Number(client.id) : index + 1,
        name: client.name.trim(),
        email: client.email.trim(),
        projectType: client.projectType || 'N/A',
        deadline: client.deadline || '',
        status: convertOldStatus(client.status),
        description: client.description || '',
      }))
    } catch {
      return defaultClients
    }
  })

  const [selectedClient, setSelectedClient] = useState(null)
  const [internalShowAddForm, setInternalShowAddForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [clientToEdit, setClientToEdit] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const showAddForm = showAddFormProp !== undefined ? showAddFormProp : internalShowAddForm
  const setShowAddForm = onShowAddForm || setInternalShowAddForm

  useEffect(() => {
    localStorage.setItem('clients', JSON.stringify(clients))
  }, [clients])

  const handleAddClient = (newClient) => {
    const nextId = clients.length > 0 ? Math.max(...clients.map((client) => client.id)) + 1 : 1
    setClients((currentClients) => [...currentClients, { ...newClient, id: nextId }])
    setShowAddForm(false)
  }

  const handleEditClient = (editedClient) => {
    setClients((currentClients) => currentClients.map((client) => (
      client.id === editedClient.id ? editedClient : client
    )))
    setShowEditForm(false)
    setClientToEdit(null)
    setSelectedClient(null)
  }

  const handleDeleteClient = (clientId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return
    setClients((currentClients) => currentClients.filter((client) => client.id !== clientId))
    if (selectedClient?.id === clientId) setSelectedClient(null)
  }

  const handleEditClick = (client) => {
    setClientToEdit(client)
    setShowEditForm(true)
    setSelectedClient(null)
  }

  const handleExportData = () => {
    const dataBlob = new Blob([JSON.stringify(clients, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `projects-backup-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }

  const handleImportData = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = ({ target }) => {
      try {
        const importedData = JSON.parse(target.result)
        if (!Array.isArray(importedData) || !importedData.every(isValidImportedProject)) {
          window.alert('Invalid file. Each project needs at least a name and an email.')
          return
        }

        if (!window.confirm(`Replace the current list with ${importedData.length} imported projects?`)) return

        setClients(importedData.map((client, index) => ({
          id: index + 1,
          name: client.name.trim(),
          email: client.email.trim(),
          projectType: client.projectType || 'N/A',
          deadline: client.deadline || '',
          status: convertOldStatus(client.status),
          description: client.description || '',
        })))
      } catch {
        window.alert('The selected file is not valid JSON.')
      }
    }
    reader.readAsText(file)
    event.target.value = ''
  }

  const searchLower = searchQuery.trim().toLowerCase()
  const filteredClients = clients.filter((client) => (
    client.name.toLowerCase().includes(searchLower) ||
    client.email.toLowerCase().includes(searchLower) ||
    client.projectType.toLowerCase().includes(searchLower)
  ))

  const stats = {
    total: clients.length,
    inProgress: clients.filter((client) => client.status === 'In Progress').length,
    toDo: clients.filter((client) => client.status === 'To Do').length,
    done: clients.filter((client) => client.status === 'Done').length,
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'No deadline'
    const date = new Date(`${dateString}T00:00:00`)
    if (Number.isNaN(date.getTime())) return dateString
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  const getStatusClass = (status) => `status-badge status-${status.toLowerCase().replaceAll(' ', '-')}`

  if (showAddForm) {
    return (
      <div className="clients-container form-view">
        <AddClient onAddClient={handleAddClient} onCancel={() => setShowAddForm(false)} />
      </div>
    )
  }

  if (showEditForm && clientToEdit) {
    return (
      <div className="clients-container form-view">
        <EditClient
          client={clientToEdit}
          onEditClient={handleEditClient}
          onCancel={() => {
            setShowEditForm(false)
            setClientToEdit(null)
          }}
        />
      </div>
    )
  }

  if (selectedClient) {
    return (
      <div className="clients-container form-view">
        <ClientDetails
          client={selectedClient}
          onClose={() => setSelectedClient(null)}
          onEdit={() => handleEditClick(selectedClient)}
          onDelete={() => handleDeleteClient(selectedClient.id)}
        />
      </div>
    )
  }

  return (
    <div className="clients-container">
      <header className="page-header">
        <div>
          <span className="eyebrow">PROJECT WORKSPACE</span>
          <h1>Client projects</h1>
          <p>Keep client work, deadlines and progress in one clear view.</p>
        </div>
        <button onClick={() => setShowAddForm(true)} className="primary-button">
          <span aria-hidden="true">+</span> New project
        </button>
      </header>

      <section className="stats-grid" aria-label="Project summary">
        <article className="stat-card stat-total"><span>Total projects</span><strong>{stats.total}</strong></article>
        <article className="stat-card stat-progress"><span>In progress</span><strong>{stats.inProgress}</strong></article>
        <article className="stat-card stat-todo"><span>To do</span><strong>{stats.toDo}</strong></article>
        <article className="stat-card stat-done"><span>Completed</span><strong>{stats.done}</strong></article>
      </section>

      <section className="projects-panel">
        <div className="panel-header">
          <div><h2>Projects</h2><p>{filteredClients.length} of {clients.length} shown</p></div>
          <div className="data-actions">
            <button onClick={handleExportData} className="secondary-button">Export</button>
            <label htmlFor="import-file" className="secondary-button import-button">
              Import
              <input id="import-file" type="file" accept=".json,application/json" onChange={handleImportData} />
            </label>
          </div>
        </div>

        <div className="search-container">
          <span aria-hidden="true" className="search-icon">⌕</span>
          <input type="search" className="search-input" aria-label="Search projects" placeholder="Search by client, email or project type" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} />
        </div>

        <div className="clients-table-wrapper">
          <table className="clients-table">
            <thead><tr><th>Client</th><th>Project</th><th>Deadline</th><th>Status</th><th><span className="sr-only">Actions</span></th></tr></thead>
            <tbody>
              {filteredClients.length > 0 ? filteredClients.map((client) => (
                <tr key={client.id}>
                  <td>
                    <button className="client-link" onClick={() => setSelectedClient(client)}>
                      <span className="client-avatar" aria-hidden="true">{client.name.charAt(0).toUpperCase()}</span>
                      <span><strong>{client.name}</strong><small>{client.email}</small></span>
                    </button>
                  </td>
                  <td><strong>{client.projectType}</strong><small className="project-description">{client.description || 'No description'}</small></td>
                  <td>{formatDate(client.deadline)}</td>
                  <td><span className={getStatusClass(client.status)}>{client.status}</span></td>
                  <td><div className="row-actions"><button className="text-button" onClick={() => handleEditClick(client)}>Edit</button><button className="text-button danger" onClick={() => handleDeleteClient(client.id)}>Delete</button></div></td>
                </tr>
              )) : (
                <tr><td colSpan="5" className="empty-state"><strong>No projects found</strong><span>Try a different search term.</span></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default ClientsList
