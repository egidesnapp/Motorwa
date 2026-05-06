import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Gauge, Fuel, Settings, Heart, Share2, Flag, ChevronLeft, ChevronRight, Star, Calendar, Eye } from 'lucide-react';
import { formatRwf } from '@motorwa/shared';

interface CarDetailProps {
  params: { slug: string };
}

export default async function CarDetailPage({ params }: CarDetailProps) {
  // In production, fetch from API. For now, static placeholder.
  const listing = {
    id: '1',
    slug: params.slug,
    title: '2020 Toyota Camry',
    make: 'Toyota',
    model: 'Camry',
    year: 2020,
    priceRwf: 5000000,
    mileageKm: 45000,
    fuelType: 'PETROL',
    transmission: 'AUTOMATIC',
    condition: 'EXCELLENT',
    importOrigin: 'JAPAN',
    province: 'KIGALI',
    district: 'Gasabo',
    isNegotiable: true,
    hasServiceHistory: true,
    hasAccidentHistory: false,
    description: 'Beautiful Toyota Camry in excellent condition. Regularly serviced, no accidents. Comes with full service history. Perfect family car with spacious interior and smooth ride. Located in Gasabo, Kigali.',
    viewsCount: 234,
    savesCount: 12,
    createdAt: '2025-01-15',
    user: {
      id: '1',
      fullName: 'Jean Pierre',
      isIdVerified: true,
      averageRating: 4.8,
      reviewCount: 23,
      createdAt: '2024-06-01',
    },
    photos: [
      { id: '1', photoUrl: '', thumbnailUrl: '', isPrimary: true },
      { id: '2', photoUrl: '', thumbnailUrl: '' },
      { id: '3', photoUrl: '', thumbnailUrl: '' },
    ],
  };

  if (!listing) notFound();

  const daysListed = Math.floor((Date.now() - new Date(listing.createdAt).getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen bg-cream">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex text-sm text-gray-600">
            <Link href="/" className="hover:text-gold">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/cars" className="hover:text-gold">Cars</Link>
            <span className="mx-2">/</span>
            <Link href={`/cars?make=${listing.make}`} className="hover:text-gold">{listing.make}</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{listing.model}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT: Photos + Details */}
          <div className="lg:col-span-2">
            {/* Photo Gallery */}
            <div className="bg-white rounded-xl overflow-hidden shadow-sm mb-6">
              <div className="aspect-[16/10] bg-gray-200 flex items-center justify-center relative">
                <span className="text-gray-400">Main Photo</span>
                <div className="absolute bottom-4 right-4 bg-black/60 text-white text-sm px-3 py-1 rounded-full">
                  1 / {listing.photos.length}
                </div>
                <button className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full hover:bg-white">
                  <ChevronLeft size={20} />
                </button>
                <button className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full hover:bg-white">
                  <ChevronRight size={20} />
                </button>
              </div>
              <div className="flex gap-2 p-4 overflow-x-auto">
                {listing.photos.map((photo, i) => (
                  <button key={photo.id} className={`w-20 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 ${i === 0 ? 'border-gold' : 'border-transparent'}`}>
                    <div className="w-full h-full bg-gray-200" />
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
              <h2 className="font-display text-xl font-bold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 whitespace-pre-line">{listing.description}</p>
            </div>

            {/* Specs Table */}
            <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
              <h2 className="font-display text-xl font-bold text-gray-900 mb-4">Specifications</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  ['Year', listing.year],
                  ['Make', listing.make],
                  ['Model', listing.model],
                  ['Mileage', `${listing.mileageKm.toLocaleString()} km`],
                  ['Fuel Type', listing.fuelType],
                  ['Transmission', listing.transmission],
                  ['Condition', listing.condition],
                  ['Import Origin', listing.importOrigin],
                  ['Service History', listing.hasServiceHistory ? 'Yes' : 'No'],
                  ['Accident History', listing.hasAccidentHistory ? 'Yes' : 'No'],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">{label}</span>
                    <span className="font-medium text-gray-900">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
              <h2 className="font-display text-xl font-bold text-gray-900 mb-4">Location</h2>
              <div className="flex items-center gap-2 text-gray-700">
                <MapPin size={20} />
                <span>{listing.district}, {listing.province}</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Price + Seller + Actions */}
          <div className="space-y-6">
            {/* Price Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-3xl font-bold text-gold mb-1">
                {formatRwf(listing.priceRwf)}
              </div>
              <div className="text-sm text-gray-400 mb-4">≈ $3,900</div>
              {listing.isNegotiable && (
                <span className="badge-featured px-3 py-1 text-sm rounded-full mb-4 inline-block">Negotiable</span>
              )}
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>Listed {daysListed} days ago</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye size={16} />
                  <span>{listing.viewsCount} views</span>
                </div>
              </div>
            </div>

            {/* Seller Box */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-navy rounded-full flex items-center justify-center text-white font-bold">
                  {listing.user.fullName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{listing.user.fullName}</span>
                    {listing.user.isIdVerified && (
                      <span className="badge-verified px-2 py-0.5 text-xs rounded">Verified</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Star size={14} className="text-gold fill-gold" />
                    <span>{listing.user.averageRating}</span>
                    <span className="text-gray-400">({listing.user.reviewCount} reviews)</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <button className="btn-primary w-full">Message Seller</button>
                <button className="btn-secondary w-full">Show Phone Number</button>
                <button className="w-full bg-green-600 text-white py-2.5 rounded-md hover:bg-green-700 transition-colors font-medium">
                  Chat on WhatsApp
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-xl p-6 shadow-sm space-y-2">
              <button className="w-full flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                <Heart size={18} />
                Save Listing
              </button>
              <button className="w-full flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                <Share2 size={18} />
                Share Listing
              </button>
              <button className="w-full flex items-center justify-center gap-2 py-2.5 text-gray-400 hover:text-error transition-colors text-sm">
                <Flag size={16} />
                Report This Listing
              </button>
            </div>
          </div>
        </div>

        {/* Similar Cars */}
        <section className="mt-12">
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-6">Similar Cars</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Link href={`/cars/similar-${i}`} key={i}>
                <div className="card overflow-hidden">
                  <div className="aspect-[4/3] bg-gray-200" />
                  <div className="p-4">
                    <h3 className="font-semibold text-sm">2019 Toyota Camry</h3>
                    <p className="text-gold font-bold mt-1">RWF 4,500,000</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
