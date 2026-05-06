import Link from 'next/link';
import { MapPin, Gauge, Fuel, Settings, Heart, Star } from 'lucide-react';

interface CarCardProps {
  featured?: boolean;
  verified?: boolean;
}

export default function CarCard({ featured, verified }: CarCardProps) {
  return (
    <div className="card overflow-hidden">
      {/* Photo */}
      <div className="relative aspect-[4/3] bg-gray-200">
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          No Photo
        </div>
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-1">
          {featured && (
            <span className="badge-featured px-2 py-1 text-xs rounded font-medium">
              Featured
            </span>
          )}
          {verified && (
            <span className="badge-verified px-2 py-1 text-xs rounded font-medium">
              Verified
            </span>
          )}
        </div>

        {/* Save Button */}
        <button className="absolute top-2 right-2 p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
          <Heart size={18} className="text-gray-600" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1">
          2020 · Toyota · Camry
        </h3>
        
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
          <span className="flex items-center gap-1">
            <Gauge size={14} />
            45,000 km
          </span>
          <span className="flex items-center gap-1">
            <Fuel size={14} />
            Petrol
          </span>
          <span className="flex items-center gap-1">
            <Settings size={14} />
            Auto
          </span>
        </div>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-xl font-bold text-gold">RWF 5,000,000</span>
          <span className="text-sm text-gray-400">≈ $3,900</span>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <MapPin size={14} />
            Kigali
          </span>
          <span className="text-gray-400">2 days ago</span>
        </div>
      </div>
    </div>
  );
}
