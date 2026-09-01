import React, { useState, useEffect } from 'react';
import { 
  Calendar, Phone, Mail, MapPin, Award, Waves, Dumbbell, Utensils, 
  Music, GlassWater, Wifi, Flower, Users, Shield, MessageSquare, 
  Star, ChevronRight, Eye, ChevronLeft, ArrowRight, Heart, Briefcase, 
  Sparkles, Coffee, Clock, Compass, Send, CheckCircle, Loader2, KeyRound 
} from 'lucide-react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BookingWizard from './components/BookingWizard';
import RoomDetailsModal from './components/RoomDetailsModal';
import ReviewModal from './components/ReviewModal';
import AdminDashboard from './components/AdminDashboard';
import { INITIAL_FACILITIES, INITIAL_SETTINGS } from './demoData';

export default function App() {
  // Navigation & Page State
  const [activePage, setActivePage] = useState('home');
  
  // Settings & DB Data State
  const [settings, setSettings] = useState(INITIAL_SETTINGS);
  const [rooms, setRooms] = useState([]);
  const [menu, setMenu] = useState([]);
  const [offers, setOffers] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  // Modals & Booking Wizards
  const [showBookingWizard, setShowBookingWizard] = useState(false);
  const [wizardPreSelects, setWizardPreSelects] = useState({ checkIn: '', checkOut: '', guests: 1, category: 'All' });
  const [selectedRoomDetails, setSelectedRoomDetails] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Gallery Lightbox State
  const [lightboxImage, setLightboxImage] = useState(null);
  const [galleryFilter, setGalleryFilter] = useState('All');

  // Interactive Table Reservation State (Lounge & Restaurant)
  const [tableBooking, setTableBooking] = useState({
    name: '', phone: '', email: '', date: '', time: '19:00', guests: 2, seatingPreference: 'Premium Window', specialRequest: ''
  });
  const [isReservingTable, setIsReservingTable] = useState(false);
  const [tableReceipt, setTableReceipt] = useState(null);
  const [tableError, setTableError] = useState('');

  // Interactive Contact Us Form State
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', subject: 'General Query', message: '' });
  const [isSendingContact, setIsSendingContact] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactError, setContactError] = useState('');

  // Interactive Event Inquiry State
  const [selectedEventPackage, setSelectedEventPackage] = useState(null);
  const [eventInquiryForm, setEventInquiryForm] = useState({ name: '', email: '', phone: '', guests: 50, date: '', message: '' });
  const [isSendingInquiry, setIsSendingInquiry] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);
  const [inquiryError, setInquiryError] = useState('');

  // Home Quick Search availability
  const [homeSearch, setHomeSearch] = useState({
    checkIn: new Date().toISOString().split('T')[0],
    checkOut: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    guests: 2,
    category: 'All'
  });

  // Load all server statistics on mount
  const loadServerData = async () => {
    try {
      const [sRes, rRes, mRes, oRes, gRes, tRes] = await Promise.all([
        fetch('/api/settings'),
        fetch('/api/rooms'),
        fetch('/api/menu'),
        fetch('/api/offers'),
        fetch('/api/gallery'),
        fetch('/api/reviews')
      ]);

      if (sRes.ok) setSettings(await sRes.json());
      if (rRes.ok) setRooms(await rRes.json());
      if (mRes.ok) setMenu(await mRes.json());
      if (oRes.ok) setOffers(await oRes.json());
      if (gRes.ok) setGallery(await gRes.json());
      if (tRes.ok) setTestimonials(await tRes.json());
    } catch (e) {
      console.error("Error loading server lists:", e);
    }
  };

  useEffect(() => {
    loadServerData();
  }, []);

  const handleOpenBookingWithDefaults = (checkIn, checkOut, guests, category) => {
    setWizardPreSelects({
      checkIn: checkIn || new Date().toISOString().split('T')[0],
      checkOut: checkOut || new Date(Date.now() + 86400000).toISOString().split('T')[0],
      guests: guests || 1,
      category: category || 'All'
    });
    setShowBookingWizard(true);
  };

  const handleRoomSelectionFromDetails = (room) => {
    setSelectedRoomDetails(null);
    setWizardPreSelects({
      checkIn: new Date().toISOString().split('T')[0],
      checkOut: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      guests: 1,
      category: room.category
    });
    setShowBookingWizard(true);
  };

  // Submit Lounge & Restaurant Table Reservation
  const handleTableReservationSubmit = async (e) => {
    e.preventDefault();
    setTableError('');
    setTableReceipt(null);

    if (!tableBooking.name.trim() || !tableBooking.phone.trim() || !tableBooking.email.trim() || !tableBooking.date) {
      setTableError('Please complete all required fields.');
      return;
    }

    setIsReservingTable(true);
    try {
      const res = await fetch('/api/lounge-reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tableBooking)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Server rejected table reservation.');

      setTableReceipt(data);
      // reset form
      setTableBooking({ name: '', phone: '', email: '', date: '', time: '19:00', guests: 2, seatingPreference: 'Premium Window', specialRequest: '' });
    } catch (err) {
      setTableError(err.message || 'Connection failure.');
    } finally {
      setIsReservingTable(false);
    }
  };

  // Submit Contact Form
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactError('');
    setContactSuccess(false);

    if (!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.message.trim()) {
      setContactError('Please fill out the required fields.');
      return;
    }

    setIsSendingContact(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm)
      });
      if (!res.ok) throw new Error('Inquiry transmission failed.');

      setContactSuccess(true);
      setContactForm({ name: '', email: '', phone: '', subject: 'General Query', message: '' });
    } catch (err) {
      setContactError(err.message || 'Failed to submit form.');
    } finally {
      setIsSendingContact(false);
    }
  };

  // Submit Event Inquiry
  const handleEventInquirySubmit = async (e) => {
    e.preventDefault();
    setInquiryError('');
    setInquirySuccess(false);

    if (!eventInquiryForm.name.trim() || !eventInquiryForm.email.trim() || !eventInquiryForm.date) {
      setInquiryError('Please complete all required credentials.');
      return;
    }

    setIsSendingInquiry(true);
    try {
      const payload = {
        ...eventInquiryForm,
        eventType: selectedEventPackage?.name || 'Custom Private Event',
        packageId: selectedEventPackage?.id || 'custom'
      };

      const res = await fetch('/api/event-inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to transmit event inquiry.');

      setInquirySuccess(true);
      setEventInquiryForm({ name: '', email: '', phone: '', guests: 50, date: '', message: '' });
    } catch (err) {
      setInquiryError(err.message || 'Failed to submit inquiry.');
    } finally {
      setIsSendingInquiry(false);
    }
  };

  // Menu categories filtering
  const [activeMenuTab, setActiveMenuTab] = useState('Local Cuisine');

  const categories = ['Breakfast', 'Lunch', 'Dinner', 'Local Cuisine', 'Continental', 'Desserts', 'Drinks', 'Cocktails / Mocktails'];

  const filteredMenu = menu.filter(item => item.category === activeMenuTab);

  const filteredGallery = galleryFilter === 'All' 
    ? gallery 
    : gallery.filter(img => img.category === galleryFilter);

  // Quick icon resolver for facilities using string mapping
  const resolveFacilityIcon = (iconName) => {
    switch (iconName) {
      case 'Waves': return <Waves className="text-[#C5A880]" size={20} />;
      case 'Dumbbell': return <Dumbbell className="text-[#C5A880]" size={20} />;
      case 'Utensils': return <Utensils className="text-[#C5A880]" size={20} />;
      case 'Music': return <Music className="text-[#C5A880]" size={20} />;
      case 'GlassWater': return <GlassWater className="text-[#C5A880]" size={20} />;
      case 'Wifi': return <Wifi className="text-[#C5A880]" size={20} />;
      case 'Spa': return <Flower className="text-[#C5A880]" size={20} />;
      case 'Conference Room':
      case 'Users': return <Users className="text-[#C5A880]" size={20} />;
      default: return <Sparkles className="text-[#C5A880]" size={20} />;
    }
  };

  return (
    <div className="bg-[#FAF9F6] text-[#1F1D1A] min-h-screen flex flex-col selection:bg-[#C5A880] selection:text-white">
      
      {/* Navigation */}
      <Navbar 
        settings={settings} 
        activePage={activePage} 
        setActivePage={setActivePage} 
        onBookNowClick={() => handleOpenBookingWithDefaults()} 
      />

      {/* RENDER PAGES DYNAMICALLY */}
      <div className="flex-grow">
        
        {/* --- PAGE: HOME --- */}
        {activePage === 'home' && (
          <div className="space-y-16">
            
            {/* HERO SECTION */}
            <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-black/60 z-10"></div>
              <img
                src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1920"
                alt="Eko Grandeur Hotel"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover animate-fade-in"
              />
              
              <div className="relative z-20 text-center text-white max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
                <span className="text-[10px] uppercase tracking-[0.35em] text-[#C5A880] font-sans font-bold block animate-pulse">
                  Unveiling Absolute Serenity in Lagos
                </span>
                <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-wide text-[#FAF9F6] uppercase leading-tight">
                  WELCOME TO <br />
                  <span className="text-[#C5A880]">{settings.name}</span>
                </h1>
                <p className="font-sans text-sm sm:text-base max-w-2xl mx-auto text-[#FAF9F6]/85 font-medium leading-relaxed">
                  Luxury Accommodation, Exceptional Hospitality & Unforgettable Experiences in Victoria Island.
                </p>
                <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
                  <button
                    onClick={() => handleOpenBookingWithDefaults()}
                    className="bg-[#C5A880] hover:bg-[#B4976D] text-white text-xs font-bold uppercase tracking-widest px-8 py-3.5 transition-all duration-300 w-full sm:w-auto rounded-none shadow-md"
                  >
                    Book a Room
                  </button>
                  <button
                    onClick={() => { setActivePage('about'); window.scrollTo({ top: 0 }); }}
                    className="border border-[#FAF9F6]/30 hover:border-[#C5A880] text-white hover:text-[#C5A880] text-xs font-bold uppercase tracking-widest px-8 py-3.5 transition-all duration-300 w-full sm:w-auto rounded-none"
                  >
                    Explore Our Hotel
                  </button>
                </div>
              </div>
            </section>

            {/* QUICK BOOKING BAR */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-30">
              <div className="bg-[#FAF9F6] border border-[#C5A880]/30 shadow-2xl p-6 font-sans">
                <h4 className="font-serif text-xs font-bold uppercase tracking-widest text-[#0B1325] mb-4 border-b border-[#FAF1EA] pb-2 text-center sm:text-left">
                  Check Vacancies in Real Time
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-1">Check-In</label>
                    <input
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={homeSearch.checkIn}
                      onChange={(e) => setHomeSearch({ ...homeSearch, checkIn: e.target.value })}
                      className="w-full text-xs bg-gray-50 border border-gray-200 px-3 py-2.5 focus:outline-none focus:border-[#C5A880] text-gray-800"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-1">Check-Out</label>
                    <input
                      type="date"
                      min={new Date(new Date(homeSearch.checkIn).getTime() + 86400000).toISOString().split('T')[0]}
                      value={homeSearch.checkOut}
                      onChange={(e) => setHomeSearch({ ...homeSearch, checkOut: e.target.value })}
                      className="w-full text-xs bg-gray-50 border border-gray-200 px-3 py-2.5 focus:outline-none focus:border-[#C5A880] text-gray-800"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-1">Guests</label>
                    <select
                      value={homeSearch.guests}
                      onChange={(e) => setHomeSearch({ ...homeSearch, guests: Number(e.target.value) })}
                      className="w-full text-xs bg-gray-50 border border-gray-200 px-3 py-2.5 focus:outline-none focus:border-[#C5A880]"
                    >
                      {[1, 2, 3, 4].map(n => (
                        <option key={n} value={n}>{n} Person{n > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-1">Room Class</label>
                    <select
                      value={homeSearch.category}
                      onChange={(e) => setHomeSearch({ ...homeSearch, category: e.target.value })}
                      className="w-full text-xs bg-gray-50 border border-gray-200 px-3 py-2.5 focus:outline-none focus:border-[#C5A880]"
                    >
                      <option value="All">All Categories</option>
                      <option value="Standard">Standard Rooms</option>
                      <option value="Deluxe">Deluxe Rooms</option>
                      <option value="Executive Suite">Executive Suites</option>
                      <option value="Presidential Suite">Presidential Suites</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button
                      onClick={() => handleOpenBookingWithDefaults(homeSearch.checkIn, homeSearch.checkOut, homeSearch.guests, homeSearch.category)}
                      className="w-full bg-[#0B1325] hover:bg-[#C5A880] text-[#C5A880] hover:text-white text-xs font-bold uppercase tracking-widest py-3 transition-all duration-300 rounded-none shadow"
                    >
                      Check Vacancies
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* INTRO ABOUT & STATS */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <span className="text-[10px] uppercase tracking-widest font-bold text-[#C5A880] font-sans">
                  The Sanctuary of Victoria Island
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B1325] tracking-wide uppercase leading-tight">
                  A Legacy of Architectural Majesty & Exquisite Comfort
                </h2>
                <p className="text-sm font-sans text-gray-600 leading-relaxed">
                  Located in the elite district of Victoria Island, {settings.name} sets the hallmark for premium hospitality in Nigeria. We combine majestic modern structures, warm tropical elements, and a five-star dining ecosystem to present a palatial experience for business leaders and global explorers.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-4 font-serif text-center">
                  <div className="border border-[#FAF1EA] bg-white p-4">
                    <span className="block text-xl font-bold text-[#0B1325]">50+</span>
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-500 font-sans block mt-1">Luxe Rooms</span>
                  </div>
                  <div className="border border-[#FAF1EA] bg-white p-4">
                    <span className="block text-xl font-bold text-[#0B1325]">10+</span>
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-500 font-sans block mt-1">Years Stay</span>
                  </div>
                  <div className="border border-[#FAF1EA] bg-white p-4">
                    <span className="block text-xl font-bold text-[#0B1325]">5,000+</span>
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-500 font-sans block mt-1">Happy Guests</span>
                  </div>
                  <div className="border border-[#FAF1EA] bg-white p-4">
                    <span className="block text-xl font-bold text-[#0B1325]">24/7</span>
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-500 font-sans block mt-1">Butler Care</span>
                  </div>
                </div>
              </div>

              <div className="aspect-video relative overflow-hidden bg-gray-100 border border-[#C5A880]/10">
                <img
                  src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1000"
                  alt="Hotel Entrance"
                  referrerPolicy="no-referrer"
                  className="object-cover w-full h-full"
                />
              </div>
            </section>

            {/* CURATED SUITES */}
            <section className="bg-gray-50 py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                <div className="text-center space-y-2">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-[#C5A880] font-sans">Accommodation Showroom</span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 tracking-wide uppercase">Curated Master Suites</h3>
                  <div className="w-16 h-px bg-[#C5A880] mx-auto mt-2"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {rooms.slice(0, 3).map((room) => (
                    <div key={room.id} className="bg-white border flex flex-col justify-between hover:border-[#C5A880] transition-all group">
                      <div className="relative aspect-video overflow-hidden bg-gray-100">
                        <img
                          src={room.images[0]}
                          alt={room.name}
                          referrerPolicy="no-referrer"
                          className="object-cover w-full h-full group-hover:scale-105 transition-all duration-500"
                        />
                        <div className="absolute top-2 left-2 bg-[#0B1325] text-[#C5A880] text-[9px] uppercase font-bold tracking-widest px-2.5 py-1">
                          {room.category}
                        </div>
                      </div>

                      <div className="p-5 flex flex-col flex-grow justify-between">
                        <div>
                          <h4 className="font-serif text-base font-bold text-gray-900">{room.name}</h4>
                          <p className="text-xs text-gray-500 line-clamp-2 mt-1.5 leading-relaxed">{room.description}</p>
                          <div className="flex justify-between items-center text-[10px] text-gray-400 font-semibold border-t pt-2.5 mt-3">
                            <span>Bed: {room.bedType}</span>
                            <span>Size: {room.size} m²</span>
                          </div>
                        </div>

                        <div className="border-t pt-4 mt-4 flex items-center justify-between">
                          <div>
                            <span className="text-[9px] text-gray-400 block uppercase leading-none">Starting from</span>
                            <span className="text-base font-serif font-bold text-[#0B1325]">₦{room.price.toLocaleString()}</span>
                          </div>
                          <div className="flex space-x-1.5">
                            <button
                              onClick={() => setSelectedRoomDetails(room)}
                              className="border border-[#0B1325] hover:border-[#C5A880] text-[#0B1325] hover:text-[#C5A880] text-[10px] font-bold uppercase tracking-wider px-3.5 py-1.5 transition-all"
                            >
                              Details
                            </button>
                            <button
                              onClick={() => handleOpenBookingWithDefaults(undefined, undefined, undefined, room.category)}
                              className="bg-[#0B1325] hover:bg-[#C5A880] text-[#C5A880] hover:text-white text-[10px] font-bold uppercase tracking-wider px-3.5 py-1.5 transition-all"
                            >
                              Book
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-center pt-4">
                  <button
                    onClick={() => { setActivePage('rooms'); window.scrollTo({ top: 0 }); }}
                    className="bg-[#0B1325] text-[#C5A880] hover:bg-[#C5A880] hover:text-white text-xs font-bold uppercase tracking-widest px-8 py-3.5 transition-all"
                  >
                    View All Suites
                  </button>
                </div>
              </div>
            </section>

            {/* TESTIMONIALS SECTION */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
              <div className="text-center space-y-2">
                <span className="text-[10px] uppercase tracking-widest font-bold text-[#C5A880] font-sans">Customer Feedback</span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 tracking-wide uppercase">Luminaries Review</h3>
                <div className="w-16 h-px bg-[#C5A880] mx-auto mt-2"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonials.slice(0, 3).map((t) => (
                  <div key={t.id} className="bg-white border p-6 flex flex-col justify-between hover:border-[#C5A880] transition-all font-sans relative">
                    <div className="absolute top-6 right-6 flex text-amber-500">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} size={12} className="fill-current" />
                      ))}
                    </div>
                    
                    <p className="text-xs text-gray-600 leading-relaxed italic mb-6">"{t.comment}"</p>
                    
                    <div className="flex items-center space-x-3.5 border-t border-gray-100 pt-4 mt-auto">
                      <img src={t.avatar} alt={t.name} referrerPolicy="no-referrer" className="w-9 h-9 rounded-full object-cover border" />
                      <div>
                        <strong className="text-xs text-gray-900 block">{t.name}</strong>
                        <span className="text-[10px] text-gray-400 block">{t.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="bg-[#0B1325] text-[#C5A880] hover:bg-[#C5A880] hover:text-white text-xs font-bold uppercase tracking-widest px-8 py-3.5 transition-all"
                >
                  Leave a Review
                </button>
              </div>
            </section>

            {/* POWERFUL FINAL CALL TO ACTION */}
            <section className="bg-[#0B1325] text-[#FAF9F6] py-16 relative overflow-hidden border-t-2 border-[#C5A880]">
              <div className="absolute inset-0 bg-black/40 z-10"></div>
              <div className="relative z-20 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 space-y-6">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A880] font-sans font-bold block">Exclusive Invitation</span>
                <h3 className="font-serif text-2xl sm:text-4xl font-bold tracking-wide uppercase">READY FOR AN UNFORGETTABLE EXPERIENCE?</h3>
                <p className="text-sm font-sans max-w-xl mx-auto text-white/80 leading-relaxed">
                  Book your room today and experience exceptional hospitality, comfort and luxury. Settle in the center of Victoria Island, Lagos.
                </p>
                <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
                  <button
                    onClick={() => handleOpenBookingWithDefaults()}
                    className="bg-[#C5A880] hover:bg-[#B4976D] text-white text-xs font-bold uppercase tracking-widest px-8 py-3.5 transition-all w-full sm:w-auto rounded-none"
                  >
                    BOOK YOUR ROOM
                  </button>
                  <button
                    onClick={() => { setActivePage('contact'); window.scrollTo({ top: 0 }); }}
                    className="border border-white/20 hover:border-[#C5A880] text-white hover:text-[#C5A880] text-xs font-bold uppercase tracking-widest px-8 py-3.5 transition-all w-full sm:w-auto rounded-none"
                  >
                    CONTACT US
                  </button>
                </div>
              </div>
            </section>

          </div>
        )}

        {/* --- PAGE: ABOUT US --- */}
        {activePage === 'about' && (
          <div className="space-y-16 py-12">
            <section className="max-w-4xl mx-auto text-center px-4 space-y-4">
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#C5A880] font-sans">Our Identity</span>
              <h2 className="font-serif text-3xl font-bold text-gray-900 tracking-wide uppercase">The Heritage of Eko Grandeur</h2>
              <div className="w-16 h-px bg-[#C5A880] mx-auto mt-2"></div>
            </section>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 text-sm font-sans text-gray-600 leading-relaxed">
                <h3 className="font-serif text-xl font-bold text-[#0B1325] tracking-wide uppercase">Our Hospitality Philosophy</h3>
                <p>
                  At {settings.name}, hospitality is not merely a service; it is a sacred culinary and lodging art. Established over a decade ago, our vision remains clear: to provide a secure sanctuary where state-of-the-art corporate requirements meet relaxed luxury recreation.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="bg-white border p-4">
                    <strong className="block font-serif text-sm uppercase text-[#0B1325]">Our Vision</strong>
                    <span className="text-xs text-gray-500 mt-1 block">To be the absolute standard of premier luxury hospitality across the West African coast.</span>
                  </div>
                  <div className="bg-white border p-4">
                    <strong className="block font-serif text-sm uppercase text-[#0B1325]">Our Mission</strong>
                    <span className="text-xs text-gray-500 mt-1 block">Consistently anticipating and exceeding guest expectations with personalized, detailed care.</span>
                  </div>
                </div>
              </div>

              <div className="aspect-video relative overflow-hidden bg-gray-100 border">
                <img
                  src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1000"
                  alt="Hotel facade"
                  referrerPolicy="no-referrer"
                  className="object-cover w-full h-full"
                />
              </div>
            </section>
          </div>
        )}

        {/* --- PAGE: ROOMS & SUITES --- */}
        {activePage === 'rooms' && (
          <div className="space-y-12 py-12">
            <section className="max-w-4xl mx-auto text-center px-4 space-y-4">
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#C5A880] font-sans">Luxe Accommodations</span>
              <h2 className="font-serif text-3xl font-bold text-gray-900 tracking-wide uppercase">Rooms & Suites</h2>
              <p className="text-xs text-gray-500 max-w-lg mx-auto font-sans leading-relaxed">
                Each room is designed with fine fabrics, private luxurious bathrooms, and individual balconies providing spectacular views of Victoria Island.
              </p>
              <div className="w-16 h-px bg-[#C5A880] mx-auto mt-2"></div>
            </section>

            {/* List all room cards */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rooms.map((room) => (
                <div key={room.id} className="bg-white border flex flex-col justify-between hover:border-[#C5A880] transition-all group">
                  <div className="relative aspect-video overflow-hidden bg-gray-100">
                    <img
                      src={room.images[0]}
                      alt={room.name}
                      referrerPolicy="no-referrer"
                      className="object-cover w-full h-full group-hover:scale-105 transition-all duration-500"
                    />
                    <div className="absolute top-2 left-2 bg-[#0B1325] text-[#C5A880] text-[9px] uppercase font-bold tracking-widest px-2.5 py-1">
                      {room.category}
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-grow justify-between">
                    <div>
                      <h4 className="font-serif text-base font-bold text-gray-900">{room.name}</h4>
                      <p className="text-xs text-gray-500 line-clamp-3 mt-1.5 leading-relaxed font-sans">{room.description}</p>
                      
                      <div className="grid grid-cols-2 gap-1.5 text-[10px] text-gray-400 font-bold border-t pt-2.5 mt-3 font-sans">
                        <span>Max Guests: {room.maxGuests}</span>
                        <span>Bed Configuration: {room.bedType}</span>
                        <span>Area size: {room.size} sqm</span>
                      </div>
                    </div>

                    <div className="border-t pt-4 mt-4 flex items-center justify-between">
                      <div>
                        <span className="text-[9px] text-gray-400 block uppercase leading-none">Starting from</span>
                        <span className="text-base font-serif font-bold text-[#0B1325]">₦{room.price.toLocaleString()}</span>
                      </div>
                      <div className="flex space-x-1.5">
                        <button
                          onClick={() => setSelectedRoomDetails(room)}
                          className="border border-[#0B1325] hover:border-[#C5A880] text-[#0B1325] hover:text-[#C5A880] text-[10px] font-bold uppercase tracking-wider px-3.5 py-1.5 transition-all"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => handleOpenBookingWithDefaults(undefined, undefined, undefined, room.category)}
                          className="bg-[#0B1325] hover:bg-[#C5A880] text-[#C5A880] hover:text-white text-[10px] font-bold uppercase tracking-wider px-3.5 py-1.5 transition-all"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </section>
          </div>
        )}

        {/* --- PAGE: LOUNGE --- */}
        {activePage === 'lounge' && (
          <div className="space-y-16 py-12">
            
            {/* Header */}
            <section className="max-w-4xl mx-auto text-center px-4 space-y-4">
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#C5A880] font-sans">Premium Recreation</span>
              <h2 className="font-serif text-3xl font-bold text-gray-900 tracking-wide uppercase">The Premium Lounge</h2>
              <div className="w-16 h-px bg-[#C5A880] mx-auto mt-2"></div>
            </section>

            {/* Description & Reservation Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              
              {/* Left Side: Photo & Information */}
              <div className="space-y-6">
                <div className="aspect-video relative overflow-hidden bg-gray-100 border border-[#C5A880]/15">
                  <img
                    src="https://images.unsplash.com/photo-1517502884422-41eaaced0168?auto=format&fit=crop&q=80&w=1000"
                    alt="Lounge Seating"
                    referrerPolicy="no-referrer"
                    className="object-cover w-full h-full"
                  />
                </div>
                
                <div className="space-y-4 text-xs font-sans text-gray-600 leading-relaxed">
                  <h4 className="font-serif text-sm font-bold uppercase tracking-wide text-gray-900">Exclusive Seating & High Entertainment</h4>
                  <p>
                    Unwind in an opulent, ambient space. Featuring curated lighting configurations, deep velvet sofas, a fully stocked bar with aged spirits, and smooth nightly jazz rhythms.
                  </p>
                  <ul className="space-y-2 border-t pt-4">
                    <li>Hours: <strong>16:00 — 02:00 Daily</strong></li>
                    <li>VIP Rooms: <strong>Available on reservation with butler service</strong></li>
                    <li>Seating: <strong>Indoor leather booths & Outdoor lagoon terrace</strong></li>
                  </ul>
                </div>
              </div>

              {/* Right Side: Table Reservation Form */}
              <div className="bg-white border p-6 shadow-md font-sans">
                <h4 className="font-serif text-base font-bold text-gray-900 mb-4 border-b pb-2 uppercase tracking-wide">
                  Reserve a Table Online
                </h4>

                {tableReceipt ? (
                  <div className="bg-emerald-50 border border-emerald-300 p-6 text-center space-y-3 rounded-none">
                    <CheckCircle className="text-emerald-500 mx-auto" size={32} />
                    <h5 className="font-serif text-sm font-bold text-emerald-900">Table Booked Successfully!</h5>
                    <p className="text-xs text-emerald-700">
                      Thank you, <strong>{tableReceipt.name}</strong>. Your {tableReceipt.seatingPreference} table for {tableReceipt.guests} guests is reserved for {tableReceipt.date} at {tableReceipt.time}.
                    </p>
                    <button
                      onClick={() => setTableReceipt(null)}
                      className="bg-[#0B1325] text-[#C5A880] hover:bg-[#C5A880] hover:text-white px-4 py-2 text-xs uppercase font-bold transition-all"
                    >
                      Book Another Table
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleTableReservationSubmit} className="space-y-4 text-xs text-gray-700">
                    {tableError && (
                      <div className="bg-red-50 border-l-2 border-red-500 p-2.5 text-red-700">
                        {tableError}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase font-semibold text-gray-500 mb-1">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={tableBooking.name}
                          onChange={(e) => setTableBooking({ ...tableBooking, name: e.target.value })}
                          placeholder="e.g. Kolawole"
                          className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#C5A880]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-semibold text-gray-500 mb-1">Phone Number *</label>
                        <input
                          type="tel"
                          required
                          value={tableBooking.phone}
                          onChange={(e) => setTableBooking({ ...tableBooking, phone: e.target.value })}
                          placeholder="e.g. +234..."
                          className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#C5A880]"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[10px] uppercase font-semibold text-gray-500 mb-1">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={tableBooking.email}
                          onChange={(e) => setTableBooking({ ...tableBooking, email: e.target.value })}
                          placeholder="e.g. user@domain.com"
                          className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#C5A880]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-semibold text-gray-500 mb-1">Date *</label>
                        <input
                          type="date"
                          required
                          min={new Date().toISOString().split('T')[0]}
                          value={tableBooking.date}
                          onChange={(e) => setTableBooking({ ...tableBooking, date: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#C5A880]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-semibold text-gray-500 mb-1">Time *</label>
                        <input
                          type="time"
                          required
                          value={tableBooking.time}
                          onChange={(e) => setTableBooking({ ...tableBooking, time: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#C5A880]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-semibold text-gray-500 mb-1">Guests *</label>
                        <select
                          value={tableBooking.guests}
                          onChange={(e) => setTableBooking({ ...tableBooking, guests: Number(e.target.value) })}
                          className="w-full px-3 py-2 border border-gray-300 focus:outline-none"
                        >
                          {[2, 4, 6, 8, 10].map(n => (
                            <option key={n} value={n}>{n} Persons</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-semibold text-gray-500 mb-1">Seating Choice</label>
                        <select
                          value={tableBooking.seatingPreference}
                          onChange={(e) => setTableBooking({ ...tableBooking, seatingPreference: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 focus:outline-none"
                        >
                          <option value="Premium Window">Premium Window Area</option>
                          <option value="Private VIP Lounge">Private VIP Lounge</option>
                          <option value="Outdoor Lagoon Terrace">Outdoor Lagoon Terrace</option>
                          <option value="Bar High Seats">Bar High Seats</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[10px] uppercase font-semibold text-gray-500 mb-1">Requests</label>
                        <textarea
                          rows={2}
                          value={tableBooking.specialRequest}
                          onChange={(e) => setTableBooking({ ...tableBooking, specialRequest: e.target.value })}
                          placeholder="e.g. Champagne bucket, quiet booth, anniversary setup..."
                          className="w-full px-3 py-2 border border-gray-300 focus:outline-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isReservingTable}
                      className="w-full bg-[#0B1325] hover:bg-[#C5A880] text-[#C5A880] hover:text-white transition-all py-3 uppercase tracking-widest font-bold font-sans mt-2"
                    >
                      {isReservingTable ? 'Reserving...' : 'Reserve a Table'}
                    </button>
                  </form>
                )}
              </div>

            </section>

          </div>
        )}

        {/* --- PAGE: RESTAURANT --- */}
        {activePage === 'restaurant' && (
          <div className="space-y-12 py-12">
            
            {/* Header */}
            <section className="max-w-4xl mx-auto text-center px-4 space-y-4">
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#C5A880] font-sans">Luxe Dining</span>
              <h2 className="font-serif text-3xl font-bold text-gray-900 tracking-wide uppercase">The Grandeur Restaurant</h2>
              <div className="w-16 h-px bg-[#C5A880] mx-auto mt-2"></div>
            </section>

            {/* Menu Sections & Categories tabs */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              
              {/* Tabs */}
              <div className="flex flex-wrap justify-center gap-2 border-b pb-4">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveMenuTab(cat)}
                    className={`px-4 py-2 text-xs uppercase font-bold tracking-wider transition-all rounded-none ${
                      activeMenuTab === cat 
                        ? 'bg-[#0B1325] text-[#C5A880]' 
                        : 'bg-white border text-gray-600 hover:border-gray-400'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Grid of Dishes */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredMenu.map((item) => (
                  <div key={item.id} className="bg-white border p-4 flex flex-col justify-between hover:border-[#C5A880] transition-all group">
                    <div className="aspect-video relative overflow-hidden bg-gray-100 border mb-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="object-cover w-full h-full group-hover:scale-105 transition-all duration-500"
                      />
                    </div>
                    <div className="flex-grow flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-1.5">
                          <h4 className="font-serif text-sm font-bold text-gray-900">{item.name}</h4>
                          <span className="text-sm font-serif font-bold text-[#0B1325]">₦{item.price.toLocaleString()}</span>
                        </div>
                        <p className="text-[11px] text-gray-500 leading-relaxed font-sans line-clamp-3">{item.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </section>

            {/* Table Reservation CTA */}
            <section className="bg-gray-50 py-16">
              <div className="max-w-xl mx-auto px-4">
                <div className="text-center mb-8">
                  <h4 className="font-serif text-xl font-bold text-gray-900 uppercase">RESERVE A DINING TABLE</h4>
                  <p className="text-xs text-gray-500 font-sans mt-1">Book your table now and indulge in curated multi-course delicacies.</p>
                </div>

                <div className="bg-white border p-6 shadow">
                  {tableReceipt ? (
                    <div className="bg-emerald-50 border border-emerald-300 p-6 text-center space-y-3 rounded-none">
                      <CheckCircle className="text-emerald-500 mx-auto" size={32} />
                      <h5 className="font-serif text-sm font-bold text-emerald-900">Table Booked Successfully!</h5>
                      <p className="text-xs text-emerald-700">
                        Thank you, <strong>{tableReceipt.name}</strong>. Your dining table is reserved for {tableReceipt.date} at {tableReceipt.time}.
                      </p>
                      <button onClick={() => setTableReceipt(null)} className="bg-[#0B1325] text-[#C5A880] px-4 py-2 text-xs uppercase font-bold">Book Another</button>
                    </div>
                  ) : (
                    <form onSubmit={handleTableReservationSubmit} className="space-y-4 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Full Name *</label>
                          <input
                            type="text"
                            required
                            value={tableBooking.name}
                            onChange={(e) => setTableBooking({ ...tableBooking, name: e.target.value })}
                            className="w-full px-3 py-2 border focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Phone *</label>
                          <input
                            type="tel"
                            required
                            value={tableBooking.phone}
                            onChange={(e) => setTableBooking({ ...tableBooking, phone: e.target.value })}
                            className="w-full px-3 py-2 border focus:outline-none"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Email *</label>
                          <input
                            type="email"
                            required
                            value={tableBooking.email}
                            onChange={(e) => setTableBooking({ ...tableBooking, email: e.target.value })}
                            className="w-full px-3 py-2 border focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Date *</label>
                          <input
                            type="date"
                            required
                            value={tableBooking.date}
                            onChange={(e) => setTableBooking({ ...tableBooking, date: e.target.value })}
                            className="w-full px-3 py-2 border focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Time *</label>
                          <input
                            type="time"
                            required
                            value={tableBooking.time}
                            onChange={(e) => setTableBooking({ ...tableBooking, time: e.target.value })}
                            className="w-full px-3 py-2 border focus:outline-none"
                          />
                        </div>
                      </div>
                      <button type="submit" disabled={isReservingTable} className="w-full bg-[#0B1325] hover:bg-[#C5A880] text-[#C5A880] hover:text-white py-3 uppercase tracking-widest font-bold">
                        {isReservingTable ? 'Reserving...' : 'RESERVE NOW'}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </section>

          </div>
        )}

        {/* --- PAGE: FACILITIES --- */}
        {activePage === 'facilities' && (
          <div className="space-y-12 py-12">
            
            {/* Header */}
            <section className="max-w-4xl mx-auto text-center px-4 space-y-4">
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#C5A880] font-sans">Palatial Services</span>
              <h2 className="font-serif text-3xl font-bold text-gray-900 tracking-wide uppercase">Resort Facilities & Services</h2>
              <div className="w-16 h-px bg-[#C5A880] mx-auto mt-2"></div>
            </section>

            {/* List Facilities */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {INITIAL_FACILITIES.map((fac, idx) => (
                <div key={idx} className="bg-white border p-6 hover:border-[#C5A880] transition-all flex flex-col justify-between font-sans">
                  <div>
                    <div className="w-10 h-10 bg-[#FAF1EA] flex items-center justify-center mb-4 border">
                      {resolveFacilityIcon(fac.icon)}
                    </div>
                    <h4 className="font-serif text-sm font-bold text-gray-900 uppercase mb-2">{fac.name}</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">{fac.desc}</p>
                  </div>
                </div>
              ))}
            </section>

          </div>
        )}

        {/* --- PAGE: EVENTS & CONFERENCES --- */}
        {activePage === 'events' && (
          <div className="space-y-16 py-12">
            
            {/* Header */}
            <section className="max-w-4xl mx-auto text-center px-4 space-y-4">
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#C5A880] font-sans">Majestic Spaces</span>
              <h2 className="font-serif text-3xl font-bold text-gray-900 tracking-wide uppercase">Events & Conferences</h2>
              <div className="w-16 h-px bg-[#C5A880] mx-auto mt-2"></div>
            </section>

            {/* Packages */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { id: "event-1", name: "Royal Wedding Celebration", capacity: 350, facilities: ["Banquet setup", "Premium state-of-the-art acoustics", "Dimmable chandeliers", "Bridal suite room included", "Gourmet catering options", "Professional event planners support"], pricing: "From ₦2,500,000", image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800", description: "Bring your dream wedding to life in our stunning grand ballroom. Elegant custom stage, VIP seating setups, and bespoke services tailored for your royal day." },
                  { id: "event-2", name: "Executive Leadership Seminar", capacity: 80, facilities: ["High-definition projection wall", "Interactive electronic podium", "Wireless microphone networks", "Business catering buffet", "High-speed enterprise network", "Dedicated technician"], pricing: "From ₦850,000", image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800", description: "Conduct high-impact corporate board meetings, premium product launches, international seminars, or executive roundtables in our fully integrated elite conference suites." },
                  { id: "event-3", name: "Grandeur Private Lounge Gala", capacity: 120, facilities: ["Exclusive lounge takeover", "Dedicated mixologist bar", "Live jazz band setup", "Canapé catering", "Ambient mood lighting", "Secure private entrance"], pricing: "From ₦1,200,000", image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=800", description: "Host luxury birthday galas, elegant corporate cocktail mixers, high-fashion private parties, or premium dinner events in our state-of-the-art exclusive lounge setting." }
                ].map((pkg) => (
                  <div key={pkg.id} className="bg-white border flex flex-col justify-between hover:border-[#C5A880] transition-all group">
                    <div>
                      <div className="aspect-video relative overflow-hidden bg-gray-100">
                        <img src={pkg.image} alt={pkg.name} className="object-cover w-full h-full" referrerPolicy="no-referrer" />
                      </div>
                      <div className="p-5 space-y-3 font-sans">
                        <span className="text-[10px] text-[#C5A880] uppercase tracking-wider font-semibold block">Capacity: up to {pkg.capacity} guests</span>
                        <h4 className="font-serif text-base font-bold text-[#0B1325] leading-none">{pkg.name}</h4>
                        <p className="text-xs text-gray-500 leading-relaxed">{pkg.description}</p>
                        
                        <div className="border-t pt-3 space-y-1.5">
                          <strong className="text-[10px] uppercase font-bold text-gray-600 block">Facilities Included:</strong>
                          <div className="grid grid-cols-1 gap-1 text-[11px] text-gray-500">
                            {pkg.facilities.slice(0, 4).map((f, i) => (
                              <span key={i}>• {f}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t p-5 bg-gray-50 flex items-center justify-between text-xs font-sans">
                      <div>
                        <span className="text-[9px] text-gray-400 block uppercase font-semibold">Standard Price</span>
                        <strong className="text-sm font-serif font-bold text-[#0B1325]">{pkg.pricing}</strong>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedEventPackage(pkg);
                          const element = document.getElementById('inquiry-anchor');
                          if (element) element.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="bg-[#0B1325] text-[#C5A880] hover:bg-[#C5A880] hover:text-white px-4 py-2 font-bold uppercase transition-all"
                      >
                        Inquire Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Inquiry Form */}
            <section id="inquiry-anchor" className="max-w-2xl mx-auto px-4">
              <div className="bg-white border p-6 shadow-md font-sans">
                <h4 className="font-serif text-base font-bold text-[#0B1325] uppercase mb-1 border-b pb-1.5">
                  Event Space Inquiry Booking
                </h4>
                <p className="text-[11px] text-gray-500 mb-4">
                  Selected Pack: <strong className="text-[#C5A880]">{selectedEventPackage ? selectedEventPackage.name : "Custom Private Event"}</strong>
                </p>

                {inquirySuccess ? (
                  <div className="bg-emerald-50 border border-emerald-300 p-6 text-center space-y-2 rounded-none">
                    <CheckCircle className="text-emerald-500 mx-auto" size={32} />
                    <h5 className="font-serif text-sm font-bold text-emerald-900">Inquiry Transmitted Successfully</h5>
                    <p className="text-xs text-emerald-700">
                      Our elite event coordination team will review details and contact you within 12 hours.
                    </p>
                    <button onClick={() => setInquirySuccess(false)} className="bg-[#0B1325] text-white px-4 py-1.5 text-xs uppercase font-bold">New Inquiry</button>
                  </div>
                ) : (
                  <form onSubmit={handleEventInquirySubmit} className="space-y-4 text-xs text-gray-700">
                    {inquiryError && (
                      <div className="bg-red-50 border-l-2 border-red-500 p-2 text-red-700">{inquiryError}</div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Your Name *</label>
                        <input
                          type="text"
                          required
                          value={eventInquiryForm.name}
                          onChange={(e) => setEventInquiryForm({ ...eventInquiryForm, name: e.target.value })}
                          className="w-full px-3 py-2 border focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Email *</label>
                        <input
                          type="email"
                          required
                          value={eventInquiryForm.email}
                          onChange={(e) => setEventInquiryForm({ ...eventInquiryForm, email: e.target.value })}
                          className="w-full px-3 py-2 border focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Phone *</label>
                        <input
                          type="tel"
                          value={eventInquiryForm.phone}
                          onChange={(e) => setEventInquiryForm({ ...eventInquiryForm, phone: e.target.value })}
                          className="w-full px-3 py-2 border focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Date of Event *</label>
                        <input
                          type="date"
                          required
                          min={new Date().toISOString().split('T')[0]}
                          value={eventInquiryForm.date}
                          onChange={(e) => setEventInquiryForm({ ...eventInquiryForm, date: e.target.value })}
                          className="w-full px-3 py-2 border focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Estimated Guests *</label>
                        <input
                          type="number"
                          required
                          value={eventInquiryForm.guests}
                          onChange={(e) => setEventInquiryForm({ ...eventInquiryForm, guests: Number(e.target.value) })}
                          className="w-full px-3 py-2 border focus:outline-none"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Requests / Message</label>
                        <textarea
                          rows={3}
                          value={eventInquiryForm.message}
                          onChange={(e) => setEventInquiryForm({ ...eventInquiryForm, message: e.target.value })}
                          placeholder="Tell us about catering desires, sound setups, and specific decor preferences..."
                          className="w-full px-3 py-2 border focus:outline-none"
                        />
                      </div>
                    </div>

                    <button type="submit" disabled={isSendingInquiry} className="w-full bg-[#0B1325] hover:bg-[#C5A880] text-[#C5A880] hover:text-white py-3 uppercase tracking-widest font-bold">
                      {isSendingInquiry ? 'Sending...' : 'SUBMIT INQUIRY'}
                    </button>
                  </form>
                )}
              </div>
            </section>

          </div>
        )}

        {/* --- PAGE: GALLERY --- */}
        {activePage === 'gallery' && (
          <div className="space-y-12 py-12">
            
            {/* Header */}
            <section className="max-w-4xl mx-auto text-center px-4 space-y-4">
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#C5A880] font-sans">Visual Showroom</span>
              <h2 className="font-serif text-3xl font-bold text-gray-900 tracking-wide uppercase">Resort Photo Gallery</h2>
              <div className="w-16 h-px bg-[#C5A880] mx-auto mt-2"></div>
            </section>

            {/* Filter Navigation */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              <div className="flex flex-wrap justify-center gap-2 border-b pb-4">
                {['All', 'Rooms', 'Lounge', 'Restaurant', 'Facilities', 'Events', 'Exterior'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setGalleryFilter(cat)}
                    className={`px-4 py-2 text-xs uppercase font-bold tracking-wider transition-all rounded-none ${
                      galleryFilter === cat 
                        ? 'bg-[#0B1325] text-[#C5A880]' 
                        : 'bg-white border text-gray-600 hover:border-gray-400'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {filteredGallery.map((g) => (
                  <div 
                    key={g.id} 
                    onClick={() => setLightboxImage(g)}
                    className="bg-white border p-2 cursor-pointer group hover:border-[#C5A880] transition-all relative overflow-hidden"
                  >
                    <div className="aspect-square bg-gray-100 overflow-hidden relative">
                      <img src={g.image} alt={g.title} className="object-cover w-full h-full group-hover:scale-105 transition-all duration-500" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Eye size={20} className="text-[#C5A880]" />
                      </div>
                    </div>
                    <div className="pt-2 text-[10px] font-sans text-gray-600 truncate">{g.title}</div>
                    <div className="text-[8px] text-[#C5A880] uppercase tracking-wider font-semibold">{g.category}</div>
                  </div>
                ))}
              </div>
            </section>

          </div>
        )}

        {/* --- PAGE: SPECIAL OFFERS --- */}
        {activePage === 'offers' && (
          <div className="space-y-12 py-12">
            
            {/* Header */}
            <section className="max-w-4xl mx-auto text-center px-4 space-y-4">
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#C5A880] font-sans">Seasonal Packages</span>
              <h2 className="font-serif text-3xl font-bold text-gray-900 tracking-wide uppercase">Offers & Packages</h2>
              <div className="w-16 h-px bg-[#C5A880] mx-auto mt-2"></div>
            </section>

            {/* List */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              {offers.map((off) => (
                <div key={off.id} className="bg-white border flex flex-col md:flex-row hover:border-[#C5A880] transition-all group">
                  <div className="w-full md:w-1/2 aspect-video md:aspect-auto relative overflow-hidden bg-gray-100 flex-shrink-0">
                    <img src={off.image} alt={off.name} className="object-cover w-full h-full group-hover:scale-105 transition-all duration-500" referrerPolicy="no-referrer" />
                  </div>
                  <div className="p-6 flex flex-col justify-between flex-grow font-sans">
                    <div>
                      <span className="text-[9px] bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 uppercase tracking-wide font-bold">{off.validity}</span>
                      <h4 className="font-serif text-base font-bold text-gray-900 mt-2.5">{off.name}</h4>
                      <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{off.description}</p>
                      
                      <div className="mt-4 border-t pt-3 space-y-1">
                        <strong className="text-[9px] uppercase tracking-wider font-bold text-gray-600 block">Terms & Validity:</strong>
                        <div className="space-y-1 text-[11px] text-gray-400">
                          {off.terms.map((t, idx) => (
                            <div key={idx}>• {t}</div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-4 mt-6 flex items-end justify-between">
                      <div>
                        <span className="text-[9px] text-gray-400 block uppercase">Exclusive package rate</span>
                        <span className="text-lg font-serif font-bold text-[#0B1325]">₦{off.price.toLocaleString()}</span>
                      </div>
                      <button
                        onClick={() => handleOpenBookingWithDefaults(undefined, undefined, undefined, 'All')}
                        className="bg-[#0B1325] hover:bg-[#C5A880] text-[#C5A880] hover:text-white px-5 py-2.5 text-xs uppercase font-bold tracking-wider transition-all"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </section>

          </div>
        )}

        {/* --- PAGE: CONTACT --- */}
        {activePage === 'contact' && (
          <div className="space-y-16 py-12">
            
            {/* Header */}
            <section className="max-w-4xl mx-auto text-center px-4 space-y-4">
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#C5A880] font-sans">Reservations & Location</span>
              <h2 className="font-serif text-3xl font-bold text-gray-900 tracking-wide uppercase">Contact Eko Grandeur</h2>
              <div className="w-16 h-px bg-[#C5A880] mx-auto mt-2"></div>
            </section>

            {/* Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              
              {/* Info Column & Map */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-sans text-gray-600">
                  <div className="flex items-start space-x-2.5">
                    <MapPin size={18} className="text-[#C5A880] mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-gray-900 uppercase tracking-wide block mb-1">Our Location</strong>
                      {settings.address}
                    </div>
                  </div>

                  <div className="flex items-start space-x-2.5">
                    <Phone size={16} className="text-[#C5A880] mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-gray-900 uppercase tracking-wide block mb-1">Telephone</strong>
                      <a href={`tel:${settings.phone}`} className="hover:text-[#C5A880] transition-colors">{settings.phone}</a><br />
                      <a href={`https://wa.me/${settings.whatsapp.replace(/\+/g, '').replace(/\s/g, '')}`} className="text-emerald-500 font-semibold mt-1 inline-block">WhatsApp Active</a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2.5">
                    <Mail size={16} className="text-[#C5A880] mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-gray-900 uppercase tracking-wide block mb-1">Email Inquiries</strong>
                      <a href={`mailto:${settings.email}`} className="hover:text-[#C5A880] transition-colors">{settings.email}</a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2.5">
                    <Clock size={16} className="text-[#C5A880] mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-gray-900 uppercase tracking-wide block mb-1">Check Times</strong>
                      Check-In: <strong>{settings.checkInTime}</strong><br />
                      Check-Out: <strong>{settings.checkOutTime}</strong>
                    </div>
                  </div>
                </div>

                {/* Google Map Mockup */}
                <div className="border border-[#C5A880]/20 relative overflow-hidden bg-gray-100 aspect-video flex items-center justify-center p-6 text-center text-xs text-gray-500">
                  <iframe 
                    title="Eko Grandeur Location Map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.728562308709!2d3.4248401147701763!3d6.42823619534914!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8acc6f455555%3A0x6b306bd6b47a7501!2sVictoria%20Island%2C%20Lagos!5e0!3m2!1sen!2sng!4v1625656157018!5m2!1sen!2sng"
                    className="absolute inset-0 w-full h-full border-0"
                    loading="lazy"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>

              {/* Form Column */}
              <div className="bg-white border p-6 shadow-md font-sans">
                <h4 className="font-serif text-base font-bold text-[#0B1325] uppercase mb-4 border-b pb-2">Send Us an Inquiry</h4>

                {contactSuccess ? (
                  <div className="bg-emerald-50 border border-emerald-300 p-6 text-center space-y-2 rounded-none">
                    <CheckCircle className="text-emerald-500 mx-auto" size={32} />
                    <h5 className="font-serif text-sm font-bold text-emerald-900">Message Transmitted</h5>
                    <p className="text-xs text-emerald-700">
                      Thank you. Your message has been saved in the administrative message base. We will contact you shortly.
                    </p>
                    <button onClick={() => setContactSuccess(false)} className="bg-[#0B1325] text-[#C5A880] px-4 py-1.5 text-xs font-bold uppercase">Send New Message</button>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4 text-xs text-gray-700">
                    {contactError && (
                      <div className="bg-red-50 border-l-2 border-red-500 p-2.5 text-red-700">{contactError}</div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={contactForm.name}
                          onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#C5A880]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Email *</label>
                        <input
                          type="email"
                          required
                          value={contactForm.email}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#C5A880]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Phone Number</label>
                        <input
                          type="tel"
                          value={contactForm.phone}
                          onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#C5A880]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Subject</label>
                        <input
                          type="text"
                          value={contactForm.subject}
                          onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#C5A880]"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Message *</label>
                        <textarea
                          rows={4}
                          required
                          value={contactForm.message}
                          onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                          placeholder="Your questions, booking desires, event ideas..."
                          className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#C5A880]"
                        />
                      </div>
                    </div>

                    <button type="submit" disabled={isSendingContact} className="w-full bg-[#0B1325] hover:bg-[#C5A880] text-[#C5A880] hover:text-white py-3 uppercase tracking-widest font-bold">
                      {isSendingContact ? 'Transmitting...' : 'SUBMIT MESSAGE'}
                    </button>
                  </form>
                )}
              </div>
            </section>

          </div>
        )}

        {/* --- PAGE: ADMIN WORKSPACE --- */}
        {activePage === 'admin' && (
          <AdminDashboard 
            onSettingsUpdated={loadServerData} 
            onDataUpdated={loadServerData} 
          />
        )}

      </div>

      {/* --- FOOTER --- */}
      {activePage !== 'admin' && (
        <Footer 
          settings={settings} 
          setActivePage={setActivePage} 
          onBookNowClick={() => handleOpenBookingWithDefaults()} 
        />
      )}

      {/* --- FLOATING WHATSAPP CHAT BUTTON --- */}
      <a
        href={`https://wa.me/${settings.whatsapp.replace(/\+/g, '').replace(/\s/g, '')}?text=Hello,%20I%20would%20like%2520to%2520make%2520a%2520reservation%2520at%2520${encodeURIComponent(settings.name)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-emerald-500 hover:bg-emerald-600 text-white p-3.5 rounded-full shadow-2xl transition-all hover:scale-110 flex items-center justify-center border border-emerald-400"
        title="Chat on WhatsApp"
      >
        <MessageSquare size={24} className="fill-current text-white" />
      </a>

      {/* --- WIZARD: BOOKING ENGINE MODAL --- */}
      {showBookingWizard && (
        <BookingWizard
          settings={settings}
          rooms={rooms}
          initialCheckIn={wizardPreSelects.checkIn}
          initialCheckOut={wizardPreSelects.checkOut}
          initialGuests={wizardPreSelects.guests}
          initialCategory={wizardPreSelects.category}
          onBookingComplete={loadServerData}
          onClose={() => setShowBookingWizard(false)}
        />
      )}

      {/* --- WIZARD: ROOM SPECIFIC PROFILE DETAILS --- */}
      {selectedRoomDetails && (
        <RoomDetailsModal
          settings={settings}
          room={selectedRoomDetails}
          onBookNow={handleRoomSelectionFromDetails}
          onClose={() => setSelectedRoomDetails(null)}
        />
      )}

      {/* --- WIZARD: REVIEW SUBMIT MODAL --- */}
      {showReviewModal && (
        <ReviewModal
          onClose={() => setShowReviewModal(false)}
          onReviewSubmitted={loadServerData}
        />
      )}

      {/* --- WIZARD: PHOTO LIGHTBOX --- */}
      {lightboxImage && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full text-center">
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-[#C5A880] border border-white/20 hover:border-[#C5A880] px-4 py-1.5 text-xs font-bold uppercase transition-all"
            >
              Close Lightbox
            </button>
            <div className="aspect-video max-h-[80vh] overflow-hidden bg-black flex items-center justify-center border border-[#FAF9F6]/15">
              <img src={lightboxImage.image} alt={lightboxImage.title} className="max-w-full max-h-[75vh] object-contain" referrerPolicy="no-referrer" />
            </div>
            <div className="pt-4 text-[#FAF9F6] font-sans">
              <h5 className="font-serif text-base font-bold">{lightboxImage.title}</h5>
              <span className="text-xs text-[#C5A880] uppercase tracking-wider font-semibold mt-1 inline-block">{lightboxImage.category} Collection</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
