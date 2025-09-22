"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Paper,
  Chip,
  Button,
  Divider
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  Person as PersonIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import { Header } from '@/components/Header';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Sidebar } from '@/components/Sidebar';
import { ContentItem } from '@/components/ContentItem';
import { findNodeByPath, buildBreadcrumbs, getNextPrevArticles } from '@/lib/contentUtils';
import { ContentNode, ViewMode } from '@/types/content';
import { i18n } from '@/lib/i18n';

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('viewMode') as ViewMode) || 'list';
    }
    return 'list';
  });
  const [currentNode, setCurrentNode] = useState<ContentNode | null>(null);
  const [sidebarItems, setSidebarItems] = useState<ContentNode[]>([]);
  const [breadcrumbs, setBreadcrumbs] = useState<Array<{ title: string; href: string }>>([]);
  const [navigation, setNavigation] = useState<{ prev: ContentNode | null; next: ContentNode | null }>({
    prev: null,
    next: null
  });

  useEffect(() => {
    const slug = params.slug as string[];
    if (!slug || slug.length === 0) return;

    const loadData = async () => {
      const fullPath = slug;
      const node = await findNodeByPath(fullPath);
      
      if (!node) {
        router.push('/');
        return;
      }

      setCurrentNode(node);

      // Build breadcrumbs (await the async function)
      try {
        const breadcrumbItems = await buildBreadcrumbs(fullPath);
        setBreadcrumbs(breadcrumbItems);
      } catch (error) {
        console.error('Error building breadcrumbs:', error);
        setBreadcrumbs([]);
      }

      // Always get the root category and show only its top-level chapters in sidebar
      const rootCategoryPath = [fullPath[0]];
      const rootCategory = fullPath.length === 1 ? node : await findNodeByPath(rootCategoryPath);
      const topLevelChapters = (rootCategory?.children || []).filter(child => child.type === 'chapter');
      setSidebarItems(topLevelChapters);

      // Handle navigation for articles only
      if (node.type === 'article') {
        // Get parent chapter for navigation
        const parentPath = fullPath.slice(0, -1);
        const parentChapter = await findNodeByPath(parentPath);
        
        if (parentChapter) {
          const navData = await getNextPrevArticles(node.id, parentChapter.id);
          setNavigation(navData);
        }
      }
    };

    loadData();
  }, [params.slug, router]);

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('viewMode', mode);
    }
  };

  const handleItemClick = (item: ContentNode) => {
    if (item.type === 'article') {
      // Will be handled by Link navigation
      return;
    }
  };

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
    const slug = params.slug as string[];
    const newSlug = [...slug];
    newSlug[newSlug.length - 1] = targetArticle.slug;
    router.push(`/c/${newSlug.join('/')}`);
  };

  if (!currentNode) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <Typography variant="h6" color="text.secondary">
          Loading...
        </Typography>
      </Box>
    );
  }

  // Article Reader View
  if (currentNode.type === 'article') {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Header title="สารบัญกรณ์" />
        
        <Box sx={{ display: 'flex' }}>
          <Sidebar items={sidebarItems} basePath={`/c/${(params.slug as string[])[0]}`} />
          
          <Container component="main" maxWidth="lg" sx={{ py: 3 }}>
            <Breadcrumb items={breadcrumbs} />
            
            <Paper elevation={2} sx={{ mt: 3 }}>
              <Box sx={{ p: 4 }}>
                <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
                  {currentNode.title}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                  {currentNode.author && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <PersonIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        โดย {currentNode.author}
                      </Typography>
                    </Box>
                  )}
                  {currentNode.createdAt && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <AccessTimeIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(currentNode.createdAt)}
                      </Typography>
                    </Box>
                  )}
                  {typeof currentNode.badge === 'number' && (
                    <Chip label={`#${currentNode.badge}`} variant="outlined" size="small" />
                  )}
                </Box>
                
                <Divider sx={{ mb: 4 }} />
                
                <Box sx={{ typography: 'body1', lineHeight: 1.8 }}>
                  {currentNode.body?.split('\n\n').map((paragraph, index) => (
                    <Typography key={index} paragraph variant="body1" sx={{ mb: 3 }}>
                      {paragraph}
                    </Typography>
                  ))}
                </Box>

                {/* Navigation Buttons inside content card */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mt: 4,
                  pt: 3,
                  borderTop: 1,
                  borderColor: 'divider'
                }}>
                  {navigation.prev ? (
                    <Button
                      onClick={() => handleNavigation(navigation.prev!)}
                      variant="contained"
                      size="large"
                      startIcon={<ChevronLeft />}
                      sx={{ boxShadow: 2 }}
                    >
                      {i18n.previous}
                    </Button>
                  ) : (
                    <Box />
                  )}
                  
                  {navigation.next ? (
                    <Button
                      onClick={() => handleNavigation(navigation.next!)}
                      variant="contained"
                      size="large"
                      endIcon={<ChevronRight />}
                      sx={{ boxShadow: 2 }}
                    >
                      {i18n.next}
                    </Button>
                  ) : (
                    <Box />
                  )}
                </Box>
              </Box>
            </Paper>
          </Container>
        </Box>
      </Box>
    );
  }

  // Explorer View
  const slug = params.slug as string[];
  const basePath = `/c/${slug.join('/')}`;
  const items = currentNode.children || [];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header 
        title={currentNode.title}
        showViewToggle={true}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
      />
      
      <Box sx={{ display: 'flex' }}>
        <Sidebar items={sidebarItems} basePath={`/c/${slug[0]}`} />
        
        <Container component="main" maxWidth="xl" sx={{ py: 3 }}>
          <Breadcrumb items={breadcrumbs} />
          
          {items.length === 0 ? (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              minHeight: '50vh',
              textAlign: 'center'
            }}>
              <Typography variant="h6" color="text.secondary">
                {i18n.comingSoon}
              </Typography>
            </Box>
          ) : viewMode === 'card' ? (
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: {
                xs: 'repeat(1, 1fr)',
                md: 'repeat(2, 1fr)', 
                lg: 'repeat(3, 1fr)'
              },
              gap: 3,
              mt: 3
            }}>
              {items.map((item) => (
                <Box key={item.id}>
                  <ContentItem
                    item={item}
                    viewMode="card"
                    basePath={basePath}
                    onItemClick={handleItemClick}
                  />
                </Box>
              ))}
            </Box>
          ) : (
            <Paper elevation={1} sx={{ mt: 3, borderRadius: 2 }}>
              {items.map((item, index) => (
                <Box key={item.id}>
                  <ContentItem
                    item={item}
                    viewMode="list"
                    basePath={basePath}
                    onItemClick={handleItemClick}
                  />
                  {index < items.length - 1 && <Divider />}
                </Box>
              ))}
            </Paper>
          )}
        </Container>
      </Box>
    </Box>
  );
}
