// src/pages/links/LinkGenerator.jsx
import React, { useState, useEffect } from 'react';
import { 
  LinkIcon, 
  DocumentDuplicateIcon,
  ChevronDownIcon,
  TrashIcon,
  ArrowPathIcon,
  ChartBarIcon,
  ExclamationCircleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../Component/context/AuthContext';

const LinkGenerator = () => {
  const { getAuthToken, user } = useAuth();
  const Base_url = import.meta.env.VITE_API_URL || "https://afffiliate.onrender.com"

  const [selectedProgram, setSelectedProgram] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [campaignName, setCampaignName] = useState('');
  const [destinationUrl, setDestinationUrl] = useState('');

  const [programs, setPrograms] = useState([]);
  const [loadingPrograms, setLoadingPrograms] = useState(true);
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [linkHistory, setLinkHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    fetchPrograms();
    fetchLinkHistory();
  }, []);

  const fetchPrograms = async () => {
    try {
      setLoadingPrograms(true);
      const token = getAuthToken();
      const response = await fetch(`${BASE_URL}/api/Allprogram`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (!response.ok) throw new Error('Failed to fetch programs');
      const data = await response.json();
      setPrograms(data);
    } catch (err) {
      console.error('Error fetching programs:', err);
      setError('Could not load programs. Please refresh the page.');
    } finally {
      setLoadingPrograms(false);
    }
  };

  const fetchLinkHistory = async () => {
    try {
      setLoadingHistory(true);
      const token = getAuthToken();
      if (!token) return;
      const response = await fetch(`${BASE_URL}/api/affiliate/links`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch history');
      const data = await response.json();
      setLinkHistory(data.links);
    } catch (err) {
      console.error('Error fetching history:', err);
      const savedHistory = localStorage.getItem('linkHistory');
      if (savedHistory) setLinkHistory(JSON.parse(savedHistory));
    } finally {
      setLoadingHistory(false);
    }
  };

  const generateLink = async () => {
    if (!selectedProgram) {
      setError('Please select a program');
      setTimeout(() => setError(''), 3000);
      return;
    }

    setGenerating(true);
    setError('');
    setSuccess('');
    
    try {
      const token = getAuthToken();
      if (!token) throw new Error('Not authenticated');

      const response = await fetch(`${BASE_URL}/api/affiliate/links`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ programId: selectedProgram })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate link');
      }

      const data = await response.json();
      // Build final tracking URL with optional campaign name as UTM
      let finalUrl = data.link.affiliateUrl;
      if (campaignName) {
        const url = new URL(finalUrl);
        url.searchParams.set('utm_campaign', campaignName);
        finalUrl = url.toString();
      }
      setGeneratedLink(finalUrl);
      setSuccess('Link generated successfully!');
      setTimeout(() => setSuccess(''), 3000);
      
      // Refresh history
      fetchLinkHistory();
      
      // Reset form
      setCustomSlug('');
      setCampaignName('');
      setDestinationUrl('');
      
    } catch (err) {
      console.error('Error generating link:', err);
      setError(err.message);
      setTimeout(() => setError(''), 5000);
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (!generatedLink) return;
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const deleteLink = async (linkId) => {
    if (!window.confirm('Are you sure you want to delete this link?')) return;
    
    try {
      const token = getAuthToken();
      const response = await fetch(`${BASE_URL}/api/affiliate/links/${linkId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to delete');
      
      setLinkHistory(prev => prev.filter(link => link._id !== linkId));
    } catch (err) {
      console.error('Error deleting link:', err);
      setError('Failed to delete link');
      setTimeout(() => setError(''), 3000);
    }
  };

  if (loadingPrograms) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading programs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Affiliate Link Generator</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Create and manage your tracking links to maximize your earnings
          </p>
        </div>
        
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
            <ExclamationCircleIcon className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
            <CheckCircleIcon className="h-5 w-5 mr-2" />
            <span>{success}</span>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Generator Form */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Create New Tracking Link</h2>
              
              <div className="space-y-6">
                {/* Program Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Program
                  </label>
                  <div className="relative">
                    <select
                      value={selectedProgram}
                      onChange={(e) => setSelectedProgram(e.target.value)}
                      className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                    >
                      <option value="">Choose a program</option>
                      {programs.map(program => (
                        <option key={program.id} value={program.id}>
                          {program.name} - {program.commission} commission
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <ChevronDownIcon className="h-5 w-5" />
                    </div>
                  </div>
                </div>
                
                {/* Campaign Name (optional) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Campaign Name (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Summer Sale Campaign"
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Helps track performance of specific campaigns (added as UTM parameter)
                  </p>
                </div>
                
                {/* Generate Button */}
                <button
                  onClick={generateLink}
                  disabled={generating}
                  className={`w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg shadow-md transition-all transform hover:scale-[1.02] ${
                    generating ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {generating ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating...
                    </span>
                  ) : 'Generate Tracking Link'}
                </button>
              </div>
            </div>
            
            {/* Generated Link */}
            {generatedLink && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Your Tracking Link</h3>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 bg-gray-50 border border-gray-300 rounded-lg p-3 overflow-x-auto">
                    <code className="text-sm break-all">{generatedLink}</code>
                  </div>
                  <button
                    onClick={copyToClipboard}
                    className={`flex items-center justify-center px-4 py-3 rounded-lg transition-colors ${
                      copied 
                        ? 'bg-green-600 text-white' 
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                  >
                    <DocumentDuplicateIcon className="h-5 w-5 mr-2" />
                    {copied ? 'Copied!' : 'Copy Link'}
                  </button>
                </div>
                <div className="mt-4 flex space-x-3">
                  <button className="flex items-center text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                    <ChartBarIcon className="h-4 w-4 mr-1" />
                    View Analytics
                  </button>
                  <button className="flex items-center text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                    <ArrowPathIcon className="h-4 w-4 mr-1" />
                    Regenerate
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Link History */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Links</h2>
              <button 
                onClick={() => setShowHistory(!showHistory)}
                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
              >
                {showHistory ? 'Hide' : 'Show All'}
              </button>
            </div>
            
            {loadingHistory ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : linkHistory.length === 0 ? (
              <div className="text-center py-10">
                <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-gray-100 mb-4">
                  <LinkIcon className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No links generated yet</h3>
                <p className="text-gray-500">
                  Create your first tracking link to get started
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {(showHistory ? linkHistory : linkHistory.slice(0, 3)).map((link) => (
                  <div key={link._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">{link.program?.name || 'Program'}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(link.createdAt).toLocaleString()}
                        </p>
                        <div className="mt-2 flex items-center text-sm">
                          <span className="text-gray-600 mr-3">
                            <span className="font-medium">{link.clicks || 0}</span> clicks
                          </span>
                          <span className="text-gray-600">
                            <span className="font-medium">{link.conversions || 0}</span> conversions
                          </span>
                        </div>
                      </div>
                      <button 
                        onClick={() => deleteLink(link._id)}
                        className="text-gray-400 hover:text-red-500 ml-2"
                        aria-label="Delete link"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="mt-3 bg-gray-50 rounded p-2 text-sm overflow-x-auto">
                      <code className="text-xs break-all">{link.affiliateUrl}</code>
                    </div>
                    <div className="mt-3 flex space-x-2">
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(link.affiliateUrl);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }}
                        className="text-xs bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-2 py-1 rounded"
                      >
                        Copy
                      </button>
                      <button className="text-xs bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-2 py-1 rounded">
                        Analytics
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Quick Tips */}
        <div className="mt-10 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
          <h3 className="text-lg font-bold text-indigo-900 mb-3">Link Generation Tips</h3>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="text-indigo-600 mr-2">•</span>
              <span>Use descriptive campaign names for better tracking</span>
            </li>
            <li className="flex items-start">
              <span className="text-indigo-600 mr-2">•</span>
              <span>Create unique links for different content sources (blog, social media, email)</span>
            </li>
            <li className="flex items-start">
              <span className="text-indigo-600 mr-2">•</span>
              <span>Monitor your link performance in the dashboard</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LinkGenerator;