import { useState } from 'react';
import { Converter } from '../components/Converter';
import { converters } from '../utils/converterConfigs';
import { SEO } from '../components/SEO';

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
  
  // Get the current category name for the SEO component
  const currentCategoryName = categories[activeCategory as keyof typeof categories]?.name || 'All Tools';
  
  return (
    <div className="w-full">
      {/* SEO Component */}
      <SEO 
        category={currentCategoryName}
        title={searchTerm ? `Search: ${searchTerm}` : undefined}
      />
      
      <section aria-labelledby="main-heading" className="text-center mb-6">
        <div className="flex justify-center items-center gap-3 mb-2">
          <div className="w-10 h-10">
            <img 
              src="/converter_logo.png" 
              alt="" 
              className="w-full h-full object-contain"
              aria-hidden="true"
            />
          </div>
          <h1 id="main-heading" className="text-3xl font-bold">
            <span>converter</span>
            <span className="opacity-60">.shwrk</span>
          </h1>
        </div>
        <p className="mt-2 text-lg text-base-content/70">Fast, secure tools for encoding, decoding, and validating various formats</p>
        <div className="mt-3 mb-5 bg-base-200 rounded-lg p-3 max-w-2xl mx-auto text-sm flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>
            <strong>100% Client-Side Processing:</strong> All conversions run directly in your browser - no data is ever sent to a server, ensuring your sensitive information remains private and secure.
          </span>
        </div>
      </section>
      
      <section aria-labelledby="search-heading" className="mb-6 w-full max-w-md mx-auto">
        <h2 id="search-heading" className="sr-only">Search Tools</h2>
        <div className="form-control">
          <label htmlFor="search-input" className="sr-only">Search for tools</label>
          <div className="input-group">
            <input 
              id="search-input"
              type="text" 
              placeholder="Search tools..." 
              className="input input-bordered w-full focus:outline-primary" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search for tools"
            />
            <button 
              className="btn btn-square bg-base-300 border-base-300 hover:bg-primary hover:border-primary"
              aria-label="Search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
      </section>
      
      {/* Category tabs */}
      <section aria-labelledby="categories-heading" className="mb-6">
        <h2 id="categories-heading" className="sr-only">Filter by Category</h2>
        <div className="flex flex-wrap gap-2 justify-center">
          {Object.entries(categories).map(([key, category]) => (
            <button
              key={key}
              className={`btn btn-sm ${activeCategory === key ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setActiveCategory(key)}
              aria-pressed={activeCategory === key}
              aria-label={`Filter by ${category.name}`}
            >
              {category.name} 
              <span className="badge badge-sm ml-1">{category.count}</span>
            </button>
          ))}
        </div>
      </section>
      
      {/* Tools grid */}
      <section aria-labelledby="tools-heading">
        <h2 id="tools-heading" className="sr-only">Converter Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredConverters.length > 0 ? (
            filteredConverters.map((converter) => (
              <Converter key={converter.name} converter={converter} />
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <div className="bg-base-200 rounded-lg p-6 max-w-lg mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-base-content/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
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
      </section>
    </div>
  );
}; 