"use client";

import { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box,
  AppBar,
  Toolbar,
  IconButton,
  InputAdornment,
  TextField,
  Card,
  CardContent,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  Search as SearchIcon,
  Home as HomeIcon, 
  Settings as SettingsIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { ContentNode } from '@/types/content';
import { searchContent, getAllContentByType } from '@/lib/contentUtils';
import { i18n } from '@/lib/i18n';

export default function LandingComponent() {
  const [categories, setCategories] = useState<ContentNode[]>([]);
  const [allCategories, setAllCategories] = useState<ContentNode[]>([]); // Store all categories
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(''); // Category filter
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Load categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const categoriesData = await getAllContentByType('category');
        setCategories(categoriesData);
        setAllCategories(categoriesData); // Store all categories for filtering
      } catch (err) {
        setError('Failed to load categories');
        console.error('Error loading categories:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    filterCategories(query, selectedCategory);
  };

  const handleCategoryFilter = (categoryId: string) => {
    setSelectedCategory(categoryId);
    filterCategories(searchQuery, categoryId);
  };

  const filterCategories = async (query: string, categoryFilter: string) => {
    try {
      let filteredCategories = allCategories;

      // Apply search filter
      if (query.trim()) {
        const results = await searchContent(query);
        const categoryIds = new Set(results.filter(r => r.type === 'category').map(r => r.id));
        filteredCategories = allCategories.filter(cat => categoryIds.has(cat._id || cat.id));
      }

      // Apply category filter
      if (categoryFilter) {
        filteredCategories = filteredCategories.filter(cat => 
          (cat._id || cat.id) === categoryFilter
        );
      }

      setCategories(filteredCategories);
    } catch (err) {
      console.error('Filter error:', err);
      // Fallback to show all categories
      setCategories(allCategories);
    }
  };

  const CategoryCard = ({ category }: { category: ContentNode }) => {
    const isComingSoon = category.badge === 'coming-soon';

    return (
      <Card 
        sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          minHeight: 280,
          maxHeight: 280,
          opacity: isComingSoon ? 0.7 : 1,
          transition: 'all 0.3s ease-in-out',
          borderRadius: 2,
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
          '&:hover': {
            boxShadow: isComingSoon ? '0 2px 12px rgba(0, 0, 0, 0.08)' : '0 8px 25px rgba(76, 175, 80, 0.15)',
            cursor: isComingSoon ? 'default' : 'pointer',
            transform: isComingSoon ? 'none' : 'translateY(-4px)'
          }
        }}
      >
        <CardContent sx={{ 
          flex: 1, 
          p: 4, 
          display: 'flex', 
          flexDirection: 'column',
          height: '100%'
        }}>
          {/* Title with decorative line */}
          <Box sx={{ mb: 3 }}>
            <Typography 
              variant="h5" 
              component="h3" 
              fontWeight={700}
              sx={{
                fontSize: '1.3rem',
                lineHeight: 1.3,
                minHeight: '3.4rem', // Space for 2-3 lines
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                mb: 2,
                color: '#2e2e2e'
              }}
            >
              {category.title}
            </Typography>
            {/* Decorative line under title */}
            <Box 
              sx={{ 
                width: '60px',
                height: '4px',
                bgcolor: '#4caf50', // Green instead of orange
                borderRadius: '2px'
              }} 
            />
          </Box>
          
          {/* Description */}
          <Typography 
            variant="body1" 
            color="text.secondary" 
            sx={{ 
              flex: 1,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              lineHeight: 1.6,
              fontSize: '0.95rem',
              minHeight: '4.8rem',
              maxHeight: '4.8rem',
              mb: 3
            }}
          >
            {category.summary || 'No description available.'}
          </Typography>
          
          {/* Bottom section with badges and button */}
          <Box sx={{ 
            mt: 'auto',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            gap: 2
          }}>
            {/* Badge Section */}
            <Box sx={{ flex: 1 }}>
              {isComingSoon ? (
                <Chip 
                  label={i18n.comingSoon} 
                  variant="outlined" 
                  size="small"
                  sx={{ 
                    borderColor: '#4caf50',
                    color: '#4caf50',
                    fontWeight: 500
                  }}
                />
              ) : category.badge && typeof category.badge === 'number' ? (
                <Chip 
                  label={`#${category.badge}`} 
                  variant="filled"
                  size="small" 
                  sx={{
                    bgcolor: '#4caf50',
                    color: 'white',
                    fontWeight: 600
                  }}
                />
              ) : null}
            </Box>
            
            {/* Action Button - Bottom Right */}
            {!isComingSoon && (
              <Button 
                variant="contained" 
                size="small"
                onClick={() => router.push(`/c/${category.slug}`)}
                sx={{
                  bgcolor: '#4caf50',
                  color: 'white',
                  fontWeight: 500,
                  fontSize: '0.8rem',
                  py: 0.8,
                  px: 2,
                  minWidth: '60px',
                  borderRadius: 1.5,
                  textTransform: 'none',
                  '&:hover': {
                    bgcolor: '#45a049',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 3px 8px rgba(76, 175, 80, 0.3)'
                  }
                }}
              >
                {i18n.read}
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
      <AppBar position="static" sx={{ bgcolor: 'primary.main' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="home" sx={{ mr: 2 }} onClick={() => router.push('/')}>
            <HomeIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {i18n.title}
          </Typography>
          <Box sx={{ flexGrow: 1, mx: 3, display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder={i18n.search}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              size="small"
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.15)',
                borderRadius: 1,
                '& .MuiOutlinedInput-root': {
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
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                  </InputAdornment>
                ),
              }}
            />
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&.Mui-focused': { color: 'white' }
                }}
              >
                Category
              </InputLabel>
              <Select
                value={selectedCategory}
                onChange={(e) => handleCategoryFilter(e.target.value)}
                label="Category"
                sx={{
                  color: 'white',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'white',
                  },
                  '& .MuiSelect-icon': {
                    color: 'rgba(255, 255, 255, 0.7)',
                  },
                }}
              >
                <MenuItem value="">
                  <em>All Categories</em>
                </MenuItem>
                {allCategories.map((category) => (
                  <MenuItem key={category._id || category.id} value={category._id || category.id}>
                    {category.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <IconButton color="inherit" onClick={() => router.push('/admin')}>
            <SettingsIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      
      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Error State */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* No Results */}
        {!loading && !error && searchQuery && categories.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 12 }}>
            <Typography color="text.secondary">{i18n.noResults}</Typography>
          </Box>
        )}

        {/* Categories Grid */}
        {!loading && !error && (
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)',
              xl: 'repeat(5, 1fr)' // More columns for extra large screens
            },
            gap: 3,
            alignItems: 'stretch', // Ensure all cards stretch to same height
            justifyItems: 'stretch' // Ensure all cards stretch to same width
          }}>
            {categories.map((category) => (
              <CategoryCard key={category._id || category.id} category={category} />
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
}
