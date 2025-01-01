'use client'

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

const Signin = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    })

    if (res?.error) {
      setError(res.error)
    } else {
      router.push("/") // Redirect to home page on successful login
    }
  }

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

      {/* Signin Form */}
      <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-96 z-20 relative backdrop-filter backdrop-blur-sm bg-opacity-80">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-100">Sign In</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="sr-only">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full px-4 py-2 rounded-md border border-gray-600 bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 placeholder-gray-400"
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full px-4 py-2 rounded-md border border-gray-600 bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 placeholder-gray-400"
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-blue-600 text-gray-100 py-2 rounded-md hover:bg-blue-700 transition duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Sign In
          </button>
          {error && (
            <p className="text-red-400 text-center" role="alert">
              {error}
            </p>
          )}
        </form>
        <div className="mt-4 text-center">
          <Link href="/signup" className="text-blue-400 hover:text-blue-300 transition duration-200">
            Don't have an account? Sign up
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Signin

