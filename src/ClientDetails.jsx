import './ClientDetails.css'

const formatDate = (dateString) => {
  if (!dateString) return 'No deadline'
  const date = new Date(`${dateString}T00:00:00`)
  if (Number.isNaN(date.getTime())) return dateString
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

const getStatusClass = (status) => `status-badge status-${status.toLowerCase().replaceAll(' ', '-')}`

function ClientDetails({ client, onClose, onEdit, onDelete }) {
  return (
    <section className="client-details-container">
      <div className="details-heading">
        <div>
          <p className="eyebrow">Project profile</p>
          <h1>{client.projectType || 'Project details'}</h1>
          <p>Review the client information and current delivery status.</p>
        </div>
        <button onClick={onClose} className="back-button">← Back</button>
      </div>

      <div className="client-details-card">
        <div className="client-summary">
          <div className="client-avatar" aria-hidden="true">
            {client.name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()}
          </div>
          <div>
            <h2>{client.name}</h2>
            <a href={`mailto:${client.email}`}>{client.email}</a>
          </div>
          <span className={getStatusClass(client.status)}>{client.status}</span>
        </div>

        <dl className="details-list">
          <div><dt>Project type</dt><dd>{client.projectType || 'Not specified'}</dd></div>
          <div><dt>Deadline</dt><dd>{formatDate(client.deadline)}</dd></div>
          <div className="full-row"><dt>Description</dt><dd>{client.description || 'No project description has been added yet.'}</dd></div>
        </dl>

        <div className="detail-actions">
          <button onClick={onEdit} className="primary-button">Edit project</button>
          <button onClick={onDelete} className="delete-project-button">Delete project</button>
        </div>
      </div>
    </section>
  )
}

export default ClientDetails
