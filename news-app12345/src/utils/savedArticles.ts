import { Article } from '../types/news';

const getSavedArticlesKey = (email: string) => `savedArticles_${email}`;

export const saveArticle = (email: string, article: Article) => {
  const key = getSavedArticlesKey(email);
  const savedArticles = getSavedArticles(email);
  
  if (!savedArticles.some(a => a.url === article.url)) {
    savedArticles.push(article);
    localStorage.setItem(key, JSON.stringify(savedArticles));
  }
};

export const removeSavedArticle = (email: string, articleUrl: string) => {
  const key = getSavedArticlesKey(email);
  const savedArticles = getSavedArticles(email);
  
  const updatedArticles = savedArticles.filter(article => article.url !== articleUrl);
  localStorage.setItem(key, JSON.stringify(updatedArticles));
};

export const getSavedArticles = (email: string): Article[] => {
  const key = getSavedArticlesKey(email);
  const savedArticles = localStorage.getItem(key);
  return savedArticles ? JSON.parse(savedArticles) : [];
};

export const isArticleSaved = (email: string, articleUrl: string): boolean => {
  const savedArticles = getSavedArticles(email);
  return savedArticles.some(article => article.url === articleUrl);
}; 