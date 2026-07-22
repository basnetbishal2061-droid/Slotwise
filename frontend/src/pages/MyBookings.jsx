import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import StatusBadge from '../components/StatusBadge';
import api from '../api/axios';

const MyBookings = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/appointments/my');
      setAppointments(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const cancelAppointment = async (id) => {
    if (!confirm('Cancel this appointment?')) return;
    try {
      await api.put(`/appointments/${id}/cancel`);
      load();
    } catch (e) {
      alert(e?.response?.data?.message || 'Could not cancel appointment.');
    }
  };

  const filtered = filterDate ? appointments.filter((a) => a.date === filterDate) : appointments;

  return (
    <Layout title="My Bookings">
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h3 className="font-bold text-ink">Appointment History</h3>
          <div className="flex items-center gap-2">
            <input
              type="date"
              className="input-field"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
            {filterDate && (
              <button className="btn-outline text-sm" onClick={() => setFilterDate('')}>
                Clear
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-slate-500">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-slate-500">No appointments found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-400 border-b border-slate-100">
                  <th className="py-2">Date</th>
                  <th className="py-2">Time</th>
                  <th className="py-2">Service</th>
                  <th className="py-2">Status</th>
                  <th className="py-2"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => (
                  <tr key={a._id} className="border-b border-slate-50">
                    <td className="py-3">{a.date}</td>
                    <td className="py-3">{a.time}</td>
                    <td className="py-3">{a.service}</td>
                    <td className="py-3"><StatusBadge status={a.status} /></td>
                    <td className="py-3 text-right">
                      {['pending', 'approved'].includes(a.status) && (
                        <button
                          onClick={() => cancelAppointment(a._id)}
                          className="text-rose-600 text-xs font-medium hover:underline"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
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

export default MyBookings;
