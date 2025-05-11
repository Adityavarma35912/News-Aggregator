import { useState, useEffect } from 'react';
import { Search, RefreshCw, ExternalLink, Menu, X } from 'lucide-react';
import { getPlaceholderImage } from '../api/placeholder';
import { saveNewsBackup, loadNewsBackup } from '../api/newsBackup';

export default function NewsAggregator() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('general');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [usingBackup, setUsingBackup] = useState(false);

  const categories = [
    'general', 'business', 'entertainment', 'health',
    'science', 'sports', 'technology'
  ];

  useEffect(() => {
    if (category !== 'search' || (category === 'search' && searchQuery)) {
      fetchNews();
    }
  }, [category]);

  const API_KEY = 'ff561564fe4f414fa92267355a22ce6d';

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    setUsingBackup(false);
    try {
      let apiUrl;
      let backupKey = category === 'search' ? `search:${searchQuery}` : category;
      if (category === 'search') {
        apiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(searchQuery)}&apiKey=${API_KEY}&pageSize=12`;
      } else {
        apiUrl = `https://newsapi.org/v2/top-headlines?category=${category}&apiKey=${API_KEY}&pageSize=12&language=en`;
      }
      const response = await fetch(apiUrl);
      const data = await response.json();
      if (data.status === 'ok') {
        setArticles(data.articles);
        saveNewsBackup(backupKey, data.articles);
      } else {
        throw new Error(data.message || 'Failed to fetch news');
      }
    } catch (err) {
      // On error, load from backup
      let backupKey = category === 'search' ? `search:${searchQuery}` : category;
      const backupArticles = loadNewsBackup(backupKey);
      if (backupArticles.length > 0) {
        setArticles(backupArticles);
        setUsingBackup(true);
        setError('Live news API limit reached. Showing backup news.');
      } else {
        setError('Failed to fetch news. Please try again later.');
      }
      console.error('Error fetching news:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setCategory('search');
      fetchNews();
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
      {/* Header */}
      <header className="backdrop-blur-md bg-white/80 shadow-lg sticky top-0 z-30">
        <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-extrabold tracking-tight text-blue-700 drop-shadow-sm">PulseWire</h1>
              <span className="bg-yellow-400 text-blue-900 px-2 py-1 rounded-full text-xs font-semibold shadow">LIVE</span>
            </div>
            {/* Mobile menu button */}
            <button
              className="md:hidden text-blue-700 hover:bg-blue-100 p-2 rounded-full transition"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
            {/* Desktop navigation */}
            <nav className="hidden md:flex gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border focus:outline-none focus:ring-2 focus:ring-blue-400/50
                    ${category === cat
                      ? 'bg-blue-700 text-white shadow-md border-blue-700'
                      : 'bg-white text-blue-700 border-blue-200 hover:bg-blue-50 hover:shadow'}
                  `}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </nav>
          </div>
          {/* Mobile navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden flex flex-col gap-2 animate-fade-in">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setCategory(cat);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border focus:outline-none focus:ring-2 focus:ring-blue-400/50
                    ${category === cat
                      ? 'bg-blue-700 text-white shadow-md border-blue-700'
                      : 'bg-white text-blue-700 border-blue-200 hover:bg-blue-50 hover:shadow'}
                  `}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </nav>
          )}
          {/* Search bar */}
          <div className="flex w-full max-w-xl mx-auto mt-2 shadow-md rounded-full overflow-hidden bg-white/90 border border-slate-200">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for news..."
              className="flex-grow px-5 py-3 rounded-l-full focus:outline-none text-gray-800 bg-transparent"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSearch();
                }
              }}
            />
            <button
              onClick={handleSearch}
              className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-3 rounded-r-full transition-colors flex items-center justify-center"
            >
              <Search size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-10 flex-grow">
        {usingBackup && (
          <div className="mb-6 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-3 rounded shadow animate-fade-in">
            <p>Live news API limit reached. Showing backup news.</p>
          </div>
        )}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800 capitalize tracking-tight">
            {category === 'search' ? `Search Results for "${searchQuery}"` : `${category} News`}
          </h2>
          {/* Floating Refresh Button */}
          <button
            onClick={fetchNews}
            className="fixed bottom-8 right-8 z-40 bg-blue-700 hover:bg-blue-800 text-white p-4 rounded-full shadow-lg transition-all flex items-center group"
            title="Refresh"
            aria-label="Refresh"
          >
            <RefreshCw size={22} className="group-hover:animate-spin" />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow">
            <p>{error}</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No articles found. Try a different search or category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, index) => (
              <div
                key={index}
                className="bg-white/90 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-slate-100 flex flex-col animate-fade-in-up"
                style={{ animationDelay: `${index * 40}ms` }}
              >
                <img
                  src={article.urlToImage || getPlaceholderImage(600, 400, category)}
                  alt={article.title}
                  className="w-full h-52 object-cover object-center transition-all duration-300 hover:scale-105"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = getPlaceholderImage(600, 400, category);
                  }}
                />
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex justify-between items-center mb-3">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 bg-blue-100 px-3 py-1 rounded-full shadow-sm">
                      <Menu size={14} /> {article.source.name}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatDate(article.publishedAt)}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-slate-900 leading-tight line-clamp-2">{article.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3 flex-1">{article.description}</p>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors mt-auto"
                  >
                    Read full story <ExternalLink size={15} className="ml-1" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white/80 border-t border-slate-200 text-slate-500 py-8 mt-10">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="font-bold text-xl text-blue-700">PulseWire</h2>
            <p className="text-slate-400 text-sm">Your daily source for trusted news</p>
          </div>
          <div className="text-sm text-slate-400 text-center md:text-right">
            <p>© {new Date().getFullYear()} PulseWire. All rights reserved.</p>
            <p>Powered by <span className="font-semibold text-blue-700">React</span></p>
          </div>
        </div>
      </footer>
      {/* Animations */}
      <style>{`
        .animate-fade-in { animation: fadeIn 0.4s; }
        .animate-fade-in-up { animation: fadeInUp 0.5s both; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: none; } }
      `}</style>
    </div>
  );
} 