import { useEffect, useState, useContext } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export default function Success() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { user } = useContext(AuthContext);
  const [status, setStatus] = useState('processing');

  useEffect(() => {
    const completeOrder = async () => {
      try {
        await axios.post('http://localhost:5000/api/checkout/success', { orderId });
        setStatus('success');
      } catch (err) {
        setStatus('error');
      }
    };
    if (orderId && user) {
      completeOrder();
    } else if (!user) {
      setStatus('login_required');
    }
  }, [orderId, user]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-md w-full border border-slate-100">
        {status === 'processing' && (
          <div className="animate-pulse">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-6"></div>
            <p className="text-lg font-medium text-slate-600">Processing your payment...</p>
          </div>
        )}
        
        {status === 'success' && (
          <>
            <CheckCircle className="w-24 h-24 text-emerald-500 mx-auto mb-6" />
            <h1 className="text-3xl font-extrabold text-slate-800 mb-4">Payment Successful!</h1>
            <p className="text-slate-500 mb-8 text-lg">Your beautiful bouquet is being prepared and will be delivered soon.</p>
            <Link to="/dashboard" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all inline-block">
              View Order in Dashboard
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <AlertCircle className="w-24 h-24 text-red-500 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-slate-800 mb-4">Oops! Something went wrong.</h1>
            <p className="text-slate-500 mb-8">We couldn't confirm your payment. Please contact support.</p>
            <Link to="/gallery" className="text-indigo-600 font-bold hover:underline">Return to Gallery</Link>
          </>
        )}

        {status === 'login_required' && (
          <>
            <p className="text-slate-600 mb-4">Please wait while we sync your session...</p>
            <Link to="/login" className="bg-slate-800 text-white px-6 py-3 rounded-xl font-bold inline-block">Log In to continue</Link>
          </>
        )}
      </div>
    </div>
  );
}
