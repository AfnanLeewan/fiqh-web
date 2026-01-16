"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  Menu,
} from "@mui/material";
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
  ChevronRight as ChevronRightIcon,
  Add as AddIcon,
  PostAdd as PostAddIcon,
} from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { ContentNode } from "@/types/content";
import RichTextEditor from "@/components/RichTextEditor";
import {
  getAllContentByType,
  createContent,
  updateContent,
  deleteContent,
} from "@/lib/contentUtils";
import { AVAILABLE_ICONS } from "@/lib/iconMapper";


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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>(""); // Category filter
  const [selectedChapter, setSelectedChapter] = useState<string>(""); // Chapter filter
  const [selectedTab, setSelectedTab] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNode, setEditingNode] = useState<EditingContentNode | null>(
    null,
  );
  const [availableParents, setAvailableParents] = useState<ContentNode[]>([]);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [addMenuAnchor, setAddMenuAnchor] = useState<HTMLElement | null>(null);
  const [addMenuParentId, setAddMenuParentId] = useState<string | null>(null);

  // Load content data
  const loadContent = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get all content types
      const [categories, chapters, articles] = await Promise.all([
        getAllContentByType("category"),
        getAllContentByType("chapter"),
        getAllContentByType("article"),
      ]);

      // Combine all content
      const allContent = [...categories, ...chapters, ...articles];
      setContentData(allContent);
    } catch (err) {
      setError("Failed to load content");
      console.error("Error loading content:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  // Reset chapter filter when category changes
  useEffect(() => {
    setSelectedChapter("");
  }, [selectedCategory]);

  const getAvailableChapters = () => {
    if (!selectedCategory) return [];

    // Helper function to check if a chapter belongs to the selected category
    const belongsToCategory = (
      item: ContentNode,
      categoryId: string,
    ): boolean => {
      if (!item.parentId) return false;

      // Direct child of category
      if (item.parentId === categoryId) return true;

      // Find the parent
      const parent = contentData.find((p) => (p._id || p.id) === item.parentId);
      if (!parent) return false;

      // If parent is a chapter, check recursively
      if (parent.type === "chapter") {
        return belongsToCategory(parent, categoryId);
      }

      return false;
    };

    return contentData.filter(
      (item) =>
        item.type === "chapter" && belongsToCategory(item, selectedCategory),
    );
  };

  const getFilteredContent = () => {
    const tabTypes = ["all", "category", "chapter", "article"];
    const currentTabType = tabTypes[selectedTab];

    // Helper function to check if an item belongs to a category tree
    const belongsToCategory = (
      item: ContentNode,
      categoryId: string,
    ): boolean => {
      if (!item.parentId) return false;

      // Find the parent
      const parent = contentData.find((p) => (p._id || p.id) === item.parentId);
      if (!parent) return false;

      // If parent is the target category, we belong to it
      if ((parent._id || parent.id) === categoryId) return true;

      // If parent is a chapter, check recursively
      if (parent.type === "chapter") {
        return belongsToCategory(parent, categoryId);
      }

      return false;
    };

    // Helper function to check if an item belongs to a chapter tree
    const belongsToChapter = (
      item: ContentNode,
      chapterId: string,
    ): boolean => {
      if (!item.parentId) return false;

      // Direct child of the chapter
      if (item.parentId === chapterId) return true;

      // Find the parent
      const parent = contentData.find((p) => (p._id || p.id) === item.parentId);
      if (!parent) return false;

      // If parent is a chapter, check recursively
      if (parent.type === "chapter") {
        return belongsToChapter(parent, chapterId);
      }

      return false;
    };

    return contentData.filter((item: ContentNode) => {
      const matchesSearch = item.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesTab =
        currentTabType === "all" || item.type === currentTabType;

      // Category filter
      let matchesCategory = true;
      if (selectedCategory) {
        if (item.type === "category") {
          matchesCategory = (item._id || item.id) === selectedCategory;
        } else {
          matchesCategory = belongsToCategory(item, selectedCategory);
        }
      }

      // Chapter filter
      let matchesChapter = true;
      if (selectedChapter) {
        if (item.type === "chapter") {
          matchesChapter =
            (item._id || item.id) === selectedChapter ||
            belongsToChapter(item, selectedChapter);
        } else if (item.type === "article") {
          matchesChapter = belongsToChapter(item, selectedChapter);
        } else if (item.type === "category") {
          // Show category only if it's the root of the selected chapter
          const selectedChapterData = contentData.find(
            (c) => (c._id || c.id) === selectedChapter,
          );
          matchesChapter = selectedChapterData
            ? belongsToCategory(selectedChapterData, item._id || item.id)
            : false;
        }
      }

      return matchesSearch && matchesTab && matchesCategory && matchesChapter;
    });
  };

  // Tree management functions
  const toggleNodeExpansion = (nodeId: string) => {
    setExpandedNodes((prev) => {
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
    return contentData.some((item) => item.parentId === nodeId);
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
      const children = content.filter((child) => child.parentId === itemId);
      children.sort((a, b) => a.title.localeCompare(b.title));

      for (const child of children) {
        addItemAndChildren(child, level + 1);
      }
    };

    // Start with root items (no parent)
    const rootItems = content.filter((item) => !item.parentId);
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
    return sortedContent.filter((item) => {
      if (!item.parentId) return true; // Root items are always visible

      // Find the parent and check if it's expanded
      let currentParent: string | null = item.parentId;
      while (currentParent) {
        if (!expandedNodes.has(currentParent)) {
          return false; // Parent is collapsed, hide this item
        }
        // Move up the tree
        const parentNode = contentData.find(
          (p) => (p._id || p.id) === currentParent,
        );
        currentParent = parentNode?.parentId || null;
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
    // Check if title contains Thai characters
    const thaiBoundary = /[\u0E00-\u0E7F]/;
    const hasThaiCharacters = thaiBoundary.test(title);

    if (hasThaiCharacters) {
      // For Thai: preserve Thai characters, remove spaces and special chars
      return (
        title
          .toLowerCase()
          .trim()
          // Remove spaces and special characters, but keep Thai characters
          .replace(/[\s\-_\.(),;:!?'"\/\\]+/g, "")
          // Remove any other non-Thai, non-English characters
          .replace(/[^\u0E00-\u0E7Fa-z0-9]+/g, "")
      );
    } else {
      // For English: standard slug generation
      return (
        title
          .toLowerCase()
          .trim()
          // Replace spaces and special characters with hyphens
          .replace(/[\s\-_]+/g, "-")
          // Remove special characters
          .replace(/[^\w\-]+/g, "-")
          // Remove multiple consecutive hyphens
          .replace(/\-\-+/g, "-")
          // Remove leading and trailing hyphens
          .replace(/^-+|-+$/g, "")
      );
    }
  };

  // Handle title change and auto-generate slug
  const handleTitleChange = (newTitle: string) => {
    setEditingNode((prev) => {
      if (!prev) return prev;

      const updates: Partial<typeof prev> = { title: newTitle };

      // Auto-generate slug only for new items or if slug is empty/matches old title
      if (
        prev.isNew ||
        !prev.slug ||
        prev.slug === generateSlug(prev.title || "")
      ) {
        updates.slug = generateSlug(newTitle);
      }

      return { ...prev, ...updates };
    });
  };

  const handleCreate = (
    type: "category" | "chapter" | "article",
    parentId?: string,
  ) => {
    // Load available parents based on type
    if (type === "chapter") {
      // Chapters can be children of categories OR other chapters
      const parents = contentData.filter(
        (item) => item.type === "category" || item.type === "chapter",
      );
      setAvailableParents(parents);
    } else if (type === "article") {
      // Articles can be children of categories or chapters (at any level)
      const parents = contentData.filter(
        (item) => item.type === "category" || item.type === "chapter",
      );
      setAvailableParents(parents);
    } else {
      // Categories have no parents
      setAvailableParents([]);
    }

    setEditingNode({
      isNew: true,
      type,
      parentId: parentId || "",
      title: "",
      summary: "",
      author: type === "article" ? "" : undefined, // Author field for articles
      body: type === "article" ? "" : undefined,
      slug: "",
      badge: type === "article" ? undefined : undefined, // Start as available (no badge)
      order: 0,
      published: true,
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editingNode?.title) {
      enqueueSnackbar("Title is required", { variant: "error" });
      return;
    }

    // Validate parent selection for chapters and articles
    if (
      editingNode.type !== "category" &&
      !editingNode.parentId &&
      availableParents.length > 0
    ) {
      enqueueSnackbar(
        `Please select a parent ${editingNode.type === "chapter" ? "category" : "category/chapter"}`,
        { variant: "error" },
      );
      return;
    }

    try {
      const contentData = {
        ...editingNode,
        parentId: editingNode.parentId || undefined,
        // Explicitly handle badge value for "available" status
        badge: editingNode.badge === undefined ? undefined : editingNode.badge,
      };
      delete contentData.isNew;

      console.log("Saving content data:", contentData);

      if (editingNode.isNew) {
        const created = await createContent(contentData);
        if (created) {
          enqueueSnackbar(`Created ${editingNode.type} successfully`, {
            variant: "success",
          });
          loadContent(); // Reload content
        } else {
          throw new Error("Failed to create content");
        }
      } else {
        const updated = await updateContent(contentData);
        if (updated) {
          enqueueSnackbar(`Updated ${editingNode.type} successfully`, {
            variant: "success",
          });
          loadContent(); // Reload content
        } else {
          throw new Error("Failed to update content");
        }
      }

      setIsDialogOpen(false);
      setEditingNode(null);
    } catch (err) {
      enqueueSnackbar("Failed to save content", { variant: "error" });
      console.error("Error saving content:", err);
    }
  };

  const handleDelete = async (node: ContentNode) => {
    if (confirm(`Are you sure you want to delete "${node.title}"?`)) {
      try {
        const result = await deleteContent(node._id || node.id);

        // Check if content has children
        if (
          result &&
          typeof result === "object" &&
          "hasChildren" in result &&
          result.hasChildren
        ) {
          // Ask user if they want to delete with children
          const deleteWithChildren = confirm(
            `"${node.title}" has child content. Do you want to delete it along with all its children? Click OK to delete with children, or Cancel to keep them.`,
          );

          if (deleteWithChildren) {
            // Delete with force flag
            const forceResult = await deleteContent(node._id || node.id, true);
            if (forceResult === true) {
              enqueueSnackbar("Content deleted successfully", {
                variant: "success",
              });
              loadContent(); // Reload content
            } else {
              throw new Error("Failed to delete content");
            }
          }
        } else if (result === true) {
          enqueueSnackbar("Content deleted successfully", {
            variant: "success",
          });
          loadContent(); // Reload content
        } else {
          throw new Error("Failed to delete content");
        }
      } catch (err) {
        enqueueSnackbar("Failed to delete content", { variant: "error" });
        console.error("Error deleting content:", err);
      }
    }
  };

  const handleLogout = () => {
    router.push("/admin/login");
  };

  // Add menu handlers
  const handleAddMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    parentId: string,
  ) => {
    setAddMenuAnchor(event.currentTarget);
    setAddMenuParentId(parentId);
  };

  const handleAddMenuClose = () => {
    setAddMenuAnchor(null);
    setAddMenuParentId(null);
  };

  const handleAddChapter = () => {
    if (addMenuParentId) {
      handleCreate("chapter", addMenuParentId);
    }
    handleAddMenuClose();
  };

  const handleAddArticle = () => {
    if (addMenuParentId) {
      handleCreate("article", addMenuParentId);
    }
    handleAddMenuClose();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "category":
        return <BookOpenIcon />;
      case "chapter":
        return <FolderIcon />;
      case "article":
        return <FileTextIcon />;
      default:
        return null;
    }
  };

  const getTypeColor = (
    type: string,
  ): "info" | "success" | "secondary" | "default" => {
    switch (type) {
      case "category":
        return "info";
      case "chapter":
        return "success";
      case "article":
        return "secondary";
      default:
        return "default";
    }
  };

  const filteredContent = getFilteredContentWithVisibility();

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Header */}
      <AppBar position="static" sx={{ bgcolor: "primary.main" }}>
        <Toolbar sx={{ px: { xs: 1, md: 2 } }}>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1, 
              fontSize: { xs: "1rem", sm: "1.25rem" },
              lineHeight: 1.2
            }}
          >
            สารานุกรมนิติศาสตร์อิสลาม
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              color="inherit"
              onClick={() => router.push("/")}
              size="small"
              sx={{ 
                minWidth: "auto",
                px: { xs: 1, sm: 2 }
              }}
            >
              <ViewIcon sx={{ mr: { xs: 0, sm: 1 } }} />
              <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                View Site
              </Box>
            </Button>
            <Button 
              color="inherit" 
              onClick={handleLogout}
              size="small"
              sx={{ 
                minWidth: "auto",
                px: { xs: 1, sm: 2 }
              }}
            >
              <LogOutIcon sx={{ mr: { xs: 0, sm: 1 } }} />
              <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                Logout
              </Box>
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
        {/* Search and Controls */}
        <Box 
          sx={{ 
            display: "flex", 
            flexDirection: { xs: "column", lg: "row" }, 
            gap: 2, 
            mb: 3,
            alignItems: { xs: "stretch", lg: "center" } 
          }}
        >
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
          <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2, flexShrink: 0 }}>
            <FormControl sx={{ minWidth: { xs: "100%", md: 180 } }}>
              <InputLabel id="category-filter-label">
                Filter by Category
              </InputLabel>
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
                  .filter((item) => item.type === "category")
                  .map((category) => (
                    <MenuItem
                      key={category._id || category.id}
                      value={category._id || category.id}
                    >
                      {category.title}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            {selectedCategory && (
              <FormControl sx={{ minWidth: { xs: "100%", md: 180 } }}>
                <InputLabel id="chapter-filter-label">
                  Filter by Chapter
                </InputLabel>
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
                      const parent = contentData.find(
                        (p) => (p._id || p.id) === item.parentId,
                      );
                      if (parent && parent.type === "chapter") {
                        return `${getChapterHierarchy(parent)} > ${item.title}`;
                      }
                      return item.title;
                    };

                    return (
                      <MenuItem
                        key={chapter._id || chapter.id}
                        value={chapter._id || chapter.id}
                      >
                        {getChapterHierarchy(chapter)}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            )}
          </Box>
          <Box sx={{ overflowX: "auto", pb: 1, display: "flex" }}>
             <ButtonGroup variant="contained" sx={{ width: { xs: "100%", md: "auto" }, justifyContent: "center" }}>
              <Button
                startIcon={<BookOpenIcon />}
                onClick={() => handleCreate("category")}
                sx={{ flex: { xs: 1, md: "initial" }, minWidth: "auto" }}
              >
                <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>Add </Box> Category
              </Button>
              <Button
                startIcon={<FolderIcon />}
                onClick={() => handleCreate("chapter")}
                sx={{ flex: { xs: 1, md: "initial" }, minWidth: "auto" }}
              >
                <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>Add </Box> Chapter
              </Button>
              <Button
                startIcon={<FileTextIcon />}
                onClick={() => handleCreate("article")}
                sx={{ flex: { xs: 1, md: "initial" }, minWidth: "auto" }}
              >
                <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>Add </Box> Article
              </Button>
            </ButtonGroup>
          </Box>
        </Box>

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
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
              sx={{ borderBottom: 1, borderColor: "divider" }}
            >
              <Tab label="All Content" />
              <Tab label="Categories" />
              <Tab label="Chapters" />
              <Tab label="Articles" />
            </Tabs>

            <TabPanel value={selectedTab} index={selectedTab}>
              {filteredContent.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Typography color="text.secondary">
                    {searchQuery
                      ? "No content found matching your search."
                      : "No content available. Create some content to get started."}
                  </Typography>
                </Box>
              ) : (
                <List sx={{ width: "100%", overflow: "hidden" }}>
                  {filteredContent.map((item) => (
                    <ListItem
                      key={item._id || item.id}
                      sx={{
                        ml: Math.min((item.level || 0) * 2, 8), // Limit max indentation to 8 units
                        mr: 1, // Add right margin to prevent overflow
                        border: 1,
                        borderColor: "divider",
                        borderRadius: 1,
                        mb: 1,
                        maxWidth: `calc(100% - ${Math.min((item.level || 0) * 2, 8) * 8}px)`, // Ensure it doesn't overflow
                        boxSizing: "border-box",
                        flexDirection: { xs: "column", sm: "row" },
                        alignItems: { xs: "stretch", sm: "center" },
                      }}
                    >
                      <ListItemIcon
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        {/* Expand/Collapse Icon */}
                        {hasChildren(item._id || item.id) ? (
                          <IconButton
                            size="small"
                            onClick={() =>
                              toggleNodeExpansion(item._id || item.id)
                            }
                            sx={{ p: 0.5 }}
                          >
                            {expandedNodes.has(item._id || item.id) ? (
                              <ExpandMoreIcon fontSize="small" />
                            ) : (
                              <ChevronRightIcon fontSize="small" />
                            )}
                          </IconButton>
                        ) : (
                          <Box sx={{ width: 24, height: 24 }} /> // Spacer for alignment
                        )}
                        {/* Type Icon */}
                        {/* Type Icon */}
                        {(() => {
                          if (
                            item.icon &&
                            AVAILABLE_ICONS[
                              item.icon as keyof typeof AVAILABLE_ICONS
                            ]
                          ) {
                            const Icon =
                              AVAILABLE_ICONS[
                                item.icon as keyof typeof AVAILABLE_ICONS
                              ];
                            return <Icon />;
                          }
                          return getTypeIcon(item.type);
                        })()}
                      </ListItemIcon>
                      <ListItemText
                        sx={{
                          minWidth: 0, // Allow shrinking
                          overflow: "hidden",
                          width: "100%", // Take full width available
                        }}
                        primary={
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              flexWrap: "wrap",
                              minWidth: 0,
                            }}
                          >
                            <Typography
                              variant="subtitle1"
                              sx={{
                                minWidth: 0,
                                wordBreak: "break-word",
                                flexShrink: 1,
                              }}
                            >
                              {item.title}
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                gap: 0.5,
                                flexWrap: "wrap",
                              }}
                            >
                              <Chip
                                label={item.type}
                                color={getTypeColor(item.type)}
                                size="small"
                              />
                              {/* Show numbered badge */}
                              {typeof item.badge === "number" && (
                                <Chip
                                  label={`#${item.badge}`}
                                  color="default"
                                  size="small"
                                />
                              )}
                              {/* Show coming soon badge */}
                              {item.badge === "coming-soon" && (
                                <Chip
                                  label="Coming Soon"
                                  color="warning"
                                  size="small"
                                />
                              )}
                            </Box>
                          </Box>
                        }
                        secondary={
                          <Typography
                            variant="body2"
                            sx={{
                              wordBreak: "break-word",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {item.summary}
                          </Typography>
                        }
                      />
                      <Box 
                        sx={{ 
                            display: "flex", 
                            gap: 1, 
                            mt: { xs: 1, sm: 0 }, 
                            ml: { sm: 2 },
                            alignSelf: { xs: "flex-end", sm: "center" },
                            flexShrink: 0 
                        }}
                      >
                        {/* Add button for categories and chapters */}
                        {(item.type === "category" ||
                          item.type === "chapter") && (
                          <IconButton
                            edge="end"
                            onClick={(e) =>
                              handleAddMenuOpen(e, item._id || item.id)
                            }
                            color="primary"
                            size="small"
                          >
                            <AddIcon />
                          </IconButton>
                        )}
                        <IconButton
                          edge="end"
                          onClick={() => handleEdit(item)}
                          size="small"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          edge="end"
                          onClick={() => handleDelete(item)}
                          color="error"
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
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
            {editingNode?.isNew ? "Create" : "Edit"} {editingNode?.type}
          </DialogTitle>
          <DialogContent>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 1 }}
            >
              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  fullWidth
                  label="Title *"
                  value={editingNode?.title || ""}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter title"
                />
              </Box>

              {/* Icon Selection for Chapters (Only for Top-Level Chapters under a Category) */}
              {editingNode?.type === "chapter" &&
                availableParents.find(
                  (p) =>
                    (p.id === editingNode?.parentId ||
                      p._id === editingNode?.parentId) &&
                    p.type === "category",
                ) && (
                  <FormControl fullWidth>
                    <InputLabel id="icon-select-label">Icon</InputLabel>
                    <Select
                      labelId="icon-select-label"
                      value={editingNode?.icon || ""}
                      label="Icon"
                      onChange={(e) =>
                        setEditingNode((prev) =>
                          prev ? { ...prev, icon: e.target.value } : null,
                        )
                      }
                    >
                      <MenuItem value="">
                        <em>Default (Inherit)</em>
                      </MenuItem>
                      {Object.keys(AVAILABLE_ICONS).map((name) => {
                        const Icon =
                          AVAILABLE_ICONS[name as keyof typeof AVAILABLE_ICONS];
                        return (
                          <MenuItem key={name} value={name}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Icon color="action" />
                              <Typography>{name}</Typography>
                            </Box>
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                )}

              {/* Parent Selection for chapters and articles */}
              {editingNode?.type !== "category" &&
                availableParents.length > 0 && (
                  <Autocomplete
                    fullWidth
                    options={availableParents}
                    value={
                      availableParents.find(
                        (parent) =>
                          (parent._id || parent.id) === editingNode?.parentId,
                      ) || null
                    }
                    onChange={(event, newValue) => {
                      setEditingNode((prev) => ({
                        ...prev,
                        parentId: newValue ? newValue._id || newValue.id : "",
                      }));
                    }}
                    getOptionLabel={(option) => {
                      // Build display text showing hierarchy
                      const getParentHierarchy = (
                        item: ContentNode,
                      ): string => {
                        const parentItem = contentData.find(
                          (p) => (p._id || p.id) === item.parentId,
                        );
                        if (parentItem) {
                          return `${getParentHierarchy(parentItem)} > ${item.title}`;
                        }
                        return item.title;
                      };
                      return `${getParentHierarchy(option)} (${option.type})`;
                    }}
                    filterOptions={(options, { inputValue }) => {
                      // Custom filter that searches in title and hierarchy
                      return options.filter((option) => {
                        const getParentHierarchy = (
                          item: ContentNode,
                        ): string => {
                          const parentItem = contentData.find(
                            (p) => (p._id || p.id) === item.parentId,
                          );
                          if (parentItem) {
                            return `${getParentHierarchy(parentItem)} > ${item.title}`;
                          }
                          return item.title;
                        };
                        const fullText =
                          `${getParentHierarchy(option)} ${option.type}`.toLowerCase();
                        return fullText.includes(inputValue.toLowerCase());
                      });
                    }}
                    renderOption={(props, option) => {
                      const { key, ...rest } = props;
                      const getParentHierarchy = (
                        item: ContentNode,
                      ): string => {
                        const parentItem = contentData.find(
                          (p) => (p._id || p.id) === item.parentId,
                        );
                        if (parentItem) {
                          return `${getParentHierarchy(parentItem)} > ${item.title}`;
                        }
                        return item.title;
                      };

                      return (
                        <Box
                          key={key}
                          component="li"
                          {...rest}
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="body1">
                              {getParentHierarchy(option)}
                            </Typography>
                          </Box>
                          <Chip
                            label={option.type}
                            size="small"
                            color={
                              option.type === "category"
                                ? "primary"
                                : "secondary"
                            }
                          />
                        </Box>
                      );
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={`Parent ${editingNode?.type === "chapter" ? "Category/Chapter" : "Category/Chapter"} *`}
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
                value={editingNode?.summary || ""}
                onChange={(e) =>
                  setEditingNode((prev) => ({
                    ...prev,
                    summary: e.target.value,
                  }))
                }
                placeholder="Brief description"
              />

              {/* Author field for articles */}
              {editingNode?.type === "article" && (
                <TextField
                  fullWidth
                  label="Author (Optional)"
                  value={editingNode?.author || ""}
                  onChange={(e) =>
                    setEditingNode((prev) => ({
                      ...prev,
                      author: e.target.value,
                    }))
                  }
                  placeholder="Enter author name"
                  helperText="Optional field for article attribution"
                />
              )}

              {/* Badge/Status Selection for categories and chapters */}
              {editingNode?.type !== "article" && (
                <FormControl fullWidth>
                  <InputLabel id="badge-select-label">Status</InputLabel>
                  <Select
                    labelId="badge-select-label"
                    value={
                      editingNode?.badge === "coming-soon"
                        ? "coming-soon"
                        : typeof editingNode?.badge === "number"
                          ? "numbered"
                          : "available"
                    }
                    label="Status"
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "coming-soon") {
                        setEditingNode((prev) => ({
                          ...prev,
                          badge: "coming-soon",
                        }));
                      } else if (value === "numbered") {
                        setEditingNode((prev) => ({ ...prev, badge: 1 }));
                      } else {
                        setEditingNode((prev) => ({
                          ...prev,
                          badge: undefined,
                        }));
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
              {editingNode?.type !== "article" &&
                typeof editingNode?.badge === "number" && (
                  <TextField
                    fullWidth
                    type="number"
                    label="Badge Number"
                    value={editingNode.badge || 1}
                    onChange={(e) =>
                      setEditingNode((prev) => ({
                        ...prev,
                        badge: parseInt(e.target.value) || 1,
                      }))
                    }
                    inputProps={{ min: 1 }}
                  />
                )}

              {editingNode?.type === "article" && (
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Content
                  </Typography>
                  <RichTextEditor
                    value={editingNode?.body || ""}
                    onChange={(value) =>
                      setEditingNode((prev) => ({ ...prev, body: value }))
                    }
                    placeholder="Enter article content..."
                    height={300}
                  />
                </Box>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleSave}
              variant="contained"
              startIcon={<SaveIcon />}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add Content Menu */}
        <Menu
          anchorEl={addMenuAnchor}
          open={Boolean(addMenuAnchor)}
          onClose={handleAddMenuClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <MenuItem onClick={handleAddChapter}>
            <ListItemIcon>
              <FolderIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Add Chapter</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleAddArticle}>
            <ListItemIcon>
              <PostAddIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Add Article</ListItemText>
          </MenuItem>
        </Menu>
      </Container>
    </Box>
  );
}
