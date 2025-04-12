// app/layout.js
import './globals.css';
import Header from './components/Header'; // adjust path if needed

export const metadata = {
  title: 'Pnoé – Agrotourism & Wellness',
  description: 'Rooted, soulful, slow travel in Crete.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="pt-[72px] bg-[#f4f1ec] text-[#2f2f2f] antialiased">
        <Header />
        {children}
      </body>
    </html>
  );
}
