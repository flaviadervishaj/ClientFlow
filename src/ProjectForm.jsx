import { useState } from 'react'
import './AddClient.css'

const emptyProject = {
  name: '',
  email: '',
  projectType: '',
  deadline: '',
  status: 'To Do',
  description: '',
}

function ProjectForm({
  title,
  subtitle,
  submitLabel,
  initialData = emptyProject,
  onSubmit,
  onCancel,
}) {
  const [formData, setFormData] = useState({ ...emptyProject, ...initialData })
  const [errors, setErrors] = useState({})

  const handleChange = ({ target: { name, value } }) => {
    setFormData((current) => ({ ...current, [name]: value }))
    if (errors[name]) {
      setErrors((current) => ({ ...current, [name]: '' }))
    }
  }

  const validate = () => {
    const nextErrors = {}
    if (!formData.name.trim()) nextErrors.name = 'Client name is required.'
    if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) nextErrors.email = 'Enter a valid email address.'
    if (!formData.projectType.trim()) nextErrors.projectType = 'Project type is required.'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!validate()) return
    onSubmit({
      ...formData,
      name: formData.name.trim(),
      email: formData.email.trim(),
      projectType: formData.projectType.trim(),
      description: formData.description.trim(),
    })
  }

  return (
    <section className="project-form-view">
      <div className="form-heading">
        <div>
          <p className="eyebrow">Project details</p>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
        <button type="button" onClick={onCancel} className="back-button">← Back</button>
      </div>

      <form onSubmit={handleSubmit} className="project-form" noValidate>
        <div className="form-grid">
          <label className="form-group">
            <span>Client name *</span>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Olivia Martin"
              aria-invalid={Boolean(errors.name)}
            />
            {errors.name && <small className="field-error">{errors.name}</small>}
          </label>

          <label className="form-group">
            <span>Email address *</span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="client@example.com"
              aria-invalid={Boolean(errors.email)}
            />
            {errors.email && <small className="field-error">{errors.email}</small>}
          </label>

          <label className="form-group">
            <span>Project type *</span>
            <input
              name="projectType"
              value={formData.projectType}
              onChange={handleChange}
              placeholder="e.g. E-commerce website"
              aria-invalid={Boolean(errors.projectType)}
            />
            {errors.projectType && <small className="field-error">{errors.projectType}</small>}
          </label>

          <label className="form-group">
            <span>Deadline</span>
            <input type="date" name="deadline" value={formData.deadline} onChange={handleChange} />
          </label>

          <label className="form-group">
            <span>Status</span>
            <select name="status" value={formData.status} onChange={handleChange}>
              <option>To Do</option>
              <option>In Progress</option>
              <option>Done</option>
            </select>
          </label>

          <label className="form-group full-width">
            <span>Description</span>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              placeholder="Add a short project brief, goals or important notes."
            />
          </label>
        </div>

        <div className="form-actions">
          <button type="button" onClick={onCancel} className="secondary-button">Cancel</button>
          <button type="submit" className="primary-button">{submitLabel}</button>
        </div>
      </form>
    </section>
  )
}

export default ProjectForm
