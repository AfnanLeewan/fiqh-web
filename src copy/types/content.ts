export interface ContentNode {
  id: string;
  slug: string;
  title: string;
  summary?: string;
  type: 'category' | 'chapter' | 'article';
  author?: string;
  createdAt?: string;
  badge?: 'coming-soon' | number;
  body?: string; // Only for articles
  children?: ContentNode[];
  parentPath?: string[];
}

export interface SearchResult {
  id: string;
  title: string;
  type: 'category' | 'chapter' | 'article';
  path: string;
  slug: string;
}

export type ViewMode = 'list' | 'card';