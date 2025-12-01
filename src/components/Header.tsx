"use client";

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  AppBar,
  Toolbar,
  Typography,
  TextField,
  IconButton,
  Box,
  Paper,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Popper,
  ClickAwayListener,
  ToggleButton,
  ToggleButtonGroup,
  Container,
  InputAdornment
} from '@mui/material';
import {
  Search as SearchIcon,
  Home as HomeIcon,
  ViewList as ListIcon,
  ViewModule as GridIcon,
  Settings as SettingsIcon,
  Category as CategoryIcon,
  Article as ArticleIcon,
  Folder as ChapterIcon,
  AccountTree as TreeIcon
} from '@mui/icons-material';
import { i18n } from '@/lib/i18n';
import { searchContent } from '@/lib/contentUtils';
import { SearchResult } from '@/types/content';
import { ViewMode } from '@/types/content';

interface HeaderProps {
  title?: string;
  showViewToggle?: boolean;
  viewMode?: ViewMode;
  onViewModeChange?: (mode: ViewMode) => void;
  onSearch?: (query: string) => void;
}

export function Header({ title = 'สารบัญกรณ์', showViewToggle = false, viewMode = 'list', onViewModeChange, onSearch }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchAnchorEl, setSearchAnchorEl] = useState<HTMLElement | null>(null);
  const router = useRouter();

  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
    
    if (query.trim()) {
      try {
        const results = await searchContent(query);
        setSearchResults(results);
        
        // Show search results if available
        if (results.length > 0) {
          const searchField = document.querySelector('input[placeholder*="search"], input[placeholder*="ค้นหา"]') as HTMLElement;
          if (searchField) {
            setSearchAnchorEl(searchField);
          }
        }
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
      setSearchAnchorEl(null);
    }
  }, [onSearch]);

  const handleResultClick = (result: SearchResult) => {
    if (result.type === 'category') {
      router.push(`/c/${result.slug}`);
    } else {
      router.push(`/c${result.path}`);
    }
    setSearchAnchorEl(null);
    setSearchQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission or default behavior
      
      if (Array.isArray(searchResults) && searchResults.length > 0) {
        handleResultClick(searchResults[0]);
      }
      // Don't navigate anywhere if no results
    }
    if (e.key === 'Escape') {
      setSearchAnchorEl(null);
    }
  };

  const handleViewModeChange = (event: React.MouseEvent<HTMLElement>, newMode: ViewMode | null) => {
    if (newMode && onViewModeChange) {
      onViewModeChange(newMode);
    }
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'category': return <CategoryIcon color="primary" />;
      case 'chapter': return <ChapterIcon color="action" />;
      case 'article': return <ArticleIcon color="primary" />;
      default: return <ArticleIcon />;
    }
  };

  return (
    <AppBar position="static" sx={{ bgcolor: 'primary.main', boxShadow: 1 }}>
      <Container maxWidth="xl">
        <Toolbar sx={{ px: { xs: 0 } }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="home"
            sx={{ mr: 2 }}
            onClick={() => router.push('/')}
          >
            <HomeIcon />
          </IconButton>
          
          <Typography 
            variant="h6" 
            component="h1" 
            sx={{ flexGrow: { xs: 1, md: 0 }, mr: { md: 4 } }}
          >
            {title}
          </Typography>
          
          <Box sx={{ flexGrow: 1 }} />
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Search Field */}
            <Box sx={{ position: 'relative' }}>
              <form onSubmit={(e) => {
                e.preventDefault();
                if (Array.isArray(searchResults) && searchResults.length > 0) {
                  handleResultClick(searchResults[0]);
                }
              }}>
                <TextField
                  size="small"
                  placeholder={i18n.search}
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={(e) => {
                    if (Array.isArray(searchResults) && searchResults.length > 0) {
                      setSearchAnchorEl(e.currentTarget);
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: 'action.active' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    width: { xs: 200, md: 300 },
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'rgba(255, 255, 255, 0.15)',
                      color: 'white',
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'white',
                      },
                    },
                    '& .MuiInputBase-input::placeholder': {
                      color: 'rgba(255, 255, 255, 0.7)',
                      opacity: 1,
                    },
                  }}
                />
              </form>
              
              <Popper
                open={Boolean(searchAnchorEl) && Array.isArray(searchResults) && searchResults.length > 0}
                anchorEl={searchAnchorEl}
                placement="bottom-start"
                sx={{ zIndex: 1300, width: searchAnchorEl?.offsetWidth || 'auto' }}
              >
                <ClickAwayListener onClickAway={() => setSearchAnchorEl(null)}>
                  <Paper elevation={8} sx={{ maxHeight: 300, overflow: 'auto' }}>
                    <List dense>
                      {Array.isArray(searchResults) && searchResults.map((result) => (
                        <ListItemButton
                          key={result.id}
                          onClick={() => handleResultClick(result)}
                        >
                          <ListItemIcon sx={{ minWidth: 40 }}>
                            {getResultIcon(result.type)}
                          </ListItemIcon>
                          <ListItemText
                            primary={result.title}
                            secondary={result.type}
                            primaryTypographyProps={{ fontSize: '0.875rem' }}
                            secondaryTypographyProps={{ fontSize: '0.75rem', textTransform: 'capitalize' }}
                          />
                        </ListItemButton>
                      ))}
                    </List>
                  </Paper>
                </ClickAwayListener>
              </Popper>
            </Box>
            
            {/* View Toggle */}
            {showViewToggle && (
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={handleViewModeChange}
                size="small"
                sx={{
                  '& .MuiToggleButton-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    '&.Mui-selected': {
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                    },
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                    },
                  },
                }}
              >
                <ToggleButton value="list" aria-label="list view">
                  <ListIcon />
                </ToggleButton>
                <ToggleButton value="card" aria-label="card view">
                  <GridIcon />
                </ToggleButton>
                <ToggleButton value="tree" aria-label="tree view">
                  <TreeIcon />
                </ToggleButton>
              </ToggleButtonGroup>
            )}
            
            {/* Admin Button */}
            <IconButton
              color="inherit"
              onClick={() => router.push('/admin/login')}
              title="Admin Login"
              sx={{ 
                color: 'rgba(255, 255, 255, 0.9)',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              <SettingsIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}