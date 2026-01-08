import { useState, useEffect } from 'react'
import './AddClient.css' // Reuse AddClient styles

function EditClient({ client, onEditClient, onCancel }) {
  // Initialize form data with the client being edited
  const [formData, setFormData] = useState({
    name: client.name,
    email: client.email,
    status: client.status
  })

  // Update form data if client prop changes
  useEffect(() => {
    setFormData({
      name: client.name,
      email: client.email,
      status: client.status
    })
  }, [client])

  // Function to handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault() // Prevents page refresh
    
    // Create updated client object with same ID
    const updatedClient = {
      id: client.id, // Keep the same ID
      name: formData.name,
      email: formData.email,
      status: formData.status
    }
    
    // Call the onEditClient function passed from parent
    onEditClient(updatedClient)
  }

  return (
    <div className="add-client-container">
      <div className="add-client-header">
        <h2>Edit Client</h2>
        <button onClick={onCancel} className="cancel-button">
          × Close
        </button>
      </div>

      <form onSubmit={handleSubmit} className="add-client-form">
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter client name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter client email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="status">Status:</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Pending">Pending</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-button">
            Save Changes
          </button>
          <button type="button" onClick={onCancel} className="cancel-button-form">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditClient

