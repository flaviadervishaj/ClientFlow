import { useState } from 'react'
import './AddClient.css'

function AddClient({ onAddClient, onCancel }) {
  // State to store form input values
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    status: 'Active'
  })

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
    
    // Call the onAddClient function passed from parent with form data
    onAddClient(formData)
    
    // Reset form after submission
    setFormData({
      name: '',
      email: '',
      status: 'Active'
    })
  }

  return (
    <div className="add-client-container">
      <div className="add-client-header">
        <h2>Add New Client</h2>
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
            Add Client
          </button>
          <button type="button" onClick={onCancel} className="cancel-button-form">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddClient

