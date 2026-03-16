import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Heyama Cloud',
  description: 'Heyama DEV Exam – Object Collection Manager',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen text-gray-900">
        <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">H</span>
          </div>
          <span className="font-semibold text-lg tracking-tight">Heyama Cloud</span>
        </nav>
        <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
