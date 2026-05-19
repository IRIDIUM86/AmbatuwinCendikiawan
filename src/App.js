import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Profile from './pages/Profile'
import EventDiscoveryComplete from './pages/EventDiscoveryComplete'
import NotFound from './pages/NotFound'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen" style={{ background: '#F8F7F5' }}>
        <Navbar />
        <Routes>
          <Route path="/" element={<EventDiscoveryComplete />} />
          <Route path="/events" element={<EventDiscoveryComplete />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
