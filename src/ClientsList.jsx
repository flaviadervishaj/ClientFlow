import { useEffect, useMemo, useState } from 'react'
import ClientDetails from './ClientDetails'
import AddClient from './AddClient'
import EditClient from './EditClient'
import './ClientsList.css'

const STORAGE_KEY = 'clientflow.projects.v1'
const VALID_STATUSES = ['To Do', 'In Progress', 'Done']

const defaultClients = [
  { id: 1, name: 'John Smith', email: 'john.smith@example.com', projectType: 'E-commerce Website', deadline: '2026-03-15', status: 'In Progress', description: 'Modern e-commerce platform with shopping cart and payment integration.' },
  { id: 2, name: 'Sarah Johnson', email: 'sarah.j@example.com', projectType: 'Streaming Platform', deadline: '2026-05-20', status: 'To Do', description: 'Video streaming website with user subscriptions and recommendation engine.' },
  { id: 3, name: 'Mike Wilson', email: 'mike.wilson@example.com', projectType: 'Restaurant Website', deadline: '2026-02-10', status: 'Done', description: 'Restaurant website with online menu and reservation system.' },
  { id: 4, name: 'Emily Davis', email: 'emily.davis@example.com', projectType: 'Personal Blog', deadline: '2026-04-30', status: 'In Progress', description: 'Blogging platform with article management and comment system.' },
]

const normalizeStatus = (status) => {
  const legacyStatuses = {
    active: 'In Progress',
    inactive: 'To Do',
    pending: 'To Do',
  }
  const normalized = legacyStatuses[String(status).toLowerCase()] || status
  return VALID_STATUSES.includes(normalized) ? normalized : 'To Do'
}

const normalizeProject = (project, index = 0) => ({
  id: project.id || `${Date.now()}-${index}`,
  name: String(project.name || '').trim(),
  email: String(project.email || '').trim(),
  projectType: String(project.projectType || '').trim(),
  deadline: String(project.deadline || ''),
  status: normalizeStatus(project.status),
  description: String(project.description || '').trim(),
})

const loadProjects = () => {
  try {
    const savedProjects = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('clients')
    if (!savedProjects) return defaultClients

    const parsedProjects = JSON.parse(savedProjects)
    if (!Array.isArray(parsedProjects)) return defaultClients
    return parsedProjects.map(normalizeProject)
  } catch {
    return defaultClients
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'No deadline'
  const date = new Date(`${dateString}T00:00:00`)
  if (Number.isNaN(date.getTime())) return dateString
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const getStatusClass = (status) => `status-badge status-${status.toLowerCase().replaceAll(' ', '-')}`

function ClientsList({ showAddForm: showAddFormProp, onShowAddForm }) {
  const [clients, setClients] = useState(loadProjects)
  const [selectedClient, setSelectedClient] = useState(null)
  const [internalShowAddForm, setInternalShowAddForm] = useState(false)
  const [clientToEdit, setClientToEdit] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  const showAddForm = showAddFormProp ?? internalShowAddForm
  const setShowAddForm = onShowAddForm || setInternalShowAddForm

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clients))
  }, [clients])

  const stats = useMemo(() => ({
    total: clients.length,
    todo: clients.filter((client) => client.status === 'To Do').length,
    active: clients.filter((client) => client.status === 'In Progress').length,
    done: clients.filter((client) => client.status === 'Done').length,
  }), [clients])

  const filteredClients = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return clients.filter((client) => {
      const matchesStatus = statusFilter === 'All' || client.status === statusFilter
      const matchesSearch = !query || [client.name, client.email, client.projectType]
        .some((value) => value.toLowerCase().includes(query))
      return matchesStatus && matchesSearch
    })
  }, [clients, searchQuery, statusFilter])

  const handleAddClient = (newClient) => {
    setClients((currentClients) => [
      ...currentClients,
      normalizeProject({ ...newClient, id: Date.now() }),
    ])
    setShowAddForm(false)
  }

  const handleEditClient = (editedClient) => {
    setClients((currentClients) => currentClients.map((client) => (
      client.id === editedClient.id ? normalizeProject(editedClient) : client
    )))
    setClientToEdit(null)
    setSelectedClient(null)
  }

  const handleDeleteClient = (clientId) => {
    if (!window.confirm('Delete this project? This action cannot be undone.')) return
    setClients((currentClients) => currentClients.filter((client) => client.id !== clientId))
    setSelectedClient(null)
  }

  const handleExportData = () => {
    const url = URL.createObjectURL(new Blob([JSON.stringify(clients, null, 2)], { type: 'application/json' }))
    const link = document.createElement('a')
    link.href = url
    link.download = `clientflow-backup-${new Date().toISOString().slice(0, 10)}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleImportData = (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    const reader = new FileReader()
    reader.onload = ({ target }) => {
      try {
        const importedData = JSON.parse(target.result)
        const isValid = Array.isArray(importedData)
          && importedData.every((project) => project && project.name && project.email)

        if (!isValid) {
          window.alert('Invalid backup. Every project needs a name and email address.')
          return
        }

        if (window.confirm(`Replace the current list with ${importedData.length} imported projects?`)) {
          setClients(importedData.map(normalizeProject))
        }
      } catch {
        window.alert('The selected file is not valid JSON.')
      }
    }
    reader.readAsText(file)
  }

  if (showAddForm) {
    return (
      <div className="clients-container form-view">
        <AddClient onAddClient={handleAddClient} onCancel={() => setShowAddForm(false)} />
      </div>
    )
  }

  if (clientToEdit) {
    return (
      <div className="clients-container form-view">
        <EditClient
          key={clientToEdit.id}
          client={clientToEdit}
          onEditClient={handleEditClient}
          onCancel={() => setClientToEdit(null)}
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
          onEdit={() => {
            setClientToEdit(selectedClient)
            setSelectedClient(null)
          }}
          onDelete={() => handleDeleteClient(selectedClient.id)}
        />
      </div>
    )
  }

  return (
    <main className="clients-container">
      <header className="clients-header">
        <div>
          <p className="eyebrow">Workspace overview</p>
          <h1>Client projects</h1>
          <p className="header-description">Track deadlines, progress and client details in one place.</p>
        </div>
        <button onClick={() => setShowAddForm(true)} className="primary-button">+ New project</button>
      </header>

      <section className="stats-grid" aria-label="Project summary">
        <article><span>Total projects</span><strong>{stats.total}</strong></article>
        <article><span>To do</span><strong>{stats.todo}</strong></article>
        <article><span>In progress</span><strong>{stats.active}</strong></article>
        <article><span>Completed</span><strong>{stats.done}</strong></article>
      </section>

      <section className="projects-panel">
        <div className="toolbar">
          <label className="search-field">
            <span className="sr-only">Search projects</span>
            <input
              type="search"
              placeholder="Search name, email or project type"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </label>
          <select
            aria-label="Filter projects by status"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="All">All statuses</option>
            {VALID_STATUSES.map((status) => <option key={status}>{status}</option>)}
          </select>
          <button onClick={handleExportData} className="secondary-button">Export</button>
          <label htmlFor="import-file" className="secondary-button file-button">
            Import
            <input id="import-file" type="file" accept="application/json,.json" onChange={handleImportData} />
          </label>
        </div>

        <div className="results-summary">
          <span>{filteredClients.length} of {clients.length} projects</span>
          {(searchQuery || statusFilter !== 'All') && (
            <button onClick={() => { setSearchQuery(''); setStatusFilter('All') }}>Clear filters</button>
          )}
        </div>

        <div className="clients-table-wrapper">
          <table className="clients-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Project</th>
                <th>Deadline</th>
                <th>Status</th>
                <th><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr key={client.id}>
                  <td data-label="Client">
                    <button className="client-link" onClick={() => setSelectedClient(client)}>{client.name}</button>
                    <span className="client-email">{client.email}</span>
                  </td>
                  <td data-label="Project">{client.projectType || 'Not specified'}</td>
                  <td data-label="Deadline">{formatDate(client.deadline)}</td>
                  <td data-label="Status"><span className={getStatusClass(client.status)}>{client.status}</span></td>
                  <td className="actions-cell">
                    <button className="text-button" onClick={() => setClientToEdit(client)}>Edit</button>
                    <button className="text-button danger" onClick={() => handleDeleteClient(client.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredClients.length === 0 && (
            <div className="empty-state">
              <strong>No projects found</strong>
              <span>Try a different search or clear the active filter.</span>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

export default ClientsList
