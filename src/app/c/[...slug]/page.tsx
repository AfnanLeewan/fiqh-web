"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Container,
  Typography,
  Paper,
  Chip,
  Button,
  Divider,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  Person as PersonIcon,
  AccessTime as AccessTimeIcon,
} from "@mui/icons-material";
import { Header } from "@/components/Header";
import { Breadcrumb } from "@/components/Breadcrumb";
import { HierarchicalContentView } from "@/components/HierarchicalContentView";
import { ContentItem } from "@/components/ContentItem";
import {
  findNodeByPath,
  buildBreadcrumbs,
  getNextPrevArticles,
} from "@/lib/contentUtils";
import { findSpecificIcon, getIconByName } from "@/lib/iconMapper";
import { ContentNode, ViewMode } from "@/types/content";
import { i18n } from "@/lib/i18n";

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("viewMode") as ViewMode) || "tree";
    }
    return "list";
  });
  const [currentNode, setCurrentNode] = useState<ContentNode | null>(null);
  const [rootCategory, setRootCategory] = useState<ContentNode | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<
    Array<{ title: string; href: string }>
  >([]);
  const [navigation, setNavigation] = useState<{
    prev: ContentNode | null;
    next: ContentNode | null;
  }>({
    prev: null,
    next: null,
  });

  useEffect(() => {
    const slug = params.slug as string[];
    if (!slug || slug.length === 0) return;

    const loadData = async () => {
      const fullPath = slug;
      const node = await findNodeByPath(fullPath);

      if (!node) {
        router.push("/");
        return;
      }

      setCurrentNode(node);

      // Build breadcrumbs (await the async function)
      try {
        const breadcrumbItems = await buildBreadcrumbs(fullPath);
        setBreadcrumbs(breadcrumbItems);
      } catch (error) {
        console.error("Error building breadcrumbs:", error);
        setBreadcrumbs([]);
      }

      // Always get the root category
      const rootCategoryPath = [fullPath[0]];
      const rootNode =
        fullPath.length === 1 ? node : await findNodeByPath(rootCategoryPath);
      setRootCategory(rootNode);

      const topLevelChapters = (rootNode?.children || []).filter(
        (child) => child.type === "chapter",
      );

      // Handle navigation for articles only
      if (node.type === "article") {
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
    if (typeof window !== "undefined") {
      localStorage.setItem("viewMode", mode);
    }
  };

  const handleItemClick = (item: ContentNode) => {
    if (item.type === "article") {
      // Will be handled by Link navigation
      return;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("th-TH", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleNavigation = (targetArticle: ContentNode) => {
    const slug = params.slug as string[];
    const newSlug = [...slug];
    newSlug[newSlug.length - 1] = targetArticle.slug;
    router.push(`/c/${newSlug.join("/")}`);
  };

  if (!currentNode) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Typography variant="h6" color="text.secondary">
          Loading...
        </Typography>
      </Box>
    );
  }

  const items = currentNode.children || [];

  // Article Reader View
  if (currentNode.type === "article") {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        <Header title="สารานุกรมนิติศาสตร์อิสลาม " />

        <Container 
          component="main" 
          maxWidth="xl" 
          sx={{ 
            py: { xs: 2, md: 3 },
            pb: { xs: 10, md: 3 } // Add extra bottom padding for mobile to avoid floating buttons obscuring content
          }}
        >
          <Breadcrumb items={breadcrumbs} />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "280px 1fr" },
              gap: 3,
              mt: { xs: 2, md: 3 },
              alignItems: "start",
            }}
          >
            {/* Sidebar on the left with hierarchical content view */}
            <Box sx={{ display: { xs: "none", md: "block" } }}>
              <HierarchicalContentView
                items={items.length > 0 ? items : [currentNode]}
                basePath={`/c/${(params.slug as string[])[0]}`}
              />
            </Box>

            <Paper elevation={2}>
              <Box sx={{ p: { xs: 2, md: 4 } }}>
                <Typography
                  variant="h3"
                  component="h1"
                  gutterBottom
                  fontWeight={700}
                  sx={{ 
                    fontSize: { xs: "1.5rem", md: "2.5rem" },
                    wordBreak: "break-word"
                  }}
                >
                  {currentNode.title}
                </Typography>

                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}
                >
                  {currentNode.author && (
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <PersonIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        โดย {currentNode.author}
                      </Typography>
                    </Box>
                  )}
                  {currentNode.createdAt && (
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <AccessTimeIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(currentNode.createdAt)}
                      </Typography>
                    </Box>
                  )}
                  {typeof currentNode.badge === "number" && (
                    <Chip
                      label={`#${currentNode.badge}`}
                      variant="outlined"
                      size="small"
                    />
                  )}
                </Box>

                <Divider sx={{ mb: 4 }} />

<Box
  sx={{
    typography: "body1",
    fontSize: { xs: "0.8rem !important", md: "1.1rem !important" },
    lineHeight: { xs: "1.5 !important", md: "1.8 !important" },
    overflowWrap: "break-word",
    wordBreak: "break-word",
    "& *": {
      maxWidth: "100%",
      overflowWrap: "break-word",
      wordBreak: "break-word",
    },
    // Apply direction to any element with dir attribute
    "& *[dir='RTL'], & *[dir='rtl']": {
      direction: "rtl !important",
    },
    "& *[dir='LTR'], & *[dir='ltr']": {
      direction: "ltr !important",
    },
    // Handle paragraphs containing RTL spans
    "& p:has(span[dir='RTL']), & p:has(span[dir='rtl'])": {
      direction: "rtl",
      textAlign: "right",
    },
    "& h1, & h2, & h3, & h4, & h5, & h6": {
      fontWeight: "bold !important",
      marginTop: { xs: "1rem !important", md: "1.5rem !important" },
      marginBottom: { xs: "0.5rem !important", md: "0.75rem !important" },
      fontSize: { xs: "1em !important", md: "1.25em !important" },
      lineHeight: { xs: "1.25 !important", md: "1.3 !important" },
    },
    "& p": {
      marginBottom: { xs: "0.75rem !important", md: "1.5rem !important" },
      fontSize: { xs: "0.8rem !important", md: "1rem !important" },
    },
    "& ul, & ol": {
      marginBottom: { xs: "0.75rem !important", md: "1.5rem !important" },
      paddingLeft: { xs: "1.5rem !important", md: "2rem !important" },
      fontSize: { xs: "0.8rem !important", md: "1rem !important" },
    },
    "& li": {
      fontSize: { xs: "0.8rem !important", md: "1rem !important" },
      marginBottom: { xs: "0.25rem !important", md: "0.5rem !important" },
    },
    "& p:has(span[dir='RTL']) + ul, & p:has(span[dir='rtl']) + ul, & p:has(span[dir='RTL']) + ol, & p:has(span[dir='rtl']) + ol": {
      direction: "rtl",
      paddingRight: { xs: "1.5rem !important", md: "2rem !important" },
      paddingLeft: "0 !important",
    },
    "& blockquote": {
      borderLeft: "4px solid #ccc",
      paddingLeft: { xs: "1rem !important", md: "1.5rem !important" },
      marginLeft: "0 !important",
      fontStyle: "italic",
      marginBottom: { xs: "0.75rem !important", md: "1.5rem !important" },
      fontSize: { xs: "0.8rem !important", md: "1rem !important" },
    },
    "& blockquote:has(span[dir='RTL']), & blockquote:has(span[dir='rtl'])": {
      direction: "rtl",
      borderRight: "4px solid #ccc",
      borderLeft: "none",
      paddingRight: { xs: "1rem !important", md: "1.5rem !important" },
      paddingLeft: "0 !important",
      marginRight: "0 !important",
      marginLeft: "auto",
    },
    "& span": {
      fontSize: { xs: "0.8rem !important", md: "1rem !important" },
    },
    "& img": {
      maxWidth: "100%",
      height: "auto",
    },
    "& a": {
      color: "primary.main",
      textDecoration: "underline",
      fontSize: { xs: "0.8rem !important", md: "1rem !important" },
    },
  }}
  dangerouslySetInnerHTML={{ __html: currentNode.body || "" }}
/>

                {/* Navigation Buttons inside content card */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mt: 4,
                    pt: 3,
                    borderTop: 1,
                    borderColor: "divider",
                  }}
                >
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
          </Box>
        </Container>
      </Box>
    );
  }

  // Explorer View
  const slug = params.slug as string[];
  const basePath = `/c/${slug.join("/")}`;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Header
        title={currentNode.title}
        showViewToggle={true}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
      />

      <Container component="main" maxWidth="xl" sx={{ py: 3 }}>
        <Breadcrumb items={breadcrumbs} />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "280px 1fr" },
            gap: 3,
            mt: 3,
            alignItems: "start",
          }}
        >
          {/* Sidebar on the left with hierarchical content view */}
          <Box sx={{ display: { xs: "none", md: "block" } }}>
            <HierarchicalContentView
              items={items.length > 0 ? items : [currentNode]}
              basePath={basePath}
            />
          </Box>

          <Box>
            {items.length === 0 ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: "50vh",
                  textAlign: "center",
                }}
              >
                <Typography variant="h6" color="text.secondary">
                  {i18n.comingSoon}
                </Typography>
              </Box>
            ) : viewMode === "tree" ? (
              <HierarchicalContentView
                items={rootCategory?.children || []}
                basePath={rootCategory ? `/c/${rootCategory.slug}` : "/c"}
                variant="full"
              />
            ) : viewMode === "card" ? (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "repeat(1, 1fr)",
                    sm: "repeat(2, 1fr)",
                    lg: "repeat(3, 1fr)",
                  },
                  gap: 3,
                }}
              >
                {items.map((item) => (
                  <Box key={item.id}>
                    <ContentItem
                      item={item}
                      viewMode="card"
                      basePath={basePath}
                      onItemClick={handleItemClick}
                      inheritedIcon={
                        getIconByName(currentNode.icon) ||
                        findSpecificIcon(currentNode.slug, currentNode.title) ||
                        undefined
                      }
                    />
                  </Box>
                ))}
              </Box>
            ) : (
              <Paper elevation={1} sx={{ borderRadius: 2 }}>
                {items.map((item, index) => (
                  <Box key={item.id}>
                    <ContentItem
                      item={item}
                      viewMode="list"
                      basePath={basePath}
                      onItemClick={handleItemClick}
                      inheritedIcon={
                        getIconByName(currentNode.icon) ||
                        findSpecificIcon(currentNode.slug, currentNode.title) ||
                        undefined
                      }
                    />
                    {index < items.length - 1 && <Divider />}
                  </Box>
                ))}
              </Paper>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
