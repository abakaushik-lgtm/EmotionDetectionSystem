import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { adminLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminLogin(email, password);
      navigate('/admin');
    } catch (err) {
      alert(err.response?.data?.msg || 'Admin login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md border-t-8 border-slate-900">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-slate-100 p-4 rounded-full mb-4">
            <ShieldCheck className="w-12 h-12 text-slate-800" />
          </div>
          <h2 className="text-3xl font-black text-slate-900">Admin Portal</h2>
          <p className="text-slate-500 font-medium">Restricted Access</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Admin Email</label>
            <input 
              type="email" 
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 outline-none bg-slate-50 transition"
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              placeholder="admin@bouquet.com"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
            <input 
              type="password" 
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 outline-none bg-slate-50 transition"
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl shadow-lg transition-transform hover:-translate-y-0.5 flex justify-center items-center gap-2 disabled:opacity-70"
          >
            {loading ? 'Authenticating...' : <><Lock size={18} /> Secure Login</>}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-slate-100 pt-6">
          <p className="text-slate-500 text-sm">
            Not an administrator? <Link to="/login" className="text-indigo-600 font-bold hover:underline">User Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
