import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
} from 'firebase/firestore'
import { database } from './firebase'

const projectCollection = (userId) => collection(database, 'users', userId, 'projects')

const fromDatabase = (snapshot) => {
  const project = snapshot.data()
  return {
    id: snapshot.id,
    name: project.clientName,
    email: project.clientEmail,
    projectType: project.projectType || '',
    deadline: project.deadline || '',
    status: project.status,
    description: project.description || '',
  }
}

const toDatabase = (project) => ({
  clientName: project.name.trim(),
  clientEmail: project.email.trim(),
  projectType: project.projectType.trim(),
  deadline: project.deadline || '',
  status: project.status,
  description: project.description.trim(),
  updatedAt: serverTimestamp(),
})

export async function getProjects(userId) {
  const snapshot = await getDocs(query(projectCollection(userId), orderBy('createdAt', 'desc')))
  return snapshot.docs.map(fromDatabase)
}

export async function createProject(project, userId) {
  const reference = doc(projectCollection(userId))
  await setDoc(reference, {
    ...toDatabase(project),
    createdAt: serverTimestamp(),
  })
  return { ...project, id: reference.id }
}

export async function updateProject(project, userId) {
  await updateDoc(doc(database, 'users', userId, 'projects', project.id), toDatabase(project))
  return project
}

export async function deleteProject(projectId, userId) {
  await deleteDoc(doc(database, 'users', userId, 'projects', projectId))
}

export async function replaceProjects(projects, userId, currentProjectIds) {
  const batch = writeBatch(database)
  const importedProjects = projects.map((project) => {
    const reference = doc(projectCollection(userId))
    batch.set(reference, {
      ...toDatabase(project),
      createdAt: serverTimestamp(),
    })
    return { ...project, id: reference.id }
  })

  currentProjectIds.forEach((projectId) => {
    batch.delete(doc(database, 'users', userId, 'projects', projectId))
  })

  await batch.commit()
  return importedProjects
}
