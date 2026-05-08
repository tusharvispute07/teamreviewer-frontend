import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    pendingReviews: 0,
    completedReviews: 0,
    recentActivity: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/dashboard');
        setStats(res.data.data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (isLoading) {
    return <div className="text-zinc-500 animate-pulse">Loading dashboard...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white mb-6">Admin Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl">
          <h3 className="text-zinc-400 text-sm font-medium">Total Employees</h3>
          <p className="text-3xl text-white font-bold mt-2">{stats.totalEmployees}</p>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl">
          <h3 className="text-zinc-400 text-sm font-medium">Pending Reviews</h3>
          <p className="text-3xl text-white font-bold mt-2">{stats.pendingReviews}</p>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl">
          <h3 className="text-zinc-400 text-sm font-medium">Completed Reviews</h3>
          <p className="text-3xl text-white font-bold mt-2">{stats.completedReviews}</p>
        </div>
      </div>
      <div className="mt-8 bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl min-h-[300px]">
        <h3 className="text-zinc-400 text-sm font-medium mb-4">Recent Company Activity</h3>
        {stats.recentActivity && stats.recentActivity.length > 0 ? (
          <div className="space-y-4">
            {stats.recentActivity.map(activity => (
              <div key={activity._id} className="flex justify-between items-center p-3 hover:bg-zinc-800/50 rounded-lg transition-colors border border-zinc-800/50">
                <div>
                  <p className="text-sm font-medium text-zinc-200">{activity.title}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">Subject: {activity.employee?.name || 'Unknown'}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-md border ${
                  activity.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                }`}>
                  {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-zinc-600 text-sm">No recent activity to show.</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
