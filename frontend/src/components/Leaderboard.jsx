import { useState, useEffect } from 'react';
import axios from 'axios';
import { Trophy, Medal, Award, ListFilter, TrendingUp, Flower2 } from 'lucide-react';
import ShareButtons from './ShareButtons';

export default function Leaderboard() {
  const [bouquets, setBouquets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('price'); // 'price' or 'quantity'

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/leaderboard');
        setBouquets(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const sortedBouquets = [...bouquets].sort((a, b) => {
    if (sortBy === 'price') return b.totalPrice - a.totalPrice;
    if (sortBy === 'quantity') {
      const qA = a.flowers.reduce((acc, f) => acc + f.quantity, 0);
      const qB = b.flowers.reduce((acc, f) => acc + f.quantity, 0);
      return qB - qA;
    }
    return 0;
  });

  if (loading) return <div className="text-center mt-20 text-slate-500">Loading leaderboard...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-16 flex flex-col items-center animate-float">
        <div className="relative mb-6">
          <Trophy className="w-24 h-24 text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]" />
          <div className="absolute inset-0 bg-amber-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        </div>
        <h1 className="text-5xl font-black text-slate-800 mb-4 tracking-tighter">Floral Hall of Fame</h1>
        <p className="text-slate-400 text-xl font-medium max-w-lg mx-auto italic">Celebrating the most extravagant and complex arrangements in our global community.</p>
        
        <div className="mt-10 flex glass border border-white/40 p-2 rounded-[2rem] gap-2 shadow-xl">
          <button 
            onClick={() => setSortBy('price')}
            className={`flex items-center gap-2 px-8 py-3 rounded-full text-sm font-black uppercase tracking-widest transition-all ${sortBy === 'price' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <TrendingUp size={18} /> High Value
          </button>
          <button 
            onClick={() => setSortBy('quantity')}
            className={`flex items-center gap-2 px-8 py-3 rounded-full text-sm font-black uppercase tracking-widest transition-all ${sortBy === 'quantity' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Flower2 size={18} /> Complexity
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {sortedBouquets.map((b, index) => (
          <div key={b._id} className="glass rounded-[2.5rem] shadow-xl hover:shadow-2xl border border-white p-8 flex flex-col md:flex-row items-center gap-8 transition-all duration-500 hover:-translate-y-2 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl font-black text-2xl shrink-0 relative z-10">
              {index === 0 ? <Trophy className="text-amber-400 w-12 h-12 drop-shadow-md" /> : 
               index === 1 ? <Medal className="text-slate-400 w-10 h-10" /> : 
               index === 2 ? <Award className="text-amber-700 w-10 h-10" /> : 
               <span className="text-slate-200 text-4xl italic font-black">#{index + 1}</span>}
            </div>

            <div className="flex-1 text-center md:text-left relative z-10">
              <h3 className="font-black text-slate-800 text-2xl tracking-tight leading-tight">{b.userId?.name || 'Anonymous'}</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                Verified Curatorial Submission • {new Date(b.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="flex-1 text-sm text-slate-500 font-medium relative z-10 bg-white/30 px-5 py-3 rounded-2xl border border-white/40">
              {b.flowers.slice(0, 2).map((f, i) => (
                <div key={i} className="flex justify-between">
                  <span>{f.name}</span>
                  <span className="font-bold text-slate-700">x{f.quantity}</span>
                </div>
              ))}
              {b.flowers.length > 2 && <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">+{b.flowers.length - 2} Additional Stems</div>}
            </div>

            <div className="text-right relative z-10">
              <div className="text-4xl font-black text-indigo-600 tracking-tighter">₹{b.totalPrice.toFixed(0)}</div>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Market Value</p>
            </div>

            <div className="md:border-l md:border-slate-100 md:pl-8 relative z-10">
              <ShareButtons 
                title="Top Bouquet" 
                text={`Look at this insane ₹${b.totalPrice.toFixed(0)} bouquet on BouquetScanner!`} 
                url={window.location.origin + '/leaderboard'} 
              />
            </div>

          </div>
        ))}

        {bouquets.length === 0 && (
          <div className="glass rounded-[3rem] p-24 text-center text-slate-400 border border-white shadow-xl">
            <Trophy size={60} className="mx-auto mb-6 opacity-10" />
            <p className="text-xl font-bold">The leaderboard is currently empty.</p>
            <p className="text-sm">Be the first to claim your spot on the podium!</p>
          </div>
        )}
      </div>
    </div>
  );
}
