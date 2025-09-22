import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Sidebar } from '@/components/Sidebar';
import { ContentItem } from '@/components/ContentItem';
import { findNodeByPath, findCategoryBySlug, buildBreadcrumbs } from '@/lib/contentUtils';
import { ContentNode, ViewMode } from '@/types/content';
import { i18n } from '@/lib/i18n';
import ArticleReader from './ArticleReader';

export default function Explorer() {
  const { categorySlug, '*': pathString } = useParams();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    return (localStorage.getItem('viewMode') as ViewMode) || 'list';
  });
  const [currentNode, setCurrentNode] = useState<ContentNode | null>(null);
  const [sidebarItems, setSidebarItems] = useState<ContentNode[]>([]);
  const [breadcrumbs, setBreadcrumbs] = useState<Array<{ title: string; href: string }>>([]);

  useEffect(() => {
    if (!categorySlug) return;

    const pathArray = pathString ? pathString.split('/').filter(Boolean) : [];
    const fullPath = [categorySlug, ...pathArray];
    
    const node = findNodeByPath(fullPath);
    if (!node) {
      navigate('/');
      return;
    }

    setCurrentNode(node);

    // Build breadcrumbs
    const breadcrumbItems = buildBreadcrumbs(fullPath);
    setBreadcrumbs(breadcrumbItems);

    // Set sidebar items (siblings of current level)
    if (pathArray.length === 0) {
      // At category level, show root chapters
      setSidebarItems(node.children || []);
    } else {
      // Find parent and show its children
      const parentPath = fullPath.slice(0, -1);
      const parent = findNodeByPath(parentPath);
      setSidebarItems(parent?.children || []);
    }
  }, [categorySlug, pathString, navigate]);

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem('viewMode', mode);
  };

  const handleItemClick = (item: ContentNode) => {
    if (item.type === 'article') {
      // Will be handled by Link navigation
      return;
    }
  };

  if (!currentNode) {
    return <div>Loading...</div>;
  }

  // If current node is an article, redirect to reader
  if (currentNode.type === 'article') {
    return <ArticleReader />;
  }

  const basePath = `/c/${categorySlug}${pathString ? `/${pathString}` : ''}`;
  const items = currentNode.children || [];

  return (
    <div className="min-h-screen bg-background">
      <Header 
        title={currentNode.title}
        showViewToggle={true}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
      />
      
      <div className="flex">
        <Sidebar items={sidebarItems} basePath={`/c/${categorySlug}`} />
        
        <main className="flex-1 p-6">
          <Breadcrumb items={breadcrumbs} />
          
          {items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">{i18n.comingSoon}</p>
            </div>
          ) : viewMode === 'card' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item) => (
                <ContentItem
                  key={item.id}
                  item={item}
                  viewMode="card"
                  basePath={basePath}
                  onItemClick={handleItemClick}
                />
              ))}
            </div>
          ) : (
            <div className="bg-card border border-border rounded-lg">
              {items.map((item) => (
                <ContentItem
                  key={item.id}
                  item={item}
                  viewMode="list"
                  basePath={basePath}
                  onItemClick={handleItemClick}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}