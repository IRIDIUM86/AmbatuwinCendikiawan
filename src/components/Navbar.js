import { User } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav 
      className="sticky top-0 z-50 border-b" 
      style={{ 
        background: 'oklch(99% 0.005 85)',
        borderColor: 'oklch(90% 0.01 85)'
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 py-5 sm:py-6 flex items-center relative">
        {/* Logo/Platform Name on Left */}
        <div 
          className="text-xl sm:text-2xl font-bold"
          style={{ 
            color: 'oklch(25% 0.015 15)',
            fontFamily: "'Space Grotesk', 'Inter', sans-serif",
            letterSpacing: '-0.02em'
          }}
        >
          SME Bazaar
        </div>
        
        {/* Navigation Links - Aligned to right, before avatar - Hidden on mobile */}
        <div className="hidden md:flex gap-6 lg:gap-8 ml-auto mr-4">
          <Link 
            to="/" 
            className="font-semibold text-sm transition-colors duration-200 hover:underline focus:outline-none focus:underline"
            style={{ 
              color: 'oklch(45% 0.02 15)',
              letterSpacing: '-0.01em'
            }}
            onMouseEnter={(e) => e.target.style.color = 'oklch(25% 0.015 15)'}
            onMouseLeave={(e) => e.target.style.color = 'oklch(45% 0.02 15)'}
          >
            Browse Events
          </Link>
          <Link 
            to="/profile" 
            className="font-semibold text-sm transition-colors duration-200 hover:underline focus:outline-none focus:underline"
            style={{ 
              color: 'oklch(45% 0.02 15)',
              letterSpacing: '-0.01em'
            }}
            onMouseEnter={(e) => e.target.style.color = 'oklch(25% 0.015 15)'}
            onMouseLeave={(e) => e.target.style.color = 'oklch(45% 0.02 15)'}
          >
            Profile
          </Link>
        </div>
        
        {/* User Profile Avatar on Right - Larger touch target */}
        <Link 
          to="/profile" 
          className="w-11 h-11 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
          style={{
            background: 'linear-gradient(135deg, oklch(45% 0.15 25) 0%, oklch(55% 0.18 35) 100%)',
            color: 'oklch(99% 0.005 85)',
            boxShadow: '0 2px 8px oklch(45% 0.15 25 / 0.25)',
            ringColor: 'oklch(45% 0.15 25)',
            ringOffsetColor: 'oklch(97% 0.008 85)'
          }}
          aria-label="View profile"
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)'
            e.currentTarget.style.boxShadow = '0 4px 16px oklch(45% 0.15 25 / 0.35)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 2px 8px oklch(45% 0.15 25 / 0.25)'
          }}
        >
          <User size={20} />
        </Link>
      </div>
    </nav>
  )
}
