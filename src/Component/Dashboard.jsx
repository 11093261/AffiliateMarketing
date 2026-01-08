// src/components/dashboard/AffiliateDashboard.jsx
import React, { useState } from 'react';
import { 
  BoltIcon, 
  LinkIcon, 
  CurrencyDollarIcon,
  UserCircleIcon,
  ChartBarIcon,
  ArrowRightIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const [onboardingProgress, setOnboardingProgress] = useState(40);
  const [completedTasks, setCompletedTasks] = useState({
    profile: false,
    payment: false,
    firstLink: false,
    tutorial: false
  });

  const toggleTask = (task) => {
    setCompletedTasks(prev => {
      const updated = {...prev, [task]: !prev[task]};
      // Calculate new progress
      const completedCount = Object.values(updated).filter(Boolean).length;
      setOnboardingProgress((completedCount / 4) * 100);
      return updated;
    });
  };

  // Sample programs data
  const recommendedPrograms = [
    { id: 1, name: "TechGadgets Pro", commission: "12-15%", category: "Electronics" },
    { id: 2, name: "FitnessFuel", commission: "8% + bonuses", category: "Health" },
    { id: 3, name: "DesignMaster Suite", commission: "30% recurring", category: "Software" },
    { id: 4, name: "EcoHome Essentials", commission: "10% flat", category: "Lifestyle" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center">
              {/* <LightningBoltIcon className="h-6 w-6 text-white" /> */}
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
                <span className="font-medium text-indigo-700">A</span>
              </div>
              <span className="font-medium text-gray-700">Alex M.</span>
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
              {/* Task 1 */}
              <div 
                className={`p-4 rounded-xl border ${
                  completedTasks.profile 
                    ? "border-green-500 bg-green-50" 
                    : "border-gray-200 hover:border-indigo-300 cursor-pointer"
                } transition-all`}
                onClick={() => toggleTask('profile')}
              >
                <div className="flex items-start">
                  <div className={`mr-3 mt-0.5 ${
                    completedTasks.profile ? "text-green-500" : "text-indigo-600"
                  }`}>
                    {completedTasks.profile 
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
              
              {/* Task 2 */}
              <div 
                className={`p-4 rounded-xl border ${
                  completedTasks.payment 
                    ? "border-green-500 bg-green-50" 
                    : "border-gray-200 hover:border-indigo-300 cursor-pointer"
                } transition-all`}
                onClick={() => toggleTask('payment')}
              >
                <div className="flex items-start">
                  <div className={`mr-3 mt-0.5 ${
                    completedTasks.payment ? "text-green-500" : "text-indigo-600"
                  }`}>
                    {completedTasks.payment 
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
              
              {/* Task 3 */}
              <div 
                className={`p-4 rounded-xl border ${
                  completedTasks.firstLink 
                    ? "border-green-500 bg-green-50" 
                    : "border-gray-200 hover:border-indigo-300 cursor-pointer"
                } transition-all`}
                onClick={() => toggleTask('firstLink')}
              >
                <div className="flex items-start">
                  <div className={`mr-3 mt-0.5 ${
                    completedTasks.firstLink ? "text-green-500" : "text-indigo-600"
                  }`}>
                    {completedTasks.firstLink 
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
              
              {/* Task 4 */}
              <div 
                className={`p-4 rounded-xl border ${
                  completedTasks.tutorial 
                    ? "border-green-500 bg-green-50" 
                    : "border-gray-200 hover:border-indigo-300 cursor-pointer"
                } transition-all`}
                onClick={() => toggleTask('tutorial')}
              >
                <div className="flex items-start">
                  <div className={`mr-3 mt-0.5 ${
                    completedTasks.tutorial ? "text-green-500" : "text-indigo-600"
                  }`}>
                    {completedTasks.tutorial 
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
                <div className="text-2xl font-bold text-white">0</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-white text-sm mb-1">Conversions</div>
                <div className="text-2xl font-bold text-white">0</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-white text-sm mb-1">Commissions</div>
                <div className="text-2xl font-bold text-white">$0.00</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-white text-sm mb-1">Payout</div>
                <div className="text-2xl font-bold text-white">$50.00</div>
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendedPrograms.map(program => (
                <div 
                  key={program.id}
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
                    <button className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-2 text-sm font-medium transition-colors">
                      Join Program
                    </button>
                  </div>
                </div>
              ))}
            </div>
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
            <button className="w-full bg-white text-indigo-600 hover:bg-indigo-50 rounded-lg py-2.5 font-medium transition-colors">
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
            <button className="w-full bg-white text-purple-600 hover:bg-purple-50 rounded-lg py-2.5 font-medium transition-colors">
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
            <button className="w-full bg-white text-teal-600 hover:bg-teal-50 rounded-lg py-2.5 font-medium transition-colors">
              View Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;