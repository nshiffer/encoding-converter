import { useState, useMemo } from 'react';
import { Converter } from '../components/Converter';
import { converters } from '../utils/converterConfigs';
import { SEO } from '../components/SEO';

const CATEGORIES = {
  all: 'All Tools',
  encoding: 'Encoding',
  format: 'Formatting',
  crypto: 'Crypto & Hash',
  devtools: 'Dev Tools',
  misc: 'Generators & Validators',
} as const;

type CategoryKey = keyof typeof CATEGORIES;

export const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('all');

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: converters.length };
    for (const c of converters) {
      counts[c.category] = (counts[c.category] || 0) + 1;
    }
    return counts;
  }, []);

  const filteredConverters = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    return converters
      .filter(
        (c) =>
          (activeCategory === 'all' || c.category === activeCategory) &&
          (term === '' ||
            c.name.toLowerCase().includes(term) ||
            c.description.toLowerCase().includes(term) ||
            c.category.toLowerCase().includes(term)),
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [searchTerm, activeCategory]);

  const currentCategoryName = CATEGORIES[activeCategory];

  return (
    <div className="w-full">
      <SEO category={currentCategoryName} title={searchTerm ? `Search: ${searchTerm}` : undefined} />

      {/* Hero */}
      <section aria-labelledby="main-heading" className="text-center mb-8">
        <div className="flex justify-center items-center gap-3 mb-3">
          <div className="w-10 h-10">
            <img src="/purple_logo.png" alt="" className="w-full h-full object-contain" aria-hidden="true" />
          </div>
          <h1 id="main-heading" className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            <span>converter</span>
            <span className="opacity-50">.shwrk</span>
          </h1>
        </div>
        <p className="text-base sm:text-lg text-base-content/60 max-w-xl mx-auto">
          Fast, private developer tools for encoding, decoding, formatting, and more
        </p>
        <div className="mt-4 inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-2 text-sm font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          100% client-side &mdash; your data never leaves your browser
        </div>
      </section>

      {/* Search */}
      <section aria-labelledby="search-heading" className="mb-6 w-full max-w-lg mx-auto">
        <h2 id="search-heading" className="sr-only">Search Tools</h2>
        <div className="relative">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            id="search-input"
            type="text"
            placeholder="Search 30+ tools..."
            className="input input-bordered w-full pl-10 focus:input-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search for tools"
          />
          {searchTerm && (
            <button
              className="btn btn-ghost btn-xs btn-circle absolute right-3 top-1/2 -translate-y-1/2"
              onClick={() => setSearchTerm('')}
              aria-label="Clear search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </section>

      {/* Category Tabs */}
      <section aria-labelledby="categories-heading" className="mb-8">
        <h2 id="categories-heading" className="sr-only">Filter by Category</h2>
        <div className="flex flex-wrap gap-2 justify-center">
          {(Object.entries(CATEGORIES) as [CategoryKey, string][]).map(([key, label]) => (
            <button
              key={key}
              className={`btn btn-sm gap-1 ${activeCategory === key ? 'btn-primary' : 'btn-ghost bg-base-200'}`}
              onClick={() => setActiveCategory(key)}
              aria-pressed={activeCategory === key}
            >
              {label}
              <span className={`badge badge-xs ${activeCategory === key ? 'badge-primary-content bg-primary-content/20' : 'badge-ghost'}`}>
                {categoryCounts[key] || 0}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Tools Grid */}
      <section aria-labelledby="tools-heading">
        <h2 id="tools-heading" className="sr-only">Converter Tools</h2>
        {filteredConverters.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredConverters.map((converter) => (
              <Converter key={converter.name} converter={converter} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-base-200 rounded-2xl p-8 max-w-md mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-base-content/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-lg font-medium mb-1">No tools found</p>
              <p className="text-base-content/50 text-sm mb-4">
                No results for &ldquo;{searchTerm}&rdquo;{activeCategory !== 'all' ? ` in ${CATEGORIES[activeCategory]}` : ''}
              </p>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => { setSearchTerm(''); setActiveCategory('all'); }}
              >
                Show All Tools
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
