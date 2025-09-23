export interface ContentNode {
  id: string;
  _id?: string; // MongoDB ObjectId
  slug: string;
  title: string;
  summary?: string;
  type: 'category' | 'chapter' | 'article';
  author?: string;
  createdAt?: string;
  updatedAt?: string;
  badge?: 'coming-soon' | number;
  body?: string; // Only for articles
  parentId?: string; // Reference to parent node
  path?: string[]; // Array of parent slugs for hierarchical navigation
  order?: number; // For ordering within parent
  published?: boolean;
  children?: ContentNode[];
  level?: number; // For hierarchical display in admin
}

export interface SearchResult {
  id: string;
  title: string;
  type: 'category' | 'chapter' | 'article';
  path: string;
  slug: string;
}

export type ViewMode = 'list' | 'card';