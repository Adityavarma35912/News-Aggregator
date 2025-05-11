import React from 'react';
import { motion } from 'framer-motion';
import { Article } from '../types/news';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';

interface NewsCardProps {
  article: Article;
}

export const NewsCard: React.FC<NewsCardProps> = ({ article }) => {
  const { user } = useAuth();
  const [isSaved, setIsSaved] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState('');

  // Optionally, you could fetch saved articles to check if this article is saved
  // For now, reset isSaved on user change
  React.useEffect(() => {
    setIsSaved(false);
  }, [user, article.url]);

  const handleSaveClick = async () => {
    if (!user) {
      setError('Please log in to save articles.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await api.post('/articles/save', { article });
      setIsSaved(true);
    } catch (err: any) {
      setError('Failed to save article.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden shadow-lg"
    >
      {article.urlToImage && (
        <img
          src={article.urlToImage}
          alt={article.title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <span className="text-sm text-blue-400">{article.source.name}</span>
          {user && (
            <button
              onClick={handleSaveClick}
              className="text-white hover:text-blue-400 transition-colors"
              aria-label={isSaved ? 'Article saved' : 'Save article'}
              tabIndex={0}
              disabled={isSaved || saving}
            >
              {isSaved ? <FaBookmark /> : <FaRegBookmark />}
            </button>
          )}
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">
          {article.title}
        </h3>
        <p className="text-gray-300 mb-4">{article.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">
            {new Date(article.publishedAt).toLocaleDateString()}
          </span>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300"
          >
            Read More
          </a>
        </div>
        {error && <div className="text-red-400 text-sm mt-2">{error}</div>}
      </div>
    </motion.div>
  );
}; 