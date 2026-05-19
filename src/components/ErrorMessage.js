import { AlertCircle } from 'lucide-react'

export default function ErrorMessage({ message, error, onRetry }) {
  const errorText = message || error || 'An error occurred. Please try again.'
  
  return (
    <div 
      className="flex flex-col items-center justify-center p-6 bg-red-500/10 border border-red-500/30 rounded-xl"
      role="alert"
      aria-live="assertive"
    >
      {/* Error Icon */}
      <AlertCircle size={48} className="text-red-400 mb-4" aria-hidden="true" />
      
      {/* Error Message Text */}
      <p className="text-gray-200 text-center mb-4 font-medium max-w-md break-words">
        {errorText}
      </p>
      
      {/* Retry Button */}
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-[#202123] transition-colors duration-200 font-medium"
          aria-label="Retry loading"
        >
          Retry
        </button>
      )}
    </div>
  )
}
