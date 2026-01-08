// src/pages/reports/PerformanceReport.jsx
import React, { useState } from 'react';
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  UserGroupIcon,
  ShoppingCartIcon,
  ArrowPathIcon,
  CalendarIcon,
  ChevronDownIcon,
  InformationCircleIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

const Performance = () => {
  const [dateRange, setDateRange] = useState('last_30_days');
  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock performance data
  const performanceData = {
    overview: {
      totalClicks: 4825,
      totalConversions: 128,
      conversionRate: 2.65,
      totalEarnings: 2860.50,
      averageOrderValue: 89.75,
      topCampaign: 'Summer Sale 2023',
      topProgram: 'TechGadgets Pro',
      topProduct: 'Wireless Noise-Canceling Headphones'
    },
    campaigns: [
      { id: 1, name: 'Summer Sale 2023', clicks: 1820, conversions: 54, revenue: 1520.00, status: 'active' },
      { id: 2, name: 'Back to School', clicks: 1280, conversions: 32, revenue: 860.50, status: 'completed' },
      { id: 3, name: 'Tech Tuesday', clicks: 950, conversions: 24, revenue: 480.00, status: 'active' },
      { id: 4, name: 'Weekend Flash Sale', clicks: 775, conversions: 18, revenue: 420.00, status: 'completed' },
    ],
    programs: [
      { id: 1, name: 'TechGadgets Pro', clicks: 2250, conversions: 68, revenue: 1620.00 },
      { id: 2, name: 'FitnessFuel Supplements', clicks: 980, conversions: 24, revenue: 480.00 },
      { id: 3, name: 'DesignMaster Suite', clicks: 780, conversions: 18, revenue: 420.00 },
      { id: 4, name: 'EcoHome Essentials', clicks: 815, conversions: 18, revenue: 340.50 },
    ],
    timeline: [
      { date: '2023-07-01', clicks: 120, conversions: 3, revenue: 85.00 },
      { date: '2023-07-02', clicks: 85, conversions: 2, revenue: 62.50 },
      { date: '2023-07-03', clicks: 145, conversions: 5, revenue: 210.00 },
      { date: '2023-07-04', clicks: 110, conversions: 4, revenue: 175.00 },
      { date: '2023-07-05', clicks: 180, conversions: 6, revenue: 320.00 },
      { date: '2023-07-06', clicks: 210, conversions: 8, revenue: 425.00 },
      { date: '2023-07-07', clicks: 190, conversions: 7, revenue: 380.00 },
    ]
  };
  
  // Date range options
  const dateRanges = [
    { id: 'today', label: 'Today' },
    { id: 'yesterday', label: 'Yesterday' },
    { id: 'last_7_days', label: 'Last 7 days' },
    { id: 'last_30_days', label: 'Last 30 days' },
    { id: 'this_month', label: 'This Month' },
    { id: 'last_month', label: 'Last Month' },
    { id: 'custom', label: 'Custom Range' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Performance Report</h1>
            <p className="text-gray-600 mt-2">
              Track and analyze your affiliate marketing performance
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <div className="relative">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
              >
                {dateRanges.map((range) => (
                  <option key={range.id} value={range.id}>
                    {range.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
              </div>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <ChevronDownIcon className="h-4 w-4" />
              </div>
            </div>
            
            <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50">
              <FunnelIcon className="h-5 w-5 text-gray-500 mr-2" />
              <span>Filters</span>
            </button>
            
            <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              <ArrowPathIcon className="h-5 w-5 mr-2" />
              <span>Refresh</span>
            </button>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-indigo-500">
            <div className="flex items-center">
              <div className="p-3 bg-indigo-100 rounded-lg mr-4">
                <ArrowTrendingUpIcon className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Clicks</p>
                <p className="text-2xl font-bold text-gray-900">{performanceData.overview.totalClicks.toLocaleString()}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
              <span>12.4% increase</span>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg mr-4">
                <ShoppingCartIcon className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Conversions</p>
                <p className="text-2xl font-bold text-gray-900">{performanceData.overview.totalConversions.toLocaleString()}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
              <span>8.2% increase</span>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg mr-4">
                <CurrencyDollarIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900">${performanceData.overview.totalEarnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
              <span>15.7% increase</span>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg mr-4">
                <UserGroupIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-900">{performanceData.overview.conversionRate}%</p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-red-600">
              <ArrowTrendingUpIcon className="h-4 w-4 mr-1 rotate-180" />
              <span>1.2% decrease</span>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {['Overview', 'Campaigns', 'Programs', 'Timeline'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.toLowerCase()
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
        
        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          {activeTab === 'overview' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Performance Overview</h2>
                <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center">
                  <InformationCircleIcon className="h-5 w-5 mr-1" />
                  How to improve
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div>
                  <div className="bg-gray-50 rounded-lg p-6 mb-6">
                    <h3 className="font-medium text-gray-900 mb-4">Top Performing Campaign</h3>
                    <div className="flex items-center">
                      <div className="bg-indigo-100 rounded-lg p-3 mr-4">
                        <ChartBarIcon className="h-8 w-8 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-gray-900">{performanceData.overview.topCampaign}</p>
                        <p className="text-gray-600">Highest conversion rate and earnings</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-medium text-gray-900 mb-4">Top Affiliate Program</h3>
                    <div className="flex items-center">
                      <div className="bg-green-100 rounded-lg p-3 mr-4">
                        <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-gray-900">{performanceData.overview.topProgram}</p>
                        <p className="text-gray-600">Highest earnings per click</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Right Column */}
                <div>
                  <div className="bg-gray-50 rounded-lg p-6 mb-6">
                    <h3 className="font-medium text-gray-900 mb-4">Best Selling Product</h3>
                    <div className="flex items-center">
                      <div className="bg-purple-100 rounded-lg p-3 mr-4">
                        <ShoppingCartIcon className="h-8 w-8 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-gray-900">{performanceData.overview.topProduct}</p>
                        <p className="text-gray-600">Highest conversion rate</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-medium text-gray-900 mb-4">Average Order Value</h3>
                    <div className="flex items-center">
                      <div className="bg-blue-100 rounded-lg p-3 mr-4">
                        <CurrencyDollarIcon className="h-8 w-8 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">${performanceData.overview.averageOrderValue.toFixed(2)}</p>
                        <p className="text-gray-600">Increased by 8.5% from last month</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'campaigns' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Campaign Performance</h2>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clicks</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conversions</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conversion Rate</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {performanceData.campaigns.map((campaign) => (
                      <tr key={campaign.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            campaign.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {campaign.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {campaign.clicks.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {campaign.conversions.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ${campaign.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {((campaign.conversions / campaign.clicks) * 100).toFixed(2)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {activeTab === 'programs' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Program Performance</h2>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clicks</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conversions</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conversion Rate</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Earnings Per Click</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {performanceData.programs.map((program) => (
                      <tr key={program.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{program.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {program.clicks.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {program.conversions.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ${program.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {((program.conversions / program.clicks) * 100).toFixed(2)}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ${(program.revenue / program.clicks).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {activeTab === 'timeline' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Performance Timeline</h2>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clicks</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conversions</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conversion Rate</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {performanceData.timeline.map((day, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{new Date(day.date).toLocaleDateString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {day.clicks.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {day.conversions.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ${day.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {((day.conversions / day.clicks) * 100).toFixed(2)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
        
        {/* Recommendations */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
          <h3 className="text-lg font-bold text-indigo-900 mb-3">Performance Recommendations</h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <div className="h-5 w-5 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-indigo-800 font-bold text-xs">1</span>
                </div>
              </div>
              <p className="ml-3 text-gray-700">
                <span className="font-medium">Optimize your TechGadgets Pro links</span> - They're generating the highest revenue per click at $0.72. Consider promoting them more prominently.
              </p>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <div className="h-5 w-5 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-indigo-800 font-bold text-xs">2</span>
                </div>
              </div>
              <p className="ml-3 text-gray-700">
                <span className="font-medium">Replicate your Summer Sale campaign strategy</span> - It has the highest conversion rate at 2.97%. Analyze what worked and apply it to other campaigns.
              </p>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <div className="h-5 w-5 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-indigo-800 font-bold text-xs">3</span>
                </div>
              </div>
              <p className="ml-3 text-gray-700">
                <span className="font-medium">Improve EcoHome Essentials performance</span> - It has the lowest conversion rate at 2.21%. Consider testing different call-to-actions or placements.
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Performance;