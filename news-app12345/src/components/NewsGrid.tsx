import React, { useState } from 'react';
import { NewsCard } from './NewsCard';
import { Article } from '../types/news';
import { useNews } from '../hooks/useNews';
import { Search } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'business', label: 'Business' },
  { id: 'entertainment', label: 'Entertainment' },
  { id: 'general', label: 'General' },
  { id: 'health', label: 'Health' },
  { id: 'science', label: 'Science' },
  { id: 'sports', label: 'Sports' },
  { id: 'technology', label: 'Technology' },
  { id: 'politics', label: 'Politics' },
  { id: 'music', label: 'Music' },
];

export const NewsGrid: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { data: news, isLoading, error } = useNews(
    isSearching ? searchQuery : undefined,
    selectedCategory !== 'all' ? selectedCategory : undefined
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
  };

  return (
    <div className="space-y-6 w-full">
      {/* Categories */}
      <div className="flex flex-wrap gap-2 justify-center w-full">
        {CATEGORIES.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedCategory === category.id
                ? 'bg-blue-600 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2 w-full px-4">
        <div className="relative flex-grow">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search news..."
            className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Search
        </button>
        {isSearching && (
          <button
            type="button"
            onClick={handleClearSearch}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Clear
          </button>
        )}
      </form>

      {/* Search Results Header */}
      {isSearching && (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">
            {searchQuery ? `Search Results for "${searchQuery}"` : 'All News'}
          </h2>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center text-white mt-8">
          Error loading news. Please try again later.
        </div>
      )}

      {/* No Results State */}
      {!isLoading && !error && news && news.articles.length === 0 && (
        <div className="text-center text-white mt-8">
          No news articles found.
        </div>
      )}

      {/* News Grid */}
      {!isLoading && !error && news && news.articles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
          {news.articles.map((article: Article) => (
            <NewsCard key={article.url} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}; 