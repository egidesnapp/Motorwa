'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard, Car, Users, CreditCard, Flag, Store,
  Megaphone, FileText, LogOut, Menu, X,
} from 'lucide-react';

const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/listings', icon: Car, label: 'Listings' },
  { href: '/admin/users', icon: Users, label: 'Users' },
  { href: '/admin/payments', icon: CreditCard, label: 'Payments' },
  { href: '/admin/reports', icon: Flag, label: 'Reports' },
  { href: '/admin/dealers', icon: Store, label: 'Dealers' },
  { href: '/admin/banners', icon: Megaphone, label: 'Banners' },
  { href: '/admin/logs', icon: FileText, label: 'Audit Logs' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (pathname === '/admin/login') return;

    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch('/api/v1/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success && data.data.role === 'ADMIN') {
          setUser(data.data);
        } else {
          localStorage.removeItem('accessToken');
          router.push('/admin/login');
        }
      } catch {
        router.push('/admin/login');
      }
    };
    fetchUser();
  }, [router, pathname]);

  const handleLogout = async () => {
    const token = localStorage.getItem('accessToken');
    await fetch('/api/v1/auth/logout', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    localStorage.removeItem('accessToken');
    router.push('/admin/login');
  };

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream flex pt-0">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-navy text-white flex flex-col transform transition-transform z-50 lg:z-auto lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-display text-xl font-bold text-gold">MotorWa</span>
              <span className="font-display text-xl font-light ml-1">Admin</span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1">
              <X size={20} />
            </button>
          </div>
          <div className="text-sm text-gray-400 mt-2">{user.fullName}</div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                pathname === item.href
                  ? 'bg-white/10 text-gold'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-gray-300 hover:bg-white/5 w-full">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <div className="lg:hidden flex items-center gap-4 p-4 bg-white border-b">
          <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-gray-100 rounded-lg">
            <Menu size={20} />
          </button>
          <h1 className="font-semibold text-gray-900">
            {navItems.find((item) => item.href === pathname)?.label || 'Admin'}
          </h1>
        </div>
        <div className="p-4 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
