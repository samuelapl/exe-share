import './globals.css';
import { AuthProvider } from './providers';
import Navbar from './components/Navbar';

export const metadata = {
  title: 'Expiring Share | Secure Dead-Drop Link Engine',
  description: 'Encrypt and transmit sensitive credentials safely with single-use, self-destructing links.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark bg-slate-950 text-slate-50">
      <body className="antialiased min-h-screen flex flex-col justify-between">
     <AuthProvider>
         <Navbar />
        
        <main className="flex-grow flex items-center justify-center p-4">
          {children}
        </main>

        <footer className="text-center text-xs p-6 text-slate-600 border-t border-slate-900">
          Built with Next.js, Express, and GraphQL
        </footer>
     </AuthProvider>
      </body>
    </html>
  );
}
