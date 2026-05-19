import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h1 className="text-3xl font-bold mb-4">404 - Page Not Found</h1>
      <Link to="/" className="text-blue-600 hover:underline">
        Return to Home
      </Link>
    </div>
  )
}
