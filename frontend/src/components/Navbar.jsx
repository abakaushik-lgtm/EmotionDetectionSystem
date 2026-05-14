import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Scan, User, LogOut } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Scan className="text-indigo-600 w-8 h-8" />
              <span className="font-bold text-xl text-slate-800 tracking-tight">BouquetScanner</span>
            </Link>
            <div className="hidden sm:flex ml-8 space-x-6">
              <Link to="/gallery" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Gallery</Link>
              <Link to="/leaderboard" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Leaderboard</Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link to="/scanner" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Scan</Link>
                {user.role === 'admin' && (
                  <>
                    <Link to="/contribute" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Contribute</Link>
                    <Link to="/admin" className="text-purple-600 hover:text-purple-800 font-bold transition-colors">Admin Panel</Link>
                  </>
                )}
                <Link to="/dashboard" className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-medium transition-colors">
                  <User size={18} /> {user.name}
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-full font-medium transition-colors">
                  <LogOut size={16} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Log In</Link>
                <Link to="/signup" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-full font-medium transition-colors shadow-sm">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
