import { ContentNode, SearchResult } from '@/types/content';

// API Base URL
const API_BASE = '/api/content';

// Helper function to make API calls
async function apiCall(endpoint: string, options?: RequestInit) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }

  return response.json();
}

export async function findNodeByPath(path: string[]): Promise<ContentNode | null> {
  try {
    const pathString = path.join('/');
    const result = await apiCall(`?path=${encodeURIComponent(pathString)}`);
    
    // The API returns { content, children }, we want the content with populated children
    if (result.content) {
      const content = result.content;
      content.children = result.children || [];
      return content;
    }
    
    return null;
  } catch (error) {
    console.error('Error finding node by path:', error);
    return null;
  }
}

export async function findCategoryBySlug(slug: string): Promise<ContentNode | null> {
  try {
    const result = await apiCall(`?path=${encodeURIComponent(slug)}`);
    return result.content || null;
  } catch (error) {
    console.error('Error finding category by slug:', error);
    return null;
  }
}

export async function getContentWithChildren(path: string[]): Promise<{ content: ContentNode; children: ContentNode[] } | null> {
  try {
    const pathString = path.join('/');
    const result = await apiCall(`?path=${encodeURIComponent(pathString)}`);
    return result;
  } catch (error) {
    console.error('Error getting content with children:', error);
    return null;
  }
}

export async function getChildrenOfNode(nodeId: string): Promise<ContentNode[]> {
  try {
    const result = await apiCall(`?parentId=${nodeId}`);
    return result || [];
  } catch (error) {
    console.error('Error getting children:', error);
    return [];
  }
}

export async function searchContent(query: string): Promise<SearchResult[]> {
  try {
    const results = await apiCall(`?search=${encodeURIComponent(query)}`);
    return results.map((node: ContentNode & { _id?: string }) => ({
      id: node._id || node.id,
      title: node.title,
      type: node.type,
      path: buildPathFromNode(node),
      slug: node.slug
    }));
  } catch (error) {
    console.error('Error searching content:', error);
    return [];
  }
}

export async function getAllContentByType(type: 'category' | 'chapter' | 'article'): Promise<ContentNode[]> {
  try {
    const result = await apiCall(`?type=${type}`);
    return result || [];
  } catch (error) {
    console.error(`Error getting ${type} content:`, error);
    return [];
  }
}

export async function getAllContent(): Promise<ContentNode[]> {
  try {
    const result = await apiCall('');
    return result || [];
  } catch (error) {
    console.error('Error getting all content:', error);
    return [];
  }
}

export async function getContentDescendants(categoryId: string): Promise<ContentNode[]> {
  try {
    // Get all content
    const allContent = await getAllContent();
    
    // Filter to get only descendants of the given category
    const descendants: ContentNode[] = [];
    
    const findDescendants = (parentId: string) => {
      const children = allContent.filter(item => item.parentId === parentId);
      for (const child of children) {
        descendants.push(child);
        // Recursively find children of this child
        findDescendants(child._id || child.id);
      }
    };
    
    findDescendants(categoryId);
    return descendants;
  } catch (error) {
    console.error('Error getting content descendants:', error);
    return [];
  }
}

// CRUD operations for admin
export async function createContent(content: Partial<ContentNode>): Promise<ContentNode | null> {
  try {
    const result = await apiCall('', {
      method: 'POST',
      body: JSON.stringify(content),
    });
    return result;
  } catch (error) {
    console.error('Error creating content:', error);
    return null;
  }
}

export async function updateContent(content: Partial<ContentNode>): Promise<ContentNode | null> {
  try {
    const result = await apiCall('', {
      method: 'PUT',
      body: JSON.stringify(content),
    });
    return result;
  } catch (error) {
    console.error('Error updating content:', error);
    return null;
  }
}

export async function deleteContent(id: string): Promise<boolean> {
  try {
    await apiCall(`?id=${id}`, {
      method: 'DELETE',
    });
    return true;
  } catch (error) {
    console.error('Error deleting content:', error);
    return false;
  }
}

// Helper functions
function buildPathFromNode(node: ContentNode & { path?: string[] }): string {
  const pathParts = [...(node.path || []), node.slug];
  return `/c/${pathParts.join('/')}`;
}

export async function getAllArticlesInChapter(chapterId: string): Promise<ContentNode[]> {
  try {
    const children = await getChildrenOfNode(chapterId);
    const articles = children.filter(child => child.type === 'article');
    
    return articles.sort((a, b) => {
      const badgeA = typeof a.badge === 'number' ? a.badge : 999;
      const badgeB = typeof b.badge === 'number' ? b.badge : 999;
      return badgeA - badgeB;
    });
  } catch (error) {
    console.error('Error getting articles in chapter:', error);
    return [];
  }
}

export async function getNextPrevArticles(currentArticleId: string, parentChapterId: string) {
  try {
    const articles = await getAllArticlesInChapter(parentChapterId);
    const currentIndex = articles.findIndex(article => article.id === currentArticleId);
    
    return {
      prev: currentIndex > 0 ? articles[currentIndex - 1] : null,
      next: currentIndex < articles.length - 1 ? articles[currentIndex + 1] : null
    };
  } catch (error) {
    console.error('Error getting next/prev articles:', error);
    return { prev: null, next: null };
  }
}

export async function buildBreadcrumbs(path: string[]): Promise<Array<{ title: string; href: string }>> {
  const breadcrumbs: Array<{ title: string; href: string }> = [];
  
  try {
    for (let i = 0; i < path.length; i++) {
      const currentPath = path.slice(0, i + 1);
      const node = await findNodeByPath(currentPath);
      
      if (node) {
        const href = `/c/${currentPath.join('/')}`;
        breadcrumbs.push({
          title: node.title,
          href
        });
      }
    }
  } catch (error) {
    console.error('Error building breadcrumbs:', error);
  }
  
  return breadcrumbs;
}

// Legacy compatibility functions (for gradual migration)
export async function findNodeByPathLegacy(path: string[]): Promise<ContentNode | null> {
  return findNodeByPath(path);
}

export async function findCategoryBySlugLegacy(slug: string): Promise<ContentNode | null> {
  return findCategoryBySlug(slug);
}

export async function searchContentLegacy(query: string): Promise<SearchResult[]> {
  return searchContent(query);
}