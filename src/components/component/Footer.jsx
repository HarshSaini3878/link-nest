import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-100 py-8 px-4 md:px-6 lg:px-8">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <Link href="/" className="text-xl font-bold text-primary">
            LinkNest
          </Link>
          <p className="text-sm text-gray-600 mt-2">
            © {new Date().getFullYear()} LinkNest. All rights reserved.
          </p>
        </div>
        <nav className="flex flex-wrap justify-center md:justify-end gap-6">
          <Link href="#" className="text-gray-600 hover:text-primary">
            Privacy Policy
          </Link>
          <Link href="#" className="text-gray-600 hover:text-primary">
            Terms of Service
          </Link>
          <Link href="#" className="text-gray-600 hover:text-primary">
            Contact Us
          </Link>
        </nav>
      </div>
    </footer>
  )
}
