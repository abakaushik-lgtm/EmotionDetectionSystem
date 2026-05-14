import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { History, Image as ImageIcon } from 'lucide-react';
import ShareButtons from './ShareButtons';

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [bouquets, setBouquets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBouquets = async () => {
      try {
        const res = await axios.get('http://localhost:5000/my-bouquets');
        setBouquets(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBouquets();
  }, []);

  if (!user) return <div className="text-center mt-20 text-slate-500">Loading profile...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Welcome, {user.name}!</h1>
          <p className="text-slate-500 mt-1">{user.email}</p>
        </div>
        <div className="bg-indigo-50 text-indigo-600 px-6 py-3 rounded-2xl font-bold text-xl text-center">
          <div>{bouquets.length}</div>
          <div className="text-sm font-medium">Saved Bouquets</div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <History className="text-indigo-500" /> Bouquet History
      </h2>

      {loading ? (
        <div className="text-slate-500">Loading history...</div>
      ) : bouquets.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center text-slate-500 flex flex-col items-center">
          <ImageIcon className="w-16 h-16 mb-4 text-slate-300" />
          <p className="text-lg font-medium">No saved bouquets yet.</p>
          <p>Go to the scanner to create your first one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bouquets.map(b => (
            <div key={b._id} className="bg-white rounded-3xl shadow-sm hover:shadow-md border border-slate-200 p-6 transition-shadow flex flex-col">
              <div className="text-sm text-slate-400 mb-4">{new Date(b.createdAt).toLocaleDateString()}</div>
              <div className="flex-1 space-y-3 mb-6">
                {b.flowers.map((f, i) => (
                  <div key={i} className="flex justify-between items-center text-sm">
                    <span className="font-medium text-slate-700">{f.quantity}x {f.name}</span>
                    <span className="text-slate-500">${(f.quantity * f.pricePerUnit).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-100 pt-4 flex justify-between items-end mt-auto pb-4">
                <span className="text-slate-500 font-medium">Total Price</span>
                <span className="text-2xl font-bold text-indigo-600">${b.totalPrice.toFixed(2)}</span>
              </div>
              <div className="pt-2 border-t border-slate-100">
                <ShareButtons 
                  title="My Bouquet" 
                  text={`I just scanned a bouquet worth $${b.totalPrice.toFixed(2)} on BouquetScanner!`} 
                  url={window.location.origin + '/gallery'} 
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
