import { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle, XCircle, BrainCircuit } from 'lucide-react';

export default function AdminPanel() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/crowdsource');
      setEntries(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch admin entries. Are you an admin?');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    // Optimistic UI update to 'training' state
    setEntries(entries.map(e => e._id === id ? { ...e, status: 'training' } : e));
    
    try {
      await axios.post(`http://localhost:5000/api/admin/crowdsource/${id}/approve`);
      // It simulates training for 2 seconds backend, so we reflect that here before removing it
      setTimeout(() => {
        setEntries(prev => prev.filter(e => e._id !== id));
      }, 2500);
    } catch (err) {
      console.error(err);
      alert('Approval failed');
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.post(`http://localhost:5000/api/admin/crowdsource/${id}/reject`);
      setEntries(entries.filter(e => e._id !== id));
    } catch (err) {
      console.error(err);
      alert('Rejection failed');
    }
  };

  if (loading) return <div className="text-center py-20 text-slate-500">Loading admin panel...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-8">
        <BrainCircuit className="w-10 h-10 text-indigo-600" />
        <h1 className="text-3xl font-extrabold text-slate-800">Admin AI Pipeline</h1>
      </div>

      {entries.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-500">
          <p className="text-lg font-medium">No pending crowdsource submissions.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {entries.map(entry => (
            <div key={entry._id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col relative overflow-hidden">
              
              {entry.status === 'training' && (
                <div className="absolute inset-0 bg-indigo-600/90 flex flex-col items-center justify-center text-white z-10 backdrop-blur-sm animate-pulse">
                  <BrainCircuit className="w-12 h-12 mb-3 animate-bounce" />
                  <p className="font-bold text-lg">AI is Learning...</p>
                  <p className="text-sm opacity-80 mt-1">Updating global database</p>
                </div>
              )}

              <div className="mb-4">
                <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full">
                  PENDING REVIEW
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-slate-800">{entry.name}</h3>
              <p className="text-indigo-600 font-semibold mb-2">Proposed: ${entry.proposedPrice}</p>
              
              <p className="text-sm text-slate-500 mt-2">Submitted by:</p>
              <p className="text-sm font-medium text-slate-700">{entry.userId?.name} ({entry.userId?.email})</p>

              <div className="mt-6 flex gap-3 pt-4 border-t border-slate-100">
                <button 
                  onClick={() => handleApprove(entry._id)}
                  className="flex-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold py-2 rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  <CheckCircle size={18} /> Approve & Train
                </button>
                <button 
                  onClick={() => handleReject(entry._id)}
                  className="flex-none bg-red-50 hover:bg-red-100 text-red-600 font-semibold px-4 py-2 rounded-xl flex items-center justify-center transition-colors"
                >
                  <XCircle size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
