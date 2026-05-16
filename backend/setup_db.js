require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Flower = require('./models/Flower');
const User = require('./models/User');
const Bouquet = require('./models/Bouquet');

async function setup() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bouquet-scanner');
  console.log('Connected to MongoDB');

  // Seed Flowers
  const defaults = [
    { name: 'Rose', price: 50, inventory: 100 },
    { name: 'Lily', price: 40, inventory: 50 },
    { name: 'Tulip', price: 30, inventory: 200 },
    { name: 'Sunflower', price: 60, inventory: 40 },
    { name: 'Daisy', price: 20, inventory: 300 },
    { name: 'Carnation', price: 30, inventory: 150 },
    { name: 'Peony', price: 70, inventory: 30 },
    { name: 'Orchid', price: 100, inventory: 20 },
    { name: 'Hydrangea', price: 80, inventory: 25 },
    { name: 'Chrysanthemum', price: 35, inventory: 100 }
  ];

  for (const f of defaults) {
    await Flower.findOneAndUpdate({ name: f.name }, f, { upsert: true, new: true });
  }
  console.log('Seeded Flowers!');

  // Create Admin User
  let admin = await User.findOne({ email: 'admin@bouquet.com' });
  if (!admin) {
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('admin123', salt);
    admin = new User({
      name: 'Admin User',
      email: 'admin@bouquet.com',
      password,
      role: 'admin'
    });
    await admin.save();
    console.log('Created Admin User (admin@bouquet.com / admin123)');
  } else {
    admin.role = 'admin';
    await admin.save();
    console.log('Admin user already exists.');
  }

  // Create Standard User
  let standard = await User.findOne({ email: 'user@bouquet.com' });
  if (!standard) {
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('user123', salt);
    standard = new User({
      name: 'Standard User',
      email: 'user@bouquet.com',
      password,
      role: 'user'
    });
    await standard.save();
    console.log('Created Standard User (user@bouquet.com / user123)');
  }

  // Create Sample Bouquets
  const bouquetCount = await Bouquet.countDocuments();
  if (bouquetCount === 0) {
    const adminUser = await User.findOne({ role: 'admin' });
    const standardUser = await User.findOne({ email: 'user@bouquet.com' });
    
    if (adminUser && standardUser) {
      const samples = [
        {
          userId: adminUser._id,
          flowers: [{ name: 'Rose', quantity: 12, pricePerUnit: 50 }, { name: 'Lily', quantity: 5, pricePerUnit: 40 }],
          totalPrice: 800,
          isPublic: true
        },
        {
          userId: standardUser._id,
          flowers: [{ name: 'Sunflower', quantity: 3, pricePerUnit: 60 }, { name: 'Daisy', quantity: 10, pricePerUnit: 20 }],
          totalPrice: 380,
          isPublic: true
        },
        {
          userId: standardUser._id,
          flowers: [{ name: 'Tulip', quantity: 15, pricePerUnit: 30 }],
          totalPrice: 450,
          isPublic: true
        }
      ];
      await Bouquet.insertMany(samples);
      console.log('Seeded Sample Bouquets!');
    }
  }

  console.log('Database Setup Complete!');
  process.exit(0);
}

setup();
