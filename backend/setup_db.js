require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Flower = require('./models/Flower');
const User = require('./models/User');

async function setup() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bouquet-scanner');
  console.log('Connected to MongoDB');

  // Seed Flowers
  const defaults = [
    { name: 'Rose', price: 5, inventory: 100 },
    { name: 'Lily', price: 4, inventory: 50 },
    { name: 'Tulip', price: 3, inventory: 200 },
    { name: 'Sunflower', price: 6, inventory: 40 },
    { name: 'Daisy', price: 2, inventory: 300 },
    { name: 'Carnation', price: 3, inventory: 150 },
    { name: 'Peony', price: 7, inventory: 30 },
    { name: 'Orchid', price: 10, inventory: 20 },
    { name: 'Hydrangea', price: 8, inventory: 25 },
    { name: 'Chrysanthemum', price: 3.5, inventory: 100 }
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

  console.log('Database Setup Complete!');
  process.exit(0);
}

setup();
