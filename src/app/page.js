import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative h-[600px]">
        <Image
          src="/salon-hero.jpg"
          alt="Bossin Salon"
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Bossin Salon</h1>
          <p className="text-xl md:text-2xl mb-8">Where Style Meets Excellence</p>
          <Link
            href="/book"
            className="hover:shadow-inner hover:shadow-black hover:scale-95 px-8 py-3 rounded-full bg-white text-black transition-colors"
          >
            Book Now
          </Link>
        </div>
      </div>

      {/* Services Section */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Hair Services */}
          <div className="bg-slate-800 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="h-48 relative mb-4 rounded-lg overflow-hidden">
              <Image
                src="/hair-service.jpg"
                alt="Hair Services"
                fill
                className="object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold mb-2">Hair Services</h3>
            <p className="text-gray-600 mb-4">Expert styling, cutting, and coloring services for all hair types.</p>
            <Link href="/services/hair" className="text-white font-medium hover:underline">
              Learn More →
            </Link>
          </div>

          {/* Spa Services */}
          <div className="bg-slate-800 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="h-48 relative mb-4 rounded-lg overflow-hidden">
              <Image
                src="/spa-service.jpg"
                alt="Spa Services"
                fill
                className="object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold mb-2">Spa Services</h3>
            <p className="text-gray-600 mb-4">Relaxing treatments and therapies for your wellness journey.</p>
            <Link href="/services/spa" className="text-white font-medium hover:underline">
              Learn More →
            </Link>
          </div>

          {/* Beauty Services */}
          <div className="bg-slate-800 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="h-48 relative mb-4 rounded-lg overflow-hidden">
              <Image
                src="/beauty-service.jpg"
                alt="Beauty Services"
                fill
                className="object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold mb-2">Beauty Services</h3>
            <p className="text-gray-600 mb-4">Complete beauty solutions from makeup to nail care.</p>
            <Link href="/services/beauty" className="text-white font-medium hover:underline">
              Learn More →
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-slate-800 py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Choose Bossin Salon</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl mb-4">👩‍💇</div>
              <h3 className="text-xl font-semibold mb-2">Expert Stylists</h3>
              <p className="text-gray-600">Highly trained professionals with years of experience</p>
            </div>
            <div>
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-xl font-semibold mb-2">Premium Products</h3>
              <p className="text-gray-600">Using only the best beauty and care products</p>
            </div>
            <div>
              <div className="text-4xl mb-4">🌟</div>
              <h3 className="text-xl font-semibold mb-2">Modern Techniques</h3>
              <p className="text-gray-600">Latest styling and treatment methods</p>
            </div>
            <div>
              <div className="text-4xl mb-4">💝</div>
              <h3 className="text-xl font-semibold mb-2">Satisfaction Guaranteed</h3>
              <p className="text-gray-600">Your happiness is our priority</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 md:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Look?</h2>
          <p className="text-gray-600 mb-8">Book your appointment today and experience the Bossin difference.</p>
          <Link
            href="/book"
            className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition-colors inline-block"
          >
            Book Your Appointment
          </Link>
        </div>
      </section>
    </div>
  );
}
