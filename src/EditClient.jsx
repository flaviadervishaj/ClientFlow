import ProjectForm from './ProjectForm'

function EditClient({ client, onEditClient, onCancel }) {
  return (
    <ProjectForm
      title="Edit project"
      subtitle="Update the client information, deadline or current status."
      initialData={client}
      submitLabel="Save changes"
      onSubmit={(formData) => onEditClient({ ...formData, id: client.id })}
      onCancel={onCancel}
    />
  )
}

export default EditClient
