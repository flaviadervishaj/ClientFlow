import { useState } from 'react'
import {
  createUserWithEmailAndPassword,
  reload,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { auth } from './lib/firebase'
import './Auth.css'

const AUTH_MESSAGES = {
  'auth/api-key-not-valid': 'The account service is temporarily unavailable. Please try again later.',
  'auth/configuration-not-found': 'The account service is not configured correctly.',
  'auth/email-already-in-use': 'An account already exists for this email address.',
  'auth/invalid-credential': 'The email or password is incorrect.',
  'auth/invalid-email': 'Enter a valid email address.',
  'auth/network-request-failed': 'Check your internet connection and try again.',
  'auth/operation-not-allowed': 'Account registration is not available right now.',
  'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.',
  'auth/weak-password': 'Choose a password with at least 8 characters.',
}

const getAuthMessage = (error) => AUTH_MESSAGES[error.code] || 'We could not complete that request. Please try again.'

function Auth() {
  const [mode, setMode] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const switchMode = (nextMode) => {
    setMode(nextMode)
    setMessage('')
    setError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')

    try {
      if (mode === 'signup') {
        const credential = await createUserWithEmailAndPassword(auth, email, password)
        await sendEmailVerification(credential.user)
        await signOut(auth)
        setMessage('Check your email to confirm your account, then sign in.')
      } else {
        await signInWithEmailAndPassword(auth, email, password)
      }
    } catch (authError) {
      setError(getAuthMessage(authError))
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordReset = async () => {
    if (!email) {
      setError('Enter your email address first.')
      return
    }

    setLoading(true)
    setMessage('')
    setError('')

    try {
      await sendPasswordResetEmail(auth, email)
      setMessage('Password reset instructions have been sent to your email.')
    } catch (authError) {
      setError(getAuthMessage(authError))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-intro">
        <div className="auth-brand"><span>CF</span> ClientFlow</div>
        <div className="auth-copy">
          <span className="auth-eyebrow">CLIENT PROJECT MANAGEMENT</span>
          <h1>Keep every client project moving.</h1>
          <p>One focused workspace for client details, deadlines and project progress.</p>
          <ul>
            <li><span>01</span>Organized project overview</li>
            <li><span>02</span>Private account-based workspace</li>
            <li><span>03</span>Secure cloud data</li>
          </ul>
        </div>
        <small>Simple workflows. Clear progress.</small>
      </section>

      <section className="auth-panel">
        <div className="auth-card">
          <div className="auth-card-heading">
            <span className="auth-mobile-logo">CF</span>
            <h2>{mode === 'signin' ? 'Welcome back' : 'Create your workspace'}</h2>
            <p>{mode === 'signin' ? 'Sign in to manage your client projects.' : 'Start organizing your client work in one place.'}</p>
          </div>

          <div className="auth-tabs" role="tablist" aria-label="Account access">
            <button type="button" className={mode === 'signin' ? 'active' : ''} onClick={() => switchMode('signin')}>Sign in</button>
            <button type="button" className={mode === 'signup' ? 'active' : ''} onClick={() => switchMode('signup')}>Create account</button>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label htmlFor="auth-email">Email address</label>
            <input id="auth-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@company.com" maxLength="254" required />

            <div className="password-label">
              <label htmlFor="auth-password">Password</label>
              {mode === 'signin' ? <button type="button" onClick={handlePasswordReset} disabled={loading}>Forgot password?</button> : null}
            </div>
            <input id="auth-password" type="password" autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Minimum 8 characters" minLength="8" required />

            {error ? <p className="auth-notice error" role="alert">{error}</p> : null}
            {message ? <p className="auth-notice success" role="status">{message}</p> : null}

            <button className="auth-submit" type="submit" disabled={loading}>
              {loading ? 'Please wait…' : mode === 'signin' ? 'Sign in to ClientFlow' : 'Create account'}
            </button>
          </form>

          <p className="auth-terms">By continuing, you agree to use ClientFlow responsibly and keep your account details secure.</p>
        </div>
      </section>
    </main>
  )
}

export function VerifyEmail({ user, onVerified }) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const checkVerification = async () => {
    setLoading(true)
    setError('')
    try {
      await reload(user)
      if (user.emailVerified) {
        onVerified({ uid: user.uid, email: user.email, emailVerified: true })
      } else {
        setError('Your email has not been confirmed yet.')
      }
    } catch {
      setError('We could not check your email status. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const resendVerification = async () => {
    setLoading(true)
    setError('')
    try {
      await sendEmailVerification(user)
      setMessage('A new confirmation email has been sent.')
    } catch (authError) {
      setError(getAuthMessage(authError))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page recovery-page">
      <section className="auth-panel">
        <div className="auth-card verification-card">
          <div className="auth-card-heading">
            <span className="auth-mobile-logo recovery-logo">CF</span>
            <h2>Confirm your email</h2>
            <p>We sent a confirmation link to <strong>{user.email}</strong>. Open it before continuing to your workspace.</p>
          </div>
          {error ? <p className="auth-notice error" role="alert">{error}</p> : null}
          {message ? <p className="auth-notice success" role="status">{message}</p> : null}
          <div className="verification-actions">
            <button className="auth-submit" type="button" onClick={checkVerification} disabled={loading}>{loading ? 'Checking…' : 'I confirmed my email'}</button>
            <button className="auth-link-button" type="button" onClick={resendVerification} disabled={loading}>Resend confirmation email</button>
            <button className="auth-link-button muted" type="button" onClick={() => signOut(auth)}>Use another account</button>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Auth
