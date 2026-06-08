import { useState, useEffect } from 'react';
import axios from 'axios';
import { Dna, Sparkles, Calendar, ChevronRight, Flower2 } from 'lucide-react';

export default function FloralDNA() {
  const [dnaData, setDnaData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDNA = async () => {
      try {
        const res = await axios.get('/api/floral-dna');
        setDnaData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDNA();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <Dna className="w-12 h-12 text-indigo-600 animate-spin" />
      <p className="text-slate-500 font-medium animate-pulse">Sequencing your Floral DNA...</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-2xl text-indigo-600 mb-4">
          <Dna size={32} />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-800 mb-2">Your Floral DNA Profile</h1>
        <p className="text-slate-500 text-lg">AI-generated style profile based on your floral journey.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* DNA Summary Card */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-indigo-100/50 border border-slate-100 p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Dna size={120} />
            </div>
            
            <div className="flex items-center gap-2 mb-6">
              <span className="bg-indigo-600 text-white text-[10px] font-black uppercase px-2 py-1 rounded">AI Persona</span>
              <h2 className="text-2xl font-bold text-slate-800">{dnaData.persona}</h2>
            </div>

            <div className="text-slate-600 leading-relaxed text-lg mb-8 whitespace-pre-wrap">
              {dnaData.dna}
            </div>

            <div className="flex flex-wrap gap-3">
              {dnaData.stats.topFlowers?.map(f => (
                <span key={f} className="bg-slate-50 border border-slate-200 text-slate-600 px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                  <Flower2 size={14} className="text-indigo-400" /> {f}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:scale-110 transition-transform duration-500">
              <Calendar size={200} />
            </div>
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Sparkles className="text-amber-300" /> Weekly DNA Subscription
            </h3>
            <p className="text-indigo-100 mb-8 max-w-md">
              Get a seasonally-fresh bouquet every Thursday, curated specifically for your **{dnaData.persona}** profile.
            </p>
            <div className="flex items-center gap-6 mb-8">
              <div>
                <p className="text-xs text-indigo-200 uppercase font-bold tracking-widest mb-1">Frequency</p>
                <p className="font-bold text-lg">Weekly</p>
              </div>
              <div className="w-px h-10 bg-white/20"></div>
              <div>
                <p className="text-xs text-indigo-200 uppercase font-bold tracking-widest mb-1">Price</p>
                <p className="font-bold text-lg">₹499 / week</p>
              </div>
            </div>
            <button className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-50 transition-colors">
              Activate Subscription <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Sidebar / Tips */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-[2rem] p-6 text-white h-full">
            <h4 className="font-bold text-lg mb-4">Stylist Recommendations</h4>
            <div className="space-y-4">
              <div className="p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                <p className="text-amber-400 text-xs font-bold uppercase mb-1">Vase Type</p>
                <p className="text-sm">We suggest **Tapered Glass** to support your preferred stem lengths.</p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                <p className="text-cyan-400 text-xs font-bold uppercase mb-1">Color Harmony</p>
                <p className="text-sm">Try pairing your favorites with **muted sage greens** for a modern look.</p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                <p className="text-rose-400 text-xs font-bold uppercase mb-1">Placement</p>
                <p className="text-sm">Your preferred flower types thrive best in **indirect morning light**.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
