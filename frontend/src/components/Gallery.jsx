import { useState, useEffect } from 'react';
import axios from 'axios';
import { Image as ImageIcon, ShoppingCart } from 'lucide-react';
import ShareButtons from './ShareButtons';
import CheckoutModal from './CheckoutModal';

export default function Gallery() {
  const [bouquets, setBouquets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkoutBouquet, setCheckoutBouquet] = useState(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/gallery');
        setBouquets(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  if (loading) return <div className="text-center mt-20 text-slate-500">Loading gallery...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500 mb-4">
          Public Bouquet Gallery
        </h1>
        <p className="text-slate-500 text-lg">Get inspired by beautiful arrangements shared by our community.</p>
      </div>

      {bouquets.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center text-slate-500 flex flex-col items-center">
          <ImageIcon className="w-16 h-16 mb-4 text-slate-300" />
          <p className="text-lg font-medium">No public bouquets yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bouquets.map(b => (
            <div key={b._id} className="bg-white rounded-3xl shadow-sm hover:shadow-xl border border-slate-200 p-6 transition-all duration-300 flex flex-col group">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">By {b.userId?.name || 'Anonymous'}</h3>
                  <span className="text-xs text-slate-400">{new Date(b.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full font-bold text-sm">
                  ${b.totalPrice.toFixed(2)}
                </div>
              </div>

              <div className="flex-1 space-y-2 mb-6">
                {b.flowers.map((f, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-slate-600">{f.quantity}x {f.name}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-between items-center opacity-80 group-hover:opacity-100 transition-opacity">
                <ShareButtons 
                  title="Awesome Bouquet!" 
                  text={`Check out this amazing $${b.totalPrice.toFixed(2)} bouquet created by ${b.userId?.name || 'someone'}!`} 
                  url={window.location.origin + '/gallery'} 
                />
                <button 
                  onClick={() => setCheckoutBouquet(b)}
                  className="flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 px-4 py-2 rounded-xl font-medium transition-colors text-sm"
                >
                  <ShoppingCart size={16} /> Buy
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
