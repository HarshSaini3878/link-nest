'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'  // Import useSession from NextAuth
import Link from 'next/link'
import { Poppins } from 'next/font/google'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
})

const gradients = [
  'from-purple-600 via-pink-500 to-red-500',
  'from-blue-500 via-teal-400 to-green-500',
  'from-yellow-400 via-orange-500 to-red-600',
  'from-indigo-600 via-purple-500 to-pink-500',
]

export default function LandingPage() {
  const [currentGradient, setCurrentGradient] = useState(0)
  const { data: session } = useSession()  // Access the session to check if the user is logged in

  const changeGradient = () => {
    setCurrentGradient((prev) => (prev + 1) % gradients.length)
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${gradients[currentGradient]} flex flex-col items-center justify-center p-4 ${poppins.className}`} >
      <div className="glassmorphism-card max-w-2xl w-full text-center p-8 rounded-3xl">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
          Link<span className="text-yellow-300">Nest</span>
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-white">
          One link to rule them all.
        </p>
        {!session ? (
          <Link href="/signup" className="btn-primary">
            Create Your LinkNest
          </Link>
        ) : (
          <Link href="/dashboard" className="btn-primary">
            Go to Dashboard
          </Link>
        )}
      </div>
      
      <button  className="mt-8 btn-secondary" onClick={changeGradient}>
        Change Background
      </button>
    </div>
  )
}
