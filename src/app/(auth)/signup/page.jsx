'use client'

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Poppins } from 'next/font/google'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
})

const Signup = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
      username,
    })

    if (res?.error) {
      setError(res.error)
    } else {
      router.push(`/dashboard`); // Redirect to home page on successful signup
    }
  }

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 relative overflow-hidden ${poppins.className}`}>
      {/* Animated background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-20 animate-pulse"></div>
      </div>
      
      {/* Signup Form */}
      <div className="glassmorphism-card-signin p-8 rounded-3xl shadow-2xl w-96 z-20 relative">
        <h1 className="text-4xl font-bold mb-6 text-center text-white">
          Link<span className="text-yellow-300">Nest</span>
        </h1>
        <h2 className="text-2xl font-semibold mb-6 text-center text-white">Sign Up</h2>
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
              className="w-full px-4 py-2 rounded-full border border-white/20 bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition duration-200"
            />
          </div>
          <div>
            <label htmlFor="username" className="sr-only">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
              className="w-full px-4 py-2 rounded-full border border-white/20 bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition duration-200"
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
              className="w-full px-4 py-2 rounded-full border border-white/20 bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition duration-200"
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-yellow-400 text-purple-900 py-2 rounded-full hover:bg-yellow-300 transition duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-300 font-semibold"
          >
            Sign Up
          </button>
          {error && (
            <p className="text-red-300 text-center" role="alert">
              {error}
            </p>
          )}
        </form>
        <div className="mt-6 text-center">
          <Link href="/signin" className="text-white hover:text-yellow-300 transition duration-200">
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Signup

