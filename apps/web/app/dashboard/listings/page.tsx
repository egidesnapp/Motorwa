'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Eye, Edit, Trash2, Zap, CheckCircle } from 'lucide-react';

export default function MyListingsPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch('/api/v1/listings');
        const data = await res.json();
        if (data.success) setListings(data.data);
      } catch (error) {
        console.error('Failed to fetch listings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'ACTIVE', label: 'Active' },
    { id: 'PENDING_REVIEW', label: 'Pending' },
    { id: 'SOLD', label: 'Sold' },
    { id: 'EXPIRED', label: 'Expired' },
  ];

  const filtered = activeTab === 'all' ? listings : listings.filter((l) => l.status === activeTab);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;
    try {
      await fetch(`/api/v1/listings/${id}`, { method: 'DELETE' });
      setListings((prev) => prev.filter((l) => l.id !== id));
    } catch (error) {
      alert('Failed to delete listing');
    }
  };

  const handleMarkSold = async (id: string) => {
    try {
      await fetch(`/api/v1/listings/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'SOLD' }),
      });
      setListings((prev) => prev.map((l) => l.id === id ? { ...l, status: 'SOLD' } : l));
    } catch (error) {
      alert('Failed to update listing');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-gray-900">My Listings</h1>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id ? 'border-gold text-gold' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Listings */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-4 animate-pulse flex gap-4">
              <div className="w-32 h-24 bg-gray-200 rounded-lg" />
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-3 bg-gray-200 rounded w-1/4" />
                <div className="h-3 bg-gray-200 rounded w-1/5" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center">
          <p className="text-gray-600">No listings in this category.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((listing) => (
            <div key={listing.id} className="bg-white rounded-xl p-4 shadow-sm flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-32 h-24 bg-gray-200 rounded-lg flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{listing.title}</h3>
                    <p className="text-sm text-gray-500">{listing.district}, {listing.province}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    listing.status === 'ACTIVE' ? 'badge-verified' :
                    listing.status === 'PENDING_REVIEW' ? 'badge-pending' :
                    listing.status === 'SOLD' ? 'badge-sold' : 'badge-pending'
                  }`}>
                    {listing.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span className="text-gold font-bold">{Number(listing.priceRwf).toLocaleString()} RWF</span>
                  <span className="flex items-center gap-1"><Eye size={14} /> {listing.viewsCount} views</span>
                  <span>{listing.savesCount} saves</span>
                </div>
              </div>
              <div className="flex sm:flex-col gap-2">
                <Link href={`/cars/${listing.slug}`} className="btn-ghost flex items-center gap-1 text-sm">
                  <Eye size={16} /> View
                </Link>
                {listing.status === 'ACTIVE' && (
                  <button onClick={() => handleMarkSold(listing.id)} className="btn-ghost flex items-center gap-1 text-sm text-success">
                    <CheckCircle size={16} /> Mark Sold
                  </button>
                )}
                <button className="btn-ghost flex items-center gap-1 text-sm">
                  <Edit size={16} /> Edit
                </button>
                <button onClick={() => handleDelete(listing.id)} className="btn-ghost flex items-center gap-1 text-sm text-error">
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
