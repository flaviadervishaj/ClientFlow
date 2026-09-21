import ProjectForm from './ProjectForm'

function AddClient({ onAddClient, onCancel }) {
  return (
    <ProjectForm
      title="Add a new project"
      subtitle="Create a client project and start tracking its progress."
      submitLabel="Add project"
      onSubmit={onAddClient}
      onCancel={onCancel}
    />
  )
}

export default AddClient
