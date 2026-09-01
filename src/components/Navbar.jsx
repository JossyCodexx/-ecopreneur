import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, Mail, Award } from 'lucide-react';

export default function Navbar({ settings, activePage, setActivePage, onBookNowClick }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', id: 'home' },
    { name: 'About Us', id: 'about' },
    { name: 'Rooms & Suites', id: 'rooms' },
    { name: 'Lounge', id: 'lounge' },
    { name: 'Restaurant', id: 'restaurant' },
    { name: 'Facilities', id: 'facilities' },
    { name: 'Events', id: 'events' },
    { name: 'Gallery', id: 'gallery' },
    { name: 'Offers', id: 'offers' },
    { name: 'Contact', id: 'contact' }
  ];

  const handleNavClick = (id) => {
    setActivePage(id);
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Top utility bar */}
      <div className="bg-[#0B1325] text-[#FAF9F6]/80 text-xs py-2 px-6 hidden md:flex justify-between items-center border-b border-[#FAF9F6]/10 font-sans tracking-wide">
        <div className="flex items-center space-x-6">
          <a href={`tel:${settings.phone}`} className="flex items-center space-x-1 hover:text-[#C5A880] transition-colors">
            <Phone size={12} className="text-[#C5A880]" />
            <span>{settings.phone}</span>
          </a>
          <a href={`mailto:${settings.email}`} className="flex items-center space-x-1 hover:text-[#C5A880] transition-colors">
            <Mail size={12} className="text-[#C5A880]" />
            <span>{settings.email}</span>
          </a>
        </div>
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1 text-[#C5A880]">
            <Award size={12} />
            <span className="font-semibold uppercase text-[10px]">5-Star Luxury Sanctuary</span>
          </span>
          <button 
            onClick={() => handleNavClick('admin')} 
            className="hover:text-[#C5A880] transition-colors text-[11px] uppercase font-semibold"
          >
            Admin Panel
          </button>
        </div>
      </div>

      {/* Main navigation header */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#FAF9F6] shadow-md border-b border-[#FAF9F6]/10 py-3 text-[#1F1D1A]' 
          : 'bg-[#0B1325]/95 md:bg-[#0B1325]/90 backdrop-blur-md py-4 text-[#FAF9F6]'
       }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex-shrink-0 cursor-pointer" onClick={() => handleNavClick('home')}>
              <div className="flex items-center space-x-2">
                <div className={`border-2 p-1.5 rounded transition-all ${isScrolled ? 'border-[#C5A880]' : 'border-[#C5A880]'}`}>
                  <span className={`font-serif text-lg font-bold tracking-widest ${isScrolled ? 'text-[#0B1325]' : 'text-[#FAF9F6]'}`}>EG</span>
                </div>
                <div className="flex flex-col">
                  <span className={`font-serif text-base tracking-widest font-bold leading-none ${isScrolled ? 'text-[#0B1325]' : 'text-[#FAF9F6]'}`}>
                    {settings.logoText || "EKO GRANDEUR"}
                  </span>
                  <span className="text-[9px] tracking-[0.25em] text-[#C5A880] font-sans font-medium uppercase mt-0.5">Hotel & Lounge</span>
                </div>
              </div>
            </div>

            {/* Desktop Navigation links */}
            <nav className="hidden xl:flex space-x-1.5 2xl:space-x-4 items-center">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-2.5 py-1.5 text-xs uppercase font-semibold tracking-wider transition-all duration-200 relative group font-sans ${
                    activePage === item.id
                      ? 'text-[#C5A880]'
                      : isScrolled
                        ? 'text-[#1F1D1A] hover:text-[#C5A880]'
                        : 'text-[#FAF9F6]/90 hover:text-[#C5A880]'
                  }`}
                >
                  {item.name}
                  <span className={`absolute bottom-0 left-2.5 right-2.5 h-[1.5px] bg-[#C5A880] transition-transform duration-300 ${
                    activePage === item.id ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`} />
                </button>
              ))}
            </nav>

            {/* Book Now Button & Hamburger */}
            <div className="flex items-center space-x-4">
              <button
                onClick={onBookNowClick}
                className="bg-[#C5A880] hover:bg-[#B4976D] text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 transition-all duration-300 shadow-sm rounded-none focus:outline-none whitespace-nowrap"
              >
                Book Now
              </button>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`xl:hidden p-2 rounded-md focus:outline-none ${isScrolled ? 'text-[#0B1325]' : 'text-[#FAF9F6]'}`}
                aria-label="Toggle Menu"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Panel */}
        {isOpen && (
          <div className="xl:hidden bg-[#0B1325] border-t border-[#FAF9F6]/10">
            <div className="px-4 pt-2 pb-6 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`block w-full text-left px-3 py-3 rounded-none text-sm uppercase font-semibold tracking-wider border-b border-[#FAF9F6]/5 transition-all ${
                    activePage === item.id
                      ? 'text-[#C5A880] bg-[#FAF9F6]/5'
                      : 'text-[#FAF9F6]/80 hover:text-[#C5A880] hover:bg-[#FAF9F6]/5'
                  }`}
                >
                  {item.name}
                </button>
              ))}
              <button
                onClick={() => handleNavClick('admin')}
                className={`block w-full text-left px-3 py-3 rounded-none text-sm uppercase font-semibold tracking-wider border-b border-[#FAF9F6]/5 transition-all ${
                  activePage === 'admin'
                    ? 'text-[#C5A880] bg-[#FAF9F6]/5'
                    : 'text-[#FAF9F6]/80 hover:text-[#C5A880] hover:bg-[#FAF9F6]/5'
                }`}
              >
                Admin Panel Dashboard
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
