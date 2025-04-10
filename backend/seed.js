require('dotenv').config(); // Must be at the top
const mongoose = require('mongoose');
const Accommodation = require('./models/Accommodation');
const connectDB = require('./config/db');

const seedData = async () => {
  try {
    await connectDB(); // Connect to MongoDB

    // Clear existing accommodations
    await Accommodation.deleteMany();

    // Hostel data
    const hostel = new Accommodation({
      type: 'hostel',
      name: 'Hostel',
      image: 'hostel-image-url.jpg',
      description: 'Basic rooms with minimum facilities, non-AC, limited water supply',
      priceOptions: [
        { nights: 4, persons: 3, price: 7200 },
        { nights: 4, persons: 4, price: 9000 },
        { nights: 5, persons: 3, price: 8400 },
        { nights: 5, persons: 4, price: 10000 }
      ],
      bookingLimit: 6,
      availableRooms: 93,
      notes: [
        '🟢 Full Board Meals: Includes breakfast, lunch, and dinner(Lunch at Competition Venue)',
        '🔶 No Dinner on 28th April And 3rd May',
        '🔷 The Hostel Triple Rooms will have only 3 Beds but may be occupied by maximum 4 Persons (No Extra Bed will be provided)'
      ]
    });

    // Hotel data
    const hotel = new Accommodation({
      type: 'hotel',
      name: 'Hotel',
      image: 'hotel-image-url.jpg',
      description: 'AC rooms.',
      priceOptions: [
        { nights: 4, persons: 2, price: 9600 },
        { nights: 4, persons: 3, price: 13200 },
        { nights: 5, persons: 2, price: 11500 },
        { nights: 5, persons: 3, price: 15300 }
      ],
      bookingLimit: 6,
      availableRooms: 40,
      notes: [
        '🟢 Full Board Meals: Includes breakfast, lunch, and dinner(Lunch at Competition Venue)',
        '🔶 No Dinner on 28th April And 3rd May'
      ]
    });

    // Save both
    await hostel.save();
    await hotel.save();

    console.log('✅ Database seeded successfully');
    mongoose.connection.close(); // Close connection
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
