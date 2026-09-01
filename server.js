import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { INITIAL_ROOMS, INITIAL_MENU, INITIAL_OFFERS, INITIAL_TESTIMONIALS, INITIAL_GALLERY, INITIAL_SETTINGS } from './src/demoData.js';

// Setup File-Based Database for absolute persistence
const DB_FILE = path.join(process.cwd(), 'database-persistence.json');

function loadDatabase() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const data = JSON.parse(raw);
      // Ensure all arrays are initialized
      return {
        settings: data.settings || INITIAL_SETTINGS,
        rooms: data.rooms || INITIAL_ROOMS,
        bookings: data.bookings || [],
        reservations: data.reservations || [],
        menu: data.menu || INITIAL_MENU,
        offers: data.offers || INITIAL_OFFERS,
        gallery: data.gallery || INITIAL_GALLERY,
        testimonials: data.testimonials || INITIAL_TESTIMONIALS,
        contactMessages: data.contactMessages || [],
        eventInquiries: data.eventInquiries || []
      };
    }
  } catch (err) {
    console.error("Error reading database file, using demo data instead:", err);
  }

  // Save the initial database
  const initData = {
    settings: INITIAL_SETTINGS,
    rooms: INITIAL_ROOMS,
    bookings: [],
    reservations: [],
    menu: INITIAL_MENU,
    offers: INITIAL_OFFERS,
    gallery: INITIAL_GALLERY,
    testimonials: INITIAL_TESTIMONIALS,
    contactMessages: [],
    eventInquiries: []
  };
  saveDatabase(initData);
  return initData;
}

function saveDatabase(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error("Error writing database file:", err);
  }
}

// Initialize db cache
let db = loadDatabase();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Helper for unique IDs and reference numbers
  const generateRef = () => {
    const num = Math.floor(10000 + Math.random() * 90000);
    return `HTL-2026-${num}`;
  };

  // --- API ROUTES ---

  // Settings
  app.get('/api/settings', (req, res) => {
    res.json(db.settings);
  });

  app.post('/api/settings', (req, res) => {
    db.settings = { ...db.settings, ...req.body };
    saveDatabase(db);
    res.json({ success: true, settings: db.settings });
  });

  // Rooms
  app.get('/api/rooms', (req, res) => {
    res.json(db.rooms);
  });

  app.get('/api/rooms/:id', (req, res) => {
    const room = db.rooms.find(r => r.id === req.params.id);
    if (!room) {
      res.status(404).json({ error: "Room not found" });
      return;
    }
    res.json(room);
  });

  app.post('/api/rooms', (req, res) => {
    const newRoom = {
      id: `room-${Date.now()}`,
      ...req.body,
      availability: req.body.availability !== undefined ? req.body.availability : true
    };
    db.rooms.push(newRoom);
    saveDatabase(db);
    res.status(201).json(newRoom);
  });

  app.put('/api/rooms/:id', (req, res) => {
    const index = db.rooms.findIndex(r => r.id === req.params.id);
    if (index === -1) {
      res.status(404).json({ error: "Room not found" });
      return;
    }
    db.rooms[index] = { ...db.rooms[index], ...req.body };
    saveDatabase(db);
    res.json(db.rooms[index]);
  });

  app.delete('/api/rooms/:id', (req, res) => {
    const initialLen = db.rooms.length;
    db.rooms = db.rooms.filter(r => r.id !== req.params.id);
    if (db.rooms.length === initialLen) {
      res.status(404).json({ error: "Room not found" });
      return;
    }
    saveDatabase(db);
    res.json({ success: true, id: req.params.id });
  });

  // Bookings - Check Overlap & Manage
  app.get('/api/bookings', (req, res) => {
    res.json(db.bookings);
  });

  app.post('/api/bookings/check-availability', (req, res) => {
    const { roomId, checkIn, checkOut } = req.body;
    if (!roomId || !checkIn || !checkOut) {
      res.status(400).json({ error: "Missing required parameters" });
      return;
    }

    const start = new Date(checkIn);
    const end = new Date(checkOut);
    if (start >= end) {
      res.status(400).json({ error: "Check-out date must be after Check-in date" });
      return;
    }

    // Overlap validation: any booking on the same room that overlaps and is active
    const overlaps = db.bookings.filter(b => {
      if (b.roomId !== roomId) return false;
      if (b.status === 'Cancelled') return false;
      // Overlap: checkIn < existingCheckOut AND checkOut > existingCheckIn
      return checkIn < b.checkOut && checkOut > b.checkIn;
    });

    res.json({ available: overlaps.length === 0, overlapsCount: overlaps.length });
  });

  app.post('/api/bookings', (req, res) => {
    const { roomId, checkIn, checkOut, guests, customerName, customerPhone, customerEmail, customerCountry, specialRequests, totalPrice } = req.body;

    // Server-side check overlap before making booking
    const overlaps = db.bookings.filter(b => {
      if (b.roomId !== roomId) return false;
      if (b.status === 'Cancelled') return false;
      return checkIn < b.checkOut && checkOut > b.checkIn;
    });

    if (overlaps.length > 0) {
      res.status(400).json({ error: "This room is already booked for the selected dates." });
      return;
    }

    const newBooking = {
      id: `booking-${Date.now()}`,
      referenceNumber: generateRef(),
      roomId,
      checkIn,
      checkOut,
      guests: Number(guests),
      customerName,
      customerPhone,
      customerEmail,
      customerCountry,
      specialRequests: specialRequests || "",
      totalPrice: Number(totalPrice),
      status: 'Pending', // Pending -> Payment -> Confirmed
      paymentStatus: 'Pending',
      createdAt: new Date().toISOString()
    };

    db.bookings.push(newBooking);
    saveDatabase(db);
    res.status(201).json(newBooking);
  });

  app.put('/api/bookings/:id', (req, res) => {
    const index = db.bookings.findIndex(b => b.id === req.params.id);
    if (index === -1) {
      res.status(404).json({ error: "Booking not found" });
      return;
    }
    db.bookings[index] = { ...db.bookings[index], ...req.body };
    saveDatabase(db);
    res.json(db.bookings[index]);
  });

  // Lounge Reservations
  app.get('/api/lounge-reservations', (req, res) => {
    res.json(db.reservations);
  });

  app.post('/api/lounge-reservations', (req, res) => {
    const { name, phone, email, date, time, guests, seatingPreference, specialRequest } = req.body;
    
    if (!name || !phone || !email || !date || !time || !guests) {
      res.status(400).json({ error: "Missing required booking details" });
      return;
    }

    const newReservation = {
      id: `lounge-${Date.now()}`,
      name,
      phone,
      email,
      date,
      time,
      guests: Number(guests),
      seatingPreference: seatingPreference || 'Standard Lounge',
      specialRequest: specialRequest || '',
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    db.reservations.push(newReservation);
    saveDatabase(db);
    res.status(201).json(newReservation);
  });

  app.put('/api/lounge-reservations/:id', (req, res) => {
    const index = db.reservations.findIndex(r => r.id === req.params.id);
    if (index === -1) {
      res.status(404).json({ error: "Reservation not found" });
      return;
    }
    db.reservations[index] = { ...db.reservations[index], ...req.body };
    saveDatabase(db);
    res.json(db.reservations[index]);
  });

  // Menu Items
  app.get('/api/menu', (req, res) => {
    res.json(db.menu);
  });

  app.post('/api/menu', (req, res) => {
    const newItem = {
      id: `menu-${Date.now()}`,
      ...req.body
    };
    db.menu.push(newItem);
    saveDatabase(db);
    res.status(201).json(newItem);
  });

  app.put('/api/menu/:id', (req, res) => {
    const index = db.menu.findIndex(m => m.id === req.params.id);
    if (index === -1) {
      res.status(404).json({ error: "Menu item not found" });
      return;
    }
    db.menu[index] = { ...db.menu[index], ...req.body };
    saveDatabase(db);
    res.json(db.menu[index]);
  });

  app.delete('/api/menu/:id', (req, res) => {
    const initialLen = db.menu.length;
    db.menu = db.menu.filter(m => m.id !== req.params.id);
    if (db.menu.length === initialLen) {
      res.status(404).json({ error: "Menu item not found" });
      return;
    }
    saveDatabase(db);
    res.json({ success: true, id: req.params.id });
  });

  // Offers
  app.get('/api/offers', (req, res) => {
    res.json(db.offers);
  });

  app.post('/api/offers', (req, res) => {
    const newOffer = {
      id: `offer-${Date.now()}`,
      ...req.body
    };
    db.offers.push(newOffer);
    saveDatabase(db);
    res.status(201).json(newOffer);
  });

  app.put('/api/offers/:id', (req, res) => {
    const index = db.offers.findIndex(o => o.id === req.params.id);
    if (index === -1) {
      res.status(404).json({ error: "Offer not found" });
      return;
    }
    db.offers[index] = { ...db.offers[index], ...req.body };
    saveDatabase(db);
    res.json(db.offers[index]);
  });

  app.delete('/api/offers/:id', (req, res) => {
    const initialLen = db.offers.length;
    db.offers = db.offers.filter(o => o.id !== req.params.id);
    if (db.offers.length === initialLen) {
      res.status(404).json({ error: "Offer not found" });
      return;
    }
    saveDatabase(db);
    res.json({ success: true, id: req.params.id });
  });

  // Gallery
  app.get('/api/gallery', (req, res) => {
    res.json(db.gallery);
  });

  app.post('/api/gallery', (req, res) => {
    const newImage = {
      id: `gallery-${Date.now()}`,
      ...req.body
    };
    db.gallery.push(newImage);
    saveDatabase(db);
    res.status(201).json(newImage);
  });

  app.delete('/api/gallery/:id', (req, res) => {
    const initialLen = db.gallery.length;
    db.gallery = db.gallery.filter(g => g.id !== req.params.id);
    if (db.gallery.length === initialLen) {
      res.status(404).json({ error: "Gallery item not found" });
      return;
    }
    saveDatabase(db);
    res.json({ success: true, id: req.params.id });
  });

  // Reviews
  app.get('/api/reviews', (req, res) => {
    res.json(db.testimonials);
  });

  app.post('/api/reviews', (req, res) => {
    const newReview = {
      id: `review-${Date.now()}`,
      avatar: req.body.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150",
      date: new Date().toISOString().split('T')[0],
      ...req.body
    };
    db.testimonials.unshift(newReview);
    saveDatabase(db);
    res.status(201).json(newReview);
  });

  // Contacts
  app.get('/api/contact', (req, res) => {
    res.json(db.contactMessages);
  });

  app.post('/api/contact', (req, res) => {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !message) {
      res.status(400).json({ error: "Name, email, and message are required" });
      return;
    }
    const newMessage = {
      id: `msg-${Date.now()}`,
      name,
      email,
      phone: phone || '',
      subject: subject || 'General Inquiry',
      message,
      createdAt: new Date().toISOString()
    };
    db.contactMessages.unshift(newMessage);
    saveDatabase(db);
    res.status(201).json(newMessage);
  });

  // Event Inquiries
  app.get('/api/event-inquiries', (req, res) => {
    res.json(db.eventInquiries);
  });

  app.post('/api/event-inquiries', (req, res) => {
    const { name, email, phone, eventType, guests, date, packageId, message } = req.body;
    if (!name || !email || !eventType || !date || !guests) {
      res.status(400).json({ error: "Missing required inquiry fields" });
      return;
    }
    const newInquiry = {
      id: `inq-${Date.now()}`,
      name,
      email,
      phone: phone || '',
      eventType,
      guests: Number(guests),
      date,
      packageId,
      message: message || '',
      createdAt: new Date().toISOString()
    };
    db.eventInquiries.unshift(newInquiry);
    saveDatabase(db);
    res.status(201).json(newInquiry);
  });

  // Admin Login
  app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    // Simple secure credentials
    if (username === 'admin' && password === 'admin123') {
      res.json({ success: true, token: "eko-grandeur-auth-token-2026" });
    } else {
      res.status(401).json({ error: "Invalid admin username or password" });
    }
  });

  // --- DEV & PRODUCTION VITE MIDDLEWARE ---

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Eko Grandeur Hotel & Lounge server running on http://localhost:${PORT}`);
  });
}

startServer();
