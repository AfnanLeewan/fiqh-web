"use client";

import { useState } from 'react';
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
  Chip
} from '@mui/material';
import { 
  Search as SearchIcon, 
  Menu as MenuIcon, 
  Settings as SettingsIcon 
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { mockData } from '@/data/mockData';
import { ContentNode } from '@/types/content';
import { searchContent } from '@/lib/contentUtils';
import { i18n } from '@/lib/i18n';

export default function Landing() {
  const [filteredCategories, setFilteredCategories] = useState<ContentNode[]>(mockData);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const results = searchContent(query);
      const categoryIds = new Set(results.filter(r => r.type === 'category').map(r => r.id));
      setFilteredCategories(mockData.filter(cat => categoryIds.has(cat.id)));
    } else {
      setFilteredCategories(mockData);
    }
  };

  const CategoryCard = ({ category }: { category: ContentNode }) => {
    const isComingSoon = category.badge === 'coming-soon' || !category.children?.length;

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
            ) : (
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
          <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>
            สารบัญกรณ์
          </Typography>
          
          <TextField
            placeholder={i18n.search}
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            size="small"
            sx={{ 
              mr: 2,
              '& .MuiOutlinedInput-root': {
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
          
          <IconButton 
            color="inherit" 
            onClick={() => router.push('/admin/login')}
            title="Admin Login"
          >
            <SettingsIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      
      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {searchQuery && filteredCategories.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 12 }}>
            <Typography color="text.secondary">{i18n.noResults}</Typography>
          </Box>
        )}
        
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
          {filteredCategories.map((category) => (
            <Box key={category.id}>
              <CategoryCard category={category} />
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
