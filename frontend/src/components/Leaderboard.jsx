import { useState, useEffect } from 'react';
import axios from 'axios';
import { Trophy, Medal, Award } from 'lucide-react';
import ShareButtons from './ShareButtons';

export default function Leaderboard() {
  const [bouquets, setBouquets] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div className="text-center mt-20 text-slate-500">Loading leaderboard...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12 flex flex-col items-center">
        <Trophy className="w-16 h-16 text-yellow-500 mb-4 drop-shadow-md" />
        <h1 className="text-4xl font-extrabold text-slate-800 mb-4">Most Expensive Bouquets</h1>
        <p className="text-slate-500 text-lg">The absolute pinnacle of luxury and creativity in our community.</p>
      </div>

      <div className="space-y-4">
        {bouquets.map((b, index) => (
          <div key={b._id} className="bg-white rounded-2xl shadow-sm hover:shadow-md border border-slate-100 p-6 flex flex-col md:flex-row items-center gap-6 transition-shadow">
            
            <div className="flex items-center justify-center w-12 h-12 rounded-full font-black text-xl shrink-0">
              {index === 0 ? <Trophy className="text-yellow-500 w-8 h-8" /> : 
               index === 1 ? <Medal className="text-slate-400 w-8 h-8" /> : 
               index === 2 ? <Award className="text-amber-600 w-8 h-8" /> : 
               <span className="text-slate-400">#{index + 1}</span>}
            </div>

            <div className="flex-1 text-center md:text-left">
              <h3 className="font-bold text-slate-800 text-xl">{b.userId?.name || 'Anonymous'}</h3>
              <p className="text-sm text-slate-500">
                Created {new Date(b.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="flex-1 text-sm text-slate-600 space-y-1">
              {b.flowers.slice(0, 3).map((f, i) => (
                <div key={i}>{f.quantity}x {f.name}</div>
              ))}
              {b.flowers.length > 3 && <div className="text-slate-400 italic">+{b.flowers.length - 3} more...</div>}
            </div>

            <div className="text-right">
              <div className="text-3xl font-black text-emerald-500">${b.totalPrice.toFixed(2)}</div>
            </div>

            <div className="md:border-l md:border-slate-100 md:pl-6">
              <ShareButtons 
                title="Top Bouquet" 
                text={`Look at this insane $${b.totalPrice.toFixed(2)} bouquet on BouquetScanner!`} 
                url={window.location.origin + '/leaderboard'} 
              />
            </div>

          </div>
        ))}

        {bouquets.length === 0 && (
          <div className="text-center text-slate-500 py-10">No bouquets in the leaderboard yet.</div>
        )}
      </div>
    </div>
  );
}
