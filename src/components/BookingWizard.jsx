import React, { useState, useEffect } from 'react';
import { Calendar, Users, Home, CheckCircle, Shield, Award, CreditCard, Loader2, ArrowRight } from 'lucide-react';

export default function BookingWizard({
  settings,
  rooms,
  initialCheckIn = '',
  initialCheckOut = '',
  initialGuests = 1,
  initialCategory = 'All',
  onBookingComplete,
  onClose
}) {
  
  // Steps: 1: Filter & Choose Room, 2: Guest Details, 3: Payment Choice, 4: Receipt
  const [step, setStep] = useState(1);

  // Form Fields
  const [checkIn, setCheckIn] = useState(initialCheckIn || new Date().toISOString().split('T')[0]);
  const [checkOut, setCheckOut] = useState(initialCheckOut || new Date(Date.now() + 86400000).toISOString().split('T')[0]);
  const [guests, setGuests] = useState(initialGuests);
  const [category, setCategory] = useState(initialCategory);

  const [selectedRoom, setSelectedRoom] = useState(null);

  // Customer Details
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerCountry, setCustomerCountry] = useState('Nigeria');
  const [specialRequests, setSpecialRequests] = useState('');

  // Payment Options
  const [paymentOption, setPaymentOption] = useState('Full');
  const [paymentProvider, setPaymentProvider] = useState('Paystack');

  // Loading & State
  const [isChecking, setIsChecking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [availableRooms, setAvailableRooms] = useState(rooms);
  const [completedBooking, setCompletedBooking] = useState(null);

  // Update checkOut if checkIn is set ahead of checkOut
  useEffect(() => {
    if (new Date(checkIn) >= new Date(checkOut)) {
      const nextDay = new Date(new Date(checkIn).getTime() + 86400000);
      setCheckOut(nextDay.toISOString().split('T')[0]);
    }
  }, [checkIn]);

  // Calculate stay duration
  const nights = Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)));

  // Validate checkIn and checkOut, then load available rooms
  const handleSearchAvailability = async () => {
    setValidationError('');
    setIsChecking(true);

    try {
      // For each room, check overlap
      const validatedList = [];
      for (const room of rooms) {
        if (category !== 'All' && room.category !== category) continue;
        if (guests > room.maxGuests) continue;

        // Query server to check double booking
        const res = await fetch('/api/bookings/check-availability', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ roomId: room.id, checkIn, checkOut })
        });
        const d = await res.json();
        
        if (d.available) {
          validatedList.push(room);
        }
      }
      setAvailableRooms(validatedList);
      if (validatedList.length === 0) {
        setValidationError('No rooms matching your search parameters are available for these overlapping dates.');
      }
    } catch (e) {
      console.error(e);
      setValidationError('Failed to connect to booking database.');
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    handleSearchAvailability();
  }, [checkIn, checkOut, category, guests, rooms]);

  const handleSelectRoom = (room) => {
    setSelectedRoom(room);
    setStep(2);
  };

  const handleGuestSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    if (!customerName.trim() || !customerPhone.trim() || !customerEmail.trim()) {
      setValidationError('Please complete all required fields (*).');
      return;
    }
    setStep(3);
  };

  const handleProcessPayment = async () => {
    if (!selectedRoom) return;
    setValidationError('');
    setIsSubmitting(true);

    const totalCost = selectedRoom.price * nights;

    const bookingPayload = {
      roomId: selectedRoom.id,
      checkIn,
      checkOut,
      guests,
      customerName,
      customerPhone,
      customerEmail,
      customerCountry,
      specialRequests,
      totalPrice: totalCost,
      paymentOption,
      paymentProvider
    };

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingPayload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Server error during booking.');
      }

      // Update booking status based on mockup payment confirmation
      const updateRes = await fetch(`/api/bookings/${data.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'Confirmed', // Mark confirmed after payment simulation succeeds!
          paymentStatus: paymentOption === 'Full' ? 'Fully Paid' : 'Deposit Paid'
        })
      });

      const updatedBooking = await updateRes.json();
      setCompletedBooking(updatedBooking);
      setStep(4);
    } catch (e) {
      setValidationError(e.message || 'Payment simulation failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#FAF9F6] text-[#1F1D1A] w-full max-w-4xl shadow-2xl relative border border-[#C5A880]/30 overflow-hidden rounded-none flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-[#0B1325] text-[#FAF9F6] p-6 border-b border-[#C5A880]/20 flex justify-between items-center">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#C5A880] font-sans font-semibold">Luxury Booking Engine</span>
            <h3 className="font-serif text-lg font-bold tracking-wide mt-1">
              {step === 1 && "Select Your Room & Suite"}
              {step === 2 && "Enter Guest Credentials"}
              {step === 3 && "Secure Paystack / Flutterwave Gateway"}
              {step === 4 && "Reservation Confirmation Receipt"}
            </h3>
          </div>
          {step !== 4 && (
            <button
              onClick={onClose}
              className="text-[#FAF9F6]/70 hover:text-white border border-[#FAF9F6]/10 hover:border-[#C5A880] px-3 py-1.5 text-xs uppercase font-sans font-semibold transition-all"
            >
              Close
            </button>
          )}
        </div>

        {/* Multi-step indicator */}
        <div className="bg-[#FAF9F6] border-b border-gray-200 px-6 py-3 flex items-center justify-between text-xs font-sans text-gray-500">
          <div className="flex items-center space-x-2">
            <span className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold ${step >= 1 ? 'bg-[#0B1325] text-[#C5A880]' : 'bg-gray-200'}`}>1</span>
            <span className={step === 1 ? 'text-[#0B1325] font-semibold' : ''}>Rooms</span>
          </div>
          <div className="w-12 h-px bg-gray-300"></div>
          <div className="flex items-center space-x-2">
            <span className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold ${step >= 2 ? 'bg-[#0B1325] text-[#C5A880]' : 'bg-gray-200'}`}>2</span>
            <span className={step === 2 ? 'text-[#0B1325] font-semibold' : ''}>Credentials</span>
          </div>
          <div className="w-12 h-px bg-gray-300"></div>
          <div className="flex items-center space-x-2">
            <span className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold ${step >= 3 ? 'bg-[#0B1325] text-[#C5A880]' : 'bg-gray-200'}`}>3</span>
            <span className={step === 3 ? 'text-[#0B1325] font-semibold' : ''}>Checkout</span>
          </div>
          <div className="w-12 h-px bg-gray-300"></div>
          <div className="flex items-center space-x-2">
            <span className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold ${step === 4 ? 'bg-[#0B1325] text-[#C5A880]' : 'bg-gray-200'}`}>4</span>
            <span className={step === 4 ? 'text-[#0B1325] font-semibold' : ''}>Confirmation</span>
          </div>
        </div>

        {/* Main Body */}
        <div className="p-6 overflow-y-auto flex-1">
          
          {validationError && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 text-xs text-red-700 font-sans">
              {validationError}
            </div>
          )}

          {/* STEP 1: Rooms Filtering and Selection */}
          {step === 1 && (
            <div className="space-y-6">
              {/* Form Search Parameters */}
              <div className="bg-[#FAF1EA] p-4 border border-[#C5A880]/20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-gray-600 mb-1">Check-In Date</label>
                  <div className="relative">
                    <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 text-xs focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-gray-600 mb-1">Check-Out Date</label>
                  <div className="relative">
                    <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      min={new Date(new Date(checkIn).getTime() + 86400000).toISOString().split('T')[0]}
                      className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 text-xs focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-gray-600 mb-1">Guests</label>
                  <div className="relative">
                    <Users size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <select
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 text-xs focus:outline-none focus:border-[#C5A880]"
                    >
                      {[1, 2, 3, 4].map(n => (
                        <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-gray-600 mb-1">Room Category</label>
                  <div className="relative">
                    <Home size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 text-xs focus:outline-none focus:border-[#C5A880]"
                    >
                      <option value="All">All Categories</option>
                      <option value="Standard">Standard Rooms</option>
                      <option value="Deluxe">Deluxe Rooms</option>
                      <option value="Executive Suite">Executive Suites</option>
                      <option value="Presidential Suite">Presidential Suites</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* List Available Rooms */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-serif text-sm font-bold uppercase tracking-wide text-gray-800">
                    Available Accommodations ({availableRooms.length})
                  </h4>
                  <span className="text-xs text-gray-500">Stay Duration: <strong>{nights} Night{nights > 1 ? 's' : ''}</strong></span>
                </div>

                {isChecking ? (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                    <Loader2 className="animate-spin text-[#C5A880] mb-2" size={28} />
                    <p className="text-xs font-sans">Checking real-time database availability...</p>
                  </div>
                ) : availableRooms.length === 0 ? (
                  <div className="border border-dashed border-gray-300 p-8 text-center text-gray-500 text-xs">
                    No vacant rooms matched your dates. Please choose other booking dates.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {availableRooms.map((room) => {
                      const totalRoomPrice = room.price * nights;
                      return (
                        <div key={room.id} className="border border-gray-200 bg-white hover:border-[#C5A880] transition-all flex flex-col h-full group">
                          <div className="relative aspect-video overflow-hidden bg-gray-100">
                            <img
                              src={room.images[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945'}
                              alt={room.name}
                              referrerPolicy="no-referrer"
                              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-2 left-2 bg-[#0B1325] text-[#C5A880] text-[9px] uppercase font-bold tracking-widest px-2 py-0.5">
                              {room.category}
                            </div>
                          </div>
                          <div className="p-4 flex flex-col flex-1 justify-between">
                            <div>
                              <h5 className="font-serif text-base font-bold text-gray-900 mb-1">{room.name}</h5>
                              <p className="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed">{room.description}</p>
                              
                              <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-600 border-t border-gray-100 pt-2 mb-3 font-sans">
                                <div>Bed: <strong>{room.bedType}</strong></div>
                                <div>Size: <strong>{room.size} m²</strong></div>
                                <div>Guests: <strong>Max {room.maxGuests}</strong></div>
                                <div>Rate: <strong>₦{room.price.toLocaleString()}/night</strong></div>
                              </div>
                            </div>

                            <div className="border-t border-gray-100 pt-3 flex items-center justify-between mt-auto">
                              <div>
                                <span className="text-[10px] text-gray-500 block uppercase tracking-wider leading-none">Total ({nights} Nights)</span>
                                <span className="text-base font-serif font-bold text-[#0B1325]">₦{totalRoomPrice.toLocaleString()}</span>
                              </div>
                              <button
                                onClick={() => handleSelectRoom(room)}
                                className="bg-[#0B1325] text-[#C5A880] hover:bg-[#C5A880] hover:text-white text-[11px] font-bold uppercase tracking-wider px-3.5 py-2 transition-all"
                              >
                                Select Room
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: Guest Details */}
          {step === 2 && selectedRoom && (
            <form onSubmit={handleGuestSubmit} className="space-y-6">
              {/* Selected Room Recap */}
              <div className="bg-[#0B1325] text-white p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                  <span className="text-[10px] text-[#C5A880] uppercase tracking-widest font-semibold block">Your Selected Accommodation</span>
                  <h4 className="font-serif text-base font-bold text-[#FAF9F6] mt-0.5">{selectedRoom.name}</h4>
                  <p className="text-xs text-white/70">{selectedRoom.category} • {selectedRoom.bedType} • {nights} Night{nights > 1 ? 's' : ''}</p>
                </div>
                <div className="mt-3 sm:mt-0 text-left sm:text-right">
                  <span className="text-[10px] text-white/50 block uppercase tracking-wider">Total Booking Cost</span>
                  <span className="text-lg font-serif font-bold text-[#C5A880]">₦{(selectedRoom.price * nights).toLocaleString()}</span>
                </div>
              </div>

              {/* Guest Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-gray-600 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Dr. Kolawole Davies"
                    className="w-full px-3 py-2 bg-white border border-gray-300 text-xs focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-gray-600 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="e.g. +234 803 123 4567"
                    className="w-full px-3 py-2 bg-white border border-gray-300 text-xs focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-gray-600 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="e.g. kola.davies@domain.com"
                    className="w-full px-3 py-2 bg-white border border-gray-300 text-xs focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-gray-600 mb-1">Country of Origin</label>
                  <input
                    type="text"
                    value={customerCountry}
                    onChange={(e) => setCustomerCountry(e.target.value)}
                    placeholder="e.g. Nigeria"
                    className="w-full px-3 py-2 bg-white border border-gray-300 text-xs focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-gray-600 mb-1">Special Requests (Optional)</label>
                  <textarea
                    rows={3}
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="e.g. Early check-in requested, ocean-view, rose decoration for anniversary, airport pickup details..."
                    className="w-full px-3 py-2 bg-white border border-gray-300 text-xs focus:outline-none focus:border-[#C5A880]"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center border-t border-gray-200 pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 border border-gray-300 text-xs uppercase tracking-wider font-semibold text-gray-700 hover:bg-gray-100 transition-all"
                >
                  Back to Rooms
                </button>
                <button
                  type="submit"
                  className="bg-[#0B1325] text-[#C5A880] hover:bg-[#C5A880] hover:text-white px-5 py-2.5 text-xs uppercase tracking-wider font-bold transition-all flex items-center space-x-1"
                >
                  <span>Proceed to Payment</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Payment Options & Mock paystack/flutterwave gateway */}
          {step === 3 && selectedRoom && (
            <div className="space-y-6">
              {/* Payment Info banner */}
              <div className="bg-[#FAF1EA] p-4 border border-[#C5A880]/30 rounded-none flex items-start space-x-3 text-xs leading-relaxed text-gray-700">
                <Shield className="text-[#C5A880] flex-shrink-0 mt-0.5" size={18} />
                <div>
                  <strong className="text-gray-900 block font-serif text-sm">Secure Payment Gateway Integration</strong>
                  The reservation engine is fully prepared for online payment integration. Payments are handled via secure third-party provider popups (Paystack or Flutterwave). No raw card details are stored on this server.
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Side: Select Payment Tier */}
                <div className="space-y-4">
                  <h5 className="font-serif text-sm font-bold uppercase tracking-wide text-gray-800">Choose Deposit Level</h5>
                  
                  <div className="space-y-3 font-sans">
                    <label className={`flex items-start p-4 border cursor-pointer transition-all ${paymentOption === 'Full' ? 'border-[#C5A885] bg-[#FAF1EA]' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                      <input
                        type="radio"
                        name="payTier"
                        checked={paymentOption === 'Full'}
                        onChange={() => setPaymentOption('Full')}
                        className="mt-1 mr-3 text-[#0B1325]"
                      />
                      <div className="text-xs">
                        <strong className="block text-gray-900 font-semibold">100% Full Payment</strong>
                        Pay full booking fees online. Streamlines check-in verification completely.
                      </div>
                    </label>

                    <label className={`flex items-start p-4 border cursor-pointer transition-all ${paymentOption === 'Deposit' ? 'border-[#C5A885] bg-[#FAF1EA]' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                      <input
                        type="radio"
                        name="payTier"
                        checked={paymentOption === 'Deposit'}
                        onChange={() => setPaymentOption('Deposit')}
                        className="mt-1 mr-3 text-[#0B1325]"
                      />
                      <div className="text-xs">
                        <strong className="block text-gray-900 font-semibold">50% Deposit Payment</strong>
                        Pay half price today, settle remaining balance during front-desk check-in.
                      </div>
                    </label>
                  </div>

                  <h5 className="font-serif text-sm font-bold uppercase tracking-wide text-gray-800 pt-2">Choose Payment Provider</h5>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setPaymentProvider('Paystack')}
                      className={`py-3 px-4 border text-center font-bold text-xs font-sans transition-all flex flex-col items-center justify-center ${paymentProvider === 'Paystack' ? 'border-[#0B1325] bg-sky-50 text-sky-800' : 'border-gray-200 hover:border-gray-300 text-gray-600'}`}
                    >
                      <CreditCard size={18} className="mb-1" />
                      Paystack Express
                    </button>
                    <button
                      onClick={() => setPaymentProvider('Flutterwave')}
                      className={`py-3 px-4 border text-center font-bold text-xs font-sans transition-all flex flex-col items-center justify-center ${paymentProvider === 'Flutterwave' ? 'border-[#0B1325] bg-amber-50 text-amber-800' : 'border-gray-200 hover:border-gray-300 text-gray-600'}`}
                    >
                      <Award size={18} className="mb-1" />
                      Flutterwave Direct
                    </button>
                  </div>
                </div>

                {/* Right Side: Stay Breakdown */}
                <div className="bg-[#FAF9F6] border border-gray-200 p-5 flex flex-col justify-between">
                  <div>
                    <h5 className="font-serif text-sm font-bold uppercase tracking-wide text-gray-800 mb-4 border-b pb-2">Booking Fees Summary</h5>
                    <ul className="space-y-3 text-xs font-sans text-gray-600">
                      <li className="flex justify-between">
                        <span>Room Rate:</span>
                        <span>₦{selectedRoom.price.toLocaleString()} x {nights} nights</span>
                      </li>
                      <li className="flex justify-between font-bold text-gray-900 border-t border-dashed pt-2.5">
                        <span>Total Room Cost:</span>
                        <span>₦{(selectedRoom.price * nights).toLocaleString()}</span>
                      </li>
                      <li className="flex justify-between text-emerald-700 font-semibold pt-1">
                        <span>Amount to Pay Now ({paymentOption === 'Full' ? '100%' : '50%'}):</span>
                        <span>
                          ₦{paymentOption === 'Full' 
                            ? (selectedRoom.price * nights).toLocaleString() 
                            : ((selectedRoom.price * nights) / 2).toLocaleString()}
                        </span>
                      </li>
                      {paymentOption === 'Deposit' && (
                        <li className="flex justify-between text-gray-500 italic font-sans pt-1">
                          <span>Amount Due at Check-In:</span>
                          <span>₦{((selectedRoom.price * nights) / 2).toLocaleString()}</span>
                        </li>
                      )}
                    </ul>
                  </div>

                  <div className="pt-6">
                    <button
                      onClick={handleProcessPayment}
                      disabled={isSubmitting}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 uppercase text-xs tracking-wider font-sans transition-all flex items-center justify-center space-x-2 shadow-md rounded-none"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="animate-spin" size={16} />
                          <span>Simulating {paymentProvider} Checkout...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle size={16} />
                          <span>Complete Secure Payment Online</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center border-t border-gray-200 pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 border border-gray-300 text-xs uppercase tracking-wider font-semibold text-gray-700 hover:bg-gray-100 transition-all"
                >
                  Back to Credentials
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Receipt confirmation screen */}
          {step === 4 && completedBooking && selectedRoom && (
            <div className="space-y-6">
              {/* Confirmed Alert Banner */}
              <div className="bg-emerald-50 border border-emerald-300 p-6 text-center space-y-2 rounded-none">
                <CheckCircle className="text-emerald-500 mx-auto" size={44} />
                <h4 className="font-serif text-lg font-bold text-emerald-900">Booking Confirmed Successfully!</h4>
                <p className="text-xs text-emerald-700 font-sans">
                  Thank you for choosing {settings.name}. Your luxury reservation is guaranteed on our database.
                </p>
                <div className="pt-2">
                  <span className="text-xs uppercase tracking-wider font-semibold text-gray-500 font-sans block">Unique Booking Reference Code</span>
                  <span className="inline-block bg-[#0B1325] text-[#C5A880] px-4 py-1.5 font-serif text-base font-bold tracking-widest mt-1">
                    {completedBooking.referenceNumber}
                  </span>
                </div>
              </div>

              {/* Booking Details Invoice Receipt */}
              <div className="border border-gray-200 bg-white p-6 space-y-4">
                <div className="flex justify-between items-center border-b pb-3 text-xs text-gray-500 font-sans">
                  <div>
                    <strong className="text-gray-800 block text-sm font-serif">{settings.name} Official Receipt</strong>
                    {settings.address}
                  </div>
                  <div className="text-right">
                    Date Paid: {new Date().toLocaleDateString()}<br />
                    Reference: {completedBooking.referenceNumber}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans text-gray-600">
                  <div>
                    <strong className="text-gray-900 font-semibold uppercase text-[10px] tracking-wider block mb-1">Customer Credentials</strong>
                    Name: <strong>{completedBooking.customerName}</strong><br />
                    Phone: <strong>{completedBooking.customerPhone}</strong><br />
                    Email: <strong>{completedBooking.customerEmail}</strong><br />
                    Country: <strong>{completedBooking.customerCountry}</strong>
                  </div>

                  <div>
                    <strong className="text-gray-900 font-semibold uppercase text-[10px] tracking-wider block mb-1">Stay Schedule</strong>
                    Room Type: <strong>{selectedRoom.name} ({selectedRoom.category})</strong><br />
                    Check-In: <strong>{completedBooking.checkIn} (from {settings.checkInTime})</strong><br />
                    Check-Out: <strong>{completedBooking.checkOut} (by {settings.checkOutTime})</strong><br />
                    Duration: <strong>{nights} Night{nights > 1 ? 's' : ''}</strong> • Guests: <strong>{completedBooking.guests} Adults</strong>
                  </div>

                  {completedBooking.specialRequests && (
                    <div className="sm:col-span-2 bg-gray-50 p-3 border-l-2 border-[#C5A880]">
                      <strong className="text-gray-900 font-semibold uppercase text-[10px] tracking-wider block">Special Requests Submitted</strong>
                      <p className="text-[11px] italic text-gray-700">{completedBooking.specialRequests}</p>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-200 pt-4 flex justify-between items-center bg-gray-50 p-4">
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest block font-sans">Total Transaction Value</span>
                    <span className="text-xl font-serif font-bold text-gray-950">₦{completedBooking.totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="text-right text-xs font-sans">
                    Payment Tier: <strong className="text-emerald-700">{completedBooking.paymentStatus}</strong><br />
                    Reservation Status: <strong className="text-emerald-700">Database Confirmed</strong>
                  </div>
                </div>
              </div>

              {/* Final Close Trigger */}
              <div className="text-center pt-2">
                <button
                  onClick={() => {
                    onBookingComplete();
                    onClose();
                  }}
                  className="bg-[#0B1325] text-[#C5A880] hover:bg-[#C5A880] hover:text-white px-6 py-3 text-xs uppercase tracking-wider font-bold font-sans transition-all"
                >
                  Return to Website
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
