import React, { useState, useEffect } from 'react';
import { 
  Building, Calendar, Clock, Utensils, Award, Image, Users, Settings, 
  Plus, Edit, Trash, Save, Shield, Search, Loader2 
} from 'lucide-react';

export default function AdminDashboard({ onSettingsUpdated, onDataUpdated }) {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Tabs: 'rooms' | 'bookings' | 'reservations' | 'menu' | 'offers' | 'gallery' | 'customers' | 'settings'
  const [activeTab, setActiveTab] = useState('bookings');

  // Master Lists
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [menu, setMenu] = useState([]);
  const [offers, setOffers] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [settings, setSettings] = useState(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Loaders
  const [isLoading, setIsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState({ type: '', text: '' });

  // Add / Edit Form states
  const [editingItem, setEditingItem] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Check LocalStorage Session
  useEffect(() => {
    const token = localStorage.getItem('eko_admin_token');
    if (token === 'eko-grandeur-auth-token-2026') {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch dashboard data
  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const [rRes, bRes, resRes, mRes, oRes, gRes, sRes] = await Promise.all([
        fetch('/api/rooms'),
        fetch('/api/bookings'),
        fetch('/api/lounge-reservations'),
        fetch('/api/menu'),
        fetch('/api/offers'),
        fetch('/api/gallery'),
        fetch('/api/settings')
      ]);

      const [r, b, res, m, o, g, s] = await Promise.all([
        rRes.json(), bRes.json(), resRes.json(), mRes.json(), oRes.json(), gRes.json(), sRes.json()
      ]);

      setRooms(r);
      setBookings(b);
      setReservations(res);
      setMenu(m);
      setOffers(o);
      setGallery(g);
      setSettings(s);
    } catch (err) {
      console.error(err);
      triggerToast('error', 'Failed to retrieve database information.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllData();
    }
  }, [isAuthenticated]);

  const triggerToast = (type, text) => {
    setToastMsg({ type, text });
    setTimeout(() => setToastMsg({ type: '', text: '' }), 4000);
  };

  // Login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Authentication failed');

      localStorage.setItem('eko_admin_token', data.token);
      setIsAuthenticated(true);
      triggerToast('success', 'Logged in successfully!');
    } catch (err) {
      setLoginError(err.message || 'Invalid username or password');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('eko_admin_token');
    setIsAuthenticated(false);
    setRooms([]);
    setBookings([]);
    setReservations([]);
  };

  // Generic API post/put/delete helpers
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    if (!settings) return;
    setActionLoading(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (!res.ok) throw new Error('Failed to save settings');
      const data = await res.json();
      setSettings(data.settings);
      onSettingsUpdated();
      triggerToast('success', 'Global Hotel Settings saved successfully!');
    } catch (err) {
      triggerToast('error', 'Settings update failed.');
    } finally {
      setActionLoading(false);
    }
  };

  // Rooms Management
  const handleSaveRoom = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    
    // Construct room data
    const rData = editingItem || {
      name: '', category: 'Standard', price: 40000, maxGuests: 2, bedType: 'Queen Bed', size: 30, description: '', facilities: ['Wi-Fi'], images: []
    };

    const isEdit = !!rData.id;
    const url = isEdit ? `/api/rooms/${rData.id}` : '/api/rooms';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rData)
      });
      if (!res.ok) throw new Error('Save failed');
      
      await fetchAllData();
      onDataUpdated();
      setEditingItem(null);
      setShowAddForm(false);
      triggerToast('success', `Room ${isEdit ? 'updated' : 'added'} successfully!`);
    } catch (e) {
      triggerToast('error', 'Failed to save room.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteRoom = async (id) => {
    if (!confirm('Are you absolutely sure you want to delete this room?')) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/rooms/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      await fetchAllData();
      onDataUpdated();
      triggerToast('success', 'Room deleted from database.');
    } catch (e) {
      triggerToast('error', 'Failed to delete room.');
    } finally {
      setActionLoading(false);
    }
  };

  // Bookings Status Management
  const handleUpdateBookingStatus = async (id, updates) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (!res.ok) throw new Error('Update failed');
      await fetchAllData();
      onDataUpdated();
      triggerToast('success', 'Booking database record updated.');
    } catch (e) {
      triggerToast('error', 'Failed to update booking status.');
    } finally {
      setActionLoading(false);
    }
  };

  // Lounge Reservations Status Management
  const handleUpdateReservationStatus = async (id, status) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/lounge-reservations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error('Update failed');
      await fetchAllData();
      triggerToast('success', 'Lounge reservation status updated.');
    } catch (e) {
      triggerToast('error', 'Failed to update reservation.');
    } finally {
      setActionLoading(false);
    }
  };

  // Restaurant Menu Management
  const handleSaveMenuItem = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    const mData = editingItem;
    const isEdit = !!mData.id;
    const url = isEdit ? `/api/menu/${mData.id}` : '/api/menu';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mData)
      });
      if (!res.ok) throw new Error('Save failed');
      await fetchAllData();
      setEditingItem(null);
      setShowAddForm(false);
      triggerToast('success', 'Menu updated successfully!');
    } catch (e) {
      triggerToast('error', 'Failed to save menu item.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteMenuItem = async (id) => {
    if (!confirm('Delete this menu item?')) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/menu/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      await fetchAllData();
      triggerToast('success', 'Menu item removed.');
    } catch (e) {
      triggerToast('error', 'Failed to delete menu item.');
    } finally {
      setActionLoading(false);
    }
  };

  // Offers Management
  const handleSaveOffer = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    const oData = editingItem;
    const isEdit = !!oData.id;
    const url = isEdit ? `/api/offers/${oData.id}` : '/api/offers';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...oData,
          terms: Array.isArray(oData.terms) ? oData.terms : oData.terms.split('\n').filter((t) => t.trim())
        })
      });
      if (!res.ok) throw new Error('Save failed');
      await fetchAllData();
      setEditingItem(null);
      setShowAddForm(false);
      triggerToast('success', 'Offer package saved.');
    } catch (e) {
      triggerToast('error', 'Failed to save offer.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteOffer = async (id) => {
    if (!confirm('Delete this offer package?')) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/offers/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      await fetchAllData();
      triggerToast('success', 'Offer deleted.');
    } catch (e) {
      triggerToast('error', 'Failed to delete offer.');
    } finally {
      setActionLoading(false);
    }
  };

  // Gallery Management
  const [newGalleryImg, setNewGalleryImg] = useState({ category: 'Rooms', image: '', title: '' });
  const handleAddGalleryImage = async (e) => {
    e.preventDefault();
    if (!newGalleryImg.image || !newGalleryImg.title) {
      triggerToast('error', 'Image URL and Title are required.');
      return;
    }
    setActionLoading(true);
    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGalleryImg)
      });
      if (!res.ok) throw new Error('Upload failed');
      await fetchAllData();
      setNewGalleryImg({ category: 'Rooms', image: '', title: '' });
      triggerToast('success', 'Image added to gallery database!');
    } catch (e) {
      triggerToast('error', 'Failed to save gallery item.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteGalleryImage = async (id) => {
    if (!confirm('Delete this image from gallery?')) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      await fetchAllData();
      triggerToast('success', 'Image deleted.');
    } catch (e) {
      triggerToast('error', 'Failed to delete image.');
    } finally {
      setActionLoading(false);
    }
  };

  // LOGIN PAGE RENDER (IF NOT AUTHENTICATED)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0B1325] flex items-center justify-center px-4 font-sans py-24">
        <div className="bg-white p-8 max-w-sm w-full border border-[#C5A880]/30 shadow-2xl relative">
          <div className="absolute top-0 inset-x-0 h-1.5 bg-[#C5A880]"></div>
          
          <div className="text-center mb-6">
            <span className="font-serif text-xl font-bold tracking-widest text-[#0B1325] block uppercase">Eko Grandeur</span>
            <span className="text-[9px] tracking-widest text-[#C5A880] uppercase block mt-1">Management Portal Access</span>
          </div>

          {loginError && (
            <div className="bg-red-50 border-l-2 border-red-500 p-3 text-xs text-red-700 mb-4 rounded-none">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-1">Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full text-xs px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#C5A880] text-gray-900"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="admin123"
                className="w-full text-xs px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#C5A880] text-gray-900"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-[#0B1325] hover:bg-[#C5A880] text-[#C5A880] hover:text-white transition-all py-2.5 text-xs font-bold uppercase tracking-widest flex items-center justify-center space-x-1"
            >
              {isLoggingIn ? <Loader2 className="animate-spin" size={14} /> : <Shield size={14} />}
              <span>Authorize Login</span>
            </button>
          </form>

          <p className="text-[10px] text-gray-400 text-center mt-6">
            Contact Eko Grandeur IT Support if credentials are misplaced.
          </p>
        </div>
      </div>
    );
  }

  // Filter Bookings Based on Search Query & Date & Status
  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          b.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          b.customerPhone.includes(searchQuery) || 
                          b.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDate = !dateFilter || b.checkIn === dateFilter || b.checkOut === dateFilter;
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    return matchesSearch && matchesDate && matchesStatus;
  });

  // Calculate unique customers list with history aggregates
  const customerHistoryMap = {};
  bookings.forEach(b => {
    const email = b.customerEmail.toLowerCase();
    if (!customerHistoryMap[email]) {
      customerHistoryMap[email] = {
        name: b.customerName,
        phone: b.customerPhone,
        country: b.customerCountry,
        bookings: [],
        spend: 0
      };
    }
    customerHistoryMap[email].bookings.push(b);
    if (b.status !== 'Cancelled') {
      customerHistoryMap[email].spend += b.totalPrice;
    }
  });
  const customersList = Object.values(customerHistoryMap);

  return (
    <div className="bg-gray-100 min-h-screen text-gray-900 font-sans flex flex-col md:flex-row">
      
      {/* Toast Notice */}
      {toastMsg.text && (
        <div className={`fixed bottom-6 right-6 z-50 p-4 border text-xs shadow-lg max-w-sm flex items-center space-x-2 ${
          toastMsg.type === 'success' ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-red-50 border-red-300 text-red-800'
        }`}>
          <span>{toastMsg.text}</span>
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#0B1325] text-white flex-shrink-0 flex flex-col justify-between py-6">
        <div>
          <div className="px-6 pb-6 border-b border-[#FAF9F6]/10 mb-6 flex justify-between items-center">
            <div>
              <span className="font-serif text-base font-bold text-[#FAF9F6] tracking-widest block leading-none">GRAND WORKSPACE</span>
              <span className="text-[9px] text-[#C5A880] tracking-widest uppercase block mt-1">Eko Grandeur Dashboard</span>
            </div>
            <button onClick={handleLogout} className="text-xs font-semibold text-red-400 hover:text-red-500">
              Logout
            </button>
          </div>

          <nav className="space-y-1 px-4">
            {[
              { id: 'bookings', name: 'Bookings Database', icon: Calendar },
              { id: 'reservations', name: 'Lounge Reservations', icon: Clock },
              { id: 'rooms', name: 'Rooms & Suites', icon: Building },
              { id: 'menu', name: 'Restaurant Menu', icon: Utensils },
              { id: 'offers', name: 'Special Packages', icon: Award },
              { id: 'gallery', name: 'Gallery Vault', icon: Image },
              { id: 'customers', name: 'Customers Portfolio', icon: Users },
              { id: 'settings', name: 'Website Configuration', icon: Settings }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setEditingItem(null);
                    setShowAddForm(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-none text-left transition-all ${
                    activeTab === tab.id 
                      ? 'bg-[#C5A880] text-white' 
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={14} />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="px-6 text-[10px] text-white/40 font-medium">
          <p>Eko Grandeur IT Engine v1.2</p>
          <p>© 2026 Melody Tech Boy</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10">
        
        {/* Top bar header */}
        <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-6">
          <div>
            <h2 className="font-serif text-xl font-bold tracking-wide uppercase text-[#0B1325]">
              {activeTab === 'bookings' && "Manage Room Bookings"}
              {activeTab === 'reservations' && "Manage Lounge Tables"}
              {activeTab === 'rooms' && "Manage Accommodations"}
              {activeTab === 'menu' && "Manage Restaurant Menu"}
              {activeTab === 'offers' && "Manage Special Offers"}
              {activeTab === 'gallery' && "Manage Photo Gallery"}
              {activeTab === 'customers' && "Guest Portfolios"}
              {activeTab === 'settings' && "Website Settings Control"}
            </h2>
            <p className="text-xs text-gray-500 font-sans mt-0.5">Real-time persistent updates active.</p>
          </div>

          {['rooms', 'menu', 'offers'].includes(activeTab) && !showAddForm && !editingItem && (
            <button
              onClick={() => {
                setShowAddForm(true);
                if (activeTab === 'rooms') {
                  setEditingItem({ name: '', category: 'Standard', price: 50000, maxGuests: 2, bedType: 'Queen Size Bed', size: 30, description: '', facilities: ['Wi-Fi', 'Air conditioning', 'Smart TV'], images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=1200'] });
                } else if (activeTab === 'menu') {
                  setEditingItem({ name: '', description: '', price: 10000, category: 'Local Cuisine', image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&q=80&w=400' });
                } else if (activeTab === 'offers') {
                  setEditingItem({ name: '', description: '', price: 120000, validity: 'Valid until Dec 2026', terms: 'Applicable on weekends\nPrior booking required', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=600' });
                }
              }}
              className="bg-[#0B1325] text-[#C5A880] hover:bg-[#C5A880] hover:text-white px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 shadow"
            >
              <Plus size={14} />
              <span>Add New</span>
            </button>
          )}
        </div>

        {/* LOADING SCREEN FOR DB QUERY */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <Loader2 className="animate-spin text-[#C5A880] mb-3" size={32} />
            <p className="text-xs font-sans">Connecting and retrieving master database lists...</p>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* TAB 1: BOOKINGS DATABASE */}
            {activeTab === 'bookings' && (
              <div className="space-y-4 font-sans">
                {/* Search / Filters Bar */}
                <div className="bg-white border p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input
                      type="text"
                      placeholder="Search Name, Ref ID, Phone..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-300 text-xs focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>

                  <div>
                    <input
                      type="date"
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 text-xs focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>

                  <div>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 text-xs focus:outline-none focus:border-[#C5A880]"
                    >
                      <option value="All">All Statuses</option>
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Checked-in">Checked-in</option>
                      <option value="Checked-out">Checked-out</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {/* Table list */}
                <div className="bg-white border overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-100 border-b uppercase text-[10px] tracking-wider text-gray-500">
                      <tr>
                        <th className="p-4">Reference / Guest</th>
                        <th className="p-4">Room Type</th>
                        <th className="p-4">Dates</th>
                        <th className="p-4">Total Cost</th>
                        <th className="p-4">Workflow Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y text-gray-700">
                      {filteredBookings.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-gray-400">No bookings matched your filters.</td>
                        </tr>
                      ) : (
                        filteredBookings.map((b) => {
                          const associatedRoom = rooms.find(r => r.id === b.roomId);
                          return (
                            <tr key={b.id} className="hover:bg-gray-50">
                              <td className="p-4 font-sans">
                                <span className="font-serif font-bold text-[#0B1325] block">{b.referenceNumber}</span>
                                <strong className="text-gray-900 block">{b.customerName}</strong>
                                <span className="text-[10px] text-gray-500">{b.customerEmail} | {b.customerPhone}</span>
                              </td>
                              <td className="p-4">
                                <span className="font-semibold block">{associatedRoom?.name || 'Deleted Room'}</span>
                                <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 uppercase tracking-wide font-semibold mt-1 inline-block">
                                  {associatedRoom?.category || 'Standard'}
                                </span>
                              </td>
                              <td className="p-4">
                                <span className="block font-medium">In: {b.checkIn}</span>
                                <span className="block text-gray-500">Out: {b.checkOut}</span>
                                <span className="text-[10px] text-[#C5A880] font-semibold">{b.guests} guest(s)</span>
                              </td>
                              <td className="p-4 font-semibold text-gray-950">
                                ₦{b.totalPrice.toLocaleString()}<br />
                                <span className={`text-[9px] font-bold uppercase ${b.paymentStatus === 'Fully Paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                  {b.paymentStatus}
                                </span>
                              </td>
                              <td className="p-4">
                                <span className={`inline-block px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider ${
                                  b.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' :
                                  b.status === 'Checked-in' ? 'bg-blue-100 text-blue-800' :
                                  b.status === 'Checked-out' ? 'bg-gray-100 text-gray-800' :
                                  b.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                  'bg-amber-100 text-amber-800'
                                }`}>
                                  {b.status}
                                </span>
                              </td>
                              <td className="p-4 text-right space-y-1">
                                {b.status === 'Pending' && (
                                  <button
                                    onClick={() => handleUpdateBookingStatus(b.id, { status: 'Confirmed', paymentStatus: 'Fully Paid' })}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 transition-all mr-1"
                                  >
                                    Confirm
                                  </button>
                                )}
                                {b.status === 'Confirmed' && (
                                  <button
                                    onClick={() => handleUpdateBookingStatus(b.id, { status: 'Checked-in' })}
                                    className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 transition-all mr-1"
                                  >
                                    Check In
                                  </button>
                                )}
                                {b.status === 'Checked-in' && (
                                  <button
                                    onClick={() => handleUpdateBookingStatus(b.id, { status: 'Checked-out' })}
                                    className="bg-gray-700 hover:bg-gray-800 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 transition-all mr-1"
                                  >
                                    Check Out
                                  </button>
                                )}
                                {b.status !== 'Cancelled' && b.status !== 'Checked-out' && (
                                  <button
                                    onClick={() => handleUpdateBookingStatus(b.id, { status: 'Cancelled' })}
                                    className="bg-red-100 hover:bg-red-200 text-red-800 text-[10px] font-bold uppercase tracking-wider px-2 py-1 transition-all"
                                  >
                                    Cancel
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 2: LOUNGE RESERVATIONS */}
            {activeTab === 'reservations' && (
              <div className="bg-white border overflow-x-auto font-sans">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-100 border-b uppercase text-[10px] tracking-wider text-gray-500">
                    <tr>
                      <th className="p-4">Customer Name</th>
                      <th className="p-4">Schedule (Date / Time)</th>
                      <th className="p-4">Table Preferences</th>
                      <th className="p-4">Special Requests</th>
                      <th className="p-4">Workflow Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-gray-700">
                    {reservations.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-gray-400">No lounge table bookings recorded.</td>
                      </tr>
                    ) : (
                      reservations.map((res) => (
                        <tr key={res.id} className="hover:bg-gray-50">
                          <td className="p-4 font-sans">
                            <strong className="text-gray-900 block">{res.name}</strong>
                            <span className="text-[10px] text-gray-500">{res.email} • {res.phone}</span>
                          </td>
                          <td className="p-4">
                            <span className="font-semibold block">{res.date}</span>
                            <span className="text-gray-500 text-[11px] block mt-0.5">Time: {res.time}</span>
                            <span className="text-[10px] text-[#C5A880] font-semibold block mt-0.5">{res.guests} Guests</span>
                          </td>
                          <td className="p-4 font-semibold text-[#0B1325]">
                            {res.seatingPreference}
                          </td>
                          <td className="p-4 italic text-gray-500 max-w-xs truncate" title={res.specialRequest}>
                            {res.specialRequest || 'None'}
                          </td>
                          <td className="p-4">
                            <span className={`inline-block px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider ${
                              res.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' :
                              res.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-amber-100 text-amber-800'
                            }`}>
                              {res.status}
                            </span>
                          </td>
                          <td className="p-4 text-right space-y-1">
                            {res.status === 'Pending' && (
                              <button
                                onClick={() => handleUpdateReservationStatus(res.id, 'Confirmed')}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 transition-all mr-1"
                              >
                                Confirm
                              </button>
                            )}
                            {res.status !== 'Cancelled' && (
                              <button
                                onClick={() => handleUpdateReservationStatus(res.id, 'Cancelled')}
                                className="bg-red-100 hover:bg-red-200 text-red-800 text-[10px] font-bold uppercase tracking-wider px-2 py-1 transition-all"
                              >
                                Cancel
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB 3: ROOMS CRUD */}
            {activeTab === 'rooms' && (
              <div className="space-y-6">
                {(showAddForm || editingItem) && (
                  <form onSubmit={handleSaveRoom} className="bg-white border p-6 space-y-4 font-sans max-w-2xl">
                    <h3 className="font-serif text-base font-bold text-gray-900 border-b pb-2">
                      {editingItem?.id ? 'Edit Accommodation Profile' : 'Add New Luxury Suite'}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Room Name</label>
                        <input
                          type="text"
                          required
                          value={editingItem?.name || ''}
                          onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Room Category</label>
                        <select
                          value={editingItem?.category || 'Standard'}
                          onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 focus:outline-none"
                        >
                          <option value="Standard">Standard</option>
                          <option value="Deluxe">Deluxe</option>
                          <option value="Executive Suite">Executive Suite</option>
                          <option value="Presidential Suite">Presidential Suite</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Price Per Night (₦)</label>
                        <input
                          type="number"
                          required
                          value={editingItem?.price || 40000}
                          onChange={(e) => setEditingItem({ ...editingItem, price: Number(e.target.value) })}
                          className="w-full px-3 py-2 border border-gray-300 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Max Guests Limit</label>
                        <input
                          type="number"
                          required
                          value={editingItem?.maxGuests || 2}
                          onChange={(e) => setEditingItem({ ...editingItem, maxGuests: Number(e.target.value) })}
                          className="w-full px-3 py-2 border border-gray-300 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Bed Configuration</label>
                        <input
                          type="text"
                          required
                          value={editingItem?.bedType || ''}
                          onChange={(e) => setEditingItem({ ...editingItem, bedType: e.target.value })}
                          placeholder="e.g. King Size Bed"
                          className="w-full px-3 py-2 border border-gray-300 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Room Size Area (sqm)</label>
                        <input
                          type="number"
                          required
                          value={editingItem?.size || 30}
                          onChange={(e) => setEditingItem({ ...editingItem, size: Number(e.target.value) })}
                          className="w-full px-3 py-2 border border-gray-300 focus:outline-none"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">First Image URL</label>
                        <input
                          type="text"
                          required
                          value={editingItem?.images?.[0] || ''}
                          onChange={(e) => {
                            const imgs = [...(editingItem?.images || [])];
                            imgs[0] = e.target.value;
                            setEditingItem({ ...editingItem, images: imgs });
                          }}
                          className="w-full px-3 py-2 border border-gray-300 focus:outline-none"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Room Description</label>
                        <textarea
                          rows={3}
                          required
                          value={editingItem?.description || ''}
                          onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="border-t pt-4 flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => { setEditingItem(null); setShowAddForm(false); }}
                        className="px-4 py-2 border text-xs uppercase font-semibold text-gray-600 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={actionLoading}
                        className="bg-[#0B1325] text-[#C5A880] hover:bg-[#C5A880] hover:text-white px-5 py-2 text-xs uppercase font-bold tracking-wider transition-all"
                      >
                        {actionLoading ? 'Saving...' : 'Save Suite'}
                      </button>
                    </div>
                  </form>
                )}

                {!showAddForm && !editingItem && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-sans">
                    {rooms.map((room) => (
                      <div key={room.id} className="bg-white border flex flex-col justify-between hover:border-[#C5A880] transition-all">
                        <div className="aspect-video relative overflow-hidden bg-gray-100">
                          <img src={room.images[0]} alt={room.name} referrerPolicy="no-referrer" className="object-cover w-full h-full" />
                          <div className="absolute top-2 left-2 bg-[#0B1325] text-[#C5A880] text-[9px] uppercase font-bold tracking-widest px-2 py-0.5">
                            {room.category}
                          </div>
                        </div>

                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <div>
                            <h4 className="font-serif text-base font-bold text-gray-900">{room.name}</h4>
                            <p className="text-xs text-gray-500 line-clamp-2 mt-1 leading-relaxed">{room.description}</p>
                            <span className="block text-sm font-serif font-bold text-[#0B1325] mt-3">₦{room.price.toLocaleString()} / Night</span>
                          </div>

                          <div className="border-t pt-3 mt-4 flex justify-between items-center text-xs">
                            <button
                              onClick={() => setEditingItem(room)}
                              className="text-gray-600 hover:text-[#C5A880] font-semibold flex items-center space-x-1"
                            >
                              <Edit size={12} />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteRoom(room.id)}
                              className="text-red-500 hover:text-red-700 font-semibold flex items-center space-x-1"
                            >
                              <Trash size={12} />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: RESTAURANT CRUD */}
            {activeTab === 'menu' && (
              <div className="space-y-6">
                {(showAddForm || editingItem) && (
                  <form onSubmit={handleSaveMenuItem} className="bg-white border p-6 space-y-4 font-sans max-w-2xl">
                    <h3 className="font-serif text-base font-bold text-gray-900 border-b pb-2">
                      {editingItem?.id ? 'Edit Dish Profile' : 'Add New Restaurant Dish'}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Dish Name</label>
                        <input
                          type="text"
                          required
                          value={editingItem?.name || ''}
                          onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Category</label>
                        <select
                          value={editingItem?.category || 'Breakfast'}
                          onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 focus:outline-none"
                        >
                          <option value="Breakfast">Breakfast</option>
                          <option value="Lunch">Lunch</option>
                          <option value="Dinner">Dinner</option>
                          <option value="Local Cuisine">Local Cuisine</option>
                          <option value="Continental">Continental</option>
                          <option value="Desserts">Desserts</option>
                          <option value="Drinks">Drinks</option>
                          <option value="Cocktails / Mocktails">Cocktails / Mocktails</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Price (₦)</label>
                        <input
                          type="number"
                          required
                          value={editingItem?.price || 5000}
                          onChange={(e) => setEditingItem({ ...editingItem, price: Number(e.target.value) })}
                          className="w-full px-3 py-2 border border-gray-300 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Image URL</label>
                        <input
                          type="text"
                          required
                          value={editingItem?.image || ''}
                          onChange={(e) => setEditingItem({ ...editingItem, image: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 focus:outline-none"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Dish Description</label>
                        <textarea
                          rows={3}
                          required
                          value={editingItem?.description || ''}
                          onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="border-t pt-4 flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => { setEditingItem(null); setShowAddForm(false); }}
                        className="px-4 py-2 border text-xs uppercase font-semibold text-gray-600 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={actionLoading}
                        className="bg-[#0B1325] text-[#C5A880] hover:bg-[#C5A880] hover:text-white px-5 py-2 text-xs uppercase font-bold tracking-wider transition-all"
                      >
                        Save Dish
                      </button>
                    </div>
                  </form>
                )}

                {!showAddForm && !editingItem && (
                  <div className="bg-white border overflow-x-auto font-sans">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-gray-100 border-b uppercase text-[10px] tracking-wider text-gray-500">
                        <tr>
                          <th className="p-4">Dish</th>
                          <th className="p-4">Category</th>
                          <th className="p-4">Description</th>
                          <th className="p-4">Price</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y text-gray-700">
                        {menu.map((m) => (
                          <tr key={m.id} className="hover:bg-gray-50">
                            <td className="p-4 flex items-center space-x-3">
                              <img src={m.image} alt="" className="w-10 h-10 object-cover border" referrerPolicy="no-referrer" />
                              <strong className="text-gray-900">{m.name}</strong>
                            </td>
                            <td className="p-4 uppercase tracking-wide font-semibold text-[10px] text-[#C5A880]">
                              {m.category}
                            </td>
                            <td className="p-4 text-gray-500 max-w-sm truncate">{m.description}</td>
                            <td className="p-4 font-bold text-gray-950">₦{m.price.toLocaleString()}</td>
                            <td className="p-4 text-right space-x-2">
                              <button onClick={() => setEditingItem(m)} className="text-gray-600 hover:text-gray-950">Edit</button>
                              <button onClick={() => handleDeleteMenuItem(m.id)} className="text-red-500 hover:text-red-700">Delete</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* TAB 5: SPECIAL OFFERS CRUD */}
            {activeTab === 'offers' && (
              <div className="space-y-6">
                {(showAddForm || editingItem) && (
                  <form onSubmit={handleSaveOffer} className="bg-white border p-6 space-y-4 font-sans max-w-2xl">
                    <h3 className="font-serif text-base font-bold text-gray-900 border-b pb-2">
                      {editingItem?.id ? 'Edit Offer Package' : 'Create Special Offer Package'}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Offer Title</label>
                        <input
                          type="text"
                          required
                          value={editingItem?.name || ''}
                          onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Validity (e.g. Valid Weekends)</label>
                        <input
                          type="text"
                          required
                          value={editingItem?.validity || ''}
                          onChange={(e) => setEditingItem({ ...editingItem, validity: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Package Price (₦)</label>
                        <input
                          type="number"
                          required
                          value={editingItem?.price || 100000}
                          onChange={(e) => setEditingItem({ ...editingItem, price: Number(e.target.value) })}
                          className="w-full px-3 py-2 border border-gray-300 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Banner Image URL</label>
                        <input
                          type="text"
                          required
                          value={editingItem?.image || ''}
                          onChange={(e) => setEditingItem({ ...editingItem, image: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 focus:outline-none"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Offer Description</label>
                        <textarea
                          rows={3}
                          required
                          value={editingItem?.description || ''}
                          onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 focus:outline-none"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Terms & Conditions (One per line)</label>
                        <textarea
                          rows={3}
                          required
                          value={Array.isArray(editingItem?.terms) ? editingItem.terms.join('\n') : editingItem?.terms || ''}
                          onChange={(e) => setEditingItem({ ...editingItem, terms: e.target.value })}
                          placeholder="Line 1 T&C&#10;Line 2 T&C"
                          className="w-full px-3 py-2 border border-gray-300 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="border-t pt-4 flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => { setEditingItem(null); setShowAddForm(false); }}
                        className="px-4 py-2 border text-xs uppercase font-semibold text-gray-600 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={actionLoading}
                        className="bg-[#0B1325] text-[#C5A880] hover:bg-[#C5A880] hover:text-white px-5 py-2 text-xs uppercase font-bold tracking-wider transition-all"
                      >
                        Save Package
                      </button>
                    </div>
                  </form>
                )}

                {!showAddForm && !editingItem && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
                    {offers.map((off) => (
                      <div key={off.id} className="bg-white border p-5 flex flex-col justify-between hover:border-[#C5A880] transition-all">
                        <div>
                          <img src={off.image} alt="" className="w-full aspect-video object-cover border mb-3" referrerPolicy="no-referrer" />
                          <h4 className="font-serif text-base font-bold text-gray-900">{off.name}</h4>
                          <p className="text-xs text-gray-500 line-clamp-2 mt-1 leading-relaxed">{off.description}</p>
                          <span className="block text-sm font-serif font-bold text-[#0B1325] mt-2">₦{off.price.toLocaleString()}</span>
                          <span className="block text-[10px] text-gray-400 mt-1 uppercase tracking-wide font-medium">Validity: {off.validity}</span>
                        </div>

                        <div className="border-t pt-3 mt-4 flex justify-between items-center text-xs">
                          <button onClick={() => setEditingItem(off)} className="text-gray-600 hover:text-gray-950 font-semibold">Edit Package</button>
                          <button onClick={() => handleDeleteOffer(off.id)} className="text-red-500 hover:text-red-700 font-semibold">Remove</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 6: GALLERY VAULT */}
            {activeTab === 'gallery' && (
              <div className="space-y-6 font-sans">
                {/* Upload Image Bar */}
                <form onSubmit={handleAddGalleryImage} className="bg-white border p-4 grid grid-cols-1 sm:grid-cols-4 gap-4 items-end text-xs">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Category</label>
                    <select
                      value={newGalleryImg.category}
                      onChange={(e) => setNewGalleryImg({ ...newGalleryImg, category: e.target.value })}
                      className="w-full px-3 py-2 border bg-gray-50 focus:outline-none"
                    >
                      <option value="Rooms">Rooms</option>
                      <option value="Lounge">Lounge</option>
                      <option value="Restaurant">Restaurant</option>
                      <option value="Facilities">Facilities</option>
                      <option value="Events">Events</option>
                      <option value="Exterior">Exterior</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Image Direct URL</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. https://images.unsplash.com/..."
                      value={newGalleryImg.image}
                      onChange={(e) => setNewGalleryImg({ ...newGalleryImg, image: e.target.value })}
                      className="w-full px-3 py-2 border bg-gray-50 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Display Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. VIP Room Sunset"
                      value={newGalleryImg.title}
                      onChange={(e) => setNewGalleryImg({ ...newGalleryImg, title: e.target.value })}
                      className="w-full px-3 py-2 border bg-gray-50 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-4 flex justify-end">
                    <button
                      type="submit"
                      disabled={actionLoading}
                      className="bg-[#0B1325] text-[#C5A880] hover:bg-[#C5A880] hover:text-white px-5 py-2 text-xs uppercase font-bold tracking-wider transition-all"
                    >
                      Add Image
                    </button>
                  </div>
                </form>

                {/* Gallery List */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {gallery.map((g) => (
                    <div key={g.id} className="bg-white border p-2 flex flex-col justify-between group relative">
                      <div className="aspect-square bg-gray-100 overflow-hidden border mb-2">
                        <img src={g.image} alt="" className="object-cover w-full h-full" referrerPolicy="no-referrer" />
                      </div>
                      <div className="text-[10px] text-gray-600 font-sans truncate pr-8">{g.title}</div>
                      <div className="text-[9px] text-[#C5A880] uppercase tracking-wider font-semibold mt-0.5">{g.category}</div>
                      <button
                        onClick={() => handleDeleteGalleryImage(g.id)}
                        className="absolute bottom-2 right-2 p-1.5 border hover:bg-red-50 text-red-500 rounded-none hover:border-red-300 transition-all"
                        title="Delete Image"
                      >
                        <Trash size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 7: CUSTOMERS DATABASE PORTFOLIO */}
            {activeTab === 'customers' && (
              <div className="bg-white border overflow-x-auto font-sans">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-100 border-b uppercase text-[10px] tracking-wider text-gray-500">
                    <tr>
                      <th className="p-4">Customer Credentials</th>
                      <th className="p-4">Total Reservations</th>
                      <th className="p-4">Country Origin</th>
                      <th className="p-4">Total Spend (₦)</th>
                      <th className="p-4 text-right">View Booking References</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-gray-700">
                    {customersList.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-gray-400">No customers registered on the database yet.</td>
                      </tr>
                    ) : (
                      customersList.map((cust, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="p-4 font-sans">
                            <strong className="text-gray-900 block">{cust.name}</strong>
                            <span className="text-[10px] text-gray-500">{cust.bookings[0].customerEmail} • {cust.phone}</span>
                          </td>
                          <td className="p-4 font-semibold text-gray-900">
                            {cust.bookings.length} Booking(s)
                          </td>
                          <td className="p-4 font-medium">{cust.country}</td>
                          <td className="p-4 font-bold text-emerald-700">₦{cust.spend.toLocaleString()}</td>
                          <td className="p-4 text-right">
                            <div className="flex flex-wrap justify-end gap-1.5 max-w-sm ml-auto">
                              {cust.bookings.map((b, bIdx) => (
                                <span 
                                  key={bIdx} 
                                  className={`px-2 py-0.5 text-[9px] uppercase tracking-wide font-mono font-bold ${
                                    b.status === 'Cancelled' ? 'bg-red-50 text-red-600 line-through' : 'bg-gray-100 text-gray-800'
                                  }`}
                                  title={`${b.checkIn} to ${b.checkOut}`}
                                >
                                  {b.referenceNumber}
                                </span>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB 8: GLOBAL HOTEL CONFIGURATION */}
            {activeTab === 'settings' && settings && (
              <form onSubmit={handleSaveSettings} className="bg-white border p-6 space-y-6 font-sans max-w-3xl">
                <h3 className="font-serif text-base font-bold text-gray-900 border-b pb-2">Global Branding, Location & Contact Config</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Hotel & Lounge Name</label>
                    <input
                      type="text"
                      required
                      value={settings.name}
                      onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Logo Text Prefix</label>
                    <input
                      type="text"
                      required
                      value={settings.logoText}
                      onChange={(e) => setSettings({ ...settings, logoText: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Physical Address</label>
                    <input
                      type="text"
                      required
                      value={settings.address}
                      onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Reservations Phone</label>
                    <input
                      type="text"
                      required
                      value={settings.phone}
                      onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">WhatsApp Reservation Line</label>
                    <input
                      type="text"
                      required
                      value={settings.whatsapp}
                      onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Official Email Address</label>
                    <input
                      type="email"
                      required
                      value={settings.email}
                      onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Facebook Handle</label>
                    <input
                      type="text"
                      required
                      value={settings.facebook}
                      onChange={(e) => setSettings({ ...settings, facebook: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Instagram Link</label>
                    <input
                      type="text"
                      required
                      value={settings.instagram}
                      onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Twitter/X Link</label>
                    <input
                      type="text"
                      required
                      value={settings.twitter}
                      onChange={(e) => setSettings({ ...settings, twitter: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Standard Check-In Time</label>
                    <input
                      type="text"
                      required
                      value={settings.checkInTime}
                      onChange={(e) => setSettings({ ...settings, checkInTime: e.target.value })}
                      placeholder="e.g. 14:00"
                      className="w-full px-3 py-2 border border-gray-300 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Standard Check-Out Time</label>
                    <input
                      type="text"
                      required
                      value={settings.checkOutTime}
                      onChange={(e) => setSettings({ ...settings, checkOutTime: e.target.value })}
                      placeholder="e.g. 12:00"
                      className="w-full px-3 py-2 border border-gray-300 focus:outline-none"
                    />
                  </div>
                </div>

                <h3 className="font-serif text-base font-bold text-gray-900 border-b pb-2 pt-4">Global Search Engine Optimization (SEO)</h3>
                <div className="grid grid-cols-1 gap-4 text-xs">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">SEO Page Title Tag</label>
                    <input
                      type="text"
                      required
                      value={settings.seoTitle}
                      onChange={(e) => setSettings({ ...settings, seoTitle: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">SEO Description Tag</label>
                    <textarea
                      rows={2}
                      required
                      value={settings.seoDescription}
                      onChange={(e) => setSettings({ ...settings, seoDescription: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">SEO Keywords (Comma Separated)</label>
                    <input
                      type="text"
                      required
                      value={settings.seoKeywords}
                      onChange={(e) => setSettings({ ...settings, seoKeywords: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="border-t pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="bg-[#0B1325] text-[#C5A880] hover:bg-[#C5A880] hover:text-white px-6 py-3 text-xs uppercase font-bold tracking-widest transition-all flex items-center space-x-1 shadow"
                  >
                    {actionLoading ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
                    <span>Save Config</span>
                  </button>
                </div>
              </form>
            )}

          </div>
        )}

      </main>
    </div>
  );
}
