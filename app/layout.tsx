import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chat with Sangkay',
  icons: {
    icon: '/logo.ico?v=1',
    shortcut: '/logo.ico?v=1',
    apple: '/logo.ico?v=1',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}