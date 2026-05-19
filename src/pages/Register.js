import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const TERRACOTTA = 'oklch(45% 0.15 25)'
const TEXT_PRIMARY = 'oklch(25% 0.015 15)'
const TEXT_SECONDARY = 'oklch(35% 0.02 15)'
const TEXT_TERTIARY = 'oklch(45% 0.02 15)'
const SURFACE = 'oklch(99% 0.005 85)'
const BORDER = 'oklch(88% 0.01 85)'
const HEADING_FONT = "'Space Grotesk', 'Inter', sans-serif"

const BUSINESS_TYPES = [
  ['food_beverage', 'Food & Beverage'],
  ['retail', 'Retail'],
  ['technology', 'Technology'],
  ['services', 'Services'],
  ['health_wellness', 'Health & Wellness'],
  ['education', 'Education'],
  ['entertainment', 'Entertainment'],
  ['fashion', 'Fashion'],
  ['home_garden', 'Home & Garden'],
  ['other', 'Other'],
]

export default function Register() {
  const navigate = useNavigate()
  const { register, loading } = useAuth()
  const [form, setForm] = useState({
    business_name: '',
    business_type: 'food_beverage',
    location: '',
    phone: '',
    email: '',
    password: '',
  })
  const [error, setError] = useState(null)
  const [info, setInfo] = useState(null)

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setInfo(null)

    if (!form.business_name.trim()) return setError('Business name is required.')
    if (!form.email.trim() || !form.password) return setError('Email and password are required.')
    if (form.password.length < 6) return setError('Password must be at least 6 characters.')
    if (form.phone && form.phone.length < 8)
      return setError('Phone number looks too short.')

    try {
      const result = await register({
        ...form,
        email: form.email.trim().toLowerCase(),
      })
      // If Supabase requires email confirmation, no access_token is returned.
      if (result?.access_token) {
        navigate('/profile', { replace: true })
      } else {
        setInfo(
          'Account created. Check your inbox to confirm your email, then sign in.',
        )
      }
    } catch (err) {
      setError(err.message || 'Registration failed.')
    }
  }

  return (
    <main
      className="min-h-[calc(100vh-72px)] flex items-center justify-center px-6 py-16"
      style={{ background: 'oklch(97% 0.008 85)' }}
    >
      <div
        className="w-full max-w-2xl rounded-2xl p-8 sm:p-10"
        style={{
          background: SURFACE,
          border: `1px solid ${BORDER}`,
          boxShadow:
            '0 1px 3px oklch(0% 0 0 / 0.06), 0 24px 80px oklch(0% 0 0 / 0.08)',
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
          Create your account
        </h1>
        <p className="mb-8 text-sm" style={{ color: TEXT_TERTIARY }}>
          A few details now, and your profile is ready for vendor applications.
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
        {info && (
          <div
            role="status"
            className="mb-5 px-4 py-3 rounded-lg text-sm"
            style={{
              background: 'oklch(95% 0.05 145)',
              color: 'oklch(30% 0.1 145)',
              border: '1px solid oklch(75% 0.12 145)',
            }}
          >
            {info}
          </div>
        )}

        <form onSubmit={onSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field
            wrap="sm:col-span-2"
            label="Business name"
            name="business_name"
            value={form.business_name}
            onChange={onChange}
            placeholder="e.g. Warung Sederhana"
            required
          />
          <SelectField
            label="Business type"
            name="business_type"
            value={form.business_type}
            onChange={onChange}
            options={BUSINESS_TYPES}
          />
          <Field
            label="Location"
            name="location"
            value={form.location}
            onChange={onChange}
            placeholder="City, region"
          />
          <Field
            label="Phone"
            name="phone"
            value={form.phone}
            onChange={onChange}
            placeholder="+62 ..."
          />
          <Field
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            placeholder="you@business.com"
            required
            autoComplete="email"
          />
          <Field
            wrap="sm:col-span-2"
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={onChange}
            placeholder="At least 6 characters"
            required
            autoComplete="new-password"
          />

          <button
            type="submit"
            disabled={loading}
            className="sm:col-span-2 w-full py-3 rounded-xl font-semibold text-sm mt-2"
            style={{
              background: TERRACOTTA,
              color: SURFACE,
              letterSpacing: '-0.01em',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? 'Creating...' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-sm text-center" style={{ color: TEXT_SECONDARY }}>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold" style={{ color: TERRACOTTA }}>
            Sign in
          </Link>
        </p>
      </div>
    </main>
  )
}

function Field({ label, name, wrap = '', ...rest }) {
  return (
    <div className={wrap}>
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

function SelectField({ label, name, options, ...rest }) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-xs font-semibold mb-2 uppercase"
        style={{ color: TEXT_TERTIARY, letterSpacing: '0.08em' }}
      >
        {label}
      </label>
      <select
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
      >
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </div>
  )
}
