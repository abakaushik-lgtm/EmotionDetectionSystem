import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';

import Navbar from './components/Navbar';
import Scanner from './components/Scanner';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import Contribute from './components/Contribute';
import AdminPanel from './components/AdminPanel';
import Gallery from './components/Gallery';
import Leaderboard from './components/Leaderboard';
import Success from './components/Success';
import AdminLogin from './components/AdminLogin';
import ChatStylist from './components/ChatStylist';
import FloralDNA from './components/FloralDNA';

const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user && user.role === 'admin' ? children : <Navigate to="/admin-login" />;
};

function AppRoutes() {
  const { user } = useContext(AuthContext);
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />
      <Routes>
        <Route path="/" element={<Scanner />} />
        <Route path="/scanner" element={<Scanner />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/success" element={<Success />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        <Route path="/contribute" element={
          <AdminRoute>
            <Contribute />
          </AdminRoute>
        } />
        <Route path="/admin" element={
          <AdminRoute>
            <AdminPanel />
          </AdminRoute>
        } />
        <Route path="/floral-dna" element={
          <PrivateRoute>
            <FloralDNA />
          </PrivateRoute>
        } />
      </Routes>
      {user && <ChatStylist />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
