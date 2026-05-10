'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Bell, Globe, Trash2 } from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', email: '', province: '', language: 'en' });
  const [notifications, setNotifications] = useState({
    email: { newMessage: true, listingApproved: true, priceDrop: true },
    push: { newMessage: true, listingApproved: true, inspectionUpdate: true },
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/v1/users/me');
        const data = await res.json();
        if (data.success) {
          setUser(data.data);
          setFormData({
            fullName: data.data.fullName || '',
            email: data.data.email || '',
            province: data.data.province || '',
            language: data.data.language || 'en',
          });
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };
    fetchUser();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/v1/users/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        alert('Settings saved successfully');
      }
    } catch (error) {
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure? This action cannot be undone.')) return;
    if (!confirm('This will permanently delete your account and all listings. Type "DELETE" to confirm.')) return;
    try {
      await fetch('/api/v1/users/me', { method: 'DELETE' });
      localStorage.removeItem('accessToken');
      router.push('/');
    } catch (error) {
      alert('Failed to delete account');
    }
  };

  if (!user) return <div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full mx-auto mt-8" />;

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-gray-900">Settings</h1>

      {/* Profile Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="font-semibold text-lg flex items-center gap-2 mb-4">
          <User size={20} /> Profile
        </h2>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 bg-navy rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {user.fullName?.charAt(0)}
          </div>
          <div>
            <button className="btn-secondary text-sm">Change Photo</button>
            <p className="text-xs text-gray-500 mt-1">JPEG, PNG. Max 5MB</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input type="text" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} className="input w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="input w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <input type="text" value={user.username} className="input w-full bg-gray-50" disabled />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input type="text" value={user.phone || 'Not provided'} className="input w-full bg-gray-50" disabled />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Province</label>
            <select value={formData.province} onChange={(e) => setFormData({ ...formData, province: e.target.value })} className="input w-full">
              <option value="">Select Province</option>
              <option value="KIGALI">Kigali</option>
              <option value="NORTHERN">Northern</option>
              <option value="SOUTHERN">Southern</option>
              <option value="EASTERN">Eastern</option>
              <option value="WESTERN">Western</option>
            </select>
          </div>
        </div>
      </div>

      {/* Language */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="font-semibold text-lg flex items-center gap-2 mb-4">
          <Globe size={20} /> Language
        </h2>
        <div className="flex gap-4">
          <button onClick={() => setFormData({ ...formData, language: 'en' })} className={`flex-1 p-4 rounded-lg border-2 text-center transition-colors ${formData.language === 'en' ? 'border-gold bg-gold-pale' : 'border-gray-200'}`}>
            <div className="font-medium">English</div>
          </button>
          <button onClick={() => setFormData({ ...formData, language: 'rw' })} className={`flex-1 p-4 rounded-lg border-2 text-center transition-colors ${formData.language === 'rw' ? 'border-gold bg-gold-pale' : 'border-gray-200'}`}>
            <div className="font-medium">Kinyarwanda</div>
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="font-semibold text-lg flex items-center gap-2 mb-4">
          <Bell size={20} /> Notifications
        </h2>
        <div className="space-y-4">
          {Object.entries(notifications).map(([channel, prefs]) => (
            <div key={channel}>
              <h3 className="font-medium text-sm text-gray-700 mb-2 capitalize">{channel} Notifications</h3>
              {Object.entries(prefs).map(([key, value]) => (
                <label key={key} className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <input type="checkbox" checked={value as boolean} onChange={() => {}} className="w-4 h-4" />
                </label>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <button onClick={handleSave} disabled={saving} className="btn-primary w-full">
        {saving ? 'Saving...' : 'Save Changes'}
      </button>

      {/* Danger Zone */}
      <div className="bg-white rounded-xl shadow-sm p-6 border-2 border-error/20">
        <h2 className="font-semibold text-lg text-error flex items-center gap-2 mb-4">
          <Trash2 size={20} /> Danger Zone
        </h2>
        <p className="text-sm text-gray-600 mb-4">Once you delete your account, there is no going back.</p>
        <button onClick={handleDeleteAccount} className="bg-error text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors text-sm">
          Delete Account
        </button>
      </div>
    </div>
  );
}
