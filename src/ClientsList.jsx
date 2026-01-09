import { useState, useEffect } from 'react'
import ClientDetails from './ClientDetails'
import AddClient from './AddClient'
import EditClient from './EditClient'
import './ClientsList.css'

// Default projects data (used only if localStorage is empty)
const defaultClients = [
  { id: 1, name: 'John Smith', email: 'john.smith@example.com', projectType: 'E-commerce Website', deadline: '2026-03-15', status: 'In Progress', description: 'Modern e-commerce platform with shopping cart and payment integration.' },
  { id: 2, name: 'Sarah Johnson', email: 'sarah.j@example.com', projectType: 'Streaming Platform', deadline: '2026-05-20', status: 'To Do', description: 'Video streaming website with user subscriptions and recommendation engine.' },
  { id: 3, name: 'Mike Wilson', email: 'mike.wilson@example.com', projectType: 'Restaurant Website', deadline: '2026-02-10', status: 'Done', description: 'Restaurant website with online menu and reservation system.' },
  { id: 4, name: 'Emily Davis', email: 'emily.davis@example.com', projectType: 'Personal Blog', deadline: '2026-04-30', status: 'In Progress', description: 'Blogging platform with article management and comment system.' },
  { id: 5, name: 'David Brown', email: 'david.brown@example.com', projectType: 'Portfolio Website', deadline: '2026-06-15', status: 'To Do', description: 'Creative portfolio showcase with image galleries and contact forms.' },
  { id: 6, name: 'Lisa Anderson', email: 'lisa.anderson@example.com', projectType: 'Hotel Booking System', deadline: '2026-01-25', status: 'Done', description: 'Hotel booking website with room availability and online reservations.' },
]

function ClientsList({ showAddForm: showAddFormProp, onShowAddForm }) {
  // Function to convert old statuses to new ones
  const convertOldStatus = (status) => {
    const statusLower = status.toLowerCase()
    if (statusLower === 'active') return 'In Progress'
    if (statusLower === 'inactive') return 'To Do'
    if (statusLower === 'pending') return 'To Do'
    return status // Return as is if already new status
  }

  // Function to update deadline year to 2026 if it's in 2024 or other years
  const updateDeadlineYear = (deadline) => {
    if (!deadline) return deadline
    // Extract year from deadline (format: YYYY-MM-DD)
    const yearMatch = deadline.match(/^(\d{4})-/)
    if (yearMatch) {
      const year = parseInt(yearMatch[1])
      // If year is not 2026, update it to 2026
      if (year !== 2026) {
        return deadline.replace(/^\d{4}-/, '2026-')
      }
    }
    return deadline
  }

  // Load clients from localStorage on component mount, or use default data
  const [clients, setClients] = useState(() => {
    // Check if we should reset to defaults (for testing)
    const shouldReset = localStorage.getItem('resetToDefaults') === 'true'
    if (shouldReset) {
      localStorage.removeItem('resetToDefaults')
      localStorage.removeItem('clients')
      return defaultClients
    }

    // Try to get clients from localStorage
    const savedClients = localStorage.getItem('clients')
    if (savedClients) {
      try {
        // Parse the JSON string back to an array
        const parsed = JSON.parse(savedClients)
        
        // Check if we need to update (if data structure is old or missing new fields)
        const needsUpdate = parsed.some(client => 
          !client.hasOwnProperty('projectType') || 
          !client.hasOwnProperty('deadline') ||
          !['To Do', 'In Progress', 'Done'].includes(client.status)
        )
        
        if (needsUpdate) {
          // Convert old data to new format
          const converted = parsed.map(client => ({
            ...client,
            projectType: client.projectType || 'N/A',
            deadline: updateDeadlineYear(client.deadline || ''),
            status: convertOldStatus(client.status)
          }))
          // Save converted data back to localStorage
          localStorage.setItem('clients', JSON.stringify(converted))
          return converted
        }
        
        // Convert old statuses and deadlines to new ones even if structure is OK
        const converted = parsed.map(client => ({
          ...client,
          deadline: updateDeadlineYear(client.deadline || ''),
          status: convertOldStatus(client.status)
        }))
        localStorage.setItem('clients', JSON.stringify(converted))
        return converted
      } catch (error) {
        // If parsing fails, use default clients
        return defaultClients
      }
    }
    // If no saved data, use default clients
    return defaultClients
  })

  // State to store the selected client
  const [selectedClient, setSelectedClient] = useState(null)

  // State to show/hide the Add Client form (use prop if provided from parent)
  const [internalShowAddForm, setInternalShowAddForm] = useState(false)
  const showAddForm = showAddFormProp !== undefined ? showAddFormProp : internalShowAddForm
  const setShowAddForm = onShowAddForm || setInternalShowAddForm

  // State to show/hide the Edit Client form
  const [showEditForm, setShowEditForm] = useState(false)
  const [clientToEdit, setClientToEdit] = useState(null)

  // State to store the search query
  const [searchQuery, setSearchQuery] = useState('')

  // Save clients to localStorage whenever clients array changes
  useEffect(() => {
    // Convert clients array to JSON string and save to localStorage
    localStorage.setItem('clients', JSON.stringify(clients))
  }, [clients]) // This runs whenever 'clients' changes

  // Function to handle row click - sets the selected client
  const handleRowClick = (client) => {
    setSelectedClient(client)
  }

  // Function to close the details view
  const handleCloseDetails = () => {
    setSelectedClient(null)
  }

  // Function to handle adding a new client
  const handleAddClient = (newClient) => {
    // Create a new client object with a unique ID
    const clientToAdd = {
      id: clients.length > 0 ? Math.max(...clients.map(c => c.id)) + 1 : 1,
      name: newClient.name,
      email: newClient.email,
      projectType: newClient.projectType || '',
      deadline: newClient.deadline || '',
      status: newClient.status,
      description: newClient.description || ''
    }

    // Add the new client to the clients array
    setClients([...clients, clientToAdd])
    // Note: useEffect will automatically save to localStorage
    
    // Close the form after adding
    setShowAddForm(false)
  }

  // Function to handle editing a client
  const handleEditClient = (editedClient) => {
    // Update the client in the array by finding it by ID and replacing it
    setClients(clients.map(client => 
      client.id === editedClient.id ? editedClient : client
    ))
    // Note: useEffect will automatically save to localStorage
    
    // Close the edit form and reset
    setShowEditForm(false)
    setClientToEdit(null)
    setSelectedClient(null) // Close details view if open
  }

  // Function to handle deleting a client
  const handleDeleteClient = (clientId) => {
    // Show confirmation dialog
    if (window.confirm('Are you sure you want to delete this project?')) {
      // Filter out the client with the matching ID
      setClients(clients.filter(client => client.id !== clientId))
      // Note: useEffect will automatically save to localStorage
      
      // Close details view if the deleted client was selected
      if (selectedClient && selectedClient.id === clientId) {
        setSelectedClient(null)
      }
    }
  }

  // Function to open edit form
  const handleEditClick = (client) => {
    setClientToEdit(client)
    setShowEditForm(true)
    setSelectedClient(null) // Close details view
  }

  // Function to export data as JSON file
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

  // Function to import data from JSON file
  const handleImportData = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result)
        
        // Validate that it's an array
        if (!Array.isArray(importedData)) {
          alert('Invalid file format! The file must contain an array of projects.')
          return
        }

        // Confirm before importing
        if (window.confirm(`This will replace all current projects with ${importedData.length} projects from the file. Continue?`)) {
          // Update deadlines to 2026 and convert old statuses
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
        console.error('Import error:', error)
      }
    }
    reader.readAsText(file)
    
    // Reset file input so same file can be imported again
    event.target.value = ''
  }

  // Filter clients based on search query
  const filteredClients = clients.filter((client) => {
    // Convert both search query and client name to lowercase for case-insensitive search
    const searchLower = searchQuery.toLowerCase()
    const clientNameLower = client.name.toLowerCase()
    
    // Return true if client name includes the search query
    return clientNameLower.includes(searchLower)
  })

  // Helper function to format date from YYYY-MM-DD to "Month Day, Year"
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    
    try {
      const date = new Date(dateString + 'T00:00:00') // Add time to avoid timezone issues
      const options = { year: 'numeric', month: 'long', day: 'numeric' }
      return date.toLocaleDateString('en-US', options)
    } catch (error) {
      return dateString // Return original if parsing fails
    }
  }

  // Helper function to get status badge class
  const getStatusClass = (status) => {
    const statusLower = status.toLowerCase()
    if (statusLower === 'in progress') return 'status-badge status-in-progress'
    if (statusLower === 'done') return 'status-badge status-done'
    if (statusLower === 'to do') return 'status-badge status-to-do'
    return 'status-badge'
  }

  // If the Add Client form should be shown
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

  // If the Edit Client form should be shown
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

  // If a client is selected, show the details view
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

  // Otherwise, show the clients list
  return (
    <div className="clients-container">
      <div className="clients-header">
        <h1>Projects List</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <p className="clients-count">
            Showing: {filteredClients.length} of {clients.length} projects
          </p>
          <button 
            onClick={handleExportData}
            className="export-button"
            title="Export all projects to JSON file"
          >
            📥 Export Data
          </button>
          <label 
            htmlFor="import-file"
            className="import-button"
            title="Import projects from JSON file"
            style={{ cursor: 'pointer' }}
          >
            📤 Import Data
            <input
              id="import-file"
              type="file"
              accept=".json"
              onChange={handleImportData}
              style={{ display: 'none' }}
            />
          </label>
          <button 
            onClick={() => {
              localStorage.setItem('resetToDefaults', 'true')
              window.location.reload()
            }}
            className="reset-button"
            title="Reset to default projects"
          >
            🔄 Reset
          </button>
          <button 
            onClick={() => setShowAddForm(true)}
            className="add-client-button"
          >
            + Add Project
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search projects by name..."
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
                        e.stopPropagation() // Prevent row click
                        handleEditClick(client)
                      }}
                      title="Edit client"
                    >
                      Edit
                    </button>
                    <button
                      className="delete-button"
                      onClick={(e) => {
                        e.stopPropagation() // Prevent row click
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


