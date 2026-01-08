// src/pages/program/ProgramDetail.jsx
import React, { useState } from 'react';
import { 
  ArrowLeftIcon, 
  DocumentDuplicateIcon,  // Fixed: Replaced LinkIcon with DocumentDuplicateIcon
  ChartBarIcon,
  ShoppingBagIcon,
  StarIcon,
  CreditCardIcon,
  CalendarIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const Program = () => {
  const [copied, setCopied] = useState(false);
  const [selectedTab, setSelectedTab] = useState('overview');
  
  // Sample program data (replace with API data)
  const program = {
    id: 1,
    name: "TechGadgets Pro",
    description: "Premium electronics store offering cutting-edge gadgets and accessories with exclusive affiliate commissions.",
    commission: "12-15% per sale",
    category: "Electronics",
    rating: 4.8,
    cookieDuration: "30 days",
    averageEarning: "$2.50 per conversion",
    performance: "High converting (8.2% CR)",
    payoutMethods: ["PayPal", "Bank Transfer", "Crypto"],
    terms: "Commissions valid for 30 days after click. No coupon stacking.",
    promotionalMaterials: [
      { id: 1, type: "Banner", size: "728x90", preview: "/banner1.jpg" },
      { id: 2, type: "Text Ad", content: "Get 10% off TechGadgets Pro!" },
      { id: 3, type: "Product Feed", format: "CSV", items: 1250 }
    ],
    trackingLink: "https://affilisphere.com/ref/techgadgets/aff123"
  };

  const copyLink = () => {
    navigator.clipboard.writeText(program.trackingLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back to Marketplace */}
        <div className="mb-6">
          <a 
            href="/marketplace" 
            className="flex items-center text-indigo-600 hover:text-indigo-800"
            aria-label="Back to Marketplace"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Marketplace
          </a>
        </div>
        
        {/* Program Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row">
            <div className="w-20 h-20 rounded-lg bg-indigo-100 flex items-center justify-center mr-6 mb-4 md:mb-0">
              <ShoppingBagIcon className="h-10 w-10 text-indigo-600" />
            </div>
            
            <div className="flex-1">
              <div className="flex flex-wrap justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{program.name}</h1>
                  <div className="flex items-center mt-2">
                    <div className="flex items-center text-amber-500">
                      <StarIcon className="h-5 w-5" aria-hidden="true" />
                      <span className="ml-1 font-medium">{program.rating}</span>
                    </div>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="text-gray-600">{program.category}</span>
                  </div>
                </div>
                
                <div className="mt-4 md:mt-0">
                  <button 
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-medium transition-colors"
                    aria-label="Join program"
                  >
                    Join Program
                  </button>
                </div>
              </div>
              
              <p className="mt-4 text-gray-600">{program.description}</p>
            </div>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-8">
          <button
            className={`px-4 py-3 font-medium ${
              selectedTab === 'overview' 
                ? 'text-indigo-600 border-b-2 border-indigo-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setSelectedTab('overview')}
            aria-selected={selectedTab === 'overview'}
            role="tab"
          >
            Overview
          </button>
          <button
            className={`px-4 py-3 font-medium ${
              selectedTab === 'promotion' 
                ? 'text-indigo-600 border-b-2 border-indigo-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setSelectedTab('promotion')}
            aria-selected={selectedTab === 'promotion'}
            role="tab"
          >
            Promotion Tools
          </button>
          <button
            className={`px-4 py-3 font-medium ${
              selectedTab === 'performance' 
                ? 'text-indigo-600 border-b-2 border-indigo-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setSelectedTab('performance')}
            aria-selected={selectedTab === 'performance'}
            role="tab"
          >
            Your Performance
          </button>
        </div>
        
        {/* Tab Content */}
        {selectedTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Commission Details */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Commission Details</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <CreditCardIcon className="h-6 w-6 text-indigo-600 mr-3" aria-hidden="true" />
                  <div>
                    <h3 className="font-medium text-gray-900">Commission Rate</h3>
                    <p className="text-green-600">{program.commission}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <CalendarIcon className="h-6 w-6 text-indigo-600 mr-3" aria-hidden="true" />
                  <div>
                    <h3 className="font-medium text-gray-900">Cookie Duration</h3>
                    <p>{program.cookieDuration}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <ChartBarIcon className="h-6 w-6 text-indigo-600 mr-3" aria-hidden="true" />
                  <div>
                    <h3 className="font-medium text-gray-900">Average Earnings</h3>
                    <p>{program.averageEarning}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <ShieldCheckIcon className="h-6 w-6 text-indigo-600 mr-3" aria-hidden="true" />
                  <div>
                    <h3 className="font-medium text-gray-900">Terms & Conditions</h3>
                    <p className="text-gray-600">{program.terms}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Payout Information */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Payout Information</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Payment Methods</h3>
                  <div className="flex flex-wrap gap-2">
                    {program.payoutMethods.map((method, index) => (
                      <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                        {method}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Payout Threshold</h3>
                  <p>$50 minimum payout</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Payment Schedule</h3>
                  <p>Net 30 days - Paid on the 15th of each month</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {selectedTab === 'promotion' && (
          <div className="space-y-8">
            {/* Tracking Link Generator */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Tracking Link</h2>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 border border-gray-300 rounded-lg p-3 bg-gray-50 overflow-x-auto">
                  <code className="text-sm">{program.trackingLink}</code>
                </div>
                <button 
                  onClick={copyLink}
                  className="flex items-center justify-center px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                  aria-label={copied ? "Link copied" : "Copy link"}
                >
                  <DocumentDuplicateIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                  {copied ? 'Copied!' : 'Copy Link'}
                </button>
              </div>
            </div>
            
            {/* Promotional Materials */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Promotional Materials</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {program.promotionalMaterials.map(material => (
                  <div key={material.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="font-medium text-gray-900 mb-2">{material.type}</div>
                    {material.size && <div className="text-sm text-gray-600 mb-2">Size: {material.size}</div>}
                    {material.format && <div className="text-sm text-gray-600 mb-2">Format: {material.format}</div>}
                    {material.items && <div className="text-sm text-gray-600 mb-2">Items: {material.items}</div>}
                    <button 
                      className="mt-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                      aria-label={`Download ${material.type}`}
                    >
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {selectedTab === 'performance' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Your Performance</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Clicks</div>
                <div className="text-xl font-bold">142</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Conversions</div>
                <div className="text-xl font-bold">12</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Commission</div>
                <div className="text-xl font-bold">$28.50</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Conversion Rate</div>
                <div className="text-xl font-bold">8.45%</div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-3">Performance Timeline</h3>
              <div 
                className="h-64 border border-gray-200 rounded-lg flex items-center justify-center text-gray-500"
                aria-label="Performance chart"
              >
                Conversion Chart Placeholder
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Program;