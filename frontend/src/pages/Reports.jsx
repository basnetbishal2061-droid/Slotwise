import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';
import api from '../api/axios';

const Reports = () => {
  const [summary, setSummary] = useState(null);
  const [byDate, setByDate] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [s, d] = await Promise.all([
          api.get('/reports/summary'),
          api.get('/reports/by-date'),
        ]);
        setSummary(s.data);
        setByDate(d.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const maxCount = Math.max(1, ...byDate.map((d) => d.count));

  return (
    <Layout title="Reports">
      {loading ? (
        <p className="text-sm text-slate-500">Loading reports...</p>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard label="Total Appointments" value={summary.totalAppointments} icon="📅" />
            <StatCard label="Total Customers" value={summary.totalCustomers} icon="👥" />
            <StatCard label="Total Slots" value={summary.totalSlots} icon="🕒" />
            <StatCard label="Today's Appointments" value={summary.todaysAppointments} icon="✅" />
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="font-bold text-ink mb-4">Status Breakdown</h3>
              <div className="space-y-3">
                {Object.entries(summary.statusBreakdown).map(([status, count]) => (
                  <div key={status}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="capitalize text-slate-600">{status}</span>
                      <span className="font-medium text-ink">{count}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className="bg-primary-500 h-2 rounded-full"
                        style={{ width: `${summary.totalAppointments ? (count / summary.totalAppointments) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h3 className="font-bold text-ink mb-4">Appointments by Date</h3>
              {byDate.length === 0 ? (
                <p className="text-sm text-slate-500">No data yet.</p>
              ) : (
                <div className="flex items-end gap-2 h-48">
                  {byDate.map((d) => (
                    <div key={d.date} className="flex-1 flex flex-col items-center justify-end gap-1">
                      <div
                        className="w-full bg-primary-500 rounded-t-md"
                        style={{ height: `${(d.count / maxCount) * 100}%` }}
                        title={`${d.date}: ${d.count}`}
                      />
                      <span className="text-[10px] text-slate-400 rotate-45 origin-left whitespace-nowrap">{d.date.slice(5)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </Layout>
  );
};

export default Reports;
