import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const TERRACOTTA = 'oklch(45% 0.15 25)'
const TEXT_PRIMARY = 'oklch(25% 0.015 15)'
const TEXT_SECONDARY = 'oklch(35% 0.02 15)'
const TEXT_TERTIARY = 'oklch(45% 0.02 15)'
const SURFACE = 'oklch(99% 0.005 85)'
const BORDER = 'oklch(88% 0.01 85)'
const HEADING_FONT = "'Space Grotesk', 'Inter', sans-serif"

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, loading } = useAuth()
  const redirectTo = location.state?.from || '/events'

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState(null)

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    if (!form.email || !form.password) {
      setError('Email and password are required.')
      return
    }
    try {
      await login(form.email.trim(), form.password)
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(err.message || 'Could not sign in.')
    }
  }

  return (
    <main
      className="min-h-[calc(100vh-72px)] flex items-center justify-center px-6 py-16"
      style={{ background: 'oklch(97% 0.008 85)' }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-8 sm:p-10"
        style={{
          background: SURFACE,
          border: `1px solid ${BORDER}`,
          boxShadow: '0 1px 3px oklch(0% 0 0 / 0.06), 0 24px 80px oklch(0% 0 0 / 0.08)',
        }}
      >
        <h1
          className="text-3xl font-bold mb-2"
          style={{
            fontFamily: HEADING_FONT,
            letterSpacing: '-0.025em',
            color: TEXT_PRIMARY,
          }}
        >
          Sign in
        </h1>
        <p className="mb-8 text-sm" style={{ color: TEXT_TERTIARY }}>
          Welcome back to Ambatuwin Cendikiawan.
        </p>

        {error && (
          <div
            role="alert"
            className="mb-5 px-4 py-3 rounded-lg text-sm"
            style={{
              background: 'oklch(95% 0.05 25)',
              color: 'oklch(35% 0.08 25)',
              border: '1px solid oklch(85% 0.06 25)',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-5">
          <Field
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            placeholder="you@business.com"
            autoComplete="email"
          />
          <Field
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={onChange}
            placeholder="At least 6 characters"
            autoComplete="current-password"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-sm"
            style={{
              background: TERRACOTTA,
              color: SURFACE,
              letterSpacing: '-0.01em',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-sm text-center" style={{ color: TEXT_SECONDARY }}>
          New here?{' '}
          <Link
            to="/register"
            className="font-semibold"
            style={{ color: TERRACOTTA }}
          >
            Create an account
          </Link>
        </p>
      </div>
    </main>
  )
}

function Field({ label, name, ...rest }) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-xs font-semibold mb-2 uppercase"
        style={{ color: TEXT_TERTIARY, letterSpacing: '0.08em' }}
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        {...rest}
        className="w-full px-4 py-3 rounded-xl outline-none text-base"
        style={{
          background: 'oklch(97% 0.008 85)',
          border: `2px solid ${BORDER}`,
          color: TEXT_PRIMARY,
        }}
        onFocus={(e) => (e.target.style.borderColor = TERRACOTTA)}
        onBlur={(e) => (e.target.style.borderColor = BORDER)}
      />
    </div>
  )
}
