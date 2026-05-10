'use client';

import { useState, useEffect } from 'react';
import { Users, Car, CreditCard, TrendingUp, Activity, Shield, ArrowUpRight } from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const headers = { Authorization: `Bearer ${token}` };

        const [statsRes, listingsRes] = await Promise.all([
          fetch('/api/v1/admin/dashboard', { headers }),
          fetch('/api/v1/admin/listings?page=1&limit=5', { headers }),
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

  const statCards = [
    { label: 'Users Today', value: stats?.usersToday || 0, icon: Users, change: '+12%', color: 'from-blue-500 to-blue-600' },
    { label: 'Listings Today', value: stats?.listingsToday || 0, icon: Car, change: '+5%', color: 'from-gold to-yellow-500' },
    { label: 'Active Listings', value: stats?.activeListings || 0, icon: TrendingUp, change: '+8%', color: 'from-emerald-500 to-emerald-600' },
    { label: 'Total Revenue', value: stats?.totalRevenue ? `${(Number(stats.totalRevenue) / 1000000).toFixed(1)}M RWF` : '0 RWF', icon: CreditCard, change: '', color: 'from-violet-500 to-violet-600' },
  ];

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-navy to-[#0a1628] rounded-2xl p-8 text-white shadow-xl border border-white/10">
        <div className="flex items-center gap-4 mb-2">
          <Activity className="w-6 h-6 text-gold" />
          <span className="text-gold text-sm font-medium uppercase tracking-wider">Admin Dashboard</span>
        </div>
        <h1 className="font-display text-3xl font-bold mt-2">Overview</h1>
        <p className="text-gray-400 mt-1">Monitor and manage your marketplace at a glance</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.color} bg-opacity-10`}>
              <stat.icon className="w-5 h-5 text-white" />
            </div>
            <div className="mt-4">
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
            {stat.change && (
              <div className="flex items-center gap-1 mt-2 text-xs font-medium text-emerald-600">
                <ArrowUpRight size={12} />
                {stat.change} vs yesterday
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-lg text-gray-900">Recent Listings</h2>
              <p className="text-sm text-gray-500">Latest listings submitted on the platform</p>
            </div>
            <a href="/admin/listings" className="text-sm text-gold hover:underline font-medium">
              View all
            </a>
          </div>
          {listings.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No listings yet</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {listings.map((listing) => (
                <div key={listing.id} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                  <div className="w-14 h-10 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                    <Car className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 text-sm truncate">{listing.title}</h3>
                    <p className="text-xs text-gray-500">{listing.user?.fullName} · {listing.district}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    listing.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    listing.status === 'PENDING_REVIEW' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                    listing.status === 'REJECTED' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-gray-50 text-gray-500 border border-gray-200'
                  }`}>
                    {listing.status.replace('_', ' ')}
                  </span>
                  <span className="text-gold font-bold text-sm">{Number(listing.priceRwf).toLocaleString()} RWF</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-5 h-5 text-gold" />
            <h2 className="font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="space-y-3">
            <a href="/admin/listings" className="block px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium text-gray-700">
              Review pending listings
            </a>
            <a href="/admin/users" className="block px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium text-gray-700">
              Manage users
            </a>
            <a href="/admin/reports" className="block px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium text-gray-700">
              View reports
            </a>
            <a href="/admin/logs" className="block px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium text-gray-700">
              Audit logs
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
