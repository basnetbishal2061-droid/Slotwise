import React from 'react';
import { Link } from 'react-router-dom';

const features = [
  'User Registration & Login',
  'JWT Authentication',
  'Admin Dashboard',
  'Book Appointment',
  'Manage Time Slots',
  'Search Available Slots',
  'Filter by Date',
  'Appointment History',
  'Reports & Insights',
  'Role-based Access',
  'Responsive Design',
];

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="flex items-center justify-between px-6 md:px-12 py-5">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-primary-500 flex items-center justify-center text-white font-bold">S</div>
          <span className="text-lg font-bold text-ink">SlotWise</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="btn-outline">Login</Link>
          <Link to="/register" className="btn-primary">Get Started</Link>
        </div>
      </nav>

      <section className="px-6 md:px-12 py-16 grid md:grid-cols-2 gap-10 items-center max-w-6xl mx-auto">
        <div>
          <span className="badge bg-primary-100 text-primary-700 mb-4 inline-block">Smart Appointment Booking</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-ink leading-tight">
            Stop double bookings.<br /> Start SlotWise scheduling.
          </h1>
          <p className="text-slate-500 mt-4 text-lg">
            Salons, clinics, and consultants use SlotWise to manage appointments, time slots
            and customers in one simple dashboard — no more manual chaos.
          </p>
          <div className="flex gap-3 mt-8">
            <Link to="/register" className="btn-primary">Create Free Account</Link>
            <Link to="/login" className="btn-outline">I already have an account</Link>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-ink">Today's Appointments</h3>
            <span className="badge bg-emerald-100 text-emerald-700">Live</span>
          </div>
          <div className="space-y-3">
            {[
              ['9:30 AM', 'Kristin Watson', 'Consultation'],
              ['11:00 AM', 'Courtney Henry', 'Deep Tissue Massage'],
              ['2:00 PM', 'Jerome Bell', 'Chemical Peel'],
            ].map(([time, name, service]) => (
              <div key={time} className="flex items-center justify-between border border-slate-100 rounded-lg p-3">
                <div>
                  <p className="font-medium text-sm text-ink">{name}</p>
                  <p className="text-xs text-slate-500">{service}</p>
                </div>
                <span className="text-sm font-semibold text-primary-600">{time}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 md:px-12 py-16 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-ink mb-8 text-center">Everything you need to run bookings</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {features.map((f) => (
            <div key={f} className="card flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-primary-500" />
              <span className="text-sm font-medium text-slate-700">{f}</span>
            </div>
          ))}
        </div>
      </section>

      <footer className="text-center text-sm text-slate-400 py-8">
        © {new Date().getFullYear()} SlotWise. Built with React, Node.js, Express & MongoDB.
      </footer>
    </div>
  );
};

export default Home;
