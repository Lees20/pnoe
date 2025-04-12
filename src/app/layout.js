// app/layout.js
import './globals.css';

export const metadata = {
  title: 'Pnoé – Agrotourism & Wellness',
  description: 'Rooted, soulful, slow travel in Crete.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
