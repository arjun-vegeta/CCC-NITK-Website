import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getMdxContent, searchContent } from '../utils/mdxUtils';
import removeMarkdown from 'remove-markdown';

const AdvancedSearchPage = () => {
  const location = useLocation();
  const [query, setQuery] = useState(location.state?.query || '');
  const [results, setResults] = useState([]);
  const [allItems, setAllItems] = useState([]);

  useEffect(() => {
    const loadContent = async () => {
      const items = await getMdxContent();
      setAllItems(items);
    };
    loadContent();
  }, []);

  useEffect(() => {
    if (query.length > 2) {
      const searchResults = searchContent(allItems, query);
      setResults(searchResults);
    } else {
      setResults([]);
    }
  }, [query, allItems]);

  const getPreview = (content, query) => {
    const cleanContent = removeMarkdown(content);
    const lowerContent = cleanContent.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const index = lowerContent.indexOf(lowerQuery);
    
    if (index === -1) return '';
    
    const start = Math.max(0, index - 60);
    const end = Math.min(cleanContent.length, index + query.length + 200);
    let preview = cleanContent.slice(start, end);
    
    preview = preview.replace(
      new RegExp(`(${query})`, 'gi'),
      '<mark class="bg-yellow-200 dark:bg-yellow-300/100 px-0">$1</mark>'
    );
    
    return `...${preview}...`;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-Montserrat font-bold text-gray-900 dark:text-white mb-3">
          Advanced Search
        </h1>
        <p className="text-gray-600 font-Montserrat dark:text-gray-400">
          Search across all documentation guides and facilities.
        </p>
      </div>

      <div className="relative mb-10 group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
          <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Start typing to search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-12 py-4 rounded-xl border border-gray-300 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-[#168a17] focus:border-transparent dark:bg-gray-900 dark:text-white transition-all duration-200"
          autoFocus
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-4 top-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {results.length > 0 ? (
        <div className="space-y-6">
          <div className="text-sm font-medium text-gray-600 dark:text-gray-400 px-2">
            Showing {results.length} results for 
            <span className="ml-2 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md">
              "{query}"
            </span>
          </div>
          
          {results.map((item, index) => (
            <div 
              key={index}
              className="group bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm hover:border-2 hover:border-blue-950 transition-shadow duration-200 border border-gray-100 dark:border-gray-800"
            >
              <Link
                to={item.path}
                className="block mb-3 hover:opacity-80 transition-opacity"
              >
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {item.title}
                </h3>
              </Link>
              {query && (
                <div 
                  className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-2"
                  dangerouslySetInnerHTML={{ 
                    __html: getPreview(item.content, query) 
                  }}
                />
              )}
              <div className="mt-3 text-sm text-[#168a17] font-medium">
                <Link
                  to={{ 
                    pathname: item.path, 
                    search: `?highlight=${encodeURIComponent(query)}` 
                  }}
                  className="inline-flex items-center hover:underline"
                >
                  View more
                  <svg 
                    className="w-4 h-4 ml-1.5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : query.length > 2 ? (
        <div className="text-center py-16">
          <div className="mb-4 text-6xl">:(</div>
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
            No results found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            We couldn't find any matches for "{query}"
          </p>
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="mb-4 text-6xl">🔍</div>
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
            Start searching
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Enter at least 3 characters to begin your search
          </p>
        </div>
      )}
    </div>
  );
};

export default AdvancedSearchPage;