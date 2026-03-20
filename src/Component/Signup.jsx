import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    company: '',
    phone: '',
    terms: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // ✅ Use environment variable if set, otherwise default to Render URL
  const Base_url = import.meta.env.VITE_API_URL || "https://afffiliate.onrender.com";

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : (value || '');
    
    setFormData(prev => ({
      ...prev,
      [name]: inputValue
    }));
    
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log(`Using Base URL: ${Base_url}`);
    
    // Enhanced validation
    if (!formData.username || !formData.email || !formData.password || !formData.phone) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    if (!formData.terms) {
      setErrorMessage("You must agree to the Terms and Privacy Policy.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      console.log(`Attempting to register via: ${Base_url}/api/register`);
      console.log('Sending data:', { 
        ...formData, 
        password: '[HIDDEN]'
      });
      
      // Shorter timeout for localhost, longer for Render (cold start)
      const timeout = Base_url.includes('localhost') ? 15000 : 30000;
      
      const response = await axios.post(`${Base_url}/api/register`, formData, {
        timeout: timeout,
      });
      
      console.log("Registration successful:", response.data);
      
      if (response.data.success) {
        alert(`Welcome ${formData.username}! Registration successful.`);
        
        // Clear form
        setFormData({
          username: '',
          email: '',
          password: '',
          company: '',
          phone: '',
          terms: false
        });
        
        navigate('/Login');
      } else {
        setErrorMessage(response.data.message || "Registration failed. Please try again.");
      }
      
    } catch (error) {
      console.error("Registration failed:", error);
      console.error("Error details:", {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status
      });
      
      if (error.response) {
        if (error.response.status === 409) {
          setErrorMessage("Email already registered. Please use a different email or login.");
        } else if (error.response.status === 400) {
          setErrorMessage(error.response.data.message || "Invalid input. Please check your details.");
        } else if (error.response.status === 401) {
          setErrorMessage("Registration not authorized. Please contact support.");
        } else if (error.response.status === 500) {
          setErrorMessage("Server error. Please try again later or contact support.");
        } else {
          setErrorMessage(`Server error (${error.response.status}). Please try again.`);
        }
      } else if (error.code === 'ECONNABORTED') {
        setErrorMessage(
          `Request timeout. The server at ${Base_url} is not responding.\n\n` +
          `Possible reasons:\n` +
          `• Backend server is not running or is still starting up (Render free tier spins down after inactivity).\n` +
          `• CORS issues (check backend CORS configuration).\n` +
          `• Network/firewall blocking the request.\n\n` +
          `Try waiting a moment and refresh, or check backend logs.`
        );
      } else if (error.request) {
        setErrorMessage(
          `Cannot reach the server at ${Base_url}.\n\n` +
          `Make sure:\n` +
          `• Backend server is running\n` +
          `• You're using the correct URL\n` +
          `• No CORS policy is blocking the request`
        );
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-2xl p-4 w-20 h-20 flex items-center justify-center shadow-lg">
            <div className="relative">
              <div className="absolute -inset-2 bg-white rounded-full opacity-30"></div>
              <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          AffiliSphere
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 max-w">
          Join the largest affiliate marketing network
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl rounded-2xl sm:px-10 border border-indigo-50">
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm whitespace-pre-line">
              <div className="flex items-start">
                <svg className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{errorMessage}</span>
              </div>
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username || ''}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter your full name"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email || ''}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="you@example.com"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password || ''}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="At least 6 characters"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                Company (Optional)
              </label>
              <div className="mt-1">
                <input
                  id="company"
                  name="company"
                  type="text"
                  value={formData.company || ''}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Your company name"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div className="mt-1">
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone || ''}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="+1 (555) 123-4567"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                checked={formData.terms || false}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                disabled={isLoading}
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                I agree to the <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">Terms</a> and <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">Privacy Policy</a>
              </label>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : 'Create Account'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button 
                onClick={() => navigate('/login')}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={isLoading}
              >
                Sign in
              </button>
            </div>
          </div>

          {/* Debug Info */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg text-xs text-gray-500">
            <p className="font-medium mb-1">Debug Info:</p>
            <p>Base URL: {Base_url}</p>
            <p>Loading: {isLoading ? 'Yes' : 'No'}</p>
            <p>Form data: {JSON.stringify({...formData, password: '[HIDDEN]'})}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;