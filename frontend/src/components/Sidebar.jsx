import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
    isActive ? 'bg-primary-500 text-white' : 'text-slate-600 hover:bg-slate-100'
  }`;

const Sidebar = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <aside className="hidden md:flex md:flex-col w-64 shrink-0 bg-white border-r border-slate-200 min-h-screen py-6 px-3">
      <div className="flex items-center gap-2 px-3 mb-8">
        <div className="w-9 h-9 rounded-lg bg-primary-500 flex items-center justify-center text-white font-bold">S</div>
        <span className="text-lg font-bold text-ink">SlotWise</span>
      </div>

      <nav className="flex flex-col gap-1">
        <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
        <NavLink to="/book" className={linkClass}>Book Appointment</NavLink>
        <NavLink to="/my-bookings" className={linkClass}>My Bookings</NavLink>
        {isAdmin && (
          <>
            <div className="mt-4 mb-1 px-4 text-xs font-semibold uppercase text-slate-400">Admin</div>
            <NavLink to="/admin" className={linkClass}>Admin Panel</NavLink>
            <NavLink to="/reports" className={linkClass}>Reports</NavLink>
          </>
        )}
        <div className="mt-4 mb-1 px-4 text-xs font-semibold uppercase text-slate-400">Account</div>
        <NavLink to="/profile" className={linkClass}>Profile</NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
