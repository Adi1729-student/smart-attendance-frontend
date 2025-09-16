import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import { v4 as uuidv4 } from 'uuid'

function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [mode, setMode] = useState<'signup' | 'login'>('signup')
  const [user, setUser] = useState<any>(null)
  const [deviceBound, setDeviceBound] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const ensureUserExists = async (id: string, email: string) => {
    try {
      await fetch('http://localhost:3000/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, email })
      })
    } catch (err: any) {
      console.error('User insert error:', err.message)
    }
  }

  const handleSignup = async () => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) setMessage(error.message)
    else {
      if (data.user) await ensureUserExists(data.user.id, email)
      setMessage('✅ Check your email for verification link!')
    }
  }

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setMessage(error.message)
    else {
      if (data.user) await ensureUserExists(data.user.id, email)
      setMessage('✅ Logged in successfully!')
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setDeviceBound(false)
    setMessage('Logged out')
  }

  const bindDevice = async () => {
    const deviceId = uuidv4()
    const payload = {
      user_id: user.id,
      device_id: deviceId,
      pubkey: 'dummy-public-key'
    }

    try {
      const res = await fetch('http://localhost:3000/devices/bind', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await res.json()
      if (res.ok) {
        setDeviceBound(true)
        setMessage('✅ Device bound successfully!')
      } else {
        setMessage('❌ Error: ' + data.error.message)
      }
    } catch (err: any) {
      setMessage('❌ Network error: ' + err.message)
    }
  }

  if (user) {
    return (
      <div style={{ padding: 20 }}>
        <h1>Welcome, {user.email}</h1>
        <button onClick={handleLogout}>Logout</button>

        <div style={{ marginTop: 30 }}>
          {deviceBound ? (
            <p>📡 Device already bound</p>
          ) : (
            <button onClick={bindDevice}>Bind This Device</button>
          )}
        </div>

        <p>{message}</p>
      </div>
    )
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Smart Attendance — {mode === 'signup' ? 'Sign Up' : 'Login'}</h1>

      <input
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      /><br />

      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      /><br />

      {mode === 'signup' ? (
        <button onClick={handleSignup}>Sign Up</button>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}

      <p>{message}</p>

      <div style={{ marginTop: 20 }}>
        <button onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}>
          Switch to {mode === 'signup' ? 'Login' : 'Sign Up'}
        </button>
      </div>
    </div>
  )
}

export default App
