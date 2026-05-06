'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Car, Eye, MessageSquare, Heart, PlusCircle } from 'lucide-react';

export default function DashboardOverview() {
  const [stats, setStats] = useState({ activeListings: 0, totalViews: 0, messages: 0, savedCars: 0 });
  const [listings, setListings] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, listingsRes] = await Promise.all([
          fetch('/api/v1/users/me/stats'),
          fetch('/api/v1/listings?page=1&limit=5'),
        ]);
        const statsData = await statsRes.json();
        const listingsData = await listingsRes.json();
        if (statsData.success) setStats(statsData.data);
        if (listingsData.success) setListings(listingsData.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here is your overview.</p>
        </div>
        <Link href="/post" className="btn-primary flex items-center gap-2">
          <PlusCircle size={18} />
          Post New Car
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Listings', value: stats.activeListings, icon: Car, color: 'text-navy' },
          { label: 'Total Views', value: stats.totalViews, icon: Eye, color: 'text-gold' },
          { label: 'Messages', value: stats.messages, icon: MessageSquare, color: 'text-info' },
          { label: 'Saved Cars', value: stats.savedCars, icon: Heart, color: 'text-error' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-6 shadow-sm">
            <stat.icon className={`w-8 h-8 ${stat.color} mb-3`} />
            <div className="text-3xl font-bold text-gray-900">{stat.value.toLocaleString()}</div>
            <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Listings */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <h2 className="font-semibold text-lg">Recent Listings</h2>
        </div>
        {listings.length === 0 ? (
          <div className="p-8 text-center">
            <Car size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600 mb-4">You have not posted any cars yet.</p>
            <Link href="/post" className="btn-primary inline-flex items-center gap-2">
              <PlusCircle size={18} /> Post Your First Car
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {listings.map((listing: any) => (
              <div key={listing.id} className="p-4 flex items-center gap-4">
                <div className="w-16 h-12 bg-gray-200 rounded-lg flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">{listing.title}</h3>
                  <p className="text-sm text-gray-500">{listing.district}, {listing.province}</p>
                </div>
                <span className="text-gold font-bold">{Number(listing.priceRwf).toLocaleString()} RWF</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  listing.status === 'ACTIVE' ? 'badge-verified' :
                  listing.status === 'PENDING_REVIEW' ? 'badge-pending' :
                  listing.status === 'SOLD' ? 'badge-sold' : ''
                }`}>
                  {listing.status}
                </span>
                <div className="text-sm text-gray-400 flex items-center gap-1">
                  <Eye size={14} /> {listing.viewsCount}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
