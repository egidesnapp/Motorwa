import Link from 'next/link';
import { Car, Shield, CheckCircle, Wrench, CreditCard, Search, Star, MapPin, Gauge, Fuel, Settings } from 'lucide-react';
import CarCard from '@/components/CarCard';

const categories = [
  { name: 'SUV', icon: Car },
  { name: 'Sedan', icon: Car },
  { name: 'Pickup', icon: Car },
  { name: 'Minivan', icon: Car },
  { name: 'Hatchback', icon: Car },
  { name: 'Van', icon: Car },
];

const howItWorks = [
  {
    step: 1,
    title: 'Post Your Car',
    description: 'Takes 5 minutes. Add photos, set your price, and publish.',
    icon: Car,
  },
  {
    step: 2,
    title: 'Connect With Buyers',
    description: 'Secure messaging. No spam, no scams, verified buyers only.',
    icon: MessageSquare,
  },
  {
    step: 3,
    title: 'Sell With Confidence',
    description: 'Verified buyers, optional inspections, secure payments.',
    icon: Shield,
  },
];

const stats = [
  { label: 'Active Listings', value: 1250 },
  { label: 'Verified Sellers', value: 890 },
  { label: 'Dealers', value: 45 },
  { label: 'Cars Sold', value: 3200 },
];

function MessageSquare(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>;
}

export default function Home() {
  return (
    <div>
      {/* SECTION 1 — Hero */}
      <section className="bg-gradient-to-br from-navy to-navy-light py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Rwanda's Trusted Car Marketplace
          </h1>
          <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Buy and sell cars safely — with verified sellers and real prices
          </p>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto bg-white rounded-xl p-4 shadow-xl">
            <div className="flex flex-col md:flex-row gap-3">
              <select className="input flex-1">
                <option value="">Make</option>
                <option value="Toyota">Toyota</option>
                <option value="Nissan">Nissan</option>
                <option value="Honda">Honda</option>
                <option value="Mercedes-Benz">Mercedes-Benz</option>
                <option value="BMW">BMW</option>
              </select>
              <select className="input flex-1">
                <option value="">Model</option>
              </select>
              <input
                type="number"
                placeholder="Max Price (RWF)"
                className="input flex-1"
              />
              <button className="btn-primary w-full md:w-auto px-8 flex items-center justify-center gap-2">
                <Search size={18} />
                Search
              </button>
            </div>
          </div>

          {/* Quick Filter Pills */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {['SUV', 'Sedan', 'Pickup', 'Under 5M', 'Under 10M'].map((filter) => (
              <Link
                key={filter}
                href={`/cars?filter=${filter.toLowerCase()}`}
                className="px-4 py-2 bg-white/10 text-white rounded-full text-sm hover:bg-white/20 transition-colors"
              >
                {filter}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2 — Stats Bar */}
      <section className="bg-gold-pale py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-navy">{stat.value.toLocaleString()}</div>
                <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3 — Featured Cars */}
      <section className="py-12 md:py-16 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-900">Featured Listings</h2>
            <Link href="/cars" className="text-gold hover:text-gold-light font-semibold">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Placeholder car cards - will be replaced with real data */}
            {[1, 2, 3, 4].map((i) => (
              <CarCard key={i} featured />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 — Browse by Category */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
            Browse by Category
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={`/cars?body_type=${cat.name.toLowerCase()}`}
                className="flex flex-col items-center p-6 border border-gray-200 rounded-lg hover:border-gold hover:shadow-md transition-all"
              >
                <cat.icon className="w-8 h-8 text-navy mb-2" />
                <span className="text-sm font-medium text-gray-900">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5 — Latest Listings */}
      <section className="py-12 md:py-16 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-900 mb-8">Just Added</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <CarCard key={i} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/cars" className="btn-primary inline-block px-8 py-3 text-lg">
              Browse All Cars
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 6 — How It Works */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-900 mb-12 text-center">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((step) => (
              <div key={step.step} className="text-center">
                <div className="w-16 h-16 bg-gold-pale rounded-full flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-8 h-8 text-gold" />
                </div>
                <div className="text-sm text-gold font-semibold mb-2">Step {step.step}</div>
                <h3 className="font-display text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7 — Top Dealers */}
      <section className="py-12 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-900">Top Dealers</h2>
            <Link href="/dealers" className="text-gold hover:text-gold-light font-semibold">
              View All Dealers →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="card p-6">
                <div className="w-16 h-16 bg-navy rounded-lg mb-4"></div>
                <h3 className="font-semibold text-gray-900 mb-1">Dealer Name {i}</h3>
                <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                  <MapPin size={14} />
                  Kigali
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Star size={14} className="text-gold fill-gold" />
                  <span>4.8</span>
                  <span className="text-gray-400">(23 reviews)</span>
                </div>
                <div className="text-sm text-gray-400 mt-2">42 cars</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 8 — Trust Signals */}
      <section className="py-12 md:py-16 bg-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <CheckCircle className="w-12 h-12 text-gold mx-auto mb-4" />
              <h3 className="font-display text-xl font-bold text-white mb-2">Verified Sellers</h3>
              <p className="text-gray-400">Every seller is verified with Rwanda National ID</p>
            </div>
            <div className="text-center">
              <Wrench className="w-12 h-12 text-gold mx-auto mb-4" />
              <h3 className="font-display text-xl font-bold text-white mb-2">Pre-Purchase Inspections</h3>
              <p className="text-gray-400">Book professional inspections before you buy</p>
            </div>
            <div className="text-center">
              <CreditCard className="w-12 h-12 text-gold mx-auto mb-4" />
              <h3 className="font-display text-xl font-bold text-white mb-2">Secure Payments</h3>
              <p className="text-gray-400">MTN MoMo & Airtel Money integrated</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 9 — Banner Ad Slot */}
      <section className="py-8 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-200 border-2 border-dashed border-gray-400 rounded-lg h-24 md:h-32 flex items-center justify-center">
            <span className="text-gray-500">Advertisement Space (728x90)</span>
          </div>
        </div>
      </section>

      {/* SECTION 10 — Download App */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Get the MotorWa App
          </h2>
          <p className="text-gray-600 mb-8">Browse cars on the go. Available on iOS and Android.</p>
          <div className="flex justify-center gap-4">
            <button className="bg-navy text-white px-6 py-3 rounded-lg hover:bg-navy-light transition-colors">
              App Store
            </button>
            <button className="bg-navy text-white px-6 py-3 rounded-lg hover:bg-navy-light transition-colors">
              Google Play
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
