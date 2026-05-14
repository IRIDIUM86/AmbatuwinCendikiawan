import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { BrowserRouter } from 'react-router-dom'
import Navbar from './Navbar'

describe('Navbar Component', () => {
  const renderNavbar = () => {
    return render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    )
  }

  describe('Navigation Links Rendering', () => {
    test('renders all three navigation links', () => {
      renderNavbar()
      const dashboardLink = screen.getByText('Dashboard')
      const applicationsLink = screen.getByText('My Applications')
      const opportunitiesLink = screen.getByText('Opportunities')
      
      expect(dashboardLink).toBeInTheDocument()
      expect(applicationsLink).toBeInTheDocument()
      expect(opportunitiesLink).toBeInTheDocument()
    })

    test('navigation links have correct href attributes', () => {
      renderNavbar()
      const dashboardLink = screen.getByText('Dashboard').closest('a')
      const applicationsLink = screen.getByText('My Applications').closest('a')
      const opportunitiesLink = screen.getByText('Opportunities').closest('a')
      
      expect(dashboardLink).toHaveAttribute('href', '/dashboard')
      expect(applicationsLink).toHaveAttribute('href', '/applications')
      expect(opportunitiesLink).toHaveAttribute('href', '/opportunities')
    })

    test('each navigation link is an anchor element', () => {
      renderNavbar()
      const dashboardLink = screen.getByText('Dashboard').closest('a')
      const applicationsLink = screen.getByText('My Applications').closest('a')
      const opportunitiesLink = screen.getByText('Opportunities').closest('a')
      
      expect(dashboardLink.tagName).toBe('A')
      expect(applicationsLink.tagName).toBe('A')
      expect(opportunitiesLink.tagName).toBe('A')
    })

    test('navigation links have correct styling classes', () => {
      renderNavbar()
      const dashboardLink = screen.getByText('Dashboard')
      const applicationsLink = screen.getByText('My Applications')
      const opportunitiesLink = screen.getByText('Opportunities')
      
      expect(dashboardLink).toHaveClass('text-gray-600', 'hover:text-gray-900', 'transition-colors', 'duration-200')
      expect(applicationsLink).toHaveClass('text-gray-600', 'hover:text-gray-900', 'transition-colors', 'duration-200')
      expect(opportunitiesLink).toHaveClass('text-gray-600', 'hover:text-gray-900', 'transition-colors', 'duration-200')
    })
  })

  describe('User Avatar Display', () => {
    test('renders user avatar on right side', () => {
      const { container } = renderNavbar()
      const profileLink = container.querySelector('a[href="/profile"]')
      
      expect(profileLink).toBeInTheDocument()
    })

    test('user avatar has correct styling classes', () => {
      const { container } = renderNavbar()
      const profileLink = container.querySelector('a[href="/profile"]')
      
      expect(profileLink).toHaveClass('w-10', 'h-10', 'rounded-full', 'bg-blue-600', 'text-white', 'flex', 'items-center', 'justify-center')
    })

    test('user avatar has hover styling', () => {
      const { container } = renderNavbar()
      const profileLink = container.querySelector('a[href="/profile"]')
      
      expect(profileLink).toHaveClass('hover:bg-blue-700', 'transition-colors', 'duration-200')
    })

    test('user avatar contains User icon from lucide-react', () => {
      const { container } = renderNavbar()
      const profileLink = container.querySelector('a[href="/profile"]')
      const svg = profileLink.querySelector('svg')
      
      expect(svg).toBeInTheDocument()
    })

    test('user avatar icon has correct size', () => {
      const { container } = renderNavbar()
      const profileLink = container.querySelector('a[href="/profile"]')
      const svg = profileLink.querySelector('svg')
      
      // lucide-react User icon with size={20} renders as 20x20
      expect(svg).toHaveAttribute('width', '20')
      expect(svg).toHaveAttribute('height', '20')
    })
  })

  describe('Sticky Positioning', () => {
    test('applies sticky positioning class', () => {
      const { container } = renderNavbar()
      const nav = container.querySelector('nav')
      
      expect(nav).toHaveClass('sticky')
    })

    test('applies top-0 positioning class', () => {
      const { container } = renderNavbar()
      const nav = container.querySelector('nav')
      
      expect(nav).toHaveClass('top-0')
    })

    test('applies z-50 stacking context', () => {
      const { container } = renderNavbar()
      const nav = container.querySelector('nav')
      
      expect(nav).toHaveClass('z-50')
    })

    test('applies all sticky positioning classes together', () => {
      const { container } = renderNavbar()
      const nav = container.querySelector('nav')
      
      expect(nav).toHaveClass('sticky', 'top-0', 'z-50')
    })
  })

  describe('Overall Navbar Styling', () => {
    test('applies white background color', () => {
      const { container } = renderNavbar()
      const nav = container.querySelector('nav')
      
      expect(nav).toHaveClass('bg-white')
    })

    test('applies shadow styling', () => {
      const { container } = renderNavbar()
      const nav = container.querySelector('nav')
      
      expect(nav).toHaveClass('shadow-md')
    })

    test('applies all navbar styling classes', () => {
      const { container } = renderNavbar()
      const nav = container.querySelector('nav')
      
      expect(nav).toHaveClass('sticky', 'top-0', 'z-50', 'bg-white', 'shadow-md')
    })

    test('renders platform logo/name on left side', () => {
      renderNavbar()
      const logo = screen.getByText('SME Bazaar')
      expect(logo).toBeInTheDocument()
      expect(logo).toHaveClass('text-xl', 'font-bold', 'text-gray-900')
    })
  })

  describe('Layout Structure', () => {
    test('navbar has proper flex layout', () => {
      const { container } = renderNavbar()
      const navContainer = container.querySelector('nav > div')
      
      expect(navContainer).toHaveClass('container', 'mx-auto', 'px-4', 'py-3', 'flex', 'justify-between', 'items-center')
    })

    test('navigation links are grouped in center', () => {
      const { container } = renderNavbar()
      const navLinksContainer = container.querySelector('div.flex.gap-6')
      
      expect(navLinksContainer).toBeInTheDocument()
      expect(navLinksContainer).toHaveClass('flex', 'gap-6')
    })

    test('navbar maintains proper spacing', () => {
      const { container } = renderNavbar()
      const navContainer = container.querySelector('nav > div')
      
      expect(navContainer).toHaveClass('px-4', 'py-3')
    })
  })

  describe('Accessibility', () => {
    test('all links are keyboard accessible', () => {
      renderNavbar()
      const dashboardLink = screen.getByText('Dashboard').closest('a')
      const applicationsLink = screen.getByText('My Applications').closest('a')
      const opportunitiesLink = screen.getByText('Opportunities').closest('a')
      
      expect(dashboardLink.tagName).toBe('A')
      expect(applicationsLink.tagName).toBe('A')
      expect(opportunitiesLink.tagName).toBe('A')
    })

    test('profile avatar link is keyboard accessible', () => {
      const { container } = renderNavbar()
      const profileLink = container.querySelector('a[href="/profile"]')
      
      expect(profileLink.tagName).toBe('A')
    })
  })

  describe('Snapshot Test', () => {
    test('navbar renders correctly and matches snapshot', () => {
      const { container } = renderNavbar()
      expect(container.querySelector('nav')).toMatchSnapshot()
    })
  })
})
