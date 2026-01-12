// src/pages/marketplace/ProgramMarketplace.jsx
import React, { useState, useEffect } from 'react';
import { 
  MagnifyingGlassIcon,
  StarIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ShoppingBagIcon,
  ArrowPathIcon // For loading state
} from '@heroicons/react/24/outline';
import axios from 'axios';

const Marketplace = () => {
  const [programs, setPrograms] = useState([]);
  const [filteredPrograms, setFilteredPrograms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [sortDirection, setSortDirection] = useState('desc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // ✅ FIXED: Correct backend URL
  const Base_url = import.meta.env.VITE_API_URL || "http://localhost:4500";

  // Fetch programs from backend API
  const fetchPrograms = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query parameters
      const params = new URLSearchParams();
      if (selectedCategory !== 'All') params.append('category', selectedCategory);
      if (searchTerm) params.append('search', searchTerm);
      params.append('sortBy', sortBy);
      params.append('sortDirection', sortDirection);
      
      console.log(`Fetching programs from: ${Base_url}/api/Allprogram?${params.toString()}`);
      
      const response = await axios.get(`${Base_url}/api/Allprogram?${params.toString()}`, {
        timeout: 10000
      });
      
      setPrograms(response.data);
      setFilteredPrograms(response.data); // Backend already filters, so use directly
      
    } catch (error) {
      console.error('Error fetching programs:', error);
      setError('Failed to load programs. Using demo data.');
      
      // Fallback to mock data
      const mockPrograms = [
        { 
          id: 1, 
          name: "TechGadgets Pro", 
          commission: "12-15%", 
          category: "Electronics", 
          rating: 4.8, 
          cookieDuration: "30 days", 
          featured: true,
          commissionValue: 15
        },
        { 
          id: 2, 
          name: "FitnessFuel Supplements", 
          commission: "8% + bonuses", 
          category: "Health", 
          rating: 4.6, 
          cookieDuration: "45 days", 
          featured: false,
          commissionValue: 8
        },
        { 
          id: 3, 
          name: "DesignMaster Suite", 
          commission: "30% recurring", 
          category: "Software", 
          rating: 4.9, 
          cookieDuration: "Lifetime", 
          featured: true,
          commissionValue: 30
        },
        { 
          id: 4, 
          name: "EcoHome Essentials", 
          commission: "10% flat", 
          category: "Lifestyle", 
          rating: 4.3, 
          cookieDuration: "14 days", 
          featured: false,
          commissionValue: 10
        },
        { 
          id: 5, 
          name: "AdventureGear Outfitters", 
          commission: "12%", 
          category: "Outdoor", 
          rating: 4.7, 
          cookieDuration: "30 days", 
          featured: true,
          commissionValue: 12
        },
        { 
          id: 6, 
          name: "LearnCode Online", 
          commission: "$50/signup", 
          category: "Education", 
          rating: 4.5, 
          cookieDuration: "60 days", 
          featured: false,
          commissionValue: 50
        },
      ];
      
      setPrograms(mockPrograms);
      setFilteredPrograms(mockPrograms);
      
      // Extract unique categories from mock data
      const uniqueCategories = ['All', ...new Set(mockPrograms.map(p => p.category))];
      setCategories(uniqueCategories);
      
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories from backend
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${Base_url}/api/categories`, {
        timeout: 5000
      });
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Use default categories if API fails
      setCategories(['All', 'Electronics', 'Health', 'Software', 'Lifestyle', 'Outdoor', 'Education']);
    }
  };

  // Initial data fetch
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchPrograms(), fetchCategories()]);
    };
    loadData();
  }, []);

  // Fetch programs when filters change
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchPrograms();
    }, 300); // Debounce to avoid too many API calls
    
    return () => clearTimeout(debounceTimer);
  }, [selectedCategory, searchTerm, sortBy, sortDirection]);

  // Join program handler
  const handleJoinProgram = async (programId) => {
    try {
      // In a real app, this would call your join program API
      console.log(`Joining program ${programId}`);
      
      // Example: Make API call to join program
      // const response = await axios.post(`${Base_url}/api/join/${programId}`, {}, {
      //   headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      // });
      
      alert('Successfully joined the program! You will be redirected to the affiliate dashboard.');
      
      // Redirect to program tracking link
      const program = programs.find(p => p.id === programId);
      if (program && program.trackingLink) {
        window.open(program.trackingLink, '_blank');
      }
    } catch (error) {
      console.error('Error joining program:', error);
      alert('Failed to join program. Please try again or contact support.');
    }
  };

  // View details handler
  const handleViewDetails = async (programId) => {
    try {
      // Fetch complete program details
      const response = await axios.get(`${Base_url}/api/program/${programId}`);
      const program = response.data;
      
      // Show details in a modal or alert
      alert(`
Program Details:
---------------
Name: ${program.name}
Category: ${program.category}
Commission: ${program.commission}
Rating: ${program.rating}/5
Cookie Duration: ${program.cookieDuration}
Performance: ${program.performance}
Average Earning: ${program.averageEarning}
Payout Methods: ${program.payoutMethods?.join(', ')}
Minimum Payout: $${program.minimumPayout}
Payout Frequency: ${program.payoutFrequency}
Terms: ${program.terms}
Website: ${program.website}
Description: ${program.description}
      `);
    } catch (error) {
      console.error('Error fetching program details:', error);
      alert('Could not load program details. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <ArrowPathIcon className="h-12 w-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-600">Loading programs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Program Marketplace</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Discover programs to promote and start earning commissions
        </p>
        {error && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg max-w-md mx-auto">
            <p className="text-yellow-700 text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search programs..."
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Sorting Controls */}
          <div className="flex space-x-4">
            <button 
              className="flex items-center px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
            >
              <span>Sort: {sortBy === 'rating' ? 'Rating' : sortBy === 'commission' ? 'Commission' : 'Name'}</span>
              {sortDirection === 'asc' ? 
                <ChevronUpIcon className="h-4 w-4 ml-1" /> : 
                <ChevronDownIcon className="h-4 w-4 ml-1" />
              }
            </button>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
            >
              <option value="rating">Rating</option>
              <option value="commission">Commission</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>
        
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mt-6">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-full transition-colors ${
                selectedCategory === category
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Programs Grid */}
      {filteredPrograms.length === 0 ? (
        <div className="max-w-7xl mx-auto text-center py-12">
          <ShoppingBagIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No programs found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrograms.map((program) => (
            <div 
              key={program.id} 
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                {/* Program Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center">
                    <ShoppingBagIcon className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="flex items-center space-x-2">
                    {program.featured && (
                      <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
                        Featured
                      </span>
                    )}
                    <div className="flex items-center px-2 py-1 bg-gray-100 rounded-lg">
                      <StarIcon className="h-4 w-4 text-amber-400" />
                      <span className="ml-1 text-sm font-medium">{program.rating}</span>
                    </div>
                  </div>
                </div>
                
                {/* Program Info */}
                <h3 className="font-bold text-lg text-gray-900 mb-2">{program.name}</h3>
                <div className="flex items-center text-sm mb-3">
                  <span className="text-green-600 font-medium">{program.commission}</span>
                  <span className="mx-2 text-gray-300">•</span>
                  <span className="text-gray-600">{program.category}</span>
                </div>
                
                <div className="text-sm text-gray-600 mb-6">
                  Cookie Duration: {program.cookieDuration}
                </div>
                
                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button 
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                    onClick={() => handleJoinProgram(program.id)}
                  >
                    Join Program
                  </button>
                  <button 
                    className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                    onClick={() => handleViewDetails(program.id)}
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* API Connection Info (for debugging) */}
      <div className="max-w-7xl mx-auto mt-8 text-center">
        <p className="text-sm text-gray-500">
          Connected to: {Base_url}/api
        </p>
      </div>
    </div>
  );
};

export default Marketplace;