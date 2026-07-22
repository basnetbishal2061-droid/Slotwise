import React from 'react';

const StatCard = ({ label, value, icon, trend }) => (
  <div className="card flex items-start justify-between">
    <div>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="text-2xl font-bold text-ink mt-1">{value}</p>
      {trend && <p className="text-xs text-emerald-600 mt-1">{trend}</p>}
    </div>
    {icon && (
      <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600 text-lg">
        {icon}
      </div>
    )}
  </div>
);

export default StatCard;
