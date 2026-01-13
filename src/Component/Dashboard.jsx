import React, { useState, useEffect } from 'react';
import { useAuth } from '../Component/context/AuthContext';
import { 
  BoltIcon, 
  LinkIcon, 
  CurrencyDollarIcon,
  UserCircleIcon,
  ChartBarIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  CreditCardIcon,
  PencilIcon,
  BanknotesIcon,
  CogIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const BASE_URL = import.meta.env.VITE_API_URL || "https://afffiliate.onrender.com" || "http://localhost:4500";
  
  // IMPORTANT: Check if getAuthToken exists before using it
  const { getAuthToken, user: authUser, logout } = useAuth();
  
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
  const [user, setUser] = useState({ 
    name: 'Alex M.', 
    email: '', 
    profile: {},
    paymentMethod: null
  });
  
  // New state for profile and payment editing
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: '',
    bio: '',
    website: '',
    socialLinks: {
      twitter: '',
      facebook: '',
      instagram: ''
    }
  });
  const [paymentForm, setPaymentForm] = useState({
    method: 'paypal',
    paypalEmail: '',
    bankName: '',
    accountNumber: '',
    accountName: '',
    swiftCode: ''
  });

  // Fetch dashboard data on component mount
  useEffect(() => {
    fetchDashboardData();
    fetchRecommendedPrograms();
    fetchUserProfile();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // IMPORTANT: Check if getAuthToken is a function
      if (typeof getAuthToken !== 'function') {
        throw new Error('getAuthToken is not available. Authentication may have failed.');
      }
      
      const token = getAuthToken();
      
      if (!token) {
        throw new Error('No authentication token found. Please login again.');
      }

      console.log('Fetching dashboard with token:', token.substring(0, 20) + '...');

      const response = await fetch(`${BASE_URL}/api/dashboard`, {
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
        const errorText = await response.text();
        console.error('Dashboard fetch error:', errorText);
        throw new Error(`Failed to fetch dashboard data: ${response.status}`);
      }

      const data = await response.json();
      
      // Update state with fetched data
      setDashboardData(data);
      setUser(prev => ({
        ...prev,
        ...data.user,
        name: data.user?.name || prev.name
      }));
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

  // NEW: Fetch user profile data
  const fetchUserProfile = async () => {
    try {
      if (typeof getAuthToken !== 'function') return;
      
      const token = getAuthToken();
      if (!token) return;

      // Note: This endpoint might need to be created or adjust the dashboard endpoint to return profile data
      // For now, we'll get profile from the dashboard data
      const response = await fetch(`${BASE_URL}/api/dashboard`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.user?.profile) {
          setProfileForm(prev => ({
            ...prev,
            name: data.user.name || '',
            bio: data.user.profile.bio || '',
            website: data.user.profile.website || '',
            socialLinks: {
              twitter: data.user.profile.socialLinks?.twitter || '',
              facebook: data.user.profile.socialLinks?.facebook || '',
              instagram: data.user.profile.socialLinks?.instagram || ''
            }
          }));
        }
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
    }
  };

  const fetchRecommendedPrograms = async () => {
    try {
      // Check if getAuthToken is a function
      if (typeof getAuthToken !== 'function') {
        console.error('getAuthToken is not a function');
        return;
      }
      
      const token = getAuthToken();
      
      if (!token) {
        console.log('No token available for recommended programs');
        return;
      }

      console.log('Fetching recommended programs with token:', token.substring(0, 20) + '...');

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
      } else {
        console.log('Recommended programs endpoint returned:', response.status);
      }
    } catch (err) {
      console.error('Error fetching recommended programs:', err);
    }
  };

  const updateOnboardingTask = async (taskKey) => {
    try {
      if (typeof getAuthToken !== 'function') {
        throw new Error('Authentication not available');
      }

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
      const response = await fetch(`${BASE_URL}/api/onboarding/task`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ task: taskKey })
      });

      if (!response.ok) {
        // Revert if API call fails
        setCompletedTasks(completedTasks);
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

  // NEW: Update user profile
  const updateProfile = async () => {
    try {
      if (typeof getAuthToken !== 'function') {
        throw new Error('Authentication not available');
      }

      const token = getAuthToken();
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${BASE_URL}/api/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: profileForm.name,
          profile: {
            bio: profileForm.bio,
            website: profileForm.website,
            socialLinks: profileForm.socialLinks
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const data = await response.json();
      
      // Update local state
      setUser(prev => ({
        ...prev,
        name: data.user?.name || profileForm.name,
        profile: data.user?.profile || profileForm
      }));
      
      // Update onboarding task if this is first time
      if (!completedTasks.profileCompleted) {
        updateOnboardingTask('profileCompleted');
      }
      
      // Close modal and show success
      setShowProfileModal(false);
      alert('Profile updated successfully!');
      
      // Refresh dashboard data
      await fetchDashboardData();
      
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message);
      alert(`Error: ${err.message}`);
    }
  };

  // NEW: Update payment method
  const updatePaymentMethod = async () => {
    try {
      if (typeof getAuthToken !== 'function') {
        throw new Error('Authentication not available');
      }

      const token = getAuthToken();
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const paymentMethodData = {
        method: paymentForm.method,
        ...(paymentForm.method === 'paypal' && { paypalEmail: paymentForm.paypalEmail }),
        ...(paymentForm.method === 'bank' && {
          bankName: paymentForm.bankName,
          accountNumber: paymentForm.accountNumber,
          accountName: paymentForm.accountName,
          swiftCode: paymentForm.swiftCode
        })
      };

      const response = await fetch(`${BASE_URL}/api/payment-method`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentMethodData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update payment method');
      }

      const data = await response.json();
      
      // Update local state
      setUser(prev => ({
        ...prev,
        paymentMethod: paymentMethodData
      }));
      
      // Update onboarding task if this is first time
      if (!completedTasks.paymentCompleted) {
        updateOnboardingTask('paymentCompleted');
      }
      
      // Close modal and show success
      setShowPaymentModal(false);
      alert('Payment method updated successfully!');
      
      // Refresh dashboard data
      await fetchDashboardData();
      
    } catch (err) {
      console.error('Error updating payment method:', err);
      setError(err.message);
      alert(`Error: ${err.message}`);
    }
  };

  const handleJoinProgram = async (programId) => {
    try {
      if (typeof getAuthToken !== 'function') {
        throw new Error('Authentication not available');
      }

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
        alert(`Program joined successfully! Your affiliate link: ${data.link?.affiliateUrl || data.link}`);
        
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
      if (typeof getAuthToken !== 'function') {
        throw new Error('Authentication not available');
      }

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
        alert(`Performance report loaded. Total earnings: $${data.summary?.totalEarnings || 0}`);
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
            <button 
              onClick={logout}
              className="ml-4 bg-gray-600 hover:bg-gray-700 text-white rounded-lg px-6 py-2 font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Get user display name
  const getUserName = () => {
    if (authUser?.email) {
      return authUser.email.split('@')[0];
    }
    if (user?.name) {
      return user.name;
    }
    return 'User';
  };

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
                <span className="font-medium text-indigo-700">{getUserName().charAt(0).toUpperCase()}</span>
              </div>
              <span className="font-medium text-gray-700">{getUserName()}</span>
              <div className="relative group">
                <button 
                  onClick={logout}
                  className="ml-2 text-sm text-red-600 hover:text-red-800"
                >
                  Logout
                </button>
                {/* Quick actions dropdown */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                  <button 
                    onClick={() => setShowProfileModal(true)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center"
                  >
                    <PencilIcon className="h-4 w-4 mr-2 text-gray-600" />
                    Edit Profile
                  </button>
                  <button 
                    onClick={() => setShowPaymentModal(true)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center"
                  >
                    <CreditCardIcon className="h-4 w-4 mr-2 text-gray-600" />
                    Payment Method
                  </button>
                </div>
              </div>
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
                onClick={() => setShowProfileModal(true)}
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
                onClick={() => setShowPaymentModal(true)}
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

        {/* Profile Update Modal */}
        {showProfileModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Update Profile</h3>
                <button 
                  onClick={() => setShowProfileModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Your display name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    rows="3"
                    placeholder="Tell us about yourself..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Website
                  </label>
                  <input
                    type="url"
                    value={profileForm.website}
                    onChange={(e) => setProfileForm({...profileForm, website: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="https://yourwebsite.com"
                  />
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Social Links</h4>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={profileForm.socialLinks.twitter}
                      onChange={(e) => setProfileForm({
                        ...profileForm, 
                        socialLinks: {...profileForm.socialLinks, twitter: e.target.value}
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Twitter username"
                    />
                    <input
                      type="text"
                      value={profileForm.socialLinks.facebook}
                      onChange={(e) => setProfileForm({
                        ...profileForm, 
                        socialLinks: {...profileForm.socialLinks, facebook: e.target.value}
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Facebook profile URL"
                    />
                    <input
                      type="text"
                      value={profileForm.socialLinks.instagram}
                      onChange={(e) => setProfileForm({
                        ...profileForm, 
                        socialLinks: {...profileForm.socialLinks, instagram: e.target.value}
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Instagram username"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-8">
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={updateProfile}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Payment Method Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Payment Method</h3>
                <button 
                  onClick={() => setShowPaymentModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Method
                  </label>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setPaymentForm({...paymentForm, method: 'paypal'})}
                      className={`flex-1 px-4 py-3 rounded-lg border-2 ${
                        paymentForm.method === 'paypal' 
                          ? 'border-indigo-600 bg-indigo-50' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <CreditCardIcon className="h-5 w-5 mx-auto mb-1" />
                      <span className="text-sm">PayPal</span>
                    </button>
                    <button
                      onClick={() => setPaymentForm({...paymentForm, method: 'bank'})}
                      className={`flex-1 px-4 py-3 rounded-lg border-2 ${
                        paymentForm.method === 'bank' 
                          ? 'border-indigo-600 bg-indigo-50' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <BanknotesIcon className="h-5 w-5 mx-auto mb-1" />
                      <span className="text-sm">Bank Transfer</span>
                    </button>
                  </div>
                </div>
                
                {paymentForm.method === 'paypal' ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      PayPal Email
                    </label>
                    <input
                      type="email"
                      value={paymentForm.paypalEmail}
                      onChange={(e) => setPaymentForm({...paymentForm, paypalEmail: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="your-email@example.com"
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bank Name
                      </label>
                      <input
                        type="text"
                        value={paymentForm.bankName}
                        onChange={(e) => setPaymentForm({...paymentForm, bankName: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="e.g., Chase Bank"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Account Holder Name
                      </label>
                      <input
                        type="text"
                        value={paymentForm.accountName}
                        onChange={(e) => setPaymentForm({...paymentForm, accountName: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Name as it appears on account"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Account Number
                      </label>
                      <input
                        type="text"
                        value={paymentForm.accountNumber}
                        onChange={(e) => setPaymentForm({...paymentForm, accountNumber: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="1234567890"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        SWIFT/BIC Code
                      </label>
                      <input
                        type="text"
                        value={paymentForm.swiftCode}
                        onChange={(e) => setPaymentForm({...paymentForm, swiftCode: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="CHASUS33"
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-3 mt-8">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={updatePaymentMethod}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Save Payment Method
                </button>
              </div>
            </div>
          </div>
        )}

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