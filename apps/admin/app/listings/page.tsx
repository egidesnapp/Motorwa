'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Eye } from 'lucide-react';

export default function AdminListingsPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('PENDING_REVIEW');
  const [rejectReason, setRejectReason] = useState('');
  const [rejectingId, setRejectingId] = useState<string | null>(null);

  const fetchListings = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`http://localhost:3001/api/v1/admin/listings?status=${statusFilter}&page=1&limit=50`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setListings(data.data);
    } catch (error) {
      console.error('Failed to fetch listings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchListings(); }, [statusFilter]);

  const handleApprove = async (id: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      await fetch(`http://localhost:3001/api/v1/admin/listings/${id}/approve`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      setListings((prev) => prev.filter((l) => l.id !== id));
    } catch (error) {
      alert('Failed to approve listing');
    }
  };

  const handleReject = async (id: string) => {
    if (!rejectReason) {
      alert('Please provide a rejection reason');
      return;
    }
    try {
      const token = localStorage.getItem('accessToken');
      await fetch(`http://localhost:3001/api/v1/admin/listings/${id}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason: rejectReason }),
      });
      setListings((prev) => prev.filter((l) => l.id !== id));
      setRejectingId(null);
      setRejectReason('');
    } catch (error) {
      alert('Failed to reject listing');
    }
  };

  const statuses = [
    { id: 'PENDING_REVIEW', label: 'Pending Review' },
    { id: 'ACTIVE', label: 'Active' },
    { id: 'REJECTED', label: 'Rejected' },
    { id: 'DRAFT', label: 'Draft' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-gray-900">Manage Listings</h1>

      <div className="flex gap-2">
        {statuses.map((s) => (
          <button
            key={s.id}
            onClick={() => setStatusFilter(s.id)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              statusFilter === s.id ? 'bg-navy text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-4 animate-pulse flex gap-4">
              <div className="w-32 h-24 bg-gray-200 rounded-lg" />
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-3 bg-gray-200 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : listings.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center text-gray-500">
          No listings with status: {statusFilter.replace('_', ' ')}
        </div>
      ) : (
        <div className="space-y-4">
          {listings.map((listing) => (
            <div key={listing.id} className="bg-white rounded-xl p-4 shadow-sm flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-32 h-24 bg-gray-200 rounded-lg flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900">{listing.title}</h3>
                <p className="text-sm text-gray-500">{listing.user?.fullName} · {listing.district}, {listing.province}</p>
                <p className="text-gold font-bold mt-1">{Number(listing.priceRwf).toLocaleString()} RWF</p>
              </div>
              <div className="flex sm:flex-col gap-2">
                <a href={`http://localhost:3000/cars/${listing.slug}`} target="_blank" className="btn-ghost flex items-center gap-1 text-sm">
                  <Eye size={16} /> View
                </a>
                {statusFilter === 'PENDING_REVIEW' && (
                  <>
                    <button onClick={() => handleApprove(listing.id)} className="flex items-center gap-1 text-sm text-success bg-success-pale px-3 py-2 rounded-md hover:bg-success/20">
                      <CheckCircle size={16} /> Approve
                    </button>
                    {rejectingId === listing.id ? (
                      <div className="mt-2 space-y-2">
                        <input
                          type="text"
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          placeholder="Rejection reason..."
                          className="input w-full text-sm"
                        />
                        <div className="flex gap-2">
                          <button onClick={() => handleReject(listing.id)} className="text-xs bg-error text-white px-3 py-1.5 rounded">Confirm</button>
                          <button onClick={() => { setRejectingId(null); setRejectReason(''); }} className="text-xs text-gray-500 px-3 py-1.5">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <button onClick={() => setRejectingId(listing.id)} className="flex items-center gap-1 text-sm text-error bg-error-pale px-3 py-2 rounded-md hover:bg-error/20">
                        <XCircle size={16} /> Reject
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
