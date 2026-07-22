import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/appointments/my');
        setAppointments(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const upcoming = appointments.filter((a) => ['pending', 'approved'].includes(a.status));
  const today = new Date().toISOString().slice(0, 10);
  const todaysCount = appointments.filter((a) => a.date === today).length;

  return (
    <Layout title={`Hello, ${user?.name?.split(' ')[0] || 'there'}`}>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard label="Total Bookings" value={appointments.length} icon="📅" />
        <StatCard label="Upcoming" value={upcoming.length} icon="⏰" />
        <StatCard label="Today" value={todaysCount} icon="✅" />
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-ink">Recent Appointments</h3>
          <Link to="/book" className="btn-primary text-sm">+ New Appointment</Link>
        </div>

        {loading ? (
          <p className="text-sm text-slate-500">Loading...</p>
        ) : appointments.length === 0 ? (
          <p className="text-sm text-slate-500">You have no appointments yet. Book your first one!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-400 border-b border-slate-100">
                  <th className="py-2">Date</th>
                  <th className="py-2">Time</th>
                  <th className="py-2">Service</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.slice(0, 6).map((a) => (
                  <tr key={a._id} className="border-b border-slate-50">
                    <td className="py-3">{a.date}</td>
                    <td className="py-3">{a.time}</td>
                    <td className="py-3">{a.service}</td>
                    <td className="py-3"><StatusBadge status={a.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
