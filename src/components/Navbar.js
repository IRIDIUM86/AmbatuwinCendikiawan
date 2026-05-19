import { User, LogOut } from 'lucide-react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const TERRACOTTA = 'oklch(45% 0.15 25)'
const TEXT_PRIMARY = 'oklch(25% 0.015 15)'
const TEXT_SECONDARY = 'oklch(45% 0.02 15)'
const SURFACE = 'oklch(99% 0.005 85)'
const BORDER = 'oklch(90% 0.01 85)'
const HEADING_FONT = "'Space Grotesk', 'Inter', sans-serif"

const NAV_LINKS = [
  { to: '/', label: 'Home', exact: true },
  { to: '/events', label: 'Events' },
  { to: '/apply', label: 'Apply' },
]

export default function Navbar() {
  const { isAuthed, user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <nav
      className="sticky top-0 z-50 border-b"
      style={{ background: SURFACE, borderColor: BORDER }}
    >
      <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
        {/* Logo */}
        <Link
          to="/"
          className="text-xl sm:text-2xl font-bold flex-shrink-0"
          style={{
            color: TEXT_PRIMARY,
            fontFamily: HEADING_FONT,
            letterSpacing: '-0.02em',
          }}
        >
          Ambatuwin{' '}
          <span style={{ color: TERRACOTTA }}>Cendikiawan</span>
        </Link>

        {/* Center nav (desktop) */}
        <div className="hidden md:flex gap-7 ml-10">
          {NAV_LINKS.map(({ to, label, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              className="text-sm font-semibold transition-colors"
              style={({ isActive }) => ({
                color: isActive ? TEXT_PRIMARY : TEXT_SECONDARY,
                letterSpacing: '-0.01em',
                borderBottom: isActive
                  ? `2px solid ${TERRACOTTA}`
                  : '2px solid transparent',
                paddingBottom: '4px',
              })}
            >
              {label}
            </NavLink>
          ))}
        </div>

        {/* Right cluster */}
        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          {isAuthed ? (
            <>
              <Link
                to="/profile"
                className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-full text-sm font-semibold"
                style={{ color: TEXT_SECONDARY }}
                title={user?.email}
              >
                <span
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{
                    background:
                      'linear-gradient(135deg, oklch(45% 0.15 25) 0%, oklch(55% 0.18 35) 100%)',
                    color: SURFACE,
                  }}
                >
                  <User size={16} />
                </span>
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full text-sm font-semibold"
                style={{
                  background: 'transparent',
                  color: TEXT_SECONDARY,
                  border: `1px solid ${BORDER}`,
                }}
              >
                <LogOut size={14} />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 rounded-full text-sm font-semibold"
                style={{ color: TEXT_SECONDARY }}
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="px-4 sm:px-5 py-2 rounded-full text-sm font-semibold"
                style={{
                  background: TERRACOTTA,
                  color: SURFACE,
                  letterSpacing: '-0.01em',
                  boxShadow: '0 2px 8px oklch(45% 0.15 25 / 0.25)',
                }}
              >
                Join
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
