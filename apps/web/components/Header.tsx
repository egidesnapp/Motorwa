'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, MessageSquare, User, PlusCircle } from 'lucide-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-navy text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="font-display text-2xl font-bold text-gold">MotorWa</span>
            <span className="font-display text-2xl font-light">.rw</span>
          </Link>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search by make, model, or keyword..."
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:bg-white/20 focus:border-gold outline-none transition-all"
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4">
            <Link href="/post" className="btn-primary flex items-center gap-2">
              <PlusCircle size={18} />
              Post Car
            </Link>
            <Link href="/dashboard/messages" className="relative p-2 hover:bg-navy-light rounded-lg transition-colors">
              <MessageSquare size={20} />
              <span className="absolute -top-1 -right-1 bg-gold text-navy text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                0
              </span>
            </Link>
            <Link href="/dashboard" className="p-2 hover:bg-navy-light rounded-lg transition-colors">
              <User size={20} />
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-navy-light rounded-lg"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-white/10 pt-4">
            <nav className="flex flex-col gap-2">
              <Link href="/" className="px-4 py-2 hover:bg-navy-light rounded-lg">Home</Link>
              <Link href="/cars" className="px-4 py-2 hover:bg-navy-light rounded-lg">Browse Cars</Link>
              <Link href="/dealers" className="px-4 py-2 hover:bg-navy-light rounded-lg">Dealers</Link>
              <Link href="/pricing" className="px-4 py-2 hover:bg-navy-light rounded-lg">Pricing</Link>
              <Link href="/post" className="btn-primary text-center mt-2">Post Car</Link>
              <Link href="/dashboard/messages" className="px-4 py-2 hover:bg-navy-light rounded-lg">Messages</Link>
              <Link href="/dashboard" className="px-4 py-2 hover:bg-navy-light rounded-lg">Dashboard</Link>
              <Link href="/login" className="px-4 py-2 hover:bg-navy-light rounded-lg">Login</Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
