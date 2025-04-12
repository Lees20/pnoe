import './globals.css';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import Header from './components/header';
import Footer from './components/footer';
import Script from 'next/script';
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Pantelis Karabetsos | Computer Engineer',
  description: "Engineering ideas into reality — with a mix of logic, pixels, and a hint of chaos.",
  keywords: [
    'Pantelis Karabetsos',
    'Pantelis Karabetsos portfolio',
    'Pantelis Karabetsos projects',
    'Pantelis Karabetsos developer',
    'Pantelis Karabetsos engineer',
    'Pantelis Karabetsos software engineer',
    'Pantelis Karabetsos computer engineer',
    'Pantelis Karabetsos web developer',
    'software engineer portfolio',
    'computer engineer portfolio',
    'web developer portfolio',
    'frontend developer',
    'backend developer',
    'full stack developer',
    'developer portfolio',
    'engineer portfolio',
    'modern web development',
    'creative developer',
    'clean code developer',
    'developer in Greece',
    'remote developer',
    'tech portfolio',
    'tech projects',
    'developer projects',
    'personal website',
    'portfolio site',
    'interactive web design',
    'user-centric developer',
    'freelance developer',
    'engineer personal site',
  ],
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      { url: '/maskable-icon.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Plausible Analytics */}
        <Script
          async
          defer
          data-domain="panteliskarabetsos.com"
          src="https://plausible.io/js/script.js"
        />

        {/* Favicon links fallback for extra reliability */}
        <link rel="icon" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* JSON-LD logo for Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Pantelis Karabetsos",
              "url": "https://panteliskarabetsos.com",
              "logo": "https://panteliskarabetsos.com/favicon.png",
            }),
          }}
        />
      </head>

      <body className={`${inter.className} cursor-none`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="bg-background text-foreground transition-colors duration-500 min-h-screen">
            <Header />
            {children}
            <Footer />
            <SpeedInsights />
            <Analytics />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
