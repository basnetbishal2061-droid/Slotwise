import React, { useEffect, useMemo, useState } from 'react';
import Layout from '../components/Layout';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const toISODate = (d) => d.toISOString().slice(0, 10);

const buildMonthDays = (year, month) => {
  const firstDay = new Date(year, month, 1);
  const startWeekday = (firstDay.getDay() + 6) % 7; // Monday = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = [];
  for (let i = 0; i < startWeekday; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(new Date(year, month, d));
  return days;
};

const BookAppointment = () => {
  const navigate = useNavigate();
  const now = new Date();
  const [viewDate, setViewDate] = useState(new Date(now.getFullYear(), now.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(toISODate(now));
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(false);
  const [message, setMessage] = useState('');

  const days = useMemo(() => buildMonthDays(viewDate.getFullYear(), viewDate.getMonth()), [viewDate]);

  useEffect(() => {
    const fetchSlots = async () => {
      setLoading(true);
      setSelectedSlot(null);
      try {
        const { data } = await api.get('/slots', { params: { date: selectedDate } });
        setSlots(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchSlots();
  }, [selectedDate]);

  const handleBook = async () => {
    if (!selectedSlot) return;
    setBooking(true);
    setMessage('');
    try {
      await api.post('/appointments', { slotId: selectedSlot._id, service: selectedSlot.service });
      setMessage('Appointment booked! Redirecting to your bookings...');
      setTimeout(() => navigate('/my-bookings'), 1200);
    } catch (e) {
      setMessage(e?.response?.data?.message || 'Could not book this slot.');
    } finally {
      setBooking(false);
    }
  };

  const monthLabel = viewDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <Layout title="Book Appointment">
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-ink uppercase text-sm tracking-wide">{monthLabel}</h3>
            <div className="flex gap-2">
              <button
                className="btn-outline px-2 py-1"
                onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))}
              >
                ‹
              </button>
              <button
                className="btn-outline px-2 py-1"
                onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))}
              >
                ›
              </button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs text-slate-400 mb-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, idx) => {
              if (!day) return <div key={idx} />;
              const iso = toISODate(day);
              const isSelected = iso === selectedDate;
              const isPast = day < new Date(now.getFullYear(), now.getMonth(), now.getDate());
              return (
                <button
                  key={iso}
                  disabled={isPast}
                  onClick={() => setSelectedDate(iso)}
                  className={`aspect-square rounded-lg text-sm font-medium transition-colors ${
                    isSelected
                      ? 'bg-primary-500 text-white'
                      : isPast
                      ? 'text-slate-300 cursor-not-allowed'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  {day.getDate()}
                </button>
              );
            })}
          </div>
        </div>

        <div className="card">
          <h3 className="font-bold text-ink mb-4">Choose a Slot — {selectedDate}</h3>
          {loading ? (
            <p className="text-sm text-slate-500">Loading slots...</p>
          ) : slots.filter((s) => !s.isBooked && !s.isBlocked).length === 0 ? (
            <p className="text-sm text-slate-500">No available slots for this date.</p>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {slots
                .filter((s) => !s.isBooked && !s.isBlocked)
                .map((s) => (
                  <button
                    key={s._id}
                    onClick={() => setSelectedSlot(s)}
                    className={`py-2 rounded-lg text-sm font-medium border transition-colors ${
                      selectedSlot?._id === s._id
                        ? 'bg-primary-500 text-white border-primary-500'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {s.time}
                  </button>
                ))}
            </div>
          )}

          {message && <p className="text-sm mt-4 text-primary-600">{message}</p>}

          <button
            disabled={!selectedSlot || booking}
            onClick={handleBook}
            className="btn-primary w-full mt-6"
          >
            {booking ? 'Booking...' : 'Continue'}
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default BookAppointment;
