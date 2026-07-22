import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import StatusBadge from '../components/StatusBadge';
import api from '../api/axios';

const DEFAULT_TIMES = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30'];

const AdminPanel = () => {
  const [tab, setTab] = useState('appointments');
  const [appointments, setAppointments] = useState([]);
  const [slots, setSlots] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [newSlotDate, setNewSlotDate] = useState('');
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAppointments = async () => {
    const { data } = await api.get('/appointments', {
      params: { status: statusFilter || undefined, date: dateFilter || undefined },
    });
    setAppointments(data);
  };

  const loadSlots = async () => {
    const { data } = await api.get('/slots', { params: { date: newSlotDate || undefined } });
    setSlots(data);
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([loadAppointments(), loadSlots()]).finally(() => setLoading(false));
    // eslint-disable-next-line
  }, [statusFilter, dateFilter, newSlotDate]);

  const updateStatus = async (id, status) => {
    await api.put(`/appointments/${id}/status`, { status });
    loadAppointments();
  };

  const toggleTime = (t) => {
    setSelectedTimes((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  };

  const createSlots = async () => {
    if (!newSlotDate || selectedTimes.length === 0) return;
    await api.post('/slots/bulk', { date: newSlotDate, times: selectedTimes, service: 'General Appointment', duration: 30 });
    setSelectedTimes([]);
    loadSlots();
  };

  const blockSlot = async (id) => {
    await api.put(`/slots/${id}/block`);
    loadSlots();
  };

  const deleteSlot = async (id) => {
    if (!confirm('Delete this slot?')) return;
    try {
      await api.delete(`/slots/${id}`);
      loadSlots();
    } catch (e) {
      alert(e?.response?.data?.message || 'Could not delete slot.');
    }
  };

  return (
    <Layout title="Admin Panel">
      <div className="flex gap-2 mb-6">
        {['appointments', 'slots'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${
              tab === t ? 'bg-primary-500 text-white' : 'bg-white border border-slate-200 text-slate-600'
            }`}
          >
            {t === 'appointments' ? 'Manage Appointments' : 'Manage Time Slots'}
          </button>
        ))}
      </div>

      {tab === 'appointments' && (
        <div className="card">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <select className="input-field sm:w-48" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">All statuses</option>
              {['pending', 'approved', 'rejected', 'cancelled', 'completed'].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <input
              type="date"
              className="input-field sm:w-48"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>

          {loading ? (
            <p className="text-sm text-slate-500">Loading...</p>
          ) : appointments.length === 0 ? (
            <p className="text-sm text-slate-500">No appointments found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-400 border-b border-slate-100">
                    <th className="py-2">Customer</th>
                    <th className="py-2">Date</th>
                    <th className="py-2">Time</th>
                    <th className="py-2">Service</th>
                    <th className="py-2">Status</th>
                    <th className="py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((a) => (
                    <tr key={a._id} className="border-b border-slate-50">
                      <td className="py-3">{a.customer?.name}<br /><span className="text-xs text-slate-400">{a.customer?.email}</span></td>
                      <td className="py-3">{a.date}</td>
                      <td className="py-3">{a.time}</td>
                      <td className="py-3">{a.service}</td>
                      <td className="py-3"><StatusBadge status={a.status} /></td>
                      <td className="py-3">
                        <select
                          className="input-field text-xs py-1"
                          value={a.status}
                          onChange={(e) => updateStatus(a._id, e.target.value)}
                        >
                          {['pending', 'approved', 'rejected', 'cancelled', 'completed'].map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {tab === 'slots' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="font-bold text-ink mb-4">Create Slots</h3>
            <label className="text-sm font-medium text-slate-600">Date</label>
            <input
              type="date"
              className="input-field mt-1 mb-4"
              value={newSlotDate}
              onChange={(e) => setNewSlotDate(e.target.value)}
            />
            <label className="text-sm font-medium text-slate-600">Times</label>
            <div className="grid grid-cols-3 gap-2 mt-1 mb-4">
              {DEFAULT_TIMES.map((t) => (
                <button
                  key={t}
                  onClick={() => toggleTime(t)}
                  className={`py-2 rounded-lg text-sm font-medium border ${
                    selectedTimes.includes(t)
                      ? 'bg-primary-500 text-white border-primary-500'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <button className="btn-primary w-full" onClick={createSlots} disabled={!newSlotDate || selectedTimes.length === 0}>
              Add Slots
            </button>
          </div>

          <div className="card">
            <h3 className="font-bold text-ink mb-4">Existing Slots {newSlotDate && `— ${newSlotDate}`}</h3>
            {slots.length === 0 ? (
              <p className="text-sm text-slate-500">No slots for this date yet.</p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {slots.map((s) => (
                  <div key={s._id} className="flex items-center justify-between border border-slate-100 rounded-lg p-3">
                    <div>
                      <p className="text-sm font-medium">{s.date} · {s.time}</p>
                      <p className="text-xs text-slate-400">
                        {s.isBooked ? 'Booked' : s.isBlocked ? 'Blocked' : 'Available'}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button className="btn-outline text-xs px-2 py-1" onClick={() => blockSlot(s._id)}>
                        {s.isBlocked ? 'Unblock' : 'Block'}
                      </button>
                      <button
                        className="text-rose-600 text-xs font-medium hover:underline"
                        onClick={() => deleteSlot(s._id)}
                        disabled={s.isBooked}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AdminPanel;
