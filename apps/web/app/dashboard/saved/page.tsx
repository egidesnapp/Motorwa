'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, Trash2, TrendingDown } from 'lucide-react';

export default function SavedCarsPage() {
  const [savedCars, setSavedCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const res = await fetch('/api/v1/saved/listings');
        const data = await res.json();
        if (data.success) setSavedCars(data.data);
      } catch (error) {
        console.error('Failed to fetch saved cars:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSaved();
  }, []);

  const unsave = async (id: string) => {
    try {
      await fetch(`/api/v1/saved/listings/${id}`, { method: 'DELETE' });
      setSavedCars((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error('Failed to unsave:', error);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-gray-900">Saved Cars</h1>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="aspect-[4/3] bg-gray-200" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : savedCars.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center">
          <Heart size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="font-display text-xl font-bold text-gray-900 mb-2">No saved cars yet</h3>
          <p className="text-gray-600 mb-4">Browse cars and tap the heart icon to save them here.</p>
          <Link href="/cars" className="btn-primary inline-block">Browse Cars</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedCars.map((car) => (
            <div key={car.id} className="card overflow-hidden relative">
              <button onClick={() => unsave(car.id)} className="absolute top-3 right-3 z-10 p-2 bg-white/90 rounded-full hover:bg-white">
                <Trash2 size={16} className="text-error" />
              </button>
              <Link href={`/cars/${car.slug}`}>
                <div className="aspect-[4/3] bg-gray-200" />
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900">{car.title}</h3>
                  <p className="text-gold font-bold mt-1">{Number(car.priceRwf).toLocaleString()} RWF</p>
                  {car.priceDrop && (
                    <div className="flex items-center gap-1 text-success text-sm mt-2">
                      <TrendingDown size={14} />
                      Price dropped {car.priceDrop}% since saved
                    </div>
                  )}
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
