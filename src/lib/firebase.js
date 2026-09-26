import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyA0SyPcg9v67Afbdt9dk1hoMFyLyGV8rfI',
  authDomain: 'clientflow-8b6a5.firebaseapp.com',
  projectId: 'clientflow-8b6a5',
  storageBucket: 'clientflow-8b6a5.firebasestorage.app',
  messagingSenderId: '323026479989',
  appId: '1:323026479989:web:3dae2ce5f9e6bda781813c',
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const database = getFirestore(app)
