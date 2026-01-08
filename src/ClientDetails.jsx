import './ClientDetails.css'

function ClientDetails({ client, onClose, onEdit, onDelete }) {
  // Helper function to get status badge class
  const getStatusClass = (status) => {
    const statusLower = status.toLowerCase()
    if (statusLower === 'active') return 'status-badge status-active'
    if (statusLower === 'inactive') return 'status-badge status-inactive'
    if (statusLower === 'pending') return 'status-badge status-pending'
    return 'status-badge'
  }

  return (
    <div className="client-details-container">
      <div className="client-details-header">
        <h2>Client Details</h2>
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
          <span className="detail-label">Status:</span>
          <span className={getStatusClass(client.status)}>
            {client.status}
          </span>
        </div>

        <div className="detail-actions">
          <button onClick={onEdit} className="edit-button-details">
            Edit Client
          </button>
          <button onClick={onDelete} className="delete-button-details">
            Delete Client
          </button>
        </div>
      </div>
    </div>
  )
}

export default ClientDetails

