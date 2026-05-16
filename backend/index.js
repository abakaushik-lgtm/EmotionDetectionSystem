require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const vision = require('@google-cloud/vision');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Flower = require('./models/Flower');
const Bouquet = require('./models/Bouquet');
const User = require('./models/User');
const Crowdsource = require('./models/Crowdsource');
const Order = require('./models/Order');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_123');
const auth = require('./middleware/auth');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_actual_key_here' ? process.env.GEMINI_API_KEY : "MOCK_KEY");

const app = express();
app.use(cors());
app.use(express.json());

let client = null;
if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  try {
    client = new vision.ImageAnnotatorClient();
  } catch (err) {
    console.warn("Could not initialize Vision client:", err.message);
  }
}

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bouquet-scanner')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const upload = multer({ storage: multer.memoryStorage() });
const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

// ========================
// Auth Routes
// ========================

app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    user = new User({ name, email, password });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    const payload = { user: { id: user.id, role: user.role } };
    jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const payload = { user: { id: user._id, role: user.role } };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/admin-login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });
    
    // Strict admin check
    if (user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access Denied: You are not an administrator.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const payload = { user: { id: user._id, role: user.role } };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/auth/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ========================
// Scanner / Bouquet Routes
// ========================

app.get('/flowers', async (req, res) => {
  try {
    const flowers = await Flower.find();
    res.json(flowers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/scan-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image uploaded' });

    let freshnessScore = 95;
    let quality = 'Fresh';
    let colorPalette = ['#FF0000', '#228B22', '#FFFFFF'];
    let detectedNames = [];
    let suggestions = [];

    const isMockKey = !process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_actual_key_here' || process.env.GEMINI_API_KEY === 'MOCK_KEY';
    
    if (!isMockKey) {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `Analyze this floral bouquet image. Return ONLY a JSON object with the following keys:
        - "detectedNames": (array of strings, specific flower names like "rose", "tulip", etc.)
        - "freshnessScore": (number 0-100 based on petal turgidity and color vibrancy)
        - "quality": (string: "Premium", "Fresh", "Standard", or "Wilting")
        - "colors": (array of 3 dominant hex colors)`;
        
        const imagePart = {
          inlineData: {
            data: req.file.buffer.toString('base64'),
            mimeType: req.file.mimetype
          }
        };

        const result = await model.generateContent([prompt, imagePart]);
        const text = result.response.text().replace(/```json|```/g, '').trim();
        const aiData = JSON.parse(text);
        
        detectedNames = (aiData.detectedNames || []).map(n => n.toLowerCase());
        freshnessScore = aiData.freshnessScore;
        quality = aiData.quality;
        colorPalette = aiData.colors;
      } catch (aiErr) {
        console.error("Gemini Vision Error:", aiErr);
        detectedNames = ['rose', 'flower', 'petal'];
      }
    } else if (client) {
      try {
        const [result] = await client.labelDetection(req.file.buffer);
        const labels = result.labelAnnotations || [];
        detectedNames = labels.map(l => l.description.toLowerCase());
        suggestions = labels.slice(0, 10).map(l => l.description);
      } catch (visionErr) {
        console.warn("Vision API Error:", visionErr.message);
        detectedNames = ['rose', 'lily', 'tulip', 'flower', 'plant', 'petal'];
        suggestions = ['Rose', 'Lily', 'Tulip', 'Flower', 'Plant', 'Petal'];
      }
    } else {
      console.warn("No AI Credentials found. Using enhanced mock AI response.");
      const allFlowers = await Flower.find();
      
      // Try to "detect" based on filename if possible (useful for user testing)
      const fileName = req.file.originalname?.toLowerCase() || "";
      let matchedMock = allFlowers.filter(f => fileName.includes(f.name.toLowerCase()));
      
      if (matchedMock.length > 0) {
        detectedNames = matchedMock.map(f => f.name.toLowerCase());
      } else {
        // Fallback to random if no filename match
        const shuffled = [...allFlowers].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, Math.floor(Math.random() * 2) + 1);
        detectedNames = selected.map(f => f.name.toLowerCase());
      }
      
      suggestions = allFlowers.map(f => f.name).slice(0, 8);
    }
    
    const knownFlowers = await Flower.find();
    const matchedFlowers = [];
    
    knownFlowers.forEach(kf => {
      if (detectedNames.some(dn => dn.includes(kf.name.toLowerCase()))) {
         matchedFlowers.push({ name: kf.name, pricePerUnit: kf.price, quantity: 1 });
      }
    });

    res.json({ 
      matchedFlowers, 
      suggestions, 
      freshnessScore, 
      quality, 
      colorPalette 
    });
  } catch (err) {
    console.error('Scan Error:', err);
    res.status(500).json({ error: 'Error scanning image' });
  }
});

// Protected: Save Bouquet
app.post('/save-bouquet', auth, async (req, res) => {
  try {
    const { flowers, totalPrice } = req.body;
    const bouquet = new Bouquet({
      userId: req.user.id,
      flowers,
      totalPrice
    });
    await bouquet.save();
    res.json({ success: true, bouquet });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Protected: Get My Bouquets
app.get('/my-bouquets', auth, async (req, res) => {
  try {
    const bouquets = await Bouquet.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(bouquets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Public: Gallery
app.get('/api/gallery', async (req, res) => {
  try {
    const bouquets = await Bouquet.find({ isPublic: true })
      .populate('userId', 'name')
      .sort({ createdAt: -1 })
      .limit(30);
    res.json(bouquets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Public: Leaderboard
app.get('/api/leaderboard', async (req, res) => {
  try {
    const bouquets = await Bouquet.find({ isPublic: true })
      .populate('userId', 'name')
      .sort({ totalPrice: -1 })
      .limit(15);
    res.json(bouquets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========================
// E-commerce Routes
// ========================

app.get('/api/inventory', async (req, res) => {
  try {
    const flowers = await Flower.find();
    res.json(flowers.map(f => ({ name: f.name, inventory: f.inventory })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/checkout', auth, async (req, res) => {
  try {
    const { bouquetId, flowers, deliveryOption, deliveryAddress } = req.body;
    
    let calculatedPrice = 0;
    for (let item of flowers) {
      const f = await Flower.findOne({ name: item.name });
      if (!f || f.inventory < item.quantity) {
        return res.status(400).json({ error: `Not enough inventory for ${item.name}` });
      }
      calculatedPrice += f.price * item.quantity;
    }

    const deliveryFee = deliveryOption === 'express' ? 150 : 50;
    calculatedPrice += deliveryFee;

    const order = new Order({
      userId: req.user.id,
      bouquetId,
      flowers,
      totalPrice: calculatedPrice,
      deliveryOption,
      deliveryAddress,
      status: 'pending'
    });
    
    await order.save();
    console.log(`Order created: ${order._id} for user ${req.user.id}`);

    if (process.env.STRIPE_SECRET_KEY) {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'inr',
            product_data: { name: 'Custom Bouquet' },
            unit_amount: Math.round(calculatedPrice * 100),
          },
          quantity: 1,
        }],
        mode: 'payment',
        success_url: `http://localhost:5173/success?orderId=${order._id}`,
        cancel_url: `http://localhost:5173/gallery`,
      });
      order.stripeSessionId = session.id;
      await order.save();
      res.json({ url: session.url });
    } else {
      // Mock payment URL for local MVP without actual Stripe keys
      res.json({ url: `/success?orderId=${order._id}&mock=true` });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/checkout/success', auth, async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
       return res.status(400).json({ error: 'Invalid Order ID' });
    }
    const order = await Order.findOne({ _id: orderId, userId: req.user.id });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    
    if (order.status !== 'paid') {
      order.status = 'paid';
      await order.save();
      
      // Decrement inventory
      for (let item of order.flowers) {
        await Flower.findOneAndUpdate(
          { name: item.name },
          { $inc: { inventory: -item.quantity } }
        );
      }
    }
    
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========================
// Crowdsourcing / Admin Routes
// ========================

const adminAuth = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ msg: 'Admin access denied' });
    }
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

app.post('/api/crowdsource', auth, upload.single('image'), async (req, res) => {
  try {
    const { name, proposedPrice } = req.body;
    const entry = new Crowdsource({
      userId: req.user.id,
      name,
      proposedPrice,
      imageBuffer: req.file ? req.file.buffer : null
    });
    await entry.save();
    res.json({ success: true, entry });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/chat', async (req, res) => {
  const { message, context } = req.body;
  try {
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MOCK_KEY' && !process.env.GEMINI_API_KEY.includes('your_actual_key')) {
       const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
       const flowerContext = context && context.length > 0 
          ? `The user is currently looking at a bouquet containing: ${context.map(f => `${f.quantity}x ${f.name}`).join(', ')}.`
          : "The user hasn't scanned a bouquet yet.";

       const prompt = `You are "Flora", a high-end, world-class professional AI Floral Stylist for the BouquetScanner platform.
       ${flowerContext}
       
       Context: "${message}". 
       
       Instructions:
       1. Be sophisticated, warm, and highly knowledgeable about floral design, color theory, and flower symbolism.
       2. Give specific, professional advice. For weddings, suggest "Boho" or "Classic" styles. For birthdays, suggest vibrant pairings.
       3. Mention flower care (water, light, temperature) if relevant.
       4. If the user asks about the scan, use the context provided: ${flowerContext}.
       5. Keep responses concise and elegant (max 3-4 sentences).
       6. NEVER mention you are an AI or LLM. You are FLORA, the stylist.`;
       
       const result = await model.generateContent(prompt);
       res.json({ reply: result.response.text() });
    } else {
       // Mock response if no API key
       setTimeout(() => {
         res.json({ reply: "I'm your AI Floral Stylist! (Demo Mode). That's a lovely mix. I'd suggest adding some Baby's Breath to give it a softer, more romantic feel. What's the special occasion?" });
       }, 800);
    }
  } catch (err) {
    console.error("Chat Error:", err);
    res.status(500).json({ error: "Failed to connect to AI Stylist." });
  }
});

app.post('/api/care-guide', async (req, res) => {
  const { flowers } = req.body;
  try {
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MOCK_KEY' && !process.env.GEMINI_API_KEY.includes('your_actual_key')) {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const flowerList = flowers.map(f => f.name).join(', ');
      
      const prompt = `Provide a professional, concise flower care guide for a bouquet containing: ${flowerList}.
      Include:
      1. Watering instructions.
      2. Sunlight and temperature needs.
      3. A "Stylist Tip" for longevity.
      Return the response in a clean, bulleted format suitable for a premium app.`;
      
      const result = await model.generateContent(prompt);
      res.json({ guide: result.response.text() });
    } else {
      res.json({ guide: "• Keep the water fresh and change it every 2 days.\n• Trim stems at a 45-degree angle.\n• Keep away from direct sunlight and ripening fruit.\n• **Stylist Tip:** Add a tiny drop of bleach to the water to keep bacteria at bay!" });
    }
  } catch (err) {
    console.error("Care Guide Error:", err);
    res.status(500).json({ error: "Failed to generate care guide." });
  }
});

app.post('/api/flower-language', async (req, res) => {
  const { flowers, occasion } = req.body;
  try {
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_actual_key_here' && process.env.GEMINI_API_KEY !== 'MOCK_KEY') {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const flowerList = flowers.map(f => f.name).join(', ');
      
      const prompt = `You are an expert in Floriography (the language of flowers). 
      Analyze this bouquet: ${flowerList}.
      ${occasion ? `The occasion is: ${occasion}.` : ""}
      
      Provide:
      1. The symbolic meaning of each flower.
      2. The overall emotional message this bouquet conveys.
      3. A "Sentiment Score" (0-100) for how well it fits the occasion.
      Keep the tone elegant, poetic, and professional. Return in a clean format.`;
      
      const result = await model.generateContent(prompt);
      res.json({ analysis: result.response.text() });
    } else {
      // Enhanced Mock for Flower Language
      const meanings = {
        'Rose': 'Love and passion',
        'Lily': 'Purity and rebirth',
        'Tulip': 'Perfect love',
        'Sunflower': 'Adoration and loyalty',
        'Daisy': 'Innocence and new beginnings'
      };
      const analysis = flowers.map(f => `• **${f.name}**: ${meanings[f.name] || 'Symbolizes beauty and nature'}`).join('\n');
      res.json({ analysis: `### The Language of Your Bouquet\n\n${analysis}\n\n**Overall Message:** This arrangement speaks of deep appreciation and refined elegance. It is perfect for expressing heartfelt emotions.` });
    }
  } catch (err) {
    console.error("Flower Language Error:", err);
    res.status(500).json({ error: "Failed to analyze flower language." });
  }
});

app.get('/api/floral-dna', auth, async (req, res) => {
  try {
    const bouquets = await Bouquet.find({ userId: req.user.id });
    const orders = await Order.find({ userId: req.user.id });
    
    if (bouquets.length === 0 && orders.length === 0) {
      return res.json({ 
        dna: "Your Floral DNA is still forming! Scan or order more bouquets to reveal your style.",
        persona: "The Budding Enthusiast",
        stats: { colors: [], flowers: [] }
      });
    }

    // Aggregate data for AI
    const flowerCounts = {};
    const colors = [];
    bouquets.forEach(b => {
      b.flowers.forEach(f => {
        flowerCounts[f.name] = (flowerCounts[f.name] || 0) + f.quantity;
      });
    });

    const topFlowers = Object.keys(flowerCounts).sort((a,b) => flowerCounts[b] - flowerCounts[a]).slice(0, 5);
    
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_actual_key_here' && process.env.GEMINI_API_KEY !== 'MOCK_KEY') {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `Based on a user's flower preferences: ${topFlowers.join(', ')}.
      Create a "Floral DNA Profile" for them.
      Include:
      1. A "Floral Persona" name (e.g., "The Avant-Garde Romantic", "The Sun-Drenched Minimalist").
      2. A 2-sentence description of their style.
      3. A recommended weekly subscription bouquet theme.
      Return as a clean JSON-like summary.`;
      
      const result = await model.generateContent(prompt);
      res.json({ 
        dna: result.response.text(),
        persona: topFlowers.includes('Rose') ? 'The Classic Romantic' : 'The Modern Stylist',
        stats: { topFlowers }
      });
    } else {
      // Mock DNA
      res.json({
        dna: `Based on your love for ${topFlowers.join(' and ')}, you appreciate refined structures and vibrant textures. Your subscription would focus on seasonally curated stems that highlight these favorites.`,
        persona: topFlowers.includes('Rose') ? 'The Timeless Romantic' : 'The Contemporary Curator',
        stats: { topFlowers }
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/budget-optimize', async (req, res) => {
  const { flowers, targetBudget } = req.body;
  try {
    const allFlowers = await Flower.find({});
    
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_actual_key_here' && process.env.GEMINI_API_KEY !== 'MOCK_KEY') {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const currentTotal = flowers.reduce((acc, f) => acc + (f.pricePerUnit * f.quantity), 0);
      
      const prompt = `Current Bouquet: ${flowers.map(f => `${f.quantity}x ${f.name} (@₹${f.pricePerUnit})`).join(', ')}.
      Total Price: ₹${currentTotal}.
      Target Budget: ₹${targetBudget}.
      Available Flower Catalog: ${allFlowers.map(f => `${f.name} (₹${f.price})`).join(', ')}.
      
      Provide a "Budget Optimization Plan":
      1. Suggest which flowers to remove or reduce in quantity.
      2. Suggest cheaper "Swap Alternatives" from the catalog that maintain a similar visual style.
      3. Calculate the new estimated total.
      Keep it professional and helpful. Return as a clean summary.`;
      
      const result = await model.generateContent(prompt);
      res.json({ plan: result.response.text() });
    } else {
      // Mock Optimizer
      const currentTotal = flowers.reduce((acc, f) => acc + (f.pricePerUnit * f.quantity), 0);
      const diff = currentTotal - targetBudget;
      
      let mockPlan = `### Budget Optimization Plan (Target: ₹${targetBudget})\n\n`;
      mockPlan += `Your current total is **₹${currentTotal.toFixed(2)}**. To save **₹${diff.toFixed(2)}**, we suggest:\n\n`;
      mockPlan += `1. **Reduce Quantities**: Reducing the count of your most expensive flowers by 20%.\n`;
      mockPlan += `2. **Smart Swap**: Swap **Peonies** for **Roses** or **Carnations** to keep the "full" look at a lower cost.\n`;
      mockPlan += `3. **Filler Strategy**: Add more **Daisies** or **Baby's Breath** to maintain volume while lowering the average stem price.\n\n`;
      mockPlan += `**Estimated New Total: ₹${(targetBudget * 1.05).toFixed(2)}**`;
      
      res.json({ plan: mockPlan });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/crowdsource', auth, adminAuth, async (req, res) => {
  try {
    // Excluding the buffer from json response to save bandwidth
    const entries = await Crowdsource.find({ status: 'pending' }).select('-imageBuffer').populate('userId', 'name email');
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/crowdsource/:id/approve', auth, adminAuth, async (req, res) => {
  try {
    const entry = await Crowdsource.findById(req.params.id);
    if (!entry) return res.status(404).json({ msg: 'Not found' });
    
    // Simulate AI training state first (for MVP narrative)
    entry.status = 'training';
    await entry.save();
    
    // Auto-learning: Immediately add to Flower DB after "training" is complete
    setTimeout(async () => {
      try {
        entry.status = 'approved';
        await entry.save();
        await Flower.findOneAndUpdate(
          { name: entry.name }, 
          { name: entry.name, price: entry.proposedPrice }, 
          { upsert: true }
        );
      } catch (err) {
        console.error("Delayed Approval Error:", err);
      }
    }, 2000); // 2 second simulated training

    res.json({ success: true, msg: 'Entry approved, AI training started' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/crowdsource/:id/reject', auth, adminAuth, async (req, res) => {
  try {
    const entry = await Crowdsource.findById(req.params.id);
    if (!entry) return res.status(404).json({ msg: 'Not found' });
    
    entry.status = 'rejected';
    await entry.save();
    res.json({ success: true, msg: 'Entry rejected' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.post('/setup-flowers', async (req, res) => {
  try {
    const defaults = [
      { name: 'Rose', price: 5 }, { name: 'Lily', price: 4 }, { name: 'Tulip', price: 3 },
      { name: 'Sunflower', price: 6 }, { name: 'Daisy', price: 2 }, { name: 'Carnation', price: 3 },
      { name: 'Peony', price: 7 }, { name: 'Orchid', price: 10 }
    ];
    for (const f of defaults) {
      await Flower.findOneAndUpdate({ name: f.name }, f, { upsert: true, new: true });
    }
    res.json({ success: true, message: 'Default flowers added' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
