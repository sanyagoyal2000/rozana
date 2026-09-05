import type { Metadata } from 'next';
import './globals.css';

const title = 'ROZANA | Begin and maintain your routine';
const description =
  'Savoury, food-first nutrition for Indian women through perimenopause, menopause and after. Take the 12-question Check-In and get a plan, a routine and a box that changes with you.';

export const metadata: Metadata = {
  metadataBase: new URL('https://rozana-prototype.vercel.app'),
  title,
  description,
  openGraph: { title, description, images: ['/og.png'] },
  twitter: { card: 'summary_large_image', title, description, images: ['/og.png'] },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
