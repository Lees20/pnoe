// app/layout.js
import './globals.css';
import Header from './components/header'; 
import Footer from './components/footer'; 
import { icons } from 'lucide-react';
import { RouteLoader} from './components/RouteLoader'; 

export const metadata = {
  title: 'Oasis – Agrotourism & Wellness',
  description: 'Rooted, soulful, slow travel in Crete.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="pt-[72px] bg-[#f4f1ec] text-[#2f2f2f] antialiased">
        <RouteLoader>
          <Header />
          {children}
          <Footer />
        </RouteLoader>
      </body>
    </html>
  );
}

