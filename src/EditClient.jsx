import { useState, useEffect } from 'react'
import './AddClient.css' // Reuse AddClient styles

function EditClient({ client, onEditClient, onCancel }) {
  // Initialize form data with the client being edited
  const [formData, setFormData] = useState({
    name: client.name,
    email: client.email,
    projectType: client.projectType || '',
    deadline: client.deadline || '',
    status: client.status,
    description: client.description || ''
  })

  // Update form data if client prop changes
  useEffect(() => {
    setFormData({
      name: client.name,
      email: client.email,
      projectType: client.projectType || '',
      deadline: client.deadline || '',
      status: client.status,
      description: client.description || ''
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
      projectType: formData.projectType,
      deadline: formData.deadline,
      status: formData.status,
      description: formData.description
    }
    
    // Call the onEditClient function passed from parent
    onEditClient(updatedClient)
  }

  return (
    <div className="add-client-container">
      <div className="add-client-header">
        <h2>Edit Project</h2>
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
          <label htmlFor="projectType">Project Type:</label>
          <input
            type="text"
            id="projectType"
            name="projectType"
            value={formData.projectType}
            onChange={handleChange}
            placeholder="e.g., Web per Dyqan, Web per Filma"
          />
        </div>

        <div className="form-group">
          <label htmlFor="deadline">Deadline:</label>
          <input
            type="date"
            id="deadline"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Project Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            placeholder="Enter a brief description of the project (2-3 sentences)..."
            style={{ 
              width: '100%', 
              padding: '0.75rem 1rem', 
              border: '1px solid #ced4da', 
              borderRadius: '6px',
              fontFamily: 'inherit',
              fontSize: '1rem',
              resize: 'vertical',
              boxSizing: 'border-box'
            }}
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
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
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

