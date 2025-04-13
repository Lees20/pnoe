import './globals.css';
import Header from './components/header';
import Footer from './components/footer';
import { RouteLoader } from './components/RouteLoader';
import SessionWrapper from './components/SessionWrapper';

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
        <SessionWrapper>
          <RouteLoader>
            <Header />
            {children}
            <Footer />
          </RouteLoader>
        </SessionWrapper>
      </body>
    </html>
  );
}
