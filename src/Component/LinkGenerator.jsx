// src/pages/links/LinkGenerator.jsx
import React, { useState, useEffect } from 'react';
import { 
  LinkIcon, 
  DocumentDuplicateIcon,
  ChevronDownIcon,
  TrashIcon,
  ArrowPathIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const LinkGenerator = () => {
  // State for form inputs
  const [selectedProgram, setSelectedProgram] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [campaignName, setCampaignName] = useState('');
  const [destinationUrl, setDestinationUrl] = useState('');
  
  // Generated link state
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);
  
  // History state
  const [linkHistory, setLinkHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  
  // Mock programs data (replace with API call)
  const programs = [
    { id: 'techgadgets', name: 'TechGadgets Pro', baseUrl: 'https://techgadgets.com/ref/affilisphere' },
    { id: 'fitfuel', name: 'FitnessFuel Supplements', baseUrl: 'https://fitfuel.com/ref/affilisphere' },
    { id: 'designmaster', name: 'DesignMaster Suite', baseUrl: 'https://designmaster.com/ref/affilisphere' },
    { id: 'ecohome', name: 'EcoHome Essentials', baseUrl: 'https://ecohome.com/ref/affilisphere' },
  ];

  // Generate tracking link
  const generateLink = () => {
    if (!selectedProgram || !destinationUrl) {
      alert('Please select a program and enter a destination URL');
      return;
    }
    
    const program = programs.find(p => p.id === selectedProgram);
    let trackingLink = `${program.baseUrl}`;
    
    // Add custom slug if provided
    if (customSlug) {
      trackingLink += `/${customSlug}`;
    }
    
    // Add UTM parameters
    const utmParams = new URLSearchParams();
    if (campaignName) utmParams.append('utm_campaign', campaignName);
    utmParams.append('utm_source', 'affilisphere');
    utmParams.append('utm_medium', 'affiliate');
    
    // Create final link with redirect
    const finalLink = `https://track.affilisphere.com/redirect?to=${encodeURIComponent(destinationUrl)}&ref=${trackingLink}&${utmParams.toString()}`;
    
    setGeneratedLink(finalLink);
    
    // Add to history
    const newLink = {
      id: Date.now(),
      program: program.name,
      link: finalLink,
      date: new Date().toLocaleString(),
      clicks: 0,
      conversions: 0
    };
    
    setLinkHistory([newLink, ...linkHistory]);
    
    // Reset form
    setCustomSlug('');
    setCampaignName('');
  };

  // Copy link to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Delete link from history
  const deleteLink = (id) => {
    setLinkHistory(linkHistory.filter(link => link.id !== id));
  };

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('linkHistory');
    if (savedHistory) {
      setLinkHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save history to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('linkHistory', JSON.stringify(linkHistory));
  }, [linkHistory]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Affiliate Link Generator</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Create and manage your tracking links to maximize your earnings
          </p>
        </div>
        
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
                          {program.name}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <ChevronDownIcon className="h-5 w-5" />
                    </div>
                  </div>
                </div>
                
                {/* Destination URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Destination URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.com/product"
                    value={destinationUrl}
                    onChange={(e) => setDestinationUrl(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                {/* Custom Slug */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Slug (optional)
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      {selectedProgram ? 
                        programs.find(p => p.id === selectedProgram)?.baseUrl + '/' : 
                        'https://program.com/ref/affilisphere/'}
                    </span>
                    <input
                      type="text"
                      placeholder="your-custom-slug"
                      value={customSlug}
                      onChange={(e) => setCustomSlug(e.target.value)}
                      className="flex-1 min-w-0 block w-full px-3 py-3 rounded-none rounded-r-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
                
                {/* Campaign Name */}
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
                    Helps track performance of specific campaigns
                  </p>
                </div>
                
                {/* Generate Button */}
                <button
                  onClick={generateLink}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg shadow-md transition-all transform hover:scale-[1.02]"
                >
                  Generate Tracking Link
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
            
            {linkHistory.length === 0 ? (
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
                  <div key={link.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">{link.program}</h3>
                        <p className="text-sm text-gray-500 mt-1">{link.date}</p>
                        <div className="mt-2 flex items-center text-sm">
                          <span className="text-gray-600 mr-3">
                            <span className="font-medium">{link.clicks}</span> clicks
                          </span>
                          <span className="text-gray-600">
                            <span className="font-medium">{link.conversions}</span> conversions
                          </span>
                        </div>
                      </div>
                      <button 
                        onClick={() => deleteLink(link.id)}
                        className="text-gray-400 hover:text-red-500 ml-2"
                        aria-label="Delete link"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="mt-3 bg-gray-50 rounded p-2 text-sm overflow-x-auto">
                      <code className="text-xs break-all">{link.link}</code>
                    </div>
                    <div className="mt-3 flex space-x-2">
                      <button className="text-xs bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-2 py-1 rounded">
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
              <span>Use descriptive custom slugs for better tracking (e.g. summer-sale-blog-post)</span>
            </li>
            <li className="flex items-start">
              <span className="text-indigo-600 mr-2">•</span>
              <span>Always name your campaigns to track performance across different channels</span>
            </li>
            <li className="flex items-start">
              <span className="text-indigo-600 mr-2">•</span>
              <span>Create unique links for different content sources (blog, social media, email)</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LinkGenerator;