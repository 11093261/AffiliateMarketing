import React, { useState } from 'react';

const Payout = () => {
  // State for form data
  const [payoutData, setPayoutData] = useState({
    method: 'paypal',
    email: '',
    accountNumber: '',
    routingNumber: '',
    threshold: 50,
    currency: 'USD',
    schedule: 'weekly'
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayoutData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Payout settings saved:', payoutData);
    // Add API call to save data here
    alert('Payout settings saved successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Payout Settings</h1>
      
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-8">
        {/* Payout Method Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Payout Method</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { id: 'paypal', label: 'PayPal', icon: 'PayPal' },
              { id: 'bank', label: 'Bank Transfer', icon: 'Bank' },
              { id: 'crypto', label: 'Crypto', icon: 'Crypto' }
            ].map((method) => (
              <label 
                key={method.id}
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  payoutData.method === method.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="method"
                    value={method.id}
                    checked={payoutData.method === method.id}
                    onChange={handleChange}
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-3 block text-sm font-medium text-gray-700">
                    {method.label}
                  </span>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  {method.icon} {/* In production, use actual icon component */}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Payment Details - Dynamic based on selection */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Payment Details</h2>
          
          {payoutData.method === 'paypal' && (
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  PayPal Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={payoutData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="your@email.com"
                />
              </div>
            </div>
          )}

          {payoutData.method === 'bank' && (
            <div className="space-y-4">
              <div>
                <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Account Number
                </label>
                <input
                  type="text"
                  id="accountNumber"
                  name="accountNumber"
                  value={payoutData.accountNumber}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="123456789"
                />
              </div>
              <div>
                <label htmlFor="routingNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Routing Number
                </label>
                <input
                  type="text"
                  id="routingNumber"
                  name="routingNumber"
                  value={payoutData.routingNumber}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="021000021"
                />
              </div>
            </div>
          )}

          {payoutData.method === 'crypto' && (
            <div className="space-y-4">
              <div>
                <label htmlFor="walletAddress" className="block text-sm font-medium text-gray-700 mb-1">
                  Wallet Address
                </label>
                <input
                  type="text"
                  id="walletAddress"
                  name="walletAddress"
                  value={payoutData.walletAddress || ''}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
                />
              </div>
            </div>
          )}
        </div>

        {/* Payout Preferences */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <label htmlFor="threshold" className="block text-sm font-medium text-gray-700 mb-1">
              Payout Threshold ($)
            </label>
            <input
              type="number"
              id="threshold"
              name="threshold"
              value={payoutData.threshold}
              onChange={handleChange}
              min="10"
              step="5"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="mt-2 text-xs text-gray-500">
              Minimum amount required to trigger a payout
            </p>
          </div>

          <div>
            <label htmlFor="schedule" className="block text-sm font-medium text-gray-700 mb-1">
              Payout Schedule
            </label>
            <select
              id="schedule"
              name="schedule"
              value={payoutData.schedule}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="bi-weekly">Bi-Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </div>

        {/* Currency Selection */}
        <div className="mb-8">
          <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
            Payment Currency
          </label>
          <select
            id="currency"
            name="currency"
            value={payoutData.currency}
            onChange={handleChange}
            className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="BTC">Bitcoin (BTC)</option>
            <option value="ETH">Ethereum (ETH)</option>
          </select>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Save Settings
          </button>
        </div>
      </form>

      {/* Security Assurance */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200 flex items-start">
        <div className="flex-shrink-0 mr-3 text-blue-500">
          {/* Security icon placeholder */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <p className="text-sm text-blue-700">
          All your payout information is securely encrypted and processed following PCI DSS compliance standards. 
          We never store your full banking credentials.
        </p>
      </div>
    </div>
  );
};

export default Payout;