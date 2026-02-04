"use client";

import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  AppBar,
  Toolbar,
  IconButton,
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
  Paper,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Popper,
  ClickAwayListener,

} from "@mui/material";
import {
  Search as SearchIcon,
  Home as HomeIcon,

  Category as CategoryIcon,
  Article as ArticleIcon,
  Folder as ChapterIcon,
  Lock as LockIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { ContentNode, SearchResult } from "@/types/content";
import { searchContent, getAllContentByType } from "@/lib/contentUtils";
import { i18n } from "@/lib/i18n";
import { getIconForContent } from "@/lib/iconMapper";
import Link from "next/link";

export default function LandingComponent() {
  const [categories, setCategories] = useState<ContentNode[]>([]);
  const [allCategories, setAllCategories] = useState<ContentNode[]>([]); // Store all categories
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>(""); // Category filter
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchAnchorEl, setSearchAnchorEl] = useState<HTMLElement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Load categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const categoriesData = await getAllContentByType("category");
        setCategories(categoriesData);
        setAllCategories(categoriesData); // Store all categories for filtering
      } catch (err) {
        setError("Failed to load categories");
        console.error("Error loading categories:", err);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const handleSearch = async (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    if (query.trim()) {
      setSearchAnchorEl(event.currentTarget as HTMLElement);
    } else {
      setSearchAnchorEl(null);
      setSearchResults([]);
    }
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
        setSearchResults(results);
        const categoryIds = new Set(
          results.filter((r) => r.type === "category").map((r) => r.id),
        );
        filteredCategories = allCategories.filter((cat) =>
          categoryIds.has(cat._id || cat.id),
        );
      } else {
        setSearchResults([]);
      }

      // Apply category filter
      if (categoryFilter) {
        filteredCategories = filteredCategories.filter(
          (cat) => (cat._id || cat.id) === categoryFilter,
        );
      }

      setCategories(filteredCategories);
    } catch (err) {
      console.error("Filter error:", err);
      // Fallback to show all categories
      setCategories(allCategories);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    router.push(result.path);
    setSearchAnchorEl(null);
    setSearchQuery("");
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case "category":
        return <CategoryIcon color="primary" />;
      case "chapter":
        return <ChapterIcon color="action" />;
      case "article":
        return <ArticleIcon color="primary" />;
      default:
        return <ArticleIcon />;
    }
  };

  const CategoryCard = ({ category }: { category: ContentNode }) => {
    const isComingSoon = category.badge === "coming-soon";
    const IconComponent = isComingSoon ? LockIcon : getIconForContent(category.type, category.slug, category.title, category.icon);

    return (
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          minHeight: 280,
          opacity: isComingSoon ? 0.8 : 1,
          bgcolor: "background.paper", // Clean white
        }}
      >
        <CardContent
          sx={{
            flex: 1,
            p: 4,
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          {/* Header with Icon and Title */}
          <Box sx={{ mb: 3, display: "flex", alignItems: "flex-start", gap: 2 }}>
            <Box
              sx={{
                p: 1.5,
                bgcolor: "secondary.light",
                borderRadius: "12px",
                color: "primary.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IconComponent fontSize="small" />
            </Box>
            <Box>
              <Typography
                variant="h1"
                component="h3"
                sx={{
                  fontSize: "1.25rem",
                  lineHeight: 1.3,
                  mb: 1,
                  color: "primary.main",
                }}
              >
                {category.title}
              </Typography>
   
              {/* ID Badge */}
              {category.badge && typeof category.badge === "number" && (
                <Chip
                  label={`#${category.badge}`}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: "0.7rem",
                    bgcolor: "primary.main",
                    color: "white",
                  }}
                />
              )}
            </Box>
            
          </Box>

          {/* Description */}
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              flex: 1,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              mb: 4, // Increased spacing
              lineHeight: 1.7, // Relaxed line height
              fontStyle: category.summary ? "normal" : "italic",
              opacity: category.summary ? 1 : 0.7
            }}
          >
            {category.summary || "No description available."}
          </Typography>

          {/* Bottom section with action */}
          <Box
            sx={{
              mt: "auto",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {isComingSoon ? (
              <Chip
                label={i18n.comingSoon}
                variant="outlined"
                size="small"
                sx={{
                  borderColor: "text.secondary",
                  color: "text.secondary",
                }}
              />
            ) : (
              <Button
                variant="text"
                endIcon={<span style={{ fontSize: "1.2em" }}>→</span>}
                onClick={() => router.push(`/c/${category.slug}`)}
                sx={{
                  p: 0,
                  minWidth: "auto",
                  color: "primary.main",
                  "&:hover": {
                    bgcolor: "transparent",
                    color: "secondary.dark",
                    transform: "translateX(4px)",
                  },
                  transition: "transform 0.2s",
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
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Header */}
      <AppBar position="static" elevation={0} sx={{ borderBottom: "1px solid", borderColor: "divider" }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ minHeight: { xs: 70, md: 80 }, alignItems: "center" }}>
            {/* Logo / Title Area */}
            <Box sx={{ display: "flex", alignItems: "center", mr: { xs: 1, md: 4 }, flex: 1, minWidth: 0 }}>
              <IconButton
                color="inherit"
                aria-label="home"
                onClick={() => router.push("/")}
                sx={{ mr: 1, "&:hover": { bgcolor: "rgba(255,255,255,0.1)" } }}
              >
                <HomeIcon />
              </IconButton>
              <Typography
                variant="h6"
                component="div"
                noWrap
                sx={{
                  fontFamily: '"Playfair Display", serif',
                  letterSpacing: "0.5px",
                  fontSize: { xs: "1.1rem", md: "1.25rem" },
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                }}
              >
                {i18n.title}
              </Typography>
            </Box>

            <Box sx={{ flexGrow: 1 }} />


          </Toolbar>
        </Container>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "white",
          pt: { xs: 6, md: 8 },
          pb: { xs: 8, md: 10 },
          position: "relative",
          overflow: "hidden"
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            backgroundImage: "radial-gradient(circle at 20% 150%, #D4AF37 0%, transparent 50%)",
          }}
        />

        <Container maxWidth="md" sx={{ position: "relative", textAlign: "center", px: { xs: 2, md: 3 } }}>
          <Typography
            variant="h2"
            component="h1"
            sx={{
              color: "white",
              mb: 2,
              textShadow: "0 2px 4px rgba(0,0,0,0.1)",
              fontSize: { xs: "2rem", md: "3rem" }
            }}
          >
            แหล่งรวบรวมข้อมูลด้านนิติศาสตร์อิสลามที่ครอบคลุม
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "secondary.light",
              mb: { xs: 4, md: 6 },
              fontWeight: 300,
              maxWidth: "900px",
              mx: "auto",
              fontSize: { xs: "1rem", md: "1.25rem" },
              lineHeight: 1.4
            }}
          >
-เรากำลังทยอยอัปโหลดข้อมูลอยู่เรื่อย ๆ โปรดติดตามการอัปเดตทางเพจหลัก-          </Typography>

          <Paper
            elevation={4}
            sx={{
              p: { xs: 2, sm: "4px 8px" },
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: "center",
              width: "100%", // Ensure it takes full width of container
              maxWidth: 700,
              mx: "auto",
              borderRadius: { xs: "24px", sm: "50px" },
              bgcolor: "rgba(255,255,255,0.95)",
              border: "2px solid",
              borderColor: "secondary.main",
              gap: { xs: 2, sm: 0 },
              boxSizing: "border-box" // Ensure padding doesn't overflow width
            }}
          >
            <Box sx={{ display: "flex", width: "100%", alignItems: "center" }}>
              <IconButton sx={{ p: "10px", color: "primary.main" }} aria-label="search">
                <SearchIcon />
              </IconButton>
              <TextField
                sx={{ ml: 1, flex: 1 }}
                variant="standard"
                placeholder={i18n.search}
                value={searchQuery}
                onChange={handleSearch}
                onFocus={(e) => {
                  if (searchQuery.trim() && searchResults.length > 0) {
                    setSearchAnchorEl(e.currentTarget);
                  }
                }}
                InputProps={{
                  disableUnderline: true,
                }}
              />
              <Popper
                open={Boolean(searchAnchorEl) && searchResults.length > 0}
                anchorEl={searchAnchorEl}
                placement="bottom-start"
                sx={{
                  zIndex: 1300,
                  width: "100%",
                  maxWidth: 500,
                }}
              >
                <ClickAwayListener onClickAway={() => setSearchAnchorEl(null)}>
                  <Paper
                    elevation={8}
                    sx={{ maxHeight: 300, overflow: "auto", mt: 1, borderRadius: 2 }}
                  >
                    <List dense>
                      {searchResults.map((result) => (
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
                            primaryTypographyProps={{ fontSize: "0.875rem" }}
                            secondaryTypographyProps={{
                              fontSize: "0.75rem",
                              textTransform: "capitalize",
                            }}
                          />
                        </ListItemButton>
                      ))}
                    </List>
                  </Paper>
                </ClickAwayListener>
              </Popper>
            </Box>
            <FormControl variant="standard" sx={{
              m: { xs: 0, sm: 1 },
              minWidth: { xs: "100%", sm: 150 },
              borderTop: { xs: "1px solid rgba(0,0,0,0.1)", sm: "none" },
              pt: { xs: 1, sm: 0 }
            }}>
              <Select
                value={selectedCategory}
                onChange={(e) => handleCategoryFilter(e.target.value)}
                displayEmpty
                disableUnderline
                sx={{
                  color: "text.primary",
                  fontSize: "0.9rem",
                  width: "100%",
                  "& .MuiSelect-select": {
                    py: 1,
                    textAlign: { xs: "left", sm: "left" },
                    pl: { xs: 1, sm: 0 }
                  }
                }}
              >
                <MenuItem value="">
                  <em style={{ fontStyle: "normal", color: "#5A5A5A" }}>All Categories</em>
                </MenuItem>
                {allCategories.map((category) => (
                  <MenuItem
                    key={category._id || category.id}
                    value={category._id || category.id}
                  >
                    {category.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
          </Paper>
          <Typography
            variant="h6"
            sx={{
              color: "white",
              mt: 1,
              fontWeight: 300,
              maxWidth: "900px",
              mx: "auto",
              fontSize: { xs: "1rem", md: "1.25rem" },
              lineHeight: 1.4
            }}
          >
ข้อมูลทั้งหมดแปลมาจากสารานุกรมของเว็บ <Link href="https://dorar.net" style={{ color: "white", textDecoration: "underline" }}>dorar.net</Link>  ขออัลลอฮ์ตอบแทนพวกท่าน       </Typography>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 }, px: { xs: 3, md: 4 }, mt: { xs: 2, md: -4 }, position: "relative", zIndex: 2 }}>
        {/* Loading State */}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress color="secondary" />
          </Box>
        )}

        {/* Error State */}
        {error && (
          <Container maxWidth="sm">
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          </Container>
        )}

        {/* No Results */}
        {!loading && !error && searchQuery && categories.length === 0 && (
          <Box sx={{ textAlign: "center", py: 12 }}>
            <Typography variant="h6" color="text.secondary">{i18n.noResults}</Typography>
          </Box>
        )}

        {/* Categories Grid */}
        {!loading && !error && (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(1, 1fr)",
                sm: "repeat(1, 1fr)",
                md: "repeat(2, 1fr)",
                lg: "repeat(2, 1fr)",
                xl: "repeat(2, 1fr)",
              },
              gap: { xs: 3, md: 4 }, // Increased gap for distinct separation
              alignItems: "stretch",
              justifyItems: "stretch",
            }}
          >
            {categories.map((category) => (
              <CategoryCard
                key={category._id || category.id}
                category={category}
              />
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
}
