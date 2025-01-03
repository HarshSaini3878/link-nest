import { Button } from '../ui/button'
import Image from 'next/image'

export default function Hero() {
  return (
    <section className="py-20 px-4 md:px-6 lg:px-8">
      <div className="container mx-auto flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-10 md:mb-0">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            One Link for All Your Content
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Share your entire online presence with a single link. Simple, fast, and customizable.
          </p>
          <Button size="lg" className="text-lg px-8 py-4">
            Get Started for Free
          </Button>
        </div>
        <div className="md:w-1/2">
          <Image
            src="/placeholder.svg?height=400&width=400"
            alt="LinkNest Demo"
            width={400}
            height={400}
            className="rounded-lg shadow-lg"
          />
        </div>
      </div>
    </section>
  )
}