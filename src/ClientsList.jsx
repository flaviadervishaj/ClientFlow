import { useState, useEffect } from 'react'
import ClientDetails from './ClientDetails'
import AddClient from './AddClient'
import EditClient from './EditClient'
import './ClientsList.css'

// Default clients data (used only if localStorage is empty)
const defaultClients = [
  { id: 1, name: 'John Smith', email: 'john.smith@example.com', status: 'Active' },
  { id: 2, name: 'Sarah Johnson', email: 'sarah.j@example.com', status: 'Active' },
  { id: 3, name: 'Mike Wilson', email: 'mike.wilson@example.com', status: 'Inactive' },
  { id: 4, name: 'Emily Davis', email: 'emily.davis@example.com', status: 'Active' },
  { id: 5, name: 'David Brown', email: 'david.brown@example.com', status: 'Pending' },
]

function ClientsList({ showAddForm: showAddFormProp, onShowAddForm }) {
  // Load clients from localStorage on component mount, or use default data
  const [clients, setClients] = useState(() => {
    // Try to get clients from localStorage
    const savedClients = localStorage.getItem('clients')
    if (savedClients) {
      // Parse the JSON string back to an array
      return JSON.parse(savedClients)
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
      status: newClient.status
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
    if (window.confirm('Are you sure you want to delete this client?')) {
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

  // Filter clients based on search query
  const filteredClients = clients.filter((client) => {
    // Convert both search query and client name to lowercase for case-insensitive search
    const searchLower = searchQuery.toLowerCase()
    const clientNameLower = client.name.toLowerCase()
    
    // Return true if client name includes the search query
    return clientNameLower.includes(searchLower)
  })

  // Helper function to get status badge class
  const getStatusClass = (status) => {
    const statusLower = status.toLowerCase()
    if (statusLower === 'active') return 'status-badge status-active'
    if (statusLower === 'inactive') return 'status-badge status-inactive'
    if (statusLower === 'pending') return 'status-badge status-pending'
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
        <h1>Clients List</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <p className="clients-count">
            Showing: {filteredClients.length} of {clients.length} clients
          </p>
          <button 
            onClick={() => setShowAddForm(true)}
            className="add-client-button"
          >
            + Add Client
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search clients by name..."
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
                <td colSpan="4" className="no-results">
                  No clients found matching "{searchQuery}"
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


