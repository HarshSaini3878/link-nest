'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AlertCircle } from 'lucide-react'

export default function AuthError({
  error = "An unexpected authentication error occurred.",
  status = 401,
}) {
  const router = useRouter()

  useEffect(() => {
    // Log the error (you might want to send this to your error tracking service)
    console.error('Auth error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0 opacity-50" 
        style={{backgroundImage: "url('/placeholder.svg?height=1080&width=1920')"}}
        aria-hidden="true"
      ></div>
      
      {/* Wavy Overlay */}
      <div className="absolute inset-0 z-10" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="absolute bottom-0 left-0 w-full">
          <path fill="rgba(75,85,99,0.3)" fillOpacity="1" d="M0,128L48,138.7C96,149,192,171,288,165.3C384,160,480,128,576,128C672,128,768,160,864,165.3C960,171,1056,149,1152,128C1248,107,1344,85,1392,74.7L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>

      {/* Error Content */}
      <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-96 z-20 relative backdrop-filter backdrop-blur-sm bg-opacity-80">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-400" aria-hidden="true" />
          <h1 className="mt-3 text-2xl font-semibold text-gray-100">Authentication Error</h1>
          <p className="mt-2 text-gray-300">{error}</p>
          <p className="mt-1 text-sm text-gray-400">Status: {status}</p>
        </div>
        <div className="mt-6 flex flex-col space-y-4">
          <button
            onClick={() => router.back()}
            className="w-full bg-blue-600 text-gray-100 py-2 rounded-md hover:bg-blue-700 transition duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Go Back
          </button>
          <Link 
            href="/signin" 
            className="w-full bg-gray-700 text-gray-100 py-2 rounded-md hover:bg-gray-600 transition duration-200 text-center focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Return to Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}

