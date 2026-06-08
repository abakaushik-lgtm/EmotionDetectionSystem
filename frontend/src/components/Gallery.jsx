import { useState, useEffect } from 'react';
import axios from 'axios';
import { Image as ImageIcon, ShoppingCart, Search, Filter } from 'lucide-react';
import ShareButtons from './ShareButtons';
import CheckoutModal from './CheckoutModal';

export default function Gallery() {
  const [bouquets, setBouquets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkoutBouquet, setCheckoutBouquet] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await axios.get('/api/gallery');
        setBouquets(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const filteredBouquets = bouquets
    .filter(b => {
      const flowersString = b.flowers.map(f => f.name).join(' ').toLowerCase();
      const userName = (b.userId?.name || 'Anonymous').toLowerCase();
      return flowersString.includes(searchTerm.toLowerCase()) || userName.includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => {
      if (sortBy === 'priceHigh') return b.totalPrice - a.totalPrice;
      if (sortBy === 'priceLow') return a.totalPrice - b.totalPrice;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  if (loading) return <div className="text-center mt-20 text-slate-500">Loading gallery...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-16 animate-float">
        <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 mb-4 tracking-tighter">
          Community Creations
        </h1>
        <p className="text-slate-400 text-xl font-medium max-w-2xl mx-auto italic">Explore the most beautiful arrangements curated by floral enthusiasts across the world.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mb-12">
        <div className="relative flex-1 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={24} />
          <input 
            type="text" 
            placeholder="Search by flower, user, or occasion..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full glass border border-white/40 rounded-[2rem] pl-16 pr-8 py-5 focus:ring-4 focus:ring-indigo-100/30 outline-none transition-all shadow-xl text-slate-700 font-medium placeholder:text-slate-400"
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="glass border border-white/40 rounded-[2rem] px-6 py-5 flex items-center gap-3 shadow-xl">
            <Filter className="text-slate-400" size={20} />
            <select 
              value={sortBy} 
              onChange={e => setSortBy(e.target.value)}
              className="bg-transparent outline-none cursor-pointer font-bold text-slate-700 appearance-none pr-8 relative"
              style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2364748b\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\' /%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0 center', backgroundSize: '1.25rem' }}
            >
              <option value="newest">Newest First</option>
              <option value="priceHigh">Premium Selection</option>
              <option value="priceLow">Value Favorites</option>
            </select>
          </div>
        </div>
      </div>

      {filteredBouquets.length === 0 ? (
        <div className="glass border border-white/40 rounded-[3rem] p-24 text-center text-slate-400 shadow-2xl">
          <ImageIcon className="w-24 h-24 mb-6 mx-auto opacity-20" />
          <p className="text-2xl font-black text-slate-800">No arrangements found.</p>
          <p className="mt-2 font-medium">Try broadening your search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredBouquets.map(b => (
            <div key={b._id} className="glass rounded-[3rem] shadow-xl hover:shadow-2xl border border-white p-8 transition-all duration-500 flex flex-col group hover:-translate-y-3 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-rose-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="flex justify-between items-start mb-8 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg">
                    {b.userId?.name?.[0] || 'A'}
                  </div>
                  <div>
                    <h3 className="font-black text-slate-800 text-lg leading-tight">{b.userId?.name || 'Anonymous'}</h3>
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">{new Date(b.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="bg-slate-900 text-white px-5 py-2 rounded-2xl font-black text-lg shadow-lg">
                  ₹{b.totalPrice.toFixed(0)}
                </div>
              </div>

              <div className="flex-1 space-y-3 mb-10 relative z-10">
                {b.flowers.map((f, i) => (
                  <div key={i} className="flex justify-between items-center text-sm bg-white/40 border border-white/60 px-4 py-2 rounded-xl">
                    <span className="font-bold text-slate-700">{f.name}</span>
                    <span className="text-slate-400 font-black">x{f.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-between items-center relative z-10">
                <div className="flex items-center gap-1">
                  <ShareButtons 
                    title="Amazing Bouquet" 
                    text={`Check out this arrangement on BouquetScanner!`} 
                    url={window.location.origin + '/gallery'} 
                  />
                </div>
                <button 
                  onClick={() => setCheckoutBouquet(b)}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-black transition-all shadow-xl hover:shadow-indigo-200 active:scale-95"
                >
                  <ShoppingCart size={18} /> Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <CheckoutModal isOpen={!!checkoutBouquet} onClose={() => setCheckoutBouquet(null)} bouquet={checkoutBouquet} />
    </div>
  );
}
