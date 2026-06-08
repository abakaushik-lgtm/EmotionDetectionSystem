import { useState } from 'react';
import axios from 'axios';
import { X, CreditCard, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CheckoutModal({ isOpen, onClose, bouquet, flowers }) {
  if (!isOpen) return null;

  const navigate = useNavigate();
  const [deliveryOption, setDeliveryOption] = useState('standard');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const deliveryFee = deliveryOption === 'express' ? 150 : 50;
  const itemsPrice = flowers ? flowers.reduce((acc, f) => acc + (f.pricePerUnit * f.quantity), 0) : bouquet.totalPrice;
  const finalPrice = itemsPrice + deliveryFee;

  const handleCheckout = async () => {
    if (!address) return alert('Please enter a delivery address');
    setLoading(true);
    try {
      const payload = {
        bouquetId: bouquet?._id,
        flowers: flowers || bouquet.flowers,
        deliveryOption,
        deliveryAddress: address
      };
      const res = await axios.post('/api/checkout', payload);
      window.location.href = res.data.url; // Redirect to Stripe / Success mock
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Checkout failed. Please log in first.');
      if(err.response?.status === 401) {
        navigate('/login');
      }
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] shadow-2xl max-w-md w-full p-8 relative animate-in fade-in zoom-in duration-200">
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 transition bg-slate-100 rounded-full p-2">
          <X size={20} />
        </button>
        
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-emerald-100 p-3 rounded-full text-emerald-600">
            <ShoppingBag size={24} />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-800">Checkout</h2>
        </div>
        
        <div className="space-y-5 mb-8">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Delivery Address</label>
            <textarea 
              value={address} 
              onChange={e => setAddress(e.target.value)} 
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition bg-slate-50" 
              rows="3" 
              placeholder="Enter your full address..."
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Delivery Speed</label>
            <select 
              value={deliveryOption} 
              onChange={e => setDeliveryOption(e.target.value)} 
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition bg-slate-50 cursor-pointer"
            >
              <option value="standard">Standard Delivery (2-3 Days) - ₹50</option>
              <option value="express">Express Delivery (Same Day) - ₹150</option>
            </select>
          </div>
        </div>

        <div className="bg-slate-50 rounded-2xl p-5 mb-8 border border-slate-100">
          <div className="flex justify-between text-slate-500 mb-2 font-medium">
            <span>Bouquet Total</span>
            <span className="text-slate-800">₹{itemsPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-slate-500 mb-4 font-medium">
            <span>Delivery Fee</span>
            <span className="text-slate-800">₹{deliveryFee.toFixed(2)}</span>
          </div>
          <div className="border-t border-slate-200 pt-3 flex justify-between items-center">
            <span className="text-lg font-bold text-slate-800">Total</span>
            <span className="text-3xl font-black text-indigo-600">₹{finalPrice.toFixed(2)}</span>
          </div>
        </div>

        <button 
          onClick={handleCheckout} 
          disabled={loading}
          className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 transition shadow-lg disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-xl hover:-translate-y-0.5"
        >
          {loading ? 'Connecting to secure gateway...' : <><CreditCard size={20} /> Pay Securely</>}
        </button>
      </div>
    </div>
  );
}
