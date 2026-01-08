// src/pages/marketplace/ProgramMarketplace.jsx
import React, { useState, useEffect } from 'react';
import { 
  MagnifyingGlassIcon, // Replaces SearchIcon
  FunnelIcon,          // Replaces FilterIcon
  StarIcon, 
  FireIcon,
  ChevronDownIcon,     // Replaces ArrowDownIcon
  ChevronUpIcon,       // Replaces ArrowUpIcon
  ShoppingBagIcon
} from '@heroicons/react/24/outline';

const Marketplace = () => {
  const [programs, setPrograms] = useState([]);
  const [filteredPrograms, setFilteredPrograms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [sortDirection, setSortDirection] = useState('desc');

  // Simulated API call
  useEffect(() => {
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
    
    // Extract unique categories
    const uniqueCategories = ['All', ...new Set(mockPrograms.map(p => p.category))];
    setCategories(uniqueCategories);
  }, []);

  // Filter and sort programs
  useEffect(() => {
    let result = [...programs];
    
    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }
    
    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term)
      );
    }
    
    // Sorting logic
    result.sort((a, b) => {
      if (sortBy === 'rating') return sortDirection === 'asc' ? a.rating - b.rating : b.rating - a.rating;
      if (sortBy === 'commission') return sortDirection === 'asc' ? a.commissionValue - b.commissionValue : b.commissionValue - a.commissionValue;
      return sortDirection === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    });
    
    setFilteredPrograms(result);
  }, [selectedCategory, searchTerm, sortBy, sortDirection, programs]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Program Marketplace</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Discover programs to promote and start earning commissions
        </p>
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
              className="flex items-center px-4 py-2 bg-gray-100 rounded-lg"
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
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                  Join Program
                </button>
                <button className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                  Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marketplace;