'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Star, Search } from 'lucide-react';

export default function DealersPage() {
  const [dealers, setDealers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [province, setProvince] = useState('');

  useEffect(() => {
    const fetchDealers = async () => {
      try {
        const params = new URLSearchParams();
        if (province) params.set('province', province);
        const res = await fetch(`/api/v1/dealers?${params.toString()}`);
        const data = await res.json();
        if (data.success) setDealers(data.data);
      } catch (error) {
        console.error('Failed to fetch dealers:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDealers();
  }, [province]);

  const filtered = search
    ? dealers.filter((d) => d.businessName?.toLowerCase().includes(search.toLowerCase()))
    : dealers;

  return (
    <div className="min-h-screen bg-cream py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl font-bold text-gray-900 mb-8">Verified Dealers</h1>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search dealers..."
              className="input w-full pl-10"
            />
          </div>
          <select value={province} onChange={(e) => setProvince(e.target.value)} className="input w-full md:w-48">
            <option value="">All Provinces</option>
            <option value="KIGALI">Kigali</option>
            <option value="NORTHERN">Northern</option>
            <option value="SOUTHERN">Southern</option>
            <option value="EASTERN">Eastern</option>
            <option value="WESTERN">Western</option>
          </select>
        </div>

        {/* Dealers Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                <div className="w-16 h-16 bg-gray-200 rounded-lg mb-4" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600">No dealers found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((dealer) => (
              <Link key={dealer.id} href={`/dealers/${dealer.id}`}>
                <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-16 h-16 bg-navy rounded-lg mb-4 flex items-center justify-center text-gold font-bold text-xl">
                    {dealer.businessName?.charAt(0)}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900">{dealer.businessName}</h3>
                    <span className="badge-verified px-2 py-0.5 text-xs rounded">Verified</span>
                  </div>
                  {dealer.user && (
                    <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                      <MapPin size={14} />
                      {dealer.province || 'Rwanda'}
                    </div>
                  )}
                  {dealer.user?.averageRating && (
                    <div className="flex items-center gap-1 text-sm">
                      <Star size={14} className="text-gold fill-gold" />
                      <span>{dealer.user.averageRating.toFixed(1)}</span>
                      <span className="text-gray-400">({dealer.user.reviewCount} reviews)</span>
                    </div>
                  )}
                  <p className="text-sm text-gray-400 mt-3 line-clamp-2">{dealer.description}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
