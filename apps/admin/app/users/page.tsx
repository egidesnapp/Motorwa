'use client';

import { useState, useEffect } from 'react';
import { Search, Ban, ShieldCheck, ShieldOff } from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      const res = await fetch(`http://localhost:3001/api/v1/admin/users?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setUsers(data.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleBan = async (id: string) => {
    const reason = prompt('Enter ban reason:');
    if (!reason) return;
    try {
      const token = localStorage.getItem('accessToken');
      await fetch(`http://localhost:3001/api/v1/admin/users/${id}/ban`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ reason }),
      });
      setUsers((prev) => prev.map((u) => u.id === id ? { ...u, isBanned: true } : u));
    } catch (error) {
      alert('Failed to ban user');
    }
  };

  const handleUnban = async (id: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      await fetch(`http://localhost:3001/api/v1/admin/users/${id}/unban`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers((prev) => prev.map((u) => u.id === id ? { ...u, isBanned: false } : u));
    } catch (error) {
      alert('Failed to unban user');
    }
  };

  const handleVerify = async (id: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      await fetch(`http://localhost:3001/api/v1/admin/users/${id}/verify-id`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers((prev) => prev.map((u) => u.id === id ? { ...u, isIdVerified: true } : u));
    } catch (error) {
      alert('Failed to verify user');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-gray-900">Manage Users</h1>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
          placeholder="Search by name, phone, or email..."
          className="input w-full pl-10"
        />
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-4 animate-pulse flex gap-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-3 bg-gray-200 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">User</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Phone</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Role</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Status</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Listings</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-navy rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {user.fullName?.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{user.fullName}</div>
                        <div className="text-xs text-gray-500">{user.email || 'No email'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{user.phone}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      user.role === 'ADMIN' ? 'bg-error-pale text-error' :
                      user.role === 'DEALER' ? 'bg-navy text-gold-light' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {user.isIdVerified && <span className="badge-verified px-2 py-0.5 text-xs rounded">Verified</span>}
                      {user.isBanned && <span className="badge-error px-2 py-0.5 text-xs rounded">Banned</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{user.listingCount}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {!user.isIdVerified && (
                        <button onClick={() => handleVerify(user.id)} className="p-1.5 bg-success-pale text-success rounded hover:bg-success/20" title="Verify ID">
                          <ShieldCheck size={16} />
                        </button>
                      )}
                      {user.isBanned ? (
                        <button onClick={() => handleUnban(user.id)} className="p-1.5 bg-warning-pale text-warning rounded hover:bg-warning/20" title="Unban">
                          <ShieldOff size={16} />
                        </button>
                      ) : (
                        <button onClick={() => handleBan(user.id)} className="p-1.5 bg-error-pale text-error rounded hover:bg-error/20" title="Ban">
                          <Ban size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
