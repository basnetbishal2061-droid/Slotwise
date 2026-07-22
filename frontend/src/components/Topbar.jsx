import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Topbar = ({ title }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between bg-white border-b border-slate-200 px-6 py-4">
      <h1 className="text-xl font-bold text-ink">{title}</h1>
      <div className="flex items-center gap-4">
        <span className="badge bg-primary-100 text-primary-700 capitalize">{user?.role}</span>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-primary-500 text-white flex items-center justify-center text-sm font-semibold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm font-medium hidden sm:inline">{user?.name}</span>
        </div>
        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="btn-outline text-sm"
        >
          Sign out
        </button>
      </div>
    </header>
  );
};

export default Topbar;
