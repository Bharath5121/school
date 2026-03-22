import '../styles/globals.css';
import { ReactNode } from 'react';
import { Syne, DM_Sans } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';

const syne = Syne({ subsets: ['latin'], variable: '--font-syne' });
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans' });

export const metadata = {
  title: 'AI Catalog Platform',
  description: 'AI tool catalog for your chosen field.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable} dark`} suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <main className="min-h-screen flex flex-col">
            {children}
          </main>
        </ThemeProvider>
        <script src="https://accounts.google.com/gsi/client" async defer></script>
      </body>
    </html>
  );
}
