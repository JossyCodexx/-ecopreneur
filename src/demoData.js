export const INITIAL_SETTINGS = {
  name: "Eko Grandeur Hotel & Lounge",
  logoText: "EKO GRANDEUR",
  address: "Plot 1415, Adetokunbo Ademola Street, Victoria Island, Lagos, Nigeria",
  phone: "+234 812 345 6789",
  whatsapp: "+234 812 345 6789",
  email: "reservations@ekograndeur.com",
  facebook: "https://facebook.com/ekograndeur",
  instagram: "https://instagram.com/ekograndeur",
  twitter: "https://twitter.com/ekograndeur",
  checkInTime: "14:00",
  checkOutTime: "12:00",
  seoTitle: "Eko Grandeur Hotel & Lounge | Luxury Hotel in Victoria Island, Lagos",
  seoDescription: "Welcome to Eko Grandeur Hotel & Lounge. Experience premium luxury accommodation, continental and local Nigerian dining, and our premium exclusive lounge.",
  seoKeywords: "Hotel in Lagos, Luxury Hotel in Lagos, Hotel and Lounge in Lagos, Hotel Rooms in Lagos, Hotel Booking in Lagos, Best Hotel in Lagos"
};

export const INITIAL_ROOMS = [
  {
    id: "room-1",
    name: "Classic Standard Room",
    category: "Standard",
    price: 45000,
    maxGuests: 2,
    bedType: "Queen Size Bed",
    size: 28,
    description: "Our Classic Standard Room offers a harmonious blend of comfort and utility, ideal for solo travellers or couples. Featuring sophisticated decor and modern conveniences.",
    facilities: ["Comfortable bed", "Air conditioning", "Smart TV", "Wi-Fi", "Private bathroom", "Work desk"],
    images: [
      "https://images.unsplash.com/photo-1611891405788-d880227f7300?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=1200"
    ],
    availability: true
  },
  {
    id: "room-2",
    name: "Superior Standard Room",
    category: "Standard",
    price: 55000,
    maxGuests: 2,
    bedType: "Queen Size Bed",
    size: 32,
    description: "An elevated standard experience with premium lighting, elegant modern seating, and high-speed enterprise Wi-Fi. Perfect for a relaxing evening or productive business stay.",
    facilities: ["Comfortable bed", "Air conditioning", "Smart TV", "Wi-Fi", "Private bathroom", "Work desk", "Coffee Maker"],
    images: [
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=1200"
    ],
    availability: true
  },
  {
    id: "room-3",
    name: "Urban Deluxe Room",
    category: "Deluxe",
    price: 75000,
    maxGuests: 2,
    bedType: "King Size Bed",
    size: 40,
    description: "Step into pure relaxation. Our Urban Deluxe Room offers curated local art pieces, premium bedding, a fully stocked mini-refrigerator, and stunning views of the Victoria Island skyline.",
    facilities: ["King-size bed", "Air conditioning", "Smart TV", "Wi-Fi", "Mini refrigerator", "Premium bathroom", "City/pool view"],
    images: [
      "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=1200"
    ],
    availability: true
  },
  {
    id: "room-4",
    name: "Grand Deluxe Room",
    category: "Deluxe",
    price: 85000,
    maxGuests: 3,
    bedType: "King Size Bed",
    size: 45,
    description: "Perfect for guests seeking extra space and luxury. Comes with an extended lounge sofa, high-fidelity sound system, rain shower, and floor-to-ceiling windows showing the sunset over the lagoon.",
    facilities: ["King-size bed", "Air conditioning", "Smart TV", "Wi-Fi", "Mini refrigerator", "Premium bathroom", "City/pool view", "Sofa Bed"],
    images: [
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=1200"
    ],
    availability: true
  },
  {
    id: "room-5",
    name: "Executive Club Suite",
    category: "Executive Suite",
    price: 130000,
    maxGuests: 3,
    bedType: "King Size Bed + Sofa",
    size: 65,
    description: "Designed for business leaders and discerning travelers. This elite suite offers a separate stylish living room, dedicated workspace, dynamic audio bar, and VIP access to the premium lounge.",
    facilities: ["Large bedroom", "Separate living area", "King-size bed", "Premium bathroom", "Work area", "Mini bar", "Luxury amenities"],
    images: [
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=1200"
    ],
    availability: true
  },
  {
    id: "room-6",
    name: "Grand Executive Suite",
    category: "Executive Suite",
    price: 160000,
    maxGuests: 4,
    bedType: "King Size Bed + Twin Bed",
    size: 80,
    description: "Experience premium comfort. Features an exquisite dining corner, a master bedroom with double-vanity washbasins, standalone bathtub, and unparalleled panoramic views of Victoria Island.",
    facilities: ["Large bedroom", "Separate living area", "King-size bed", "Premium bathroom", "Work area", "Mini bar", "Luxury amenities", "Dining Area"],
    images: [
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=1200"
    ],
    availability: true
  },
  {
    id: "room-7",
    name: "Presidential Palace Suite",
    category: "Presidential Suite",
    price: 350000,
    maxGuests: 4,
    bedType: "Super King Size Bed",
    size: 140,
    description: "The ultimate standard of opulent luxury. This sprawling sanctuary features an elegant lounge, custom-built kitchen, high-security double doors, a gorgeous dining suite, and 24/7 dedicated butler service.",
    facilities: ["Premium luxury accommodation", "Large living room", "King-size bedroom", "Luxury bathroom", "Dining area", "Premium lounge", "VIP amenities", "24/7 Butler Service"],
    images: [
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1200"
    ],
    availability: true
  }
];

export const INITIAL_MENU = [
  // Breakfast
  {
    id: "menu-1",
    name: "Eko Royal English Breakfast",
    description: "Two farm eggs any style, premium sausages, crispy bacon, grilled tomatoes, baked beans, sautéed mushrooms, served with sourdough toast and fresh orange juice.",
    price: 12500,
    category: "Breakfast",
    image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "menu-2",
    name: "Gourmet Avocado Toast",
    description: "Freshly smashed Hass avocado on toasted artisan sourdough, topped with poached organic eggs, chili flakes, microgreens, and a drizzle of premium extra virgin olive oil.",
    price: 9500,
    category: "Breakfast",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=400"
  },
  // Local Cuisine
  {
    id: "menu-3",
    name: "Grandeur Jollof Rice Special",
    description: "Richly spiced Nigerian smoky Jollof rice, served with tender grilled quarter chicken, sweet fried plantains (Dodo), and a crisp side salad.",
    price: 14500,
    category: "Local Cuisine",
    image: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "menu-4",
    name: "Gbegiri & Ewedu with Amala",
    description: "Traditional soft Amala served with savory bean soup (Gbegiri), jute leaf soup (Ewedu), rich stew, and perfectly seasoned assorted beef or goat meat.",
    price: 16000,
    category: "Local Cuisine",
    image: "https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&q=80&w=400"
  },
  // Continental
  {
    id: "menu-5",
    name: "Ribeye Steak with Truffle Mash",
    description: "Prime grass-fed dry-aged 300g ribeye steak, seared with garlic herb butter, accompanied by creamy white truffle mashed potatoes and glazed asparagus.",
    price: 32000,
    category: "Continental",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "menu-6",
    name: "Creamy Seafood Tagliatelle",
    description: "Fresh handmade pasta tossed with pan-seared jumbo prawns, Atlantic scallops, calamari, garlic, and white wine cream reduction, garnished with freshly grated aged parmesan.",
    price: 24500,
    category: "Continental",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=400"
  },
  // Lunch
  {
    id: "menu-7",
    name: "The Grandeur Wagyu Burger",
    description: "Premium Wagyu beef patty, melted cheddar cheese, caramelized onions, house truffle aioli, toasted brioche bun, served with gold-dusted crispy hand-cut fries.",
    price: 18500,
    category: "Lunch",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400"
  },
  // Dinner
  {
    id: "menu-8",
    name: "Pan-Sealed Atlantic Salmon",
    description: "Sustainably sourced salmon fillet with crispy skin, resting on saffron risotto, finished with an elegant dill beurre blanc sauce and micro-shaved fennel.",
    price: 28000,
    category: "Dinner",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=400"
  },
  // Desserts
  {
    id: "menu-9",
    name: "Decadent Chocolate Lava Cake",
    description: "Rich dark chocolate cake with a molten liquid center, served with Madagascan vanilla bean gelato, fresh raspberries, and a dusting of cocoa.",
    price: 7500,
    category: "Desserts",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=400"
  },
  // Drinks
  {
    id: "menu-10",
    name: "Premium Champagne (Glass)",
    description: "Veuve Clicquot Brut, with notes of white fruits and raisins, followed by hints of brioche and vanilla.",
    price: 15000,
    category: "Drinks",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=400"
  },
  // Cocktails
  {
    id: "menu-11",
    name: "Eko Sunset Signature",
    description: "A premium tropical cocktail with premium dark rum, fresh passion fruit puree, lime juice, orange liqueur, and a hint of homemade spicy ginger syrup.",
    price: 8500,
    category: "Cocktails / Mocktails",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "menu-12",
    name: "Grandeur Virgin Mojito",
    description: "A refreshing mocktail with muddled fresh mint leaves, lime wedges, pure cane sugar, topped with club soda and a dash of sweet cucumber syrup.",
    price: 6000,
    category: "Cocktails / Mocktails",
    image: "https://images.unsplash.com/photo-1575444758702-4a6b9222336e?auto=format&fit=crop&q=80&w=400"
  }
];

export const INITIAL_OFFERS = [
  {
    id: "offer-1",
    name: "Weekend Sanctuary Package",
    description: "Escape the hustle with our Weekend Package. Includes 2 nights luxury accommodation in our Deluxe rooms, breakfast for two, and exclusive VIP entry to the Lounge.",
    price: 135000,
    validity: "Valid until Dec 31, 2026",
    terms: ["Applicable for Friday & Saturday check-ins", "Prior reservation required", "Includes welcome cocktail on arrival"],
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "offer-2",
    name: "Romantic Lagoon Getaway",
    description: "Create unforgettable memories with your partner. Includes accommodation in our Executive Suite, complimentary premium champagne, three-course dinner, and custom roses decor.",
    price: 210000,
    validity: "Valid all year round",
    terms: ["Requires 48h advance booking", "Decor customization options available", "Subject to suite availability"],
    image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "offer-3",
    name: "Corporate Executive Retreat",
    description: "Empower your business trip with premium luxury. Includes Deluxe Room, corporate high-speed Wi-Fi access, complimentary ironing services, and 2 hours of private Boardroom usage.",
    price: 85000,
    validity: "Valid weekdays only (Mon - Thu)",
    terms: ["Must present corporate identity", "Boardroom slots subject to schedule", "Check-out extendable to 15:00"],
    image: "https://images.unsplash.com/photo-1517502884422-41eaaced0168?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "offer-4",
    name: "Unwind & Splash Family Package",
    description: "The ultimate family getaway in Lagos. Enjoy 15% discount on our adjoining Grand Deluxe rooms, complimentary children's breakfast buffet, and unlimited access to our infinity pool.",
    price: 155000,
    validity: "Valid during school holidays",
    terms: ["Valid for up to 2 adults & 2 children under 12", "Pool safety rules apply", "Extra beds available on request"],
    image: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&q=80&w=600"
  }
];

export const INITIAL_EVENT_PACKAGES = [
  {
    id: "event-1",
    name: "Royal Wedding Celebration",
    capacity: 350,
    facilities: ["Banquet setup", "Premium state-of-the-art acoustics", "Dimmable chandeliers", "Bridal suite room included", "Gourmet catering options", "Professional event planners support"],
    pricing: "From ₦2,500,000",
    description: "Bring your dream wedding to life in our stunning grand ballroom. Elegant custom stage, VIP seating setups, and bespoke services tailored for your royal day.",
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "event-2",
    name: "Executive Leadership Seminar",
    capacity: 80,
    facilities: ["High-definition projection wall", "Interactive electronic podium", "Wireless microphone networks", "Business catering buffet", "High-speed enterprise network", "Dedicated technician"],
    pricing: "From ₦850,000",
    description: "Conduct high-impact corporate board meetings, premium product launches, international seminars, or executive roundtables in our fully integrated elite conference suites.",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "event-3",
    name: "Grandeur Private Lounge Gala",
    capacity: 120,
    facilities: ["Exclusive lounge takeover", "Dedicated mixologist bar", "Live jazz band setup", "Canapé catering", "Ambient mood lighting", "Secure private entrance"],
    pricing: "From ₦1,200,000",
    description: "Host luxury birthday galas, elegant corporate cocktail mixers, high-fashion private parties, or premium dinner events in our state-of-the-art exclusive lounge setting.",
    image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=800"
  }
];

export const INITIAL_TESTIMONIALS = [
  {
    id: "review-1",
    name: "Dr. Olumide Adeleke",
    rating: 5,
    comment: "Absolutely outstanding experience! The Executive Suite is world-class, but the real star is the customer service. The staff anticipates your every need. The smoky Jollof at the restaurant was the best I've tasted in Lagos.",
    date: "2026-08-15",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150"
  },
  {
    id: "review-2",
    name: "Sarah Jenkins",
    rating: 5,
    comment: "Eko Grandeur is a true luxury sanctuary in the middle of Lagos. The bed in the Deluxe room was like sleeping on a cloud. The VIP Lounge area is incredibly elegant and peaceful for business conversations.",
    date: "2026-08-20",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
  },
  {
    id: "review-3",
    name: "Chief Emeka Okafor",
    rating: 5,
    comment: "We hosted our corporate leadership seminar here and the organization was flawless. High-speed internet, premium projector screens, and top-tier buffet dining. Recommended without reservation.",
    date: "2026-08-25",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150"
  },
  {
    id: "review-4",
    name: "Amina Yusuf",
    rating: 5,
    comment: "The Presidential Suite is breathtaking! The attention to detail is spectacular. The pool deck is gorgeous in the evenings, with the lights from the city reflecting beautifully. A masterclass in hospitality.",
    date: "2026-08-27",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
  },
  {
    id: "review-5",
    name: "Michael Thompson",
    rating: 4,
    comment: "Beautiful hotel, excellent facilities, and wonderful drinks! The cocktails at the lounge are absolutely delicious. A great spot to unwind after a long week of meetings in Lagos.",
    date: "2026-08-28",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150"
  },
  {
    id: "review-6",
    name: "Chioma Nnaji",
    rating: 5,
    comment: "I used the Weekend Package for my birthday getaway and it was exceptional. They surprised me with a gorgeous complimentary red-velvet cake and a handwritten card! I will definitely be back.",
    date: "2026-08-29",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150"
  }
];

export const INITIAL_GALLERY = [
  { id: "g-1", category: "Exterior", image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1000", title: "Palatial Hotel Exterior" },
  { id: "g-2", category: "Exterior", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1000", title: "Main Lobby Entrance" },
  { id: "g-3", category: "Rooms", image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=1000", title: "Presidential Bedroom Suite" },
  { id: "g-4", category: "Rooms", image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=1000", title: "Deluxe Twin Room" },
  { id: "g-5", category: "Lounge", image: "https://images.unsplash.com/photo-1517502884422-41eaaced0168?auto=format&fit=crop&q=80&w=1000", title: "Elite Executive Lounge" },
  { id: "g-6", category: "Lounge", image: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&q=80&w=1000", title: "Exclusive Cocktail VIP Lounge" },
  { id: "g-7", category: "Restaurant", image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=1000", title: "The Grandeur Main Restaurant" },
  { id: "g-8", category: "Restaurant", image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=1000", title: "Gourmet Ribeye Dinner Plate" },
  { id: "g-9", category: "Facilities", image: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&q=80&w=1000", title: "Lagoon View Infinity Pool" },
  { id: "g-10", category: "Facilities", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1000", title: "Elite Fitness Center & Gym" },
  { id: "g-11", category: "Events", image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1000", title: "Palace Wedding Ballroom" },
  { id: "g-12", category: "Events", image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1000", title: "Corporate Seminar Theatre" }
];

export const INITIAL_FACILITIES = [
  { name: "Swimming Pool", desc: "Elegant lagoon-view infinity pool with custom lounging decks.", icon: "Waves" },
  { name: "Gym", desc: "Top-tier cardio machines, heavy-duty weights, and expert personal trainers.", icon: "Dumbbell" },
  { name: "Restaurant", desc: "Five-star continental delicacies and traditional local favorites.", icon: "Utensils" },
  { name: "Lounge", desc: "Opulent exclusive seating area with nightly live music acts.", icon: "Music" },
  { name: "Bar", desc: "Artisanal signature cocktails crafted by world-class mixologists.", icon: "GlassWater" },
  { name: "Wi-Fi", desc: "Symmetrical fiber optic connection with 100% hotel-wide coverage.", icon: "Wifi" },
  { name: "Spa", desc: "Indulgent thermal massages, clarifying facials, and detoxifying steam rooms.", icon: "Flower" },
  { name: "Conference Room", desc: "Fully high-tech multimedia boardrooms for leadership meets.", icon: "Users" }
];
