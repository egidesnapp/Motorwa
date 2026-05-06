'use client';

import { useState, useEffect } from 'react';
import { Users, Car, CreditCard, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const headers = { Authorization: `Bearer ${token}` };

        const [statsRes, listingsRes] = await Promise.all([
          fetch('http://localhost:3001/api/v1/admin/dashboard', { headers }),
          fetch('http://localhost:3001/api/v1/admin/listings?page=1&limit=5', { headers }),
        ]);

        const statsData = await statsRes.json();
        const listingsData = await listingsRes.json();

        if (statsData.success) setStats(statsData.data);
        if (listingsData.success) setListings(listingsData.data);
      } catch (error) {
        console.error('Failed to fetch admin data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="font-display text-2xl font-bold text-gray-900">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Users Today', value: stats?.usersToday || 0, icon: Users, color: 'text-navy' },
          { label: 'Listings Today', value: stats?.listingsToday || 0, icon: Car, color: 'text-gold' },
          { label: 'Active Listings', value: stats?.activeListings || 0, icon: TrendingUp, color: 'text-success' },
          { label: 'Total Revenue', value: stats?.totalRevenue ? `${(Number(stats.totalRevenue) / 1000000).toFixed(1)}M RWF` : '0 RWF', icon: CreditCard, color: 'text-info' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-6 shadow-sm">
            <stat.icon className={`w-8 h-8 ${stat.color} mb-3`} />
            <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Listings Pending Review */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <h2 className="font-semibold text-lg">Recent Listings</h2>
        </div>
        {listings.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No listings yet</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {listings.map((listing) => (
              <div key={listing.id} className="p-4 flex items-center gap-4">
                <div className="w-16 h-12 bg-gray-200 rounded-lg flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">{listing.title}</h3>
                  <p className="text-sm text-gray-500">{listing.user?.fullName} · {listing.district}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  listing.status === 'ACTIVE' ? 'badge-verified' :
                  listing.status === 'PENDING_REVIEW' ? 'badge-pending' :
                  listing.status === 'REJECTED' ? 'badge-error' : ''
                }`}>
                  {listing.status.replace('_', ' ')}
                </span>
                <span className="text-gold font-bold text-sm">{Number(listing.priceRwf).toLocaleString()} RWF</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
