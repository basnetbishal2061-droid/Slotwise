import React from 'react';

const styles = {
  pending: 'bg-amber-100 text-amber-700',
  approved: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-rose-100 text-rose-700',
  cancelled: 'bg-slate-200 text-slate-600',
  completed: 'bg-primary-100 text-primary-700',
};

const StatusBadge = ({ status }) => (
  <span className={`badge capitalize ${styles[status] || 'bg-slate-100 text-slate-600'}`}>{status}</span>
);

export default StatusBadge;
