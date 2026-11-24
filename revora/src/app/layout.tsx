import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ToastProvider } from '@/components/common/Toast';
import { AuthProvider } from '@/contexts/AuthContext';

export const metadata: Metadata = {
  title: 'REVORA | Premium Used-Car Marketplace India',
  description:
    'Discover, compare, and drive quality used cars from verified individual sellers and accredited dealerships across India. Every Drive Begins Somewhere.',
  keywords: [
    'used cars India',
    'buy used car',
    'sell car India',
    'certified used cars',
    'Audi R8 used',
    'Toyota Camry used',
    'verified dealerships',
    'luxury pre-owned cars',
    'REVORA automotive',
  ],
  authors: [{ name: 'REVORA Technologies' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#070B0D',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-revora-mainBg text-revora-textPrimary antialiased selection:bg-revora-steel selection:text-white font-sans">
        <AuthProvider>
          <ToastProvider>{children}</ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
