// src/pages/program/ProgramDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../Component/context/AuthContext';
import { 
  ArrowLeftIcon, 
  DocumentDuplicateIcon,
  ChartBarIcon,
  ShoppingBagIcon,
  StarIcon,
  CreditCardIcon,
  CalendarIcon,
  ShieldCheckIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

const Program = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getAuthToken } = useAuth();
  const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4500';
  
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    fetchProgram();
  }, [id]);

  const fetchProgram = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      const response = await fetch(`${BASE_URL}/api/program/${id}`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (!response.ok) throw new Error('Failed to fetch program');
      const data = await response.json();
      setProgram(data);
    } catch (err) {
      console.error('Error fetching program:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    if (!program?.trackingLink) return;
    navigator.clipboard.writeText(program.trackingLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleJoinProgram = async () => {
    try {
      setJoining(true);
      const token = getAuthToken();
      if (!token) {
        navigate('/login');
        return;
      }
      
      const response = await fetch(`${BASE_URL}/api/affiliate/links`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ programId: id })
      });
      
      if (!response.ok) throw new Error('Failed to join program');
      const data = await response.json();
      alert(`Success! Your affiliate link: ${data.link.affiliateUrl}`);
      navigate('/dashboard'); // or stay on page
    } catch (err) {
      console.error('Join error:', err);
      alert(err.message);
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading program details...</p>
        </div>
      </div>
    );
  }

  if (error || !program) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ExclamationCircleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800">Program not found</h2>
          <button
            onClick={() => navigate('/marketplace')}
            className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg"
          >
            Back to Marketplace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back to Marketplace */}
        <div className="mb-6">
          <button 
            onClick={() => navigate('/marketplace')}
            className="flex items-center text-indigo-600 hover:text-indigo-800"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Marketplace
          </button>
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
                      <StarIcon className="h-5 w-5" />
                      <span className="ml-1 font-medium">{program.rating || 'N/A'}</span>
                    </div>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="text-gray-600">{program.category}</span>
                  </div>
                </div>
                
                <div className="mt-4 md:mt-0">
                  <button 
                    onClick={handleJoinProgram}
                    disabled={joining}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                  >
                    {joining ? 'Joining...' : 'Join Program'}
                  </button>
                </div>
              </div>
              
              <p className="mt-4 text-gray-600">{program.description || 'No description available.'}</p>
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
          >
            Your Performance
          </button>
        </div>
        
        {/* Tab Content */}
        {selectedTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Commission Details</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <CreditCardIcon className="h-6 w-6 text-indigo-600 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900">Commission Rate</h3>
                    <p className="text-green-600">{program.commission || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <CalendarIcon className="h-6 w-6 text-indigo-600 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900">Cookie Duration</h3>
                    <p>{program.cookieDuration || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <ChartBarIcon className="h-6 w-6 text-indigo-600 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900">Average Earnings</h3>
                    <p>{program.averageEarning || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <ShieldCheckIcon className="h-6 w-6 text-indigo-600 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900">Terms & Conditions</h3>
                    <p className="text-gray-600">{program.terms || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Payout Information</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Payment Methods</h3>
                  <div className="flex flex-wrap gap-2">
                    {(program.payoutMethods || []).map((method, idx) => (
                      <span key={idx} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                        {method}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Minimum Payout</h3>
                  <p>${program.minimumPayout || 50}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Payout Frequency</h3>
                  <p>{program.payoutFrequency || 'Monthly'}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {selectedTab === 'promotion' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Tracking Link</h2>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 border border-gray-300 rounded-lg p-3 bg-gray-50 overflow-x-auto">
                  <code className="text-sm">{program.trackingLink || 'Not available'}</code>
                </div>
                <button 
                  onClick={copyLink}
                  disabled={!program.trackingLink}
                  className="flex items-center justify-center px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  <DocumentDuplicateIcon className="h-5 w-5 mr-2" />
                  {copied ? 'Copied!' : 'Copy Link'}
                </button>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Promotional Materials</h2>
              {program.promotionalMaterials && program.promotionalMaterials.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {program.promotionalMaterials.map(material => (
                    <div key={material.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md">
                      <div className="font-medium text-gray-900 mb-2">{material.type}</div>
                      {material.size && <div className="text-sm text-gray-600 mb-2">Size: {material.size}</div>}
                      {material.format && <div className="text-sm text-gray-600 mb-2">Format: {material.format}</div>}
                      <button className="mt-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No promotional materials available yet.</p>
              )}
            </div>
          </div>
        )}
        
        {selectedTab === 'performance' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Your Performance</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Clicks</div>
                <div className="text-xl font-bold">0</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Conversions</div>
                <div className="text-xl font-bold">0</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Commission</div>
                <div className="text-xl font-bold">$0.00</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Conversion Rate</div>
                <div className="text-xl font-bold">0%</div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center text-gray-500">
              Performance data will appear once you start sharing your links.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Program;