import { AlertCircle } from 'lucide-react'

export default function ErrorMessage({ message, error, onRetry }) {
  const errorText = message || error || 'An error occurred. Please try again.'
  
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-red-50 border border-red-200 rounded-xl shadow-md">
      {/* Error Icon */}
      <AlertCircle size={48} className="text-red-600 mb-4" />
      
      {/* Error Message Text */}
      <p className="text-gray-900 text-center mb-4 font-medium">
        {errorText}
      </p>
      
      {/* Retry Button */}
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-200 font-medium"
        >
          Retry
        </button>
      )}
    </div>
  )
}
