import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Profile from './pages/Profile'
import EventDiscoveryComplete from './pages/EventDiscoveryComplete'
import AIMatchmaker from './pages/AIMatchmaker'
import NotFound from './pages/NotFound'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<EventDiscoveryComplete />} />
          <Route path="/events" element={<EventDiscoveryComplete />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/matchmaker" element={<AIMatchmaker />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
