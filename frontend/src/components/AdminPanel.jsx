import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { CheckCircle, XCircle, Cpu, User as UserIcon, Calendar } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export default function AdminPanel() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    if (token) {
      fetchEntries();
    }
  }, [token]);

  const fetchEntries = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/crowdsource', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEntries(res.data);
    } catch (err) {
      console.error('Fetch Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    setEntries(prev => prev.map(e => e._id === id ? { ...e, status: 'training' } : e));
    
    try {
      await axios.post(`http://localhost:5000/api/admin/crowdsource/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTimeout(() => {
        setEntries(prev => prev.filter(e => e._id !== id));
      }, 2500);
    } catch (err) {
      console.error(err);
      alert('Approval failed.');
      fetchEntries();
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.post(`http://localhost:5000/api/admin/crowdsource/${id}/reject`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEntries(prev => prev.filter(e => e._id !== id));
    } catch (err) {
      console.error(err);
      alert('Rejection failed.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-slate-500 gap-4">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="font-bold animate-pulse uppercase tracking-widest text-xs">Accessing Neural Database...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <header className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/20 pb-10">
        <div>
          <h1 className="text-5xl font-black text-slate-800 tracking-tighter">AI <span className="text-indigo-600">Training</span> Pipeline</h1>
          <p className="text-slate-500 font-medium mt-2">Approve crowdsourced intelligence to expand the global floral DNA database.</p>
        </div>
        <div className="glass px-8 py-4 rounded-3xl shadow-xl border border-white/40 flex items-center gap-4">
          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
          <p className="font-black text-slate-700 uppercase text-xs tracking-widest">Pipeline Active</p>
        </div>
      </header>

      {entries.length === 0 ? (
        <div className="glass rounded-[3rem] p-20 text-center border border-white shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/20 to-transparent"></div>
          <Cpu className="w-24 h-24 mx-auto mb-8 text-slate-300 opacity-50" />
          <h2 className="text-3xl font-black text-slate-800 mb-4">Database Optimized</h2>
          <p className="text-slate-500 text-lg max-w-md mx-auto leading-relaxed">No pending submissions found. Your AI models are currently operating at peak efficiency.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {entries.map(entry => (
            <div key={entry._id} className="glass rounded-[3rem] shadow-2xl border border-white p-8 flex flex-col relative overflow-hidden group hover:-translate-y-2 transition-all duration-500">
              
              {entry.status === 'training' && (
                <div className="absolute inset-0 bg-slate-900/90 flex flex-col items-center justify-center text-white z-20 backdrop-blur-md animate-in fade-in duration-500">
                  <div className="relative">
                    <Cpu className="w-20 h-20 mb-6 animate-[spin_3s_linear_infinite] text-indigo-400" />
                    <div className="absolute inset-0 bg-indigo-500 rounded-full blur-3xl opacity-20 scale-150"></div>
                  </div>
                  <p className="text-xl font-black tracking-widest uppercase mb-2">Neural Link Active</p>
                  <p className="text-indigo-300 font-bold text-sm animate-pulse">Training Global Model...</p>
                </div>
              )}

              <div className="relative h-64 mb-8 rounded-[2rem] overflow-hidden shadow-inner bg-slate-100">
                <img 
                  src={entry.imageUrl || 'https://images.unsplash.com/photo-1519340241574-2dec3962a7a4?auto=format&fit=crop&q=80&w=800'} 
                  alt={entry.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Proposed Price</p>
                  <p className="text-lg font-black text-indigo-600">₹{entry.proposedPrice}</p>
                </div>
              </div>

              <div className="flex-1 space-y-6">
                <div>
                  <h3 className="text-2xl font-black text-slate-800 mb-1">{entry.name}</h3>
                  <div className="flex items-center gap-2 text-slate-400 text-sm font-bold">
                    <Calendar size={14} /> {new Date(entry.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-slate-50/50 p-5 rounded-3xl border border-slate-100">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100">
                    <UserIcon className="text-slate-400" size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Contributor</p>
                    <p className="font-bold text-slate-700 truncate max-w-[150px]">{entry.userId?.name || 'Anonymous'}</p>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={() => handleApprove(entry._id)}
                    className="flex-1 bg-slate-900 hover:bg-indigo-600 text-white font-black py-5 rounded-[2rem] flex items-center justify-center gap-2 transition-all shadow-xl hover:scale-105 active:scale-95"
                  >
                    <CheckCircle size={20} /> Approve & Train
                  </button>
                  <button 
                    onClick={() => handleReject(entry._id)}
                    className="bg-white hover:bg-red-50 text-red-500 font-black px-6 py-5 rounded-[2rem] flex items-center justify-center transition-all border border-slate-200 shadow-lg hover:border-red-200"
                  >
                    <XCircle size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
