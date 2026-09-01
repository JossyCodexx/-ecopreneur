import React, { useState } from 'react';
import { Sparkles, Home, Maximize, User, Clock, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

export default function RoomDetailsModal({ settings, room, onBookNow, onClose }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev === 0 ? room.images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev === room.images.length - 1 ? 0 : prev + 1));
  };

  // Luxury house rules matching high-end hotels
  const houseRules = [
    "No Smoking allowed inside rooms. Dedicated outdoor smoking zones are available.",
    "Pets are not allowed in executive rooms and public dining spaces.",
    "Quiet Hours are active between 23:00 and 07:00 to preserve guest serenity.",
    "Parties or high-density gatherings inside standard rooms are strictly prohibited.",
    "Valid government photo identification is mandatory for all checking guests."
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#FAF9F6] text-[#1F1D1A] w-full max-w-5xl shadow-2xl relative border border-[#C5A880]/30 overflow-hidden rounded-none flex flex-col max-h-[95vh]">
        
        {/* Header bar */}
        <div className="bg-[#0B1325] text-[#FAF9F6] p-5 border-b border-[#C5A880]/20 flex justify-between items-center">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#C5A880] font-sans font-semibold">Accommodation Profile</span>
            <h3 className="font-serif text-lg font-bold tracking-wide mt-0.5">{room.name}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#FAF9F6]/70 hover:text-white border border-[#FAF9F6]/10 hover:border-[#C5A880] px-3.5 py-1 text-xs uppercase font-sans font-semibold transition-all"
          >
            Close
          </button>
        </div>

        {/* Modal content body */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Side: Dynamic Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-video bg-gray-100 border border-gray-200 overflow-hidden">
                <img
                  src={room.images[activeImageIndex] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945'}
                  alt={room.name}
                  referrerPolicy="no-referrer"
                  className="object-cover w-full h-full transition-all duration-500"
                />
                
                {room.images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-[#0B1325]/75 hover:bg-[#C5A880] text-white p-2 transition-all focus:outline-none"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#0B1325]/75 hover:bg-[#C5A880] text-white p-2 transition-all focus:outline-none"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </>
                )}

                <div className="absolute bottom-3 right-3 bg-black/75 text-white text-[10px] tracking-wider px-2 py-1 uppercase font-semibold">
                  Image {activeImageIndex + 1} of {room.images.length}
                </div>
              </div>

              {/* Thumbnails */}
              {room.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {room.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`aspect-video overflow-hidden border transition-all ${idx === activeImageIndex ? 'border-[#C5A880] ring-1 ring-[#C5A880]' : 'border-gray-200 hover:border-gray-400'}`}
                    >
                      <img src={img} alt="" referrerPolicy="no-referrer" className="object-cover w-full h-full" />
                    </button>
                  ))}
                </div>
              )}

              {/* Specs pill boxes */}
              <div className="grid grid-cols-3 gap-2 text-center pt-2 font-sans text-xs">
                <div className="bg-[#FAF1EA] p-3 border border-[#C5A880]/10">
                  <Maximize size={16} className="mx-auto text-[#C5A880] mb-1" />
                  <span className="text-[10px] text-gray-500 block uppercase font-semibold">Room Area</span>
                  <strong className="text-gray-900">{room.size} m²</strong>
                </div>
                <div className="bg-[#FAF1EA] p-3 border border-[#C5A880]/10">
                  <Home size={16} className="mx-auto text-[#C5A880] mb-1" />
                  <span className="text-[10px] text-gray-500 block uppercase font-semibold">Bed Configuration</span>
                  <strong className="text-gray-900 text-[10px] truncate block" title={room.bedType}>{room.bedType}</strong>
                </div>
                <div className="bg-[#FAF1EA] p-3 border border-[#C5A880]/10">
                  <User size={16} className="mx-auto text-[#C5A880] mb-1" />
                  <span className="text-[10px] text-gray-500 block uppercase font-semibold">Guest Limits</span>
                  <strong className="text-gray-900">Max {room.maxGuests} Guests</strong>
                </div>
              </div>
            </div>

            {/* Right Side: Description, Amenities & Policies */}
            <div className="space-y-6 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#C5A880] font-sans font-bold leading-none">{room.category} Class</span>
                    <h4 className="font-serif text-xl font-bold text-gray-900 mt-1">{room.name}</h4>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-gray-500 block uppercase font-sans tracking-wide">Premium Daily Rate</span>
                    <span className="text-xl font-serif font-bold text-[#0B1325]">₦{room.price.toLocaleString()}</span>
                  </div>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed mt-4 border-t pt-4 font-sans">{room.description}</p>

                {/* Amenities List */}
                <div className="pt-5">
                  <h5 className="font-serif text-xs font-bold uppercase tracking-wide text-gray-900 mb-2.5 flex items-center space-x-1.5">
                    <Sparkles size={14} className="text-[#C5A880]" />
                    <span>Included Luxe Amenities</span>
                  </h5>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs font-sans text-gray-700">
                    {room.facilities.map((fac, idx) => (
                      <div key={idx} className="flex items-center space-x-1.5">
                        <span className="w-1.5 h-1.5 bg-[#C5A880] rounded-none"></span>
                        <span>{fac}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Policies & Times */}
                <div className="grid grid-cols-2 gap-4 pt-5 border-t border-gray-100 mt-5 text-xs font-sans text-gray-600">
                  <div className="flex items-start space-x-2">
                    <Clock size={16} className="text-[#C5A880] mt-0.5" />
                    <div>
                      <span className="block font-semibold uppercase text-[10px] tracking-wide text-gray-800">Check-In Policy</span>
                      Check-in starts from <strong>{settings.checkInTime}</strong>. Early check-in subject to vacancy.
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Clock size={16} className="text-[#C5A880] mt-0.5" />
                    <div>
                      <span className="block font-semibold uppercase text-[10px] tracking-wide text-gray-800">Check-Out Policy</span>
                      Check-out by <strong>{settings.checkOutTime}</strong>. Settle balances at the front desk.
                    </div>
                  </div>
                </div>

                {/* House Rules */}
                <div className="pt-5 border-t border-gray-100 mt-5">
                  <h5 className="font-serif text-xs font-bold uppercase tracking-wide text-gray-900 mb-2.5">
                    Resort House Rules
                  </h5>
                  <ul className="text-[11px] font-sans text-gray-500 space-y-1">
                    {houseRules.map((rule, index) => (
                      <li key={index} className="flex items-start space-x-1.5">
                        <span className="text-[#C5A880] font-bold">•</span>
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Booking Action Buttons */}
              <div className="border-t border-gray-200 pt-5 flex items-center justify-between bg-gray-50 -mx-6 -mb-6 p-6">
                <div>
                  <span className="text-[10px] text-gray-500 block uppercase font-sans tracking-wide">Daily Booking Rate</span>
                  <span className="text-lg font-serif font-bold text-gray-950">₦{room.price.toLocaleString()} <span className="text-xs font-normal text-gray-500 font-sans">/ Night</span></span>
                </div>
                <button
                  onClick={() => onBookNow(room)}
                  className="bg-[#0B1325] text-[#C5A880] hover:bg-[#C5A880] hover:text-white text-xs font-bold uppercase tracking-widest px-6 py-3 transition-all flex items-center space-x-1.5 shadow"
                >
                  <Calendar size={14} />
                  <span>Book This Room Now</span>
                </button>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
