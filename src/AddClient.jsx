import { useState } from 'react'
import './AddClient.css'

function AddClient({ onAddClient, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: '',
    deadline: '',
    status: 'To Do',
    description: ''
  })
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!isValidEmail(formData.email)) {
      alert('Please enter a valid email address')
      return
    }
    
    setSubmitting(true)
    const saved = await onAddClient(formData)
    setSubmitting(false)

    if (!saved) return
    
    setFormData({
      name: '',
      email: '',
      projectType: '',
      deadline: '',
      status: 'To Do',
      description: ''
    })
  }

  return (
    <div className="add-client-container">
      <div className="add-client-header">
        <h2>Add New Project</h2>
        <button onClick={onCancel} className="cancel-button">
          × Close
        </button>
      </div>

      <form onSubmit={handleSubmit} className="add-client-form">
        <div className="form-group">
          <label htmlFor="name">Client name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            maxLength="120"
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
            maxLength="254"
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
            maxLength="160"
            placeholder="e.g. E-commerce website"
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
            rows="4"
            maxLength="2000"
            placeholder="Enter a brief description of the project (2-3 sentences)..."
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
          <button type="submit" className="submit-button" disabled={submitting}>
            {submitting ? 'Saving…' : 'Add Project'}
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
