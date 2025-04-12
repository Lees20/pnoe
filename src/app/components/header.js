'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShadow, setHasShadow] = useState(false);

  const navLinks = [
    { name: 'Experiences', href: '#experiences' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
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
        hasShadow ? 'shadow-md' : ''
      } bg-[#f4f1ec]/70 backdrop-blur-lg border-b border-[#eae6e0]`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-serif text-[#5a4a3f] hover:opacity-90 transition">
          Oasis
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-4">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="px-4 py-2 rounded-full text-sm text-[#5a4a3f] hover:bg-[#e8e2d9] hover:text-[#8b6f47] transition-all"
            >
              {link.name}
            </a>
          ))}
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
        <div className="md:hidden bg-[#f4f1ec] border-t border-[#e2ded8] px-6 pb-6 pt-2 animate-fade-in">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-full text-[#5a4a3f] hover:bg-[#e8e2d9] hover:text-[#8b6f47] transition"
              >
                {link.name}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>//comment
  );
}
