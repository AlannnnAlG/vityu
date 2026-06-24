import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ adminOnly = false }) => {
  const location = useLocation();
  
  // 🔥 CEK LOCALSTORAGE LANGSUNG
  const hasToken = !!localStorage.getItem('pb_token');
  const hasAuth = !!localStorage.getItem('pb_auth');
  
  // 🔥 AMBIL USER DARI LOCALSTORAGE
  let user = null;
  try {
    const authData = localStorage.getItem('pb_auth');
    if (authData) {
      const parsed = JSON.parse(authData);
      user = parsed.record || parsed.model;
    }
  } catch (e) {}

  console.log('🔒 ProtectedRoute - path:', location.pathname);
  console.log('🔒 ProtectedRoute - hasToken:', hasToken);
  console.log('🔒 ProtectedRoute - user:', user?.email);

  // 🔥 KALAU ADA TOKEN, LANGSUNG ALLOW
  if (hasToken && hasAuth) {
    if (adminOnly && user?.role !== 'admin') {
      return <Navigate to="/" replace />;
    }
    return <Outlet />;
  }

  // 🔥 GA ADA TOKEN, REDIRECT KE LOGIN
  return <Navigate to="/login" replace />;
};

export default ProtectedRoute;