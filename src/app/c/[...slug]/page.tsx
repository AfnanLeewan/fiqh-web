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
import { findSpecificIcon } from "@/lib/iconMapper";
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
        <Header title="สารบัญกรณ์" />

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
                basePath={`/c/${(params.slug as string[])[0]}`}
              />
            </Box>

            <Paper elevation={2}>
              <Box sx={{ p: 4 }}>
                <Typography
                  variant="h3"
                  component="h1"
                  gutterBottom
                  fontWeight={700}
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
                    lineHeight: 1.8,
                    "& h1, & h2, & h3, & h4, & h5, & h6": {
                      fontWeight: "bold",
                      marginTop: 2,
                      marginBottom: 1,
                    },
                    "& p": {
                      marginBottom: 2,
                    },
                    "& ul, & ol": {
                      marginBottom: 2,
                      paddingLeft: 3,
                    },
                    "& blockquote": {
                      borderLeft: "4px solid #ccc",
                      paddingLeft: 2,
                      marginLeft: 0,
                      fontStyle: "italic",
                    },
                    "& img": {
                      maxWidth: "100%",
                      height: "auto",
                    },
                    "& a": {
                      color: "primary.main",
                      textDecoration: "underline",
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
                      inheritedIcon={findSpecificIcon(currentNode.slug, currentNode.title) || undefined}
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
