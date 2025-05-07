import { useState } from 'react';
import { Converter } from '../components/Converter';
import { converters } from '../utils/converterConfigs';

export const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Group converters by category
  const categories = {
    all: { name: 'All Tools', count: converters.length },
    encoding: { 
      name: 'Encoding', 
      count: converters.filter(c => c.category === 'encoding').length
    },
    format: { 
      name: 'Formatting', 
      count: converters.filter(c => c.category === 'format').length
    },
    crypto: { 
      name: 'Cryptography', 
      count: converters.filter(c => c.category === 'crypto').length
    },
    misc: { 
      name: 'Miscellaneous', 
      count: converters.filter(c => c.category === 'misc').length
    }
  };
  
  const filteredConverters = converters
    .filter(converter => 
      (searchTerm.trim() === '' || 
       converter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       converter.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (activeCategory === 'all' || converter.category === activeCategory)
    )
    .sort((a, b) => a.name.localeCompare(b.name));
  
  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold">Encoding Converter</h1>
        <p className="mt-2 text-lg text-base-content/70">Fast, secure tools for encoding, decoding, and validating various formats</p>
        <div className="mt-3 mb-5 bg-base-200 rounded-lg p-3 max-w-2xl mx-auto text-sm flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>
            <strong>100% Client-Side Processing:</strong> All conversions run directly in your browser - no data is ever sent to a server, ensuring your sensitive information remains private and secure.
          </span>
        </div>
      </div>
      
      <div className="mb-6 w-full max-w-md mx-auto">
        <div className="form-control">
          <div className="input-group">
            <input 
              type="text" 
              placeholder="Search tools..." 
              className="input input-bordered w-full focus:outline-primary" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search for tools"
            />
            <button className="btn btn-square bg-base-300 border-base-300 hover:bg-primary hover:border-primary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 justify-center mb-6">
        {Object.entries(categories).map(([key, category]) => (
          <button
            key={key}
            className={`btn btn-sm ${activeCategory === key ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveCategory(key)}
          >
            {category.name} 
            <span className="badge badge-sm ml-1">{category.count}</span>
          </button>
        ))}
      </div>
      
      {/* Tools grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredConverters.length > 0 ? (
          filteredConverters.map((converter) => (
            <Converter key={converter.name} converter={converter} />
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <div className="bg-base-200 rounded-lg p-6 max-w-lg mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-base-content/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xl font-medium mb-4">No tools found matching "{searchTerm}"</p>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  setSearchTerm('');
                  setActiveCategory('all');
                }}
              >
                Show All Tools
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 