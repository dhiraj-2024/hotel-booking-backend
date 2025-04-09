require('dotenv').config(); // Make sure this is at the very top
const mongoose = require('mongoose');
const Accommodation = require('./models/Accommodation');
const connectDB = require('./config/db'); // Import your existing db.js

const seedData = async () => {
  try {
    await connectDB(); // Use your existing connection function

    // Clear existing data
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
        'The Hostel Triple Rooms will have only 3 Beds but may be occupied by maximum 4 Persons (No Extra Bed will be provided)',
        'No Dinner on 28th April and 3rd May'
      ]
    });

    // Hotel data
    const hotel = new Accommodation({
      type: 'hotel',
      name: 'Hotel',
      image: 'hotel-image-url.jpg',
      description: 'AC rooms with good facilities.',
      priceOptions: [
        { nights: 4, persons: 2, price: 9600 },
        { nights: 4, persons: 3, price: 13200 },
        { nights: 5, persons: 2, price: 11500 },
        { nights: 5, persons: 3, price: 15300 }
      ],
      bookingLimit: 6,
      availableRooms: 40,
      notes: [
        'Per Room Full Board (Breakfast and Dinner at Hotel, Lunch at Competition Venue)',
        'Does not include Dinner on 28th Apr and 3rd May'
      ]
    });

    await hostel.save();
    await hotel.save();

    console.log('Database seeded successfully');
    mongoose.connection.close(); // Close the connection when done
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();