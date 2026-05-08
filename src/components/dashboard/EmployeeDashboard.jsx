import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Link } from 'react-router-dom';

const EmployeeDashboard = () => {
  const [stats, setStats] = useState({
    reviewsRequired: 0,
    feedbackReceived: 0,
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
    return <div className="text-zinc-500 animate-pulse">Loading workspace...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white mb-6">My Workspace</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl">
          <h3 className="text-zinc-400 text-sm font-medium">Reviews Required</h3>
          <p className="text-3xl text-white font-bold mt-2">{stats.reviewsRequired}</p>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl">
          <h3 className="text-zinc-400 text-sm font-medium">Feedback Received</h3>
          <p className="text-3xl text-white font-bold mt-2">{stats.feedbackReceived}</p>
        </div>
      </div>
      <div className="mt-8 bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl min-h-[200px] flex flex-col justify-center items-center">
        <h3 className="text-zinc-400 text-sm font-medium mb-4 w-full text-left">Action Items</h3>
        {stats.reviewsRequired > 0 ? (
          <div className="text-center flex flex-col items-center justify-center flex-1 w-full">
            <p className="text-zinc-300 text-sm mb-4">You have {stats.reviewsRequired} pending performance reviews to submit feedback for.</p>
            <Link to="/reviews" className="bg-white text-black px-4 py-2 rounded-md font-medium text-sm hover:bg-zinc-200 transition-colors shadow-sm active:scale-[0.98]">
              Go to Reviews
            </Link>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center w-full">
            <p className="text-zinc-600 text-sm">You have no pending action items.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;
