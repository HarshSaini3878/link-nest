import Link from 'next/link'
import { Button } from '../ui/button'

export default function Header() {
  return (
    <header className="py-6 px-4 md:px-6 lg:px-8">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-primary">
          LinkNest
        </Link>
        <nav className="hidden md:flex space-x-6">
          <Link href="#features" className="text-gray-600 hover:text-primary">Features</Link>
          <Link href="#how-it-works" className="text-gray-600 hover:text-primary">How It Works</Link>
          <Link href="#pricing" className="text-gray-600 hover:text-primary">Pricing</Link>
        </nav>
        <div className="flex space-x-4">
          <Button variant="outline">Log In</Button>
          <Button>Sign Up</Button>
        </div>
      </div>
    </header>
  )
}

