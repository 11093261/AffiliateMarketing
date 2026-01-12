import React, { useState, useEffect } from 'react';
import { useAuth } from '../Component/context/AuthContext'; // Add this import
import { 
  BoltIcon, 
  LinkIcon, 
  CurrencyDollarIcon,
  UserCircleIcon,
  ChartBarIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const BASE_URL = import.meta.env.VITE_API_URL || "https://afffiliate.onrender.com" || "http://localhost:4500";
  
  const { getAuthToken, user: authUser, logout } = useAuth(); // Use auth context
  
  // State for dashboard data
  const [dashboardData, setDashboardData] = useState(null);
  const [onboardingProgress, setOnboardingProgress] = useState(40);
  const [completedTasks, setCompletedTasks] = useState({
    profileCompleted: false,
    paymentCompleted: false,
    firstLinkCreated: false,
    tutorialCompleted: false
  });
  const [recommendedPrograms, setRecommendedPrograms] = useState([]);
  const [stats, setStats] = useState({
    clicks: 0,
    conversions: 0,
    commissions: 0,
    pendingPayout: 0,
    payoutThreshold: 50
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState({ name: 'Alex M.', email: '', profile: {} });

  // Fetch dashboard data on component mount
  useEffect(() => {
    fetchDashboardData();
    fetchRecommendedPrograms();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = getAuthToken(); // Use from context
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${BASE_URL}/api/users/dashboard`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        // Token expired or invalid
        logout();
        throw new Error('Session expired. Please login again.');
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Update state with fetched data
      setDashboardData(data);
      setUser(data.user || {});
      setCompletedTasks(data.onboarding || {});
      setOnboardingProgress(data.onboarding?.progress || 40);
      setStats(data.stats || {});
      
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message);
      // Fallback to sample data if API fails
      setRecommendedPrograms([
        { _id: 1, name: "TechGadgets Pro", commission: "12-15%", category: "Electronics" },
        { _id: 2, name: "FitnessFuel", commission: "8% + bonuses", category: "Health" },
        { _id: 3, name: "DesignMaster Suite", commission: "30% recurring", category: "Software" },
        { _id: 4, name: "EcoHome Essentials", commission: "10% flat", category: "Lifestyle" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendedPrograms = async () => {
    try {
      const token = getAuthToken();
      
      if (!token) return;

      const response = await fetch(`${BASE_URL}/api/programs/recommended`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setRecommendedPrograms(data);
      }
    } catch (err) {
      console.error('Error fetching recommended programs:', err);
    }
  };

  // ... rest of your component remains the same ...

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center">
              <BoltIcon className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Affili<span className="text-indigo-600">Sphere</span></h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="hidden md:flex items-center text-gray-600 hover:text-indigo-600">
              <UserCircleIcon className="h-5 w-5 mr-1" />
              Support
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                <span className="font-medium text-indigo-700">{authUser?.name?.charAt(0) || user.name?.charAt(0) || 'A'}</span>
              </div>
              <span className="font-medium text-gray-700">{authUser?.name || user.name || 'Alex M.'}</span>
            </div>
          </div>
        </header>
        
        {/* ... rest of your JSX ... */}
        
      </div>
    </div>
  );
};

export default Dashboard;