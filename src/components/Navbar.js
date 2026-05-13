import { User, Calendar, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex gap-6">
        <Link to="/profile" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors">
          <User size={20} />
          <span>Profile</span>
        </Link>
        <Link to="/events" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors">
          <Calendar size={20} />
          <span>Event Discovery</span>
        </Link>
        <Link to="/matchmaker" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors">
          <Sparkles size={20} />
          <span>AI Matchmaker</span>
        </Link>
      </div>
    </nav>
  )
}
