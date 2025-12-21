import type { ZennArticle, ZennArticleData } from '@/types/zenn';

const ZENN_API_URL = 'https://zenn.dev/api/articles?username=pav';

/**
 * Fetch all Zenn articles from the API
 */
export async function fetchZennArticles(): Promise<ZennArticle[]> {
  try {
    const res = await fetch(ZENN_API_URL);
    if (!res.ok) {
      console.error(`Failed to fetch Zenn articles: ${res.status}`);
      return [];
    }
    const data: ZennArticleData = await res.json();
    return data.articles;
  } catch (error) {
    console.error('Error fetching Zenn articles:', error);
    return [];
  }
}
