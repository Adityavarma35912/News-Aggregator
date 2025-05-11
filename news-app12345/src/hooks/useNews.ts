import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { NewsResponse } from '../types/news';

// Hard-coded API key
const API_KEY = 'ff561564fe4f414fa92267355a22ce6d';
const BASE_URL = 'https://newsapi.org/v2';

export const useNews = (searchQuery?: string, category?: string) => {
  return useQuery<NewsResponse>({
    queryKey: ['news', searchQuery, category],
    queryFn: async () => {
      let endpoint;

      if (searchQuery) {
        endpoint = `${BASE_URL}/everything?q=${encodeURIComponent(searchQuery)}&apiKey=${API_KEY}`;
      } else if (category) {
        endpoint = `${BASE_URL}/top-headlines?country=us&category=${category}&apiKey=${API_KEY}`;
      } else {
        endpoint = `${BASE_URL}/top-headlines?country=us&apiKey=${API_KEY}`;
      }

      const response = await axios.get(endpoint);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
}; 