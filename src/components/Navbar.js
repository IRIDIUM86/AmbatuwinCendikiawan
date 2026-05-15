import { User } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo/Platform Name on Left */}
        <div className="text-xl font-bold text-gray-900">SME Bazaar</div>
        
        {/* Navigation Links in Center */}
        <div className="flex gap-6">
          <Link to="/dashboard" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
            Dashboard
          </Link>
          <Link to="/applications" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
            My Applications
          </Link>
          <Link to="/opportunities" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
            Opportunities
          </Link>
        </div>
        
        {/* User Profile Avatar on Right */}
        <Link to="/profile" className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors duration-200">
          <User size={20} />
        </Link>
      </div>
    </nav>
  )
}
