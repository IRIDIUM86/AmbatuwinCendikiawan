import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import crudApi from '../services/crudApi'

const STORAGE_KEY = 'amba.session.v1'

const AuthContext = createContext(null)

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch (_) {
    return null
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => readStored())
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (session) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [session])

  const login = useCallback(async (email, password) => {
    setLoading(true)
    try {
      const res = await crudApi.login(email, password)
      const data = res?.data || res
      const next = {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        user: data.user,
      }
      setSession(next)
      return next
    } finally {
      setLoading(false)
    }
  }, [])

  const register = useCallback(async (payload) => {
    setLoading(true)
    try {
      const res = await crudApi.register(payload)
      const data = res?.data || res
      if (data?.access_token && data?.user) {
        const next = {
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
          user: data.user,
        }
        setSession(next)
      }
      return data
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      if (session?.accessToken) await crudApi.logout(session.accessToken)
    } catch (_) {
      // ignore network errors on logout
    }
    setSession(null)
  }, [session])

  const value = useMemo(
    () => ({
      session,
      user: session?.user || null,
      isAuthed: !!session?.user,
      loading,
      login,
      register,
      logout,
    }),
    [session, loading, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
