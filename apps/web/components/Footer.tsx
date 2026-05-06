import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Logo & Description */}
          <div>
            <div className="mb-4">
              <span className="font-display text-2xl font-bold text-gold">MotorWa</span>
              <span className="font-display text-2xl font-light">.rw</span>
            </div>
            <p className="text-sm text-gray-400 mb-2">Rwanda's Trusted Car Marketplace</p>
            <p className="text-sm text-gray-400 mb-4">Ahantu h'imodoka mu Rwanda</p>
            <p className="text-sm text-gray-400">
              Buy and sell cars safely with verified sellers, real prices, and secure payments.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-semibold text-gold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/cars" className="text-gray-400 hover:text-gold transition-colors">Browse Cars</Link></li>
              <li><Link href="/post" className="text-gray-400 hover:text-gold transition-colors">Post Car</Link></li>
              <li><Link href="/dealers" className="text-gray-400 hover:text-gold transition-colors">Dealers</Link></li>
              <li><Link href="/pricing" className="text-gray-400 hover:text-gold transition-colors">Pricing</Link></li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h3 className="font-semibold text-gold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-gray-400 hover:text-gold transition-colors">About</Link></li>
              <li><Link href="/blog" className="text-gray-400 hover:text-gold transition-colors">Blog</Link></li>
              <li><Link href="/help" className="text-gray-400 hover:text-gold transition-colors">Help</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-gold transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div>
            <h3 className="font-semibold text-gold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/terms" className="text-gray-400 hover:text-gold transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="text-gray-400 hover:text-gold transition-colors">Privacy Policy</Link></li>
              <li><Link href="/cookies" className="text-gray-400 hover:text-gold transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            © 2025 MotorWa.rw. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span>Accepted payments:</span>
            <span className="px-2 py-1 bg-white/10 rounded">MTN MoMo</span>
            <span className="px-2 py-1 bg-white/10 rounded">Airtel Money</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
