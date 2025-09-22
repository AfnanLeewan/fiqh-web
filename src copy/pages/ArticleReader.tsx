import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { findNodeByPath, buildBreadcrumbs, getNextPrevArticles } from '@/lib/contentUtils';
import { ContentNode } from '@/types/content';
import { i18n } from '@/lib/i18n';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ArticleReader() {
  const { categorySlug, '*': pathString } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<ContentNode | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<Array<{ title: string; href: string }>>([]);
  const [navigation, setNavigation] = useState<{ prev: ContentNode | null; next: ContentNode | null }>({
    prev: null,
    next: null
  });

  useEffect(() => {
    if (!categorySlug || !pathString) return;

    const pathArray = pathString.split('/').filter(Boolean);
    const fullPath = [categorySlug, ...pathArray];
    
    const node = findNodeByPath(fullPath);
    if (!node || node.type !== 'article') {
      navigate('/');
      return;
    }

    setArticle(node);

    // Build breadcrumbs
    const breadcrumbItems = buildBreadcrumbs(fullPath);
    setBreadcrumbs(breadcrumbItems);

    // Get parent chapter for navigation
    const parentPath = fullPath.slice(0, -1);
    const parentChapter = findNodeByPath(parentPath);
    
    if (parentChapter) {
      const navData = getNextPrevArticles(node.id, parentChapter);
      setNavigation(navData);
    }
  }, [categorySlug, pathString, navigate]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleNavigation = (targetArticle: ContentNode) => {
    const currentPath = `/c/${categorySlug}/${pathString}`;
    const pathParts = currentPath.split('/');
    pathParts[pathParts.length - 1] = targetArticle.slug;
    navigate(pathParts.join('/'));
  };

  if (!article) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header title="สารบัญกรณ์" />
      
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <Breadcrumb items={breadcrumbs} />
        
        <Card>
          <CardHeader>
            <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {article.author && (
                <span>โดย {article.author}</span>
              )}
              {article.createdAt && (
                <span>{formatDate(article.createdAt)}</span>
              )}
              {typeof article.badge === 'number' && (
                <Badge variant="outline">#{article.badge}</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-lg max-w-none">
              {article.body?.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-4 leading-relaxed text-foreground">
                  {paragraph}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="fixed bottom-6 left-6 right-6 flex justify-between pointer-events-none">
          {navigation.prev ? (
            <Button
              onClick={() => handleNavigation(navigation.prev!)}
              variant="default"
              size="lg"
              className="pointer-events-auto shadow-lg"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              {i18n.previous}
            </Button>
          ) : (
            <div></div>
          )}
          
          {navigation.next ? (
            <Button
              onClick={() => handleNavigation(navigation.next!)}
              variant="default"
              size="lg"
              className="pointer-events-auto shadow-lg"
            >
              {i18n.next}
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <div></div>
          )}
        </div>
      </main>
    </div>
  );
}