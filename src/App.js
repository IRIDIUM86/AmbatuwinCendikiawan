import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ApplyVendor from './pages/ApplyVendor'
import Profile from './pages/Profile'
import EventDiscoveryComplete from './pages/EventDiscoveryComplete'
import NotFound from './pages/NotFound'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen" style={{ background: 'oklch(97% 0.008 85)' }}>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<EventDiscoveryComplete />} />
            <Route path="/apply" element={<ApplyVendor />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
