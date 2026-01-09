import './ClientDetails.css'

function ClientDetails({ client, onClose, onEdit, onDelete }) {
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

  return (
    <div className="client-details-container">
      <div className="client-details-header">
        <h2>Project Details</h2>
        <button onClick={onClose} className="close-button">
          ← Back to List
        </button>
      </div>

      <div className="client-details-card">
        <div className="detail-row">
          <span className="detail-label">Name:</span>
          <span className="detail-value">{client.name}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Email:</span>
          <span className="detail-value">{client.email}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Project Type:</span>
          <span className="detail-value">{client.projectType || 'N/A'}</span>
        </div>

        {client.description && (
          <div className="detail-row detail-row-description">
            <span className="detail-label">Description:</span>
            <span className="detail-value">{client.description}</span>
          </div>
        )}

        <div className="detail-row">
          <span className="detail-label">Deadline:</span>
          <span className="detail-value">{formatDate(client.deadline)}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Status:</span>
          <span className={getStatusClass(client.status)}>
            {client.status}
          </span>
        </div>

        <div className="detail-actions">
          <button onClick={onEdit} className="edit-button-details">
            Edit Project
          </button>
          <button onClick={onDelete} className="delete-button-details">
            Delete Project
          </button>
        </div>
      </div>
    </div>
  )
}

export default ClientDetails

