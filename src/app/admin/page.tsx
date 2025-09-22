"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  AppBar,
  Toolbar,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import {
  Add as PlusIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Article as FileTextIcon,
  Folder as FolderIcon,
  Book as BookOpenIcon,
  Logout as LogOutIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { mockData } from '@/data/mockData';
import { ContentNode } from '@/types/content';

type EditingNode = Partial<ContentNode> & {
  isNew?: boolean;
  parentId?: string;
};

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

export default function Admin() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);
  const [editingNode, setEditingNode] = useState<EditingNode | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  // Mock data management (in real app, this would be API calls)
  const [contentData] = useState(mockData);

  const flattenContent = (nodes: ContentNode[], level = 0): (ContentNode & { level: number })[] => {
    const result: (ContentNode & { level: number })[] = [];
    
    nodes.forEach(node => {
      result.push({ ...node, level });
      if (node.children) {
        result.push(...flattenContent(node.children, level + 1));
      }
    });
    
    return result;
  };

  const getFilteredContent = () => {
    const tabTypes = ['all', 'category', 'chapter', 'article'];
    const currentTabType = tabTypes[selectedTab];
    
    return flattenContent(contentData).filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTab = currentTabType === 'all' || item.type === currentTabType;
      return matchesSearch && matchesTab;
    });
  };

  const handleEdit = (node: ContentNode) => {
    setEditingNode({ ...node });
    setIsDialogOpen(true);
  };

  const handleCreate = (type: 'category' | 'chapter' | 'article', parentId?: string) => {
    setEditingNode({
      isNew: true,
      type,
      parentId,
      title: '',
      summary: '',
      body: type === 'article' ? '' : undefined,
      slug: '',
      badge: type === 'article' ? undefined : 'coming-soon'
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!editingNode?.title || !editingNode?.slug) {
      enqueueSnackbar('Title and slug are required', { variant: 'error' });
      return;
    }

    enqueueSnackbar(
      `${editingNode.isNew ? 'Created' : 'Updated'} ${editingNode.type} successfully`,
      { variant: 'success' }
    );

    setIsDialogOpen(false);
    setEditingNode(null);
  };

  const handleDelete = (node: ContentNode) => {
    if (confirm(`Are you sure you want to delete "${node.title}"?`)) {
      enqueueSnackbar('Content deleted successfully', { variant: 'success' });
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

  const getTypeColor = (type: string): 'info' | 'success' | 'secondary' | 'default' => {
    switch (type) {
      case 'category': return 'info';
      case 'chapter': return 'success';
      case 'article': return 'secondary';
      default: return 'default';
    }
  };

  const filteredContent = getFilteredContent();

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
          <Button
            variant="contained"
            startIcon={<PlusIcon />}
            onClick={() => handleCreate('category')}
            sx={{ minWidth: 150 }}
          >
            Add Content
          </Button>
        </Box>

        {/* Content Tabs */}
        <Paper sx={{ mb: 3 }}>
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
            <List>
              {filteredContent.map((item) => (
                <ListItem 
                  key={item.id}
                  sx={{ 
                    ml: item.level * 3,
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 1,
                    mb: 1
                  }}
                >
                  <ListItemIcon>
                    {getTypeIcon(item.type)}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle1">{item.title}</Typography>
                        <Chip 
                          label={item.type} 
                          color={getTypeColor(item.type)}
                          size="small"
                        />
                        {item.badge && item.badge !== 'coming-soon' && (
                          <Chip label={`#${item.badge}`} variant="outlined" size="small" />
                        )}
                        {item.badge === 'coming-soon' && (
                          <Chip label="Coming Soon" color="warning" size="small" />
                        )}
                      </Box>
                    }
                    secondary={item.summary}
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
          </TabPanel>
        </Paper>

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
                  onChange={(e) => setEditingNode(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter title"
                />
                <TextField
                  fullWidth
                  label="Slug *"
                  value={editingNode?.slug || ''}
                  onChange={(e) => setEditingNode(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="enter-slug"
                />
              </Box>
              
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Summary"
                value={editingNode?.summary || ''}
                onChange={(e) => setEditingNode(prev => ({ ...prev, summary: e.target.value }))}
                placeholder="Brief description"
              />

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
