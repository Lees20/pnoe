'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, UserCircle, ChevronDown,LogIn,LogOut,User } from 'lucide-react';
import { useRouteLoader } from './RouteLoader';
import { signOut, useSession } from 'next-auth/react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShadow, setHasShadow] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const routeLoader = useRouteLoader();
  const { data: session } = useSession();

  const navLinks = [
    { name: 'Experiences', href: '/experiences' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setHasShadow(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-shadow duration-300 ${
        hasShadow ? 'shadow-xl' : 'shadow-none'
      } bg-[#f4f1ec]/90 backdrop-blur-lg border-b border-[#eae6e0]`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <button
          onClick={() => routeLoader?.triggerRouteChange('/')}
          className="text-3xl font-serif text-[#5a4a3f] hover:text-[#8b6f47] transition-all"
        >
          Oasis
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 items-center">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => routeLoader?.triggerRouteChange(link.href)}
              className="text-lg text-[#5a4a3f] hover:bg-[#e8e2d9] hover:text-[#8b6f47] px-4 py-2 rounded-full transition-all"
            >
              {link.name}
            </button>
          ))}

          {session ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 text-sm text-[#5a4a3f] px-4 py-2 rounded-full border border-[#e4ddd3] bg-[#fdfaf5] hover:bg-[#f1ede7] transition"
              >
                <UserCircle size={20} /> {session.user?.name?.split(' ')[0] || 'Account'} <ChevronDown size={16} />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-[#eae6e0] z-10">
                  <button
                    onClick={() => routeLoader?.triggerRouteChange('/bookings')}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-[#fdfaf5] text-[#5a4a3f]"
                  >
                    My Bookings
                  </button>
                  <button
                    onClick={() => routeLoader?.triggerRouteChange('/favourites')}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-[#fdfaf5] text-[#5a4a3f]"
                  >
                    Favourites
                  </button>
                  <button
                    onClick={() => signOut()}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-[#fdfaf5] text-[#b44d4d]"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => routeLoader?.triggerRouteChange('/login')}
              className="flex items-center gap-2 text-sm text-[#5a4a3f] hover:text-[#8b6f47] px-4 py-2 rounded-full border border-[#e4ddd3] bg-[#fdfaf5] hover:bg-[#f1ede7] transition"
            >
              <LogIn size={16} /> Log In
            </button>
          )}
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-[#5a4a3f]"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-[#f4f1ec] border-t border-[#e2ded8] px-6 py-6 animate-fade-in">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => {
                  routeLoader?.triggerRouteChange(link.href);
                  setIsOpen(false);
                }}
                className="px-4 py-2 rounded-full text-[#5a4a3f] hover:bg-[#e8e2d9] hover:text-[#8b6f47] transition"
              >
                {link.name}
              </button>
            ))}
            {session ? (
              <>
                <button
                  onClick={() => {
                    routeLoader?.triggerRouteChange('/bookings');
                    setIsOpen(false);
                  }}
                  className="text-sm text-[#5a4a3f] hover:text-[#8b6f47]"
                >
                  My Bookings
                </button>
                <button
                  onClick={() => {
                    routeLoader?.triggerRouteChange('/favourites');
                    setIsOpen(false);
                  }}
                  className="text-sm text-[#5a4a3f] hover:text-[#8b6f47]"
                >
                  Favourites
                </button>
                <button
                  onClick={() => {
                    signOut();
                    setIsOpen(false);
                  }}
                  className="text-sm text-[#b44d4d]"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  routeLoader?.triggerRouteChange('/login');
                  setIsOpen(false);
                }}
                className="flex items-center gap-2 text-sm text-[#5a4a3f] hover:text-[#8b6f47] px-4 py-2 rounded-full border border-[#e4ddd3] bg-[#fdfaf5] hover:bg-[#f1ede7] transition"
              >
                <LogIn size={16} /> Log In
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}