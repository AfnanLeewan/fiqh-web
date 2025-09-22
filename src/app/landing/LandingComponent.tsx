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
          minHeight: 200, // Ensure minimum height for consistency
          opacity: isComingSoon ? 0.6 : 1,
          '&:hover': {
            boxShadow: isComingSoon ? 'none' : 3,
            cursor: isComingSoon ? 'default' : 'pointer'
          }
        }}
      >
        <CardContent sx={{ 
          flex: 1, 
          p: 3, 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <Box>
            <Typography variant="h6" component="h3" gutterBottom fontWeight={600}>
              {category.title}
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                mb: 2,
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                lineHeight: 1.5,
                minHeight: '4.5em' // 3 lines × 1.5 line-height
              }}
            >
              {category.summary}
            </Typography>
          </Box>
          <Box sx={{ mt: 'auto', pt: 2 }}>
            {isComingSoon ? (
              <Chip label={i18n.comingSoon} variant="outlined" size="small" />
            ) : category.badge && typeof category.badge === 'number' ? (
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <Chip 
                  label={`#${category.badge}`} 
                  variant="outlined" 
                  size="small" 
                  color="primary"
                />
              </Box>
            ) : null}
            {!isComingSoon && (
              <Button 
                variant="contained" 
                size="small"
                onClick={() => router.push(`/c/${category.slug}`)}
                fullWidth
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
              lg: 'repeat(4, 1fr)'
            },
            gap: 3,
          }}>
            {categories.map((category) => (
              <Box key={category._id || category.id}>
                <CategoryCard category={category} />
              </Box>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
}
