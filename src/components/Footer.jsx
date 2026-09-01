import React from 'react';
import { Mail, Phone, MapPin, MessageSquare, Facebook, Instagram, Twitter, ArrowUp } from 'lucide-react';

export default function Footer({ settings, setActivePage, onBookNowClick }) {
  
  const handleLinkClick = (id) => {
    setActivePage(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0B1325] text-[#FAF9F6] border-t border-[#FAF9F6]/10 font-sans">
      {/* Top Footer Section with Brand and Information Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Column 1: Brand Profile */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <div className="border border-[#C5A880] p-1.5 rounded">
                <span className="font-serif text-lg font-bold tracking-widest text-[#FAF9F6]">EG</span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-base tracking-widest font-bold text-[#FAF9F6]">
                  {settings.name || "Eko Grandeur"}
                </span>
                <span className="text-[9px] tracking-widest text-[#C5A880] uppercase">Luxury Hotel & Lounge</span>
              </div>
            </div>
            <p className="text-sm text-[#FAF9F6]/75 leading-relaxed">
              Step into an exclusive sanctuary in Lagos. Enjoy world-class hospitality, gourmet chef dining, premium suites, and unforgettable memories at Victoria Island.
            </p>
            {/* Social media links */}
            <div className="flex space-x-4 pt-2">
              <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="p-2 border border-[#FAF9F6]/10 hover:border-[#C5A880] hover:text-[#C5A880] text-[#FAF9F6]/80 transition-all">
                <Facebook size={16} />
              </a>
              <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="p-2 border border-[#FAF9F6]/10 hover:border-[#C5A880] hover:text-[#C5A880] text-[#FAF9F6]/80 transition-all">
                <Instagram size={16} />
              </a>
              <a href={settings.twitter} target="_blank" rel="noopener noreferrer" className="p-2 border border-[#FAF9F6]/10 hover:border-[#C5A880] hover:text-[#C5A880] text-[#FAF9F6]/80 transition-all">
                <Twitter size={16} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-serif text-sm font-semibold tracking-wider uppercase text-[#C5A880] mb-6 border-b border-[#FAF9F6]/10 pb-2">
              Explore
            </h4>
            <ul className="space-y-3.5 text-sm text-[#FAF9F6]/80">
              <li>
                <button onClick={() => handleLinkClick('home')} className="hover:text-[#C5A880] transition-colors focus:outline-none">
                  Home Page
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('about')} className="hover:text-[#C5A880] transition-colors focus:outline-none">
                  About Our Resort
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('rooms')} className="hover:text-[#C5A880] transition-colors focus:outline-none">
                  Rooms & Suites
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('facilities')} className="hover:text-[#C5A880] transition-colors focus:outline-none">
                  Resort Facilities
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('offers')} className="hover:text-[#C5A880] transition-colors focus:outline-none">
                  Special Packages
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Spaces & Booking */}
          <div>
            <h4 className="font-serif text-sm font-semibold tracking-wider uppercase text-[#C5A880] mb-6 border-b border-[#FAF9F6]/10 pb-2">
              Amenities & Booking
            </h4>
            <ul className="space-y-3.5 text-sm text-[#FAF9F6]/80">
              <li>
                <button onClick={() => handleLinkClick('lounge')} className="hover:text-[#C5A880] transition-colors focus:outline-none">
                  The Premium Lounge
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('restaurant')} className="hover:text-[#C5A880] transition-colors focus:outline-none">
                  Five-Star Restaurant
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('events')} className="hover:text-[#C5A880] transition-colors focus:outline-none">
                  Events & Conference Halls
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('gallery')} className="hover:text-[#C5A880] transition-colors focus:outline-none">
                  Photo Gallery
                </button>
              </li>
              <li>
                <button onClick={onBookNowClick} className="text-[#C5A880] font-bold hover:text-[#B4976D] transition-colors focus:outline-none">
                  Book A Room Online
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Location & Inquiries */}
          <div>
            <h4 className="font-serif text-sm font-semibold tracking-wider uppercase text-[#C5A880] mb-6 border-b border-[#FAF9F6]/10 pb-2">
              Contact & Support
            </h4>
            <ul className="space-y-4 text-sm text-[#FAF9F6]/80">
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="text-[#C5A880] flex-shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={16} className="text-[#C5A880] flex-shrink-0" />
                <a href={`tel:${settings.phone}`} className="hover:text-[#C5A880] transition-colors">
                  {settings.phone}
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={16} className="text-[#C5A880] flex-shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-[#C5A880] transition-colors break-all">
                  {settings.email}
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <MessageSquare size={16} className="text-[#C5A880] flex-shrink-0" />
                <a 
                  href={`https://wa.me/${settings.whatsapp.replace(/\+/g, '').replace(/\s/g, '')}?text=Hello,%20I%20would%20like%20to%20make%20a%20reservation%20at%20${encodeURIComponent(settings.name)}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-[#C5A880] transition-colors font-medium text-emerald-400"
                >
                  WhatsApp Booking Active
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Copyright and Developer Credit Section */}
      <div className="border-t border-[#FAF9F6]/10 bg-[#070C18] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-xs text-[#FAF9F6]/60 text-center md:text-left gap-4">
          <div>
            <p>© 2026 <strong>{settings.name}</strong>. All Rights Reserved.</p>
          </div>
          <div className="font-medium tracking-wide">
            <p className="text-[#FAF9F6]/50">
              Designed & Developed by{" "}
              <span className="text-[#C5A880] font-bold">Melody Tech Boy</span> 
              <span className="hidden md:inline"> — </span>
              <br className="md:hidden" />
              Website Developer | Web Development Trainer | Coding Instructor
            </p>
          </div>
          <div>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="p-2.5 border border-[#FAF9F6]/10 hover:border-[#C5A880] hover:text-[#C5A880] bg-[#0B1325] text-[#FAF9F6]/80 transition-all focus:outline-none"
              title="Back to Top"
            >
              <ArrowUp size={14} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
