export interface Article {
  id?: number;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    name: string;
  };
  content: string;
}

export interface NewsResponse {
  articles: Article[];
  totalResults: number;
  status: string;
} 