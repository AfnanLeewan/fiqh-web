"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  CircularProgress,
  Autocomplete,
  AppBar,
  Toolbar,
  InputAdornment,
  ButtonGroup,
  Collapse
} from '@mui/material';
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Article as FileTextIcon,
  Folder as FolderIcon,
  Book as BookOpenIcon,
  Logout as LogOutIcon,
  Visibility as ViewIcon,
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { ContentNode } from '@/types/content';
import {
  getAllContentByType,
  createContent,
  updateContent,
  deleteContent
} from '@/lib/contentUtils';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

interface EditingContentNode extends Partial<ContentNode> {
  isNew?: boolean;
  parentId?: string;
}

export default function AdminPage() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  
  const [contentData, setContentData] = useState<ContentNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(''); // Category filter
  const [selectedChapter, setSelectedChapter] = useState<string>(''); // Chapter filter
  const [selectedTab, setSelectedTab] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNode, setEditingNode] = useState<EditingContentNode | null>(null);
  const [availableParents, setAvailableParents] = useState<ContentNode[]>([]);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  // Load content data
  const loadContent = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get all content types
      const [categories, chapters, articles] = await Promise.all([
        getAllContentByType('category'),
        getAllContentByType('chapter'),
        getAllContentByType('article')
      ]);
      
      // Combine all content
      const allContent = [...categories, ...chapters, ...articles];
      setContentData(allContent);
    } catch (err) {
      setError('Failed to load content');
      console.error('Error loading content:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  // Reset chapter filter when category changes
  useEffect(() => {
    setSelectedChapter('');
  }, [selectedCategory]);

  const getAvailableChapters = () => {
    if (!selectedCategory) return [];
    
    // Helper function to check if a chapter belongs to the selected category
    const belongsToCategory = (item: ContentNode, categoryId: string): boolean => {
      if (!item.parentId) return false;
      
      // Direct child of category
      if (item.parentId === categoryId) return true;
      
      // Find the parent
      const parent = contentData.find(p => (p._id || p.id) === item.parentId);
      if (!parent) return false;
      
      // If parent is a chapter, check recursively
      if (parent.type === 'chapter') {
        return belongsToCategory(parent, categoryId);
      }
      
      return false;
    };
    
    return contentData.filter(item => 
      item.type === 'chapter' && belongsToCategory(item, selectedCategory)
    );
  };

  const getFilteredContent = () => {
    const tabTypes = ['all', 'category', 'chapter', 'article'];
    const currentTabType = tabTypes[selectedTab];
    
    // Helper function to check if an item belongs to a category tree
    const belongsToCategory = (item: ContentNode, categoryId: string): boolean => {
      if (!item.parentId) return false;
      
      // Find the parent
      const parent = contentData.find(p => (p._id || p.id) === item.parentId);
      if (!parent) return false;
      
      // If parent is the target category, we belong to it
      if ((parent._id || parent.id) === categoryId) return true;
      
      // If parent is a chapter, check recursively
      if (parent.type === 'chapter') {
        return belongsToCategory(parent, categoryId);
      }
      
      return false;
    };

    // Helper function to check if an item belongs to a chapter tree
    const belongsToChapter = (item: ContentNode, chapterId: string): boolean => {
      if (!item.parentId) return false;
      
      // Direct child of the chapter
      if (item.parentId === chapterId) return true;
      
      // Find the parent
      const parent = contentData.find(p => (p._id || p.id) === item.parentId);
      if (!parent) return false;
      
      // If parent is a chapter, check recursively
      if (parent.type === 'chapter') {
        return belongsToChapter(parent, chapterId);
      }
      
      return false;
    };
    
    return contentData.filter((item: ContentNode) => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTab = currentTabType === 'all' || item.type === currentTabType;
      
      // Category filter
      let matchesCategory = true;
      if (selectedCategory) {
        if (item.type === 'category') {
          matchesCategory = (item._id || item.id) === selectedCategory;
        } else {
          matchesCategory = belongsToCategory(item, selectedCategory);
        }
      }

      // Chapter filter
      let matchesChapter = true;
      if (selectedChapter) {
        if (item.type === 'chapter') {
          matchesChapter = (item._id || item.id) === selectedChapter || belongsToChapter(item, selectedChapter);
        } else if (item.type === 'article') {
          matchesChapter = belongsToChapter(item, selectedChapter);
        } else if (item.type === 'category') {
          // Show category only if it's the root of the selected chapter
          const selectedChapterData = contentData.find(c => (c._id || c.id) === selectedChapter);
          matchesChapter = selectedChapterData && belongsToCategory(selectedChapterData, item._id || item.id);
        }
      }
      
      return matchesSearch && matchesTab && matchesCategory && matchesChapter;
    });
  };

  // Tree management functions
  const toggleNodeExpansion = (nodeId: string) => {
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
    return contentData.some(item => item.parentId === nodeId);
  };

  const sortContentHierarchically = (content: ContentNode[]): ContentNode[] => {
    const result: ContentNode[] = [];
    const processed = new Set<string>();
    
    const addItemAndChildren = (item: ContentNode, level: number = 0) => {
      const itemId = item._id || item.id;
      if (processed.has(itemId)) return;
      
      processed.add(itemId);
      result.push({ ...item, level });
      
      // Find and add children
      const children = content.filter(child => child.parentId === itemId);
      children.sort((a, b) => a.title.localeCompare(b.title));
      
      for (const child of children) {
        addItemAndChildren(child, level + 1);
      }
    };
    
    // Start with root items (no parent)
    const rootItems = content.filter(item => !item.parentId);
    rootItems.sort((a, b) => a.title.localeCompare(b.title));
    
    for (const rootItem of rootItems) {
      addItemAndChildren(rootItem);
    }
    
    return result;
  };

  const getFilteredContentWithVisibility = () => {
    const allContent = getFilteredContent();
    const sortedContent = sortContentHierarchically(allContent);
    
    if (searchQuery) {
      // When searching, show all matching items regardless of expansion state
      return sortedContent;
    }
    
    // Filter out collapsed children
    return sortedContent.filter(item => {
      if (!item.parentId) return true; // Root items are always visible
      
      // Find the parent and check if it's expanded
      let currentParent = item.parentId;
      while (currentParent) {
        if (!expandedNodes.has(currentParent)) {
          return false; // Parent is collapsed, hide this item
        }
        // Move up the tree
        const parentNode = contentData.find(p => (p._id || p.id) === currentParent);
        currentParent = parentNode?.parentId;
      }
      
      return true;
    });
  };

  const handleEdit = (node: ContentNode) => {
    setEditingNode({ ...node });
    setIsDialogOpen(true);
  };

  // Helper function to generate slug from title
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .trim()
      // Replace Thai characters and spaces with hyphens
      .replace(/[\s\u0E00-\u0E7F]+/g, '-')
      // Replace special characters with hyphens
      .replace(/[^\w\-]+/g, '-')
      // Remove multiple consecutive hyphens
      .replace(/\-\-+/g, '-')
      // Remove leading and trailing hyphens
      .replace(/^-+|-+$/g, '');
  };

  // Handle title change and auto-generate slug
  const handleTitleChange = (newTitle: string) => {
    setEditingNode(prev => {
      if (!prev) return prev;
      
      const updates: Partial<typeof prev> = { title: newTitle };
      
      // Auto-generate slug only for new items or if slug is empty/matches old title
      if (prev.isNew || !prev.slug || prev.slug === generateSlug(prev.title || '')) {
        updates.slug = generateSlug(newTitle);
      }
      
      return { ...prev, ...updates };
    });
  };

  const handleCreate = (type: 'category' | 'chapter' | 'article', parentId?: string) => {
    // Load available parents based on type
    if (type === 'chapter') {
      // Chapters can be children of categories OR other chapters
      const parents = contentData.filter(item => 
        item.type === 'category' || item.type === 'chapter'
      );
      setAvailableParents(parents);
    } else if (type === 'article') {
      // Articles can be children of categories or chapters (at any level)
      const parents = contentData.filter(item => 
        item.type === 'category' || item.type === 'chapter'
      );
      setAvailableParents(parents);
    } else {
      // Categories have no parents
      setAvailableParents([]);
    }

    setEditingNode({
      isNew: true,
      type,
      parentId: parentId || '',
      title: '',
      summary: '',
      body: type === 'article' ? '' : undefined,
      slug: '',
      badge: type === 'article' ? undefined : undefined, // Start as available (no badge)
      order: 0,
      published: true
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editingNode?.title) {
      enqueueSnackbar('Title is required', { variant: 'error' });
      return;
    }

    // Validate parent selection for chapters and articles
    if (editingNode.type !== 'category' && !editingNode.parentId && availableParents.length > 0) {
      enqueueSnackbar(`Please select a parent ${editingNode.type === 'chapter' ? 'category' : 'category/chapter'}`, { variant: 'error' });
      return;
    }

    try {
      const contentData = {
        ...editingNode,
        parentId: editingNode.parentId || undefined
      };
      delete contentData.isNew;

      if (editingNode.isNew) {
        const created = await createContent(contentData);
        if (created) {
          enqueueSnackbar(`Created ${editingNode.type} successfully`, { variant: 'success' });
          loadContent(); // Reload content
        } else {
          throw new Error('Failed to create content');
        }
      } else {
        const updated = await updateContent(contentData);
        if (updated) {
          enqueueSnackbar(`Updated ${editingNode.type} successfully`, { variant: 'success' });
          loadContent(); // Reload content
        } else {
          throw new Error('Failed to update content');
        }
      }

      setIsDialogOpen(false);
      setEditingNode(null);
    } catch (err) {
      enqueueSnackbar('Failed to save content', { variant: 'error' });
      console.error('Error saving content:', err);
    }
  };

  const handleDelete = async (node: ContentNode) => {
    if (confirm(`Are you sure you want to delete "${node.title}"?`)) {
      try {
        const success = await deleteContent(node._id || node.id);
        if (success) {
          enqueueSnackbar('Content deleted successfully', { variant: 'success' });
          loadContent(); // Reload content
        } else {
          throw new Error('Failed to delete content');
        }
      } catch (err) {
        enqueueSnackbar('Failed to delete content', { variant: 'error' });
        console.error('Error deleting content:', err);
      }
    }
  };

  const handleLogout = () => {
    router.push('/admin/login');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'category': return <BookOpenIcon />;
      case 'chapter': return <FolderIcon />;
      case 'article': return <FileTextIcon />;
      default: return null;
    }
  };

  const getBadgeColor = (badge: string): 'warning' | 'success' | 'info' | 'error' | 'default' => {
    switch (badge) {
      case 'coming-soon': return 'warning';
      case 'available': return 'success';
      case 'new': return 'info';
      case 'updated': return 'info';
      default: return 'default';
    }
  };

  const getBadgeText = (badge: string | number): string => {
    if (typeof badge === 'number') return `#${badge}`;
    switch (badge) {
      case 'coming-soon': return 'Coming Soon';
      case 'available': return 'Available';
      case 'new': return 'New';
      case 'updated': return 'Updated';
      default: return badge.toString();
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

  const filteredContent = getFilteredContentWithVisibility();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
      <AppBar position="static" sx={{ bgcolor: 'primary.main' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Content Management System
          </Typography>
          <Button color="inherit" onClick={() => router.push('/')} sx={{ mr: 2 }}>
            <ViewIcon sx={{ mr: 1 }} />
            View Site
          </Button>
          <Button color="inherit" onClick={handleLogout}>
            <LogOutIcon sx={{ mr: 1 }} />
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Search and Controls */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <FormControl sx={{ minWidth: 180 }}>
            <InputLabel id="category-filter-label">Filter by Category</InputLabel>
            <Select
              labelId="category-filter-label"
              value={selectedCategory}
              label="Filter by Category"
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <MenuItem value="">
                <em>All Categories</em>
              </MenuItem>
              {contentData
                .filter(item => item.type === 'category')
                .map((category) => (
                  <MenuItem key={category._id || category.id} value={category._id || category.id}>
                    {category.title}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          {selectedCategory && (
            <FormControl sx={{ minWidth: 180 }}>
              <InputLabel id="chapter-filter-label">Filter by Chapter</InputLabel>
              <Select
                labelId="chapter-filter-label"
                value={selectedChapter}
                label="Filter by Chapter"
                onChange={(e) => setSelectedChapter(e.target.value)}
              >
                <MenuItem value="">
                  <em>All Chapters</em>
                </MenuItem>
                {getAvailableChapters().map((chapter) => {
                  // Build display text showing hierarchy for nested chapters
                  const getChapterHierarchy = (item: ContentNode): string => {
                    const parent = contentData.find(p => (p._id || p.id) === item.parentId);
                    if (parent && parent.type === 'chapter') {
                      return `${getChapterHierarchy(parent)} > ${item.title}`;
                    }
                    return item.title;
                  };
                  
                  return (
                    <MenuItem key={chapter._id || chapter.id} value={chapter._id || chapter.id}>
                      {getChapterHierarchy(chapter)}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          )}
          <ButtonGroup variant="contained">
            <Button
              startIcon={<BookOpenIcon />}
              onClick={() => handleCreate('category')}
              sx={{ minWidth: 120 }}
            >
              Add Category
            </Button>
            <Button
              startIcon={<FolderIcon />}
              onClick={() => handleCreate('chapter')}
              sx={{ minWidth: 120 }}
            >
              Add Chapter
            </Button>
            <Button
              startIcon={<FileTextIcon />}
              onClick={() => handleCreate('article')}
              sx={{ minWidth: 120 }}
            >
              Add Article
            </Button>
          </ButtonGroup>
        </Box>

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Error State */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Content Tabs */}
        {!loading && !error && (
          <Paper sx={{ mb: 3, px: 2 }}>
            <Tabs
              value={selectedTab}
              onChange={(_, newValue) => setSelectedTab(newValue)}
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab label="All Content" />
              <Tab label="Categories" />
              <Tab label="Chapters" />
              <Tab label="Articles" />
            </Tabs>

            <TabPanel value={selectedTab} index={selectedTab}>
              {filteredContent.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography color="text.secondary">
                    {searchQuery ? 'No content found matching your search.' : 'No content available. Create some content to get started.'}
                  </Typography>
                </Box>
              ) : (
                <List sx={{ width: '100%', overflow: 'hidden' }}>
                  {filteredContent.map((item) => (
                    <ListItem 
                      key={item._id || item.id}
                      sx={{ 
                        ml: Math.min(item.level * 2, 8), // Limit max indentation to 8 units
                        mr: 1, // Add right margin to prevent overflow
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 1,
                        mb: 1,
                        maxWidth: `calc(100% - ${Math.min(item.level * 2, 8) * 8}px)`, // Ensure it doesn't overflow
                        boxSizing: 'border-box'
                      }}
                    >
                      <ListItemIcon sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {/* Expand/Collapse Icon */}
                        {hasChildren(item._id || item.id) ? (
                          <IconButton
                            size="small"
                            onClick={() => toggleNodeExpansion(item._id || item.id)}
                            sx={{ p: 0.5 }}
                          >
                            {expandedNodes.has(item._id || item.id) ? 
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
                          minWidth: 0, // Allow shrinking
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
                              {item.badge && item.badge !== 'coming-soon' && (
                                <Chip 
                                  label={getBadgeText(item.badge)} 
                                  color={typeof item.badge === 'string' ? getBadgeColor(item.badge) : 'default'} 
                                  size="small" 
                                />
                              )}
                              {item.badge === 'coming-soon' && (
                                <Chip label="Coming Soon" color={getBadgeColor('coming-soon')} size="small" />
                              )}
                            </Box>
                          </Box>
                        }
                        secondary={
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
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          onClick={() => handleEdit(item)}
                          sx={{ mr: 1 }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          edge="end"
                          onClick={() => handleDelete(item)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              )}
            </TabPanel>
          </Paper>
        )}

        {/* Edit/Create Dialog */}
        <Dialog 
          open={isDialogOpen} 
          onClose={() => setIsDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {editingNode?.isNew ? 'Create' : 'Edit'} {editingNode?.type}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Title *"
                  value={editingNode?.title || ''}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter title"
                />
              </Box>

              {/* Parent Selection for chapters and articles */}
              {editingNode?.type !== 'category' && availableParents.length > 0 && (
                <Autocomplete
                  fullWidth
                  options={availableParents}
                  value={availableParents.find(parent => (parent._id || parent.id) === editingNode?.parentId) || null}
                  onChange={(event, newValue) => {
                    setEditingNode(prev => ({ 
                      ...prev, 
                      parentId: newValue ? (newValue._id || newValue.id) : '' 
                    }));
                  }}
                  getOptionLabel={(option) => {
                    // Build display text showing hierarchy
                    const getParentHierarchy = (item: ContentNode): string => {
                      const parentItem = contentData.find(p => (p._id || p.id) === item.parentId);
                      if (parentItem) {
                        return `${getParentHierarchy(parentItem)} > ${item.title}`;
                      }
                      return item.title;
                    };
                    return `${getParentHierarchy(option)} (${option.type})`;
                  }}
                  filterOptions={(options, { inputValue }) => {
                    // Custom filter that searches in title and hierarchy
                    return options.filter(option => {
                      const getParentHierarchy = (item: ContentNode): string => {
                        const parentItem = contentData.find(p => (p._id || p.id) === item.parentId);
                        if (parentItem) {
                          return `${getParentHierarchy(parentItem)} > ${item.title}`;
                        }
                        return item.title;
                      };
                      const fullText = `${getParentHierarchy(option)} ${option.type}`.toLowerCase();
                      return fullText.includes(inputValue.toLowerCase());
                    });
                  }}
                  renderOption={(props, option) => {
                    const getParentHierarchy = (item: ContentNode): string => {
                      const parentItem = contentData.find(p => (p._id || p.id) === item.parentId);
                      if (parentItem) {
                        return `${getParentHierarchy(parentItem)} > ${item.title}`;
                      }
                      return item.title;
                    };
                    
                    return (
                      <Box component="li" {...props} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="body1">{getParentHierarchy(option)}</Typography>
                        </Box>
                        <Chip 
                          label={option.type} 
                          size="small" 
                          color={option.type === 'category' ? 'primary' : 'secondary'} 
                        />
                      </Box>
                    );
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={`Parent ${editingNode?.type === 'chapter' ? 'Category/Chapter' : 'Category/Chapter'} *`}
                      placeholder="Search for parent category or chapter..."
                      helperText="Type to search by name or hierarchy"
                    />
                  )}
                  noOptionsText="No matching parents found"
                  clearOnBlur
                  selectOnFocus
                  handleHomeEndKeys
                />
              )}
              
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Summary"
                value={editingNode?.summary || ''}
                onChange={(e) => setEditingNode(prev => ({ ...prev, summary: e.target.value }))}
                placeholder="Brief description"
              />

              {/* Badge/Status Selection for categories and chapters */}
              {editingNode?.type !== 'article' && (
                <FormControl fullWidth>
                  <InputLabel id="badge-select-label">Status</InputLabel>
                  <Select
                    labelId="badge-select-label"
                    value={editingNode?.badge === 'coming-soon' ? 'coming-soon' : 
                           typeof editingNode?.badge === 'number' ? 'numbered' : 'available'}
                    label="Status"
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === 'coming-soon') {
                        setEditingNode(prev => ({ ...prev, badge: 'coming-soon' }));
                      } else if (value === 'numbered') {
                        setEditingNode(prev => ({ ...prev, badge: 1 }));
                      } else {
                        setEditingNode(prev => ({ ...prev, badge: undefined }));
                      }
                    }}
                  >
                    <MenuItem value="available">Available (No Badge)</MenuItem>
                    <MenuItem value="numbered">Numbered Badge</MenuItem>
                    <MenuItem value="coming-soon">Coming Soon</MenuItem>
                  </Select>
                </FormControl>
              )}

              {/* Number input for numbered badges */}
              {editingNode?.type !== 'article' && typeof editingNode?.badge === 'number' && (
                <TextField
                  fullWidth
                  type="number"
                  label="Badge Number"
                  value={editingNode.badge || 1}
                  onChange={(e) => setEditingNode(prev => ({ 
                    ...prev, 
                    badge: parseInt(e.target.value) || 1 
                  }))}
                  inputProps={{ min: 1 }}
                />
              )}

              {editingNode?.type === 'article' && (
                <TextField
                  fullWidth
                  multiline
                  rows={8}
                  label="Content"
                  value={editingNode?.body || ''}
                  onChange={(e) => setEditingNode(prev => ({ ...prev, body: e.target.value }))}
                  placeholder="Article content"
                />
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} variant="contained" startIcon={<SaveIcon />}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}
