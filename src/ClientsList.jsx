import { useState, useEffect } from 'react'
import ClientDetails from './ClientDetails'
import AddClient from './AddClient'
import EditClient from './EditClient'
import './ClientsList.css'

const defaultClients = [
  { id: 1, name: 'John Smith', email: 'john.smith@example.com', projectType: 'E-commerce Website', deadline: '2026-03-15', status: 'In Progress', description: 'Modern e-commerce platform with shopping cart and payment integration.' },
  { id: 2, name: 'Sarah Johnson', email: 'sarah.j@example.com', projectType: 'Streaming Platform', deadline: '2026-05-20', status: 'To Do', description: 'Video streaming website with user subscriptions and recommendation engine.' },
  { id: 3, name: 'Mike Wilson', email: 'mike.wilson@example.com', projectType: 'Restaurant Website', deadline: '2026-02-10', status: 'Done', description: 'Restaurant website with online menu and reservation system.' },
  { id: 4, name: 'Emily Davis', email: 'emily.davis@example.com', projectType: 'Personal Blog', deadline: '2026-04-30', status: 'In Progress', description: 'Blogging platform with article management and comment system.' },
  { id: 5, name: 'David Brown', email: 'david.brown@example.com', projectType: 'Portfolio Website', deadline: '2026-06-15', status: 'To Do', description: 'Creative portfolio showcase with image galleries and contact forms.' },
  { id: 6, name: 'Lisa Anderson', email: 'lisa.anderson@example.com', projectType: 'Hotel Booking System', deadline: '2026-01-25', status: 'Done', description: 'Hotel booking website with room availability and online reservations.' },
]

function ClientsList({ showAddForm: showAddFormProp, onShowAddForm }) {
  const convertOldStatus = (status) => {
    const statusLower = status.toLowerCase()
    if (statusLower === 'active') return 'In Progress'
    if (statusLower === 'inactive') return 'To Do'
    if (statusLower === 'pending') return 'To Do'
    return status
  }

  const updateDeadlineYear = (deadline) => {
    if (!deadline) return deadline
    const yearMatch = deadline.match(/^(\d{4})-/)
    if (yearMatch) {
      const year = parseInt(yearMatch[1])
      if (year !== 2026) {
        return deadline.replace(/^\d{4}-/, '2026-')
      }
    }
    return deadline
  }

  const [clients, setClients] = useState(() => {
    const savedClients = localStorage.getItem('clients')
    if (savedClients) {
      try {
        const parsed = JSON.parse(savedClients)
        
        const needsUpdate = parsed.some(client => 
          !client.hasOwnProperty('projectType') || 
          !client.hasOwnProperty('deadline') ||
          !['To Do', 'In Progress', 'Done'].includes(client.status)
        )
        
        if (needsUpdate) {
          const converted = parsed.map(client => ({
            ...client,
            projectType: client.projectType || 'N/A',
            deadline: updateDeadlineYear(client.deadline || ''),
            status: convertOldStatus(client.status)
          }))
          localStorage.setItem('clients', JSON.stringify(converted))
          return converted
        }
        
        const converted = parsed.map(client => ({
          ...client,
          deadline: updateDeadlineYear(client.deadline || ''),
          status: convertOldStatus(client.status)
        }))
        localStorage.setItem('clients', JSON.stringify(converted))
        return converted
      } catch (error) {
        return defaultClients
      }
    }
    return defaultClients
  })

  const [selectedClient, setSelectedClient] = useState(null)

  const [internalShowAddForm, setInternalShowAddForm] = useState(false)
  const showAddForm = showAddFormProp !== undefined ? showAddFormProp : internalShowAddForm
  const setShowAddForm = onShowAddForm || setInternalShowAddForm

  const [showEditForm, setShowEditForm] = useState(false)
  const [clientToEdit, setClientToEdit] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    localStorage.setItem('clients', JSON.stringify(clients))
  }, [clients])

  const handleRowClick = (client) => {
    setSelectedClient(client)
  }

  const handleCloseDetails = () => {
    setSelectedClient(null)
  }

  const handleAddClient = (newClient) => {
    const clientToAdd = {
      id: clients.length > 0 ? Math.max(...clients.map(c => c.id)) + 1 : 1,
      name: newClient.name,
      email: newClient.email,
      projectType: newClient.projectType || '',
      deadline: newClient.deadline || '',
      status: newClient.status,
      description: newClient.description || ''
    }
    setClients([...clients, clientToAdd])
    setShowAddForm(false)
  }

  const handleEditClient = (editedClient) => {
    setClients(clients.map(client => 
      client.id === editedClient.id ? editedClient : client
    ))
    setShowEditForm(false)
    setClientToEdit(null)
    setSelectedClient(null)
  }

  const handleDeleteClient = (clientId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      setClients(clients.filter(client => client.id !== clientId))
      if (selectedClient && selectedClient.id === clientId) {
        setSelectedClient(null)
      }
    }
  }

  const handleEditClick = (client) => {
    setClientToEdit(client)
    setShowEditForm(true)
    setSelectedClient(null)
  }

  const handleExportData = () => {
    const dataStr = JSON.stringify(clients, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `projects-backup-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    alert('Projects data exported successfully!')
  }

  const handleImportData = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result)
        
        if (!Array.isArray(importedData)) {
          alert('Invalid file format! The file must contain an array of projects.')
          return
        }

        if (window.confirm(`This will replace all current projects with ${importedData.length} projects from the file. Continue?`)) {
          const processedData = importedData.map(client => ({
            ...client,
            deadline: updateDeadlineYear(client.deadline || ''),
            status: convertOldStatus(client.status || 'To Do')
          }))
          
          setClients(processedData)
          alert('Projects data imported successfully!')
        }
      } catch (error) {
        alert('Error importing file! Please make sure it\'s a valid JSON file.')
      }
    }
    reader.readAsText(file)
    event.target.value = ''
  }

  const filteredClients = clients.filter((client) => {
    const searchLower = searchQuery.toLowerCase()
    const matchesName = client.name.toLowerCase().includes(searchLower)
    const matchesEmail = client.email.toLowerCase().includes(searchLower)
    const matchesProjectType = (client.projectType || '').toLowerCase().includes(searchLower)
    return matchesName || matchesEmail || matchesProjectType
  })

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      const date = new Date(dateString + 'T00:00:00')
      const options = { year: 'numeric', month: 'long', day: 'numeric' }
      return date.toLocaleDateString('en-US', options)
    } catch (error) {
      return dateString
    }
  }

  const getStatusClass = (status) => {
    const statusLower = status.toLowerCase()
    if (statusLower === 'in progress') return 'status-badge status-in-progress'
    if (statusLower === 'done') return 'status-badge status-done'
    if (statusLower === 'to do') return 'status-badge status-to-do'
    return 'status-badge'
  }

  if (showAddForm) {
    return (
      <div className="clients-container">
        <AddClient 
          onAddClient={handleAddClient}
          onCancel={() => setShowAddForm(false)}
        />
      </div>
    )
  }

  if (showEditForm && clientToEdit) {
    return (
      <div className="clients-container">
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
      <div className="clients-container">
        <ClientDetails 
          client={selectedClient} 
          onClose={handleCloseDetails}
          onEdit={() => handleEditClick(selectedClient)}
          onDelete={() => handleDeleteClient(selectedClient.id)}
        />
      </div>
    )
  }

  return (
    <div className="clients-container">
      <div className="clients-header">
        <div className="clients-header-top">
          <h1>Projects List</h1>
          <p className="clients-count">
            Showing: {filteredClients.length} of {clients.length} projects
          </p>
        </div>
        <div className="clients-header-buttons">
          <button 
            onClick={handleExportData}
            className="export-button"
            title="Export all projects to JSON file"
          >
            📥 Export
          </button>
          <label 
            htmlFor="import-file"
            className="import-button"
            title="Import projects from JSON file"
            style={{ cursor: 'pointer' }}
          >
            📤 Import
            <input
              id="import-file"
              type="file"
              accept=".json"
              onChange={handleImportData}
              style={{ display: 'none' }}
            />
          </label>
          <button 
            onClick={() => setShowAddForm(true)}
            className="add-client-button"
          >
            + Add
          </button>
        </div>
      </div>

      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search by name, email, or project type..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="clients-table-wrapper">
        <table className="clients-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Project Type</th>
              <th>Deadline</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.length > 0 ? (
              filteredClients.map((client) => (
                <tr key={client.id}>
                  <td 
                    className="client-name clickable"
                    onClick={() => handleRowClick(client)}
                  >
                    {client.name}
                  </td>
                  <td 
                    className="client-email clickable"
                    onClick={() => handleRowClick(client)}
                  >
                    {client.email}
                  </td>
                  <td 
                    className="clickable project-type-cell"
                    onClick={() => handleRowClick(client)}
                    title={client.description ? client.description : ''}
                  >
                    {client.projectType || 'N/A'}
                  </td>
                  <td 
                    className="clickable"
                    onClick={() => handleRowClick(client)}
                  >
                    {formatDate(client.deadline)}
                  </td>
                  <td 
                    className="clickable"
                    onClick={() => handleRowClick(client)}
                  >
                    <span className={getStatusClass(client.status)}>
                      {client.status}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button
                      className="edit-button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEditClick(client)
                      }}
                      title="Edit client"
                    >
                      Edit
                    </button>
                    <button
                      className="delete-button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteClient(client.id)
                      }}
                      title="Delete client"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-results">
                  No projects found matching "{searchQuery}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ClientsList