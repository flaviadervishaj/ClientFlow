import { useState } from 'react'
import ClientDetails from './ClientDetails'
import ProjectForm from './ProjectForm'
import { createProject, deleteProject, updateProject } from './lib/projects'
import './ClientsList.css'

function ClientsList({ clients, setClients, userId, loadError, showAddForm: showAddFormProp, onShowAddForm }) {
  const [selectedClient, setSelectedClient] = useState(null)
  const [internalShowAddForm, setInternalShowAddForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [clientToEdit, setClientToEdit] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [error, setError] = useState('')

  const showAddForm = showAddFormProp !== undefined ? showAddFormProp : internalShowAddForm
  const setShowAddForm = onShowAddForm || setInternalShowAddForm

  const handleAddClient = async (newClient) => {
    try {
      setError('')
      const savedClient = await createProject(newClient, userId)
      setClients((currentClients) => [savedClient, ...currentClients])
      setShowAddForm(false)
      return true
    } catch {
      setError('The project could not be saved. Please try again.')
      return false
    }
  }

  const handleEditClient = async (editedClient) => {
    try {
      setError('')
      const savedClient = await updateProject(editedClient, userId)
      setClients((currentClients) => currentClients.map((client) => (
        client.id === savedClient.id ? savedClient : client
      )))
      setShowEditForm(false)
      setClientToEdit(null)
      setSelectedClient(null)
      return true
    } catch {
      setError('The changes could not be saved. Please try again.')
      return false
    }
  }

  const handleDeleteClient = async (clientId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return
    try {
      setError('')
      await deleteProject(clientId, userId)
      setClients((currentClients) => currentClients.filter((client) => client.id !== clientId))
      if (selectedClient?.id === clientId) setSelectedClient(null)
    } catch {
      setError('The project could not be deleted. Please try again.')
    }
  }

  const handleEditClick = (client) => {
    setClientToEdit(client)
    setShowEditForm(true)
    setSelectedClient(null)
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
        <ProjectForm onSave={handleAddClient} onCancel={() => setShowAddForm(false)} />
      </div>
    )
  }

  if (showEditForm && clientToEdit) {
    return (
      <div className="clients-container form-view">
        <ProjectForm
          key={clientToEdit.id}
          project={clientToEdit}
          onSave={handleEditClient}
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

      {error || loadError ? <p className="projects-error" role="alert">{error || loadError}</p> : null}

      <section className="stats-grid" aria-label="Project summary">
        <article className="stat-card stat-total"><span>Total projects</span><strong>{stats.total}</strong></article>
        <article className="stat-card stat-progress"><span>In progress</span><strong>{stats.inProgress}</strong></article>
        <article className="stat-card stat-todo"><span>To do</span><strong>{stats.toDo}</strong></article>
        <article className="stat-card stat-done"><span>Completed</span><strong>{stats.done}</strong></article>
      </section>

      <section className="projects-panel">
        <div className="panel-header">
          <div><h2>Projects</h2><p>{filteredClients.length} of {clients.length} shown</p></div>
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
                <tr><td colSpan="5" className="empty-state"><strong>{clients.length === 0 ? 'No projects yet' : 'No projects found'}</strong><span>{clients.length === 0 ? 'Create your first client project to get started.' : 'Try a different search term.'}</span></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default ClientsList
