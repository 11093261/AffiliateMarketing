import React, { useState, useEffect } from 'react';
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

  const getAuthToken = () => {
    // Get token from localStorage (adjust based on your auth setup)
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      
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

  const updateOnboardingTask = async (taskKey) => {
    try {
      const token = getAuthToken();
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      // First, toggle locally for immediate UI feedback
      const newCompletedTasks = {
        ...completedTasks,
        [taskKey]: !completedTasks[taskKey]
      };
      setCompletedTasks(newCompletedTasks);

      // Calculate new progress
      const completedCount = Object.values(newCompletedTasks).filter(Boolean).length;
      const newProgress = (completedCount / 4) * 100;
      setOnboardingProgress(newProgress);

      // Send update to backend
      const response = await fetch(`${BASE_URL}/api/users/onboarding/task`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ task: taskKey })
      });

      if (!response.ok) {
        // Revert if API call fails
        setCompletedTasks({
          ...completedTasks
        });
        throw new Error('Failed to update task');
      }

      const data = await response.json();
      // Update with server response
      setCompletedTasks(data.onboarding);
      setOnboardingProgress(data.progress);

    } catch (err) {
      console.error('Error updating task:', err);
      setError(err.message);
      // Revert to original state
      await fetchDashboardData();
    }
  };

  const handleJoinProgram = async (programId) => {
    try {
      const token = getAuthToken();
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Create affiliate link for this program
      const response = await fetch(`${BASE_URL}/api/affiliate/links`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ programId })
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Program joined successfully! Your affiliate link: ${data.link.affiliateUrl}`);
        
        // Refresh dashboard data to update firstLinkCreated status
        await fetchDashboardData();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to join program');
      }
    } catch (err) {
      console.error('Error joining program:', err);
      alert(`Error: ${err.message}`);
    }
  };

  const handleCreateLink = () => {
    // Navigate to link creation page or open modal
    alert('Navigate to link creation page');
  };

  const handleViewAssets = () => {
    alert('Navigate to promo materials page');
  };

  const handleViewReports = async () => {
    try {
      const token = getAuthToken();
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${BASE_URL}/api/affiliate/stats/performance`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        // Display performance data or navigate to reports page
        console.log('Performance data:', data);
        alert(`Performance report loaded. Total earnings: $${data.summary.totalEarnings}`);
      }
    } catch (err) {
      console.error('Error fetching performance report:', err);
    }
  };

  // Loading state
  if (loading && !dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <ExclamationCircleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-red-800 mb-2">Unable to Load Dashboard</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={fetchDashboardData}
              className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-6 py-2 font-medium transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

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
                <span className="font-medium text-indigo-700">{user.name?.charAt(0) || 'A'}</span>
              </div>
              <span className="font-medium text-gray-700">{user.name || 'Alex M.'}</span>
            </div>
          </div>
        </header>

        {/* Onboarding Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-10">
          <div className="p-6 md:p-8 border-b border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Welcome to Affilisphere!</h2>
              <span className="text-sm font-medium text-indigo-600">{onboardingProgress}% complete</span>
            </div>
            <p className="text-gray-600 mb-6">Complete these steps to start earning commissions</p>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-8">
              <div 
                className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500" 
                style={{ width: `${onboardingProgress}%` }}
              ></div>
            </div>
            
            {/* Quick Tasks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Task 1: Complete Profile */}
              <div 
                className={`p-4 rounded-xl border ${
                  completedTasks.profileCompleted 
                    ? "border-green-500 bg-green-50" 
                    : "border-gray-200 hover:border-indigo-300 cursor-pointer"
                } transition-all`}
                onClick={() => updateOnboardingTask('profileCompleted')}
              >
                <div className="flex items-start">
                  <div className={`mr-3 mt-0.5 ${
                    completedTasks.profileCompleted ? "text-green-500" : "text-indigo-600"
                  }`}>
                    {completedTasks.profileCompleted 
                      ? <CheckCircleIcon className="h-6 w-6" /> 
                      : <div className="w-6 h-6 rounded-full border-2 border-indigo-600" />
                    }
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Complete Profile</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Add payment info and niche preferences
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Task 2: Set Payment Method */}
              <div 
                className={`p-4 rounded-xl border ${
                  completedTasks.paymentCompleted 
                    ? "border-green-500 bg-green-50" 
                    : "border-gray-200 hover:border-indigo-300 cursor-pointer"
                } transition-all`}
                onClick={() => updateOnboardingTask('paymentCompleted')}
              >
                <div className="flex items-start">
                  <div className={`mr-3 mt-0.5 ${
                    completedTasks.paymentCompleted ? "text-green-500" : "text-indigo-600"
                  }`}>
                    {completedTasks.paymentCompleted 
                      ? <CheckCircleIcon className="h-6 w-6" /> 
                      : <div className="w-6 h-6 rounded-full border-2 border-indigo-600" />
                    }
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Set Payment Method</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Connect PayPal or bank account
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Task 3: Create First Link */}
              <div 
                className={`p-4 rounded-xl border ${
                  completedTasks.firstLinkCreated 
                    ? "border-green-500 bg-green-50" 
                    : "border-gray-200 hover:border-indigo-300 cursor-pointer"
                } transition-all`}
                onClick={() => updateOnboardingTask('firstLinkCreated')}
              >
                <div className="flex items-start">
                  <div className={`mr-3 mt-0.5 ${
                    completedTasks.firstLinkCreated ? "text-green-500" : "text-indigo-600"
                  }`}>
                    {completedTasks.firstLinkCreated 
                      ? <CheckCircleIcon className="h-6 w-6" /> 
                      : <div className="w-6 h-6 rounded-full border-2 border-indigo-600" />
                    }
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Create First Link</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Generate your referral link
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Task 4: Watch Tutorial */}
              <div 
                className={`p-4 rounded-xl border ${
                  completedTasks.tutorialCompleted 
                    ? "border-green-500 bg-green-50" 
                    : "border-gray-200 hover:border-indigo-300 cursor-pointer"
                } transition-all`}
                onClick={() => updateOnboardingTask('tutorialCompleted')}
              >
                <div className="flex items-start">
                  <div className={`mr-3 mt-0.5 ${
                    completedTasks.tutorialCompleted ? "text-green-500" : "text-indigo-600"
                  }`}>
                    {completedTasks.tutorialCompleted 
                      ? <CheckCircleIcon className="h-6 w-6" /> 
                      : <div className="w-6 h-6 rounded-full border-2 border-indigo-600" />
                    }
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Watch Tutorial</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      5-minute starter guide
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Stats Preview */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 md:p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-white text-sm mb-1">Clicks</div>
                <div className="text-2xl font-bold text-white">{stats.clicks || 0}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-white text-sm mb-1">Conversions</div>
                <div className="text-2xl font-bold text-white">{stats.conversions || 0}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-white text-sm mb-1">Commissions</div>
                <div className="text-2xl font-bold text-white">${(stats.commissions || 0).toFixed(2)}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-white text-sm mb-1">Payout</div>
                <div className="text-2xl font-bold text-white">${(stats.payoutThreshold || 50).toFixed(2)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Programs */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-10">
          <div className="p-6 md:p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Recommended Programs</h2>
              <a href="#" className="text-indigo-600 hover:text-indigo-800 flex items-center">
                View all <ArrowRightIcon className="h-4 w-4 ml-1" />
              </a>
            </div>
            
            {recommendedPrograms.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <LinkIcon className="h-6 w-6 text-indigo-600" />
                </div>
                <p className="text-gray-600">No recommended programs available</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {recommendedPrograms.map(program => (
                  <div 
                    key={program._id || program.id}
                    className="border border-gray-200 rounded-xl hover:border-indigo-300 transition-all overflow-hidden"
                  >
                    <div className="p-5">
                      <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center mb-4">
                        <LinkIcon className="h-6 w-6 text-indigo-600" />
                      </div>
                      <h3 className="font-bold text-gray-800 mb-1">{program.name}</h3>
                      <div className="flex items-center text-sm mb-3">
                        <span className="text-green-600 font-medium">{program.commission}</span>
                        <span className="mx-2 text-gray-300">•</span>
                        <span className="text-gray-600">{program.category}</span>
                      </div>
                      <button 
                        onClick={() => handleJoinProgram(program._id || program.id)}
                        className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-2 text-sm font-medium transition-colors"
                      >
                        Join Program
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-lg mb-2">Link Generator</h3>
                <p className="text-indigo-100 text-sm mb-4">Create your first referral link</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                <LinkIcon className="h-6 w-6" />
              </div>
            </div>
            <button 
              onClick={handleCreateLink}
              className="w-full bg-white text-indigo-600 hover:bg-indigo-50 rounded-lg py-2.5 font-medium transition-colors"
            >
              Create Link
            </button>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-lg mb-2">Promo Materials</h3>
                <p className="text-purple-100 text-sm mb-4">Get banners & content assets</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                <CurrencyDollarIcon className="h-6 w-6" />
              </div>
            </div>
            <button 
              onClick={handleViewAssets}
              className="w-full bg-white text-purple-600 hover:bg-purple-50 rounded-lg py-2.5 font-medium transition-colors"
            >
              View Assets
            </button>
          </div>
          
          <div className="bg-gradient-to-br from-teal-500 to-teal-700 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-lg mb-2">Performance Report</h3>
                <p className="text-teal-100 text-sm mb-4">Track clicks & conversions</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                <ChartBarIcon className="h-6 w-6" />
              </div>
            </div>
            <button 
              onClick={handleViewReports}
              className="w-full bg-white text-teal-600 hover:bg-teal-50 rounded-lg py-2.5 font-medium transition-colors"
            >
              View Reports
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg">
            <div className="flex items-center">
              <ExclamationCircleIcon className="h-5 w-5 mr-2" />
              <span>Error: {error}</span>
              <button 
                onClick={() => setError(null)}
                className="ml-4 text-red-800 hover:text-red-900"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;