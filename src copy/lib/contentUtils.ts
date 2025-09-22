import { ContentNode, SearchResult } from '@/types/content';
import { mockData } from '@/data/mockData';

export function findNodeByPath(path: string[]): ContentNode | null {
  let current = mockData;
  let result: ContentNode | null = null;

  for (const slug of path) {
    const found = current.find(node => node.slug === slug);
    if (!found) return null;
    result = found;
    current = found.children || [];
  }

  return result;
}

export function findCategoryBySlug(slug: string): ContentNode | null {
  return mockData.find(category => category.slug === slug) || null;
}

export function searchContent(query: string): SearchResult[] {
  const results: SearchResult[] = [];
  const searchTerm = query.toLowerCase();

  function traverse(nodes: ContentNode[], path: string[] = []) {
    for (const node of nodes) {
      if (node.title.toLowerCase().includes(searchTerm)) {
        results.push({
          id: node.id,
          title: node.title,
          type: node.type,
          path: path.length > 0 ? `/${path.join('/')}/${node.slug}` : `/${node.slug}`,
          slug: node.slug
        });
      }
      
      if (node.children) {
        traverse(node.children, [...path, node.slug]);
      }
    }
  }

  traverse(mockData);
  return results.slice(0, 8); // Limit to 8 results as per spec
}

export function getAllArticlesInChapter(chapter: ContentNode): ContentNode[] {
  const articles: ContentNode[] = [];
  
  function traverse(node: ContentNode) {
    if (node.type === 'article') {
      articles.push(node);
    }
    if (node.children) {
      node.children.forEach(traverse);
    }
  }
  
  if (chapter.children) {
    chapter.children.forEach(traverse);
  }
  
  return articles.sort((a, b) => {
    const badgeA = typeof a.badge === 'number' ? a.badge : 999;
    const badgeB = typeof b.badge === 'number' ? b.badge : 999;
    return badgeA - badgeB;
  });
}

export function getNextPrevArticles(currentArticleId: string, parentChapter: ContentNode) {
  const articles = getAllArticlesInChapter(parentChapter);
  const currentIndex = articles.findIndex(article => article.id === currentArticleId);
  
  return {
    prev: currentIndex > 0 ? articles[currentIndex - 1] : null,
    next: currentIndex < articles.length - 1 ? articles[currentIndex + 1] : null
  };
}

export function buildBreadcrumbs(path: string[]): Array<{ title: string; href: string }> {
  const breadcrumbs: Array<{ title: string; href: string }> = [];
  let currentPath = '';
  
  for (let i = 0; i < path.length; i++) {
    currentPath += `/${path[i]}`;
    const node = findNodeByPath(path.slice(0, i + 1));
    
    if (node) {
      breadcrumbs.push({
        title: node.title,
        href: i === 0 ? `/c${currentPath}` : `/c/${path[0]}${currentPath.substring(path[0].length + 1)}`
      });
    }
  }
  
  return breadcrumbs;
}