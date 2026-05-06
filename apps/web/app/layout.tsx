import type { Metadata } from 'next';
import { DM_Sans, Playfair_Display, DM_Mono } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });
const dmMono = DM_Mono({ weight: '400', subsets: ['latin'], variable: '--font-dm-mono' });

export const metadata: Metadata = {
  title: 'MotorWa.rw — Rwanda\'s Trusted Car Marketplace',
  description: 'Buy and sell cars safely in Rwanda — with verified sellers, real prices, and secure payments.',
  keywords: ['cars', 'Rwanda', 'buy cars', 'sell cars', 'Kigali', 'auto marketplace'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${playfair.variable} ${dmMono.variable}`}>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
