"use client";

import { useState, useMemo, useEffect } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Chip,
  Paper,
  Typography
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
  Category as CategoryIcon,
  Folder as FolderIcon,
  Article as FileTextIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { ContentNode } from '@/types/content';

interface TreeViewProps {
  items: ContentNode[];
}

export function TreeView({ items }: TreeViewProps) {
  const router = useRouter();
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [allItems, setAllItems] = useState<ContentNode[]>(items);
  
  // Update allItems when items prop changes
  useEffect(() => {
    setAllItems(items);
  }, [items]);

  // Function to fetch children of a node
  const fetchChildren = async (nodeId: string) => {
    try {
      console.log('Fetching children for nodeId:', nodeId);
      const response = await fetch(`/api/content?parentId=${nodeId}`);
      
      if (!response.ok) {
        console.warn(`No children found for nodeId ${nodeId}: ${response.status} ${response.statusText}`);
        return; // Don't throw error, just return
      }
      
      const children = await response.json();
      console.log('Fetched children:', children);
      
      if (Array.isArray(children) && children.length > 0) {
        // Add the fetched children to allItems
        setAllItems(prev => {
          const existing = prev.filter(item => item.parentId !== nodeId);
          return [...existing, ...children];
        });
      }
    } catch (error) {
      console.error('Error fetching children for nodeId', nodeId, ':', error);
    }
  };

  // Build hierarchical display with proper levels
  const displayItems = useMemo(() => {
    const result: ContentNode[] = [];
    const processed = new Set<string>();
    
    const addItemAndChildren = (item: ContentNode, level: number = 0) => {
      const itemId = item._id || item.id;
      if (processed.has(itemId)) return;
      
      processed.add(itemId);
      result.push({ ...item, level });
      
      // Add children if this node is expanded
      if (expandedNodes.has(itemId)) {
        const children = allItems.filter(child => child.parentId === itemId);
        children.sort((a, b) => (a.order || 0) - (b.order || 0) || a.title.localeCompare(b.title));
        
        for (const child of children) {
          addItemAndChildren(child, level + 1);
        }
      }
    };
    
    // Start with the root items (direct children passed to component)
    const rootItems = items.sort((a, b) => (a.order || 0) - (b.order || 0) || a.title.localeCompare(b.title));
    for (const rootItem of rootItems) {
      addItemAndChildren(rootItem, 0);
    }
    
    return result;
  }, [items, allItems, expandedNodes]);

  const toggleNodeExpansion = async (nodeId: string) => {
    const isCurrentlyExpanded = expandedNodes.has(nodeId);
    
    if (!isCurrentlyExpanded) {
      // Expanding: check if we need to fetch children
      const hasLoadedChildren = allItems.some(item => item.parentId === nodeId);
      if (!hasLoadedChildren) {
        await fetchChildren(nodeId);
      }
    }
    
    // Toggle expansion state
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  const hasChildren = (nodeId: string): boolean => {
    // Check if this node has children in allItems
    const hasLoadedChildren = allItems.some(item => item.parentId === nodeId);
    
    // Check if the node itself indicates it has children
    const node = allItems.find(item => (item._id || item.id) === nodeId) || 
                  items.find(item => (item._id || item.id) === nodeId);
    const hasChildrenProp = node && node.children && node.children.length > 0;
    
    // Only assume chapters might have children if we haven't tried to load them yet
    // and they don't explicitly have children already shown
    if (node && node.type === 'chapter' && !hasLoadedChildren && !hasChildrenProp) {
      // Check if we've already tried to fetch children for this node
      return true; // Assume chapters might have children until proven otherwise
    }
    
    return hasLoadedChildren || hasChildrenProp || false;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'category': return <CategoryIcon />;
      case 'chapter': return <FolderIcon />;
      case 'article': return <FileTextIcon />;
      default: return null;
    }
  };

  const getTypeColor = (type: string): 'info' | 'success' | 'secondary' | 'default' => {
    switch (type) {
      case 'category': return 'info';
      case 'chapter': return 'success';
      case 'article': return 'secondary';
      default: return 'default';
    }
  };

  const handleCardClick = (item: ContentNode) => {
    const isExpandable = hasChildren(item._id || item.id);
    
    // If it's expandable (chapter/category with children), toggle expansion
    if (isExpandable && (item.type === 'chapter' || item.type === 'category')) {
      toggleNodeExpansion(item._id || item.id);
    } 
    // If it's an article, always navigate
    else if (item.type === 'article') {
      // Get current URL path to build the navigation path
      const currentPath = window.location.pathname;
      const pathParts = currentPath.split('/').filter(Boolean);
      
      console.log('Current path parts:', pathParts);
      console.log('Navigating to article:', item.title, 'slug:', item.slug);
      
      // We should be in /c/[category] context
      if (pathParts[0] === 'c' && pathParts.length >= 2) {
        const categorySlug = pathParts[1];
        
        // Check if we're already in a chapter context
        if (pathParts.length === 3) {
          // We're in /c/category/chapter, so navigate to article
          router.push(`/c/${categorySlug}/${pathParts[2]}/${item.slug}`);
        } else {
          // We're in /c/category, need to find the chapter
          // Look for the parent chapter of this article
          let parentChapter = null;
          
          // First, try to find in loaded items
          for (const potentialParent of allItems) {
            if (potentialParent.type === 'chapter' && item.parentId === (potentialParent._id || potentialParent.id)) {
              parentChapter = potentialParent;
              break;
            }
          }
          
          // Also try in original items
          if (!parentChapter) {
            for (const potentialParent of items) {
              if (potentialParent.type === 'chapter' && item.parentId === (potentialParent._id || potentialParent.id)) {
                parentChapter = potentialParent;
                break;
              }
            }
          }
          
          if (parentChapter) {
            console.log('Found parent chapter:', parentChapter.slug);
            router.push(`/c/${categorySlug}/${parentChapter.slug}/${item.slug}`);
          } else {
            console.log('No parent chapter found, trying direct navigation');
            router.push(`/c/${categorySlug}/${item.slug}`);
          }
        }
      } else {
        console.log('Not in proper category context, using simple navigation');
        router.push(`/c/${item.slug}`);
      }
    }
    // If it's a chapter without expandable content, navigate to it
    else if (item.type === 'chapter' && !isExpandable) {
      const currentPath = window.location.pathname;
      const pathParts = currentPath.split('/').filter(Boolean);
      
      if (pathParts[0] === 'c' && pathParts.length >= 2) {
        const categorySlug = pathParts[1];
        router.push(`/c/${categorySlug}/${item.slug}`);
      } else {
        router.push(`/c/${item.slug}`);
      }
    }
  };

  if (displayItems.length === 0) {
    return (
      <Paper elevation={1} sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="text.secondary">
          No content available
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={1} sx={{ borderRadius: 2,p:2 }}>
      <List sx={{ width: '100%', overflow: 'hidden' }}>
        {displayItems.map((item) => {
          const isExpandable = hasChildren(item._id || item.id);
          const isExpanded = expandedNodes.has(item._id || item.id);
          
          return (
            <ListItem 
              key={item._id || item.id}
              onClick={() => handleCardClick(item)}
              sx={{ 
                ml: Math.min((item.level || 0) * 2, 8), // Limit max indentation
                mr: 1,
                border: 1,
                borderColor: 'divider',
                borderRadius: 1,
                mb: 1,
                maxWidth: `calc(100% - ${Math.min((item.level || 0) * 2, 8) * 8}px)`,
                boxSizing: 'border-box',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'action.hover'
                }
              }}
            >
              <ListItemIcon sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {/* Expand/Collapse Icon */}
                {isExpandable ? (
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click
                      toggleNodeExpansion(item._id || item.id);
                    }}
                    sx={{ p: 0.5 }}
                  >
                    {isExpanded ? 
                      <ExpandMoreIcon fontSize="small" /> : 
                      <ChevronRightIcon fontSize="small" />
                    }
                  </IconButton>
                ) : (
                  <Box sx={{ width: 24, height: 24 }} /> // Spacer for alignment
                )}
                {/* Type Icon */}
                {getTypeIcon(item.type)}
              </ListItemIcon>
              
              <ListItemText
                sx={{ 
                  minWidth: 0,
                  overflow: 'hidden'
                }}
                primary={
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    flexWrap: 'wrap',
                    minWidth: 0
                  }}>
                    {/* Title without individual link - card will handle navigation */}
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        minWidth: 0,
                        wordBreak: 'break-word',
                        flexShrink: 1
                      }}
                    >
                      {item.title}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      <Chip 
                        label={item.type} 
                        color={getTypeColor(item.type)}
                        size="small"
                      />
                      {/* Show numbered badge */}
                      {typeof item.badge === 'number' && (
                        <Chip 
                          label={`#${item.badge}`} 
                          color="default" 
                          size="small" 
                        />
                      )}
                      {/* Show coming soon badge */}
                      {item.badge === 'coming-soon' && (
                        <Chip label="Coming Soon" color="warning" size="small" />
                      )}
                    </Box>
                  </Box>
                }
                secondary={
                  item.summary && (
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        wordBreak: 'break-word',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {item.summary}
                    </Typography>
                  )
                }
              />
            </ListItem>
          );
        })}
      </List>
    </Paper>
  );
}