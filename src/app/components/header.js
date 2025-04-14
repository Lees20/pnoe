'use client';
import { useState, useEffect } from 'react';
import { Menu, X, UserCircle, ChevronDown, LogIn, User } from 'lucide-react'; // Adding icons for Login and Register
import { useRouteLoader } from './RouteLoader';
import { signOut, useSession } from 'next-auth/react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShadow, setHasShadow] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false); // For the account dropdown
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
                    onClick={() => routeLoader?.triggerRouteChange('/account/settings')}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-[#fdfaf5] text-[#5a4a3f]"
                  >
                    Settings
                  </button>
                  
                  {session?.user?.role === 'admin' && (
                    <nav>
                      <a   className="block w-full text-left px-4 py-2 text-sm hover:bg-[#fdfaf5] text-[#5a4a3f]" 
                      href="/admin/experiences">Manage Experiences</a> {/* Link to the admin page */}
                    </nav>
                  )}
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
            <>
              {/* Discreet "Log In" Button with Icon */}
              <button
                onClick={() => routeLoader?.triggerRouteChange('/login')}
                className="flex items-center gap-2 text-sm text-[#8b6f47] hover:text-[#5a4a3f] py-1.5 px-3 transition-all font-medium hover:bg-[#e8e2d9] rounded-full"
              >
                <LogIn size={16} />
                Log In
              </button>

              {/* Discreet "Register" Button with Icon */}
              <button
                onClick={() => routeLoader?.triggerRouteChange('/sign-up')}
                className="flex items-center gap-2 text-sm text-[#8b6f47] hover:text-[#5a4a3f] py-1.5 px-3 transition-all font-medium hover:bg-[#e8e2d9] rounded-full"
              >
                <User size={16} />
                Register
              </button>
            </>
          )}
        </nav>

        {/* Hamburger and Account Icon for Mobile */}
        <div className="md:hidden flex items-center gap-4">
          {/* Account Icon */}
          {session && (
            <button
              onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
              className="flex items-center gap-2 text-sm text-[#5a4a3f] hover:text-[#8b6f47] px-4 py-2 rounded-full border border-[#e4ddd3] bg-[#fdfaf5] hover:bg-[#f1ede7] transition"
            >
              <UserCircle size={20} />
            </button>
          )}

          {/* Hamburger Menu */}
          <button
            className="text-[#5a4a3f]"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-[#f4f1ec] border-t border-[#e2ded8] px-6 py-6 animate-fade-in shadow-xl transition-all">
          <nav className="flex flex-col gap-6 items-center">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => {
                  routeLoader?.triggerRouteChange(link.href);
                  setIsOpen(false);
                }}
                className="text-[#5a4a3f] text-lg hover:bg-[#e8e2d9] px-4 py-2 rounded-full transition-all"
              >
                {link.name}
              </button>
            ))}
            {/* Minimalistic Log In and Register buttons in the hamburger menu */}
            {!session && (
              <>
                {/* Log In Button with Icon */}
                <button
                  onClick={() => {
                    routeLoader?.triggerRouteChange('/login');
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-2 text-sm text-[#8b6f47] hover:text-[#5a4a3f] py-1.5 px-3 transition-all font-medium hover:bg-[#e8e2d9] rounded-full"
                >
                  <LogIn size={16} /> Log In
                </button>

                {/* Register Button with Icon */}
                <button
                  onClick={() => {
                    routeLoader?.triggerRouteChange('/sign-up');
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-2 text-sm text-[#8b6f47] hover:text-[#5a4a3f] py-1.5 px-3 transition-all font-medium hover:bg-[#e8e2d9] rounded-full"
                >
                  <User size={16} /> Register
                </button>
              </>
            )}
          </nav>
        </div>
      )}

      {/* Mobile Account Dropdown */}
      {accountDropdownOpen && session && (
        <div className="md:hidden absolute top-20 right-4 w-48 bg-white rounded-xl shadow-lg border border-[#eae6e0] z-10">
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
            onClick={() => routeLoader?.triggerRouteChange('/account/settings')}
            className="block w-full text-left px-4 py-2 text-sm hover:bg-[#fdfaf5] text-[#5a4a3f]"
          >
            Settings
          </button>
          <button
            onClick={() => {
              signOut();
              setAccountDropdownOpen(false);
            }}
            className="block w-full text-left px-4 py-2 text-sm hover:bg-[#fdfaf5] text-[#b44d4d]"
          >
            Sign Out
          </button>
          
          {session?.user?.role === 'admin' && (
                    <nav>
                      <a   className="block w-full text-left px-4 py-2 text-sm hover:bg-[#fdfaf5] text-[#5a4a3f]" 
                      href="/admin/experiences">Manage Experiences</a> {/* Link to the admin page */}
                    </nav>
                  )}
            </div>
          )}
      
    </header>
  );
}
