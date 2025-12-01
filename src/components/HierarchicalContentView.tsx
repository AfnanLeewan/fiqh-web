"use client";

import { ContentNode } from "@/types/content";
import Link from "next/link";
import { useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Collapse,
  Paper,
  Chip,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { getChildrenOfNode } from "@/lib/contentUtils";
import {
  ExpandMore as ExpandMoreIcon,
  LibraryBooks as LibraryBooksIcon,
  FolderOpen as FolderOpenIcon,
  ArticleOutlined as ArticleOutlinedIcon,
} from "@mui/icons-material";
import { usePathname } from "next/navigation";

interface HierarchicalContentViewProps {
  items: ContentNode[];
  basePath: string;
  variant?: "sidebar" | "full";
}

interface ExpandedState {
  [key: string]: boolean;
}

export function HierarchicalContentView({
  items,
  basePath,
  variant = "sidebar",
}: HierarchicalContentViewProps) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [loadedChildren, setLoadedChildren] = useState<
    Record<string, ContentNode[]>
  >({});
  const [loadingNodes, setLoadingNodes] = useState<Record<string, boolean>>({});

  const toggleExpand = async (node: ContentNode) => {
    const isExpanding = !expanded[node.id];

    setExpanded((prev) => ({
      ...prev,
      [node.id]: isExpanding,
    }));

    // If expanding, and we don't have children yet, and it's not an article
    if (isExpanding && node.type !== "article") {
      const hasPreloadedChildren = node.children && node.children.length > 0;
      const hasLoadedChildren =
        loadedChildren[node.id] && loadedChildren[node.id].length > 0;

      if (!hasPreloadedChildren && !hasLoadedChildren) {
        // Fetch children
        setLoadingNodes((prev) => ({ ...prev, [node.id]: true }));
        try {
          const children = await getChildrenOfNode(node._id || node.id);
          setLoadedChildren((prev) => ({ ...prev, [node.id]: children }));
        } catch (error) {
          console.error("Error loading children:", error);
        } finally {
          setLoadingNodes((prev) => ({ ...prev, [node.id]: false }));
        }
      }
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "category":
        return <FolderOpenIcon fontSize="small" sx={{ color: "#ff9800" }} />;
      case "chapter":
        return <LibraryBooksIcon fontSize="small" sx={{ color: "#2196f3" }} />;
      case "article":
        return (
          <ArticleOutlinedIcon fontSize="small" sx={{ color: "#4caf50" }} />
        );
      default:
        return null;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "category":
        return "#ff9800"; // Orange
      case "chapter":
        return "#2196f3"; // Blue
      case "article":
        return "#4caf50"; // Green
      default:
        return "#9e9e9e"; // Grey
    }
  };

  const renderNode = (
    node: ContentNode,
    depth: number = 0,
    currentBasePath: string = basePath,
  ): React.ReactNode => {
    const href = `${currentBasePath}/${node.slug}`;
    const isActive = pathname === href || pathname.includes(`/${node.slug}`);

    // Determine children source
    const nodeChildren = loadedChildren[node.id] || node.children || [];
    const hasChildren = nodeChildren.length > 0 || node.type !== "article"; // Assume non-articles might have children
    const isExpanded = expanded[node.id];
    const isLoading = loadingNodes[node.id];
    const isComingSoon = node.badge === "coming-soon";

    // Sidebar View (Simple List)
    if (variant === "sidebar") {
      return (
        <Box key={node.id}>
          <ListItem
            disablePadding
            sx={{
              pl: depth * 2,
              display: "block",
              bgcolor: isActive ? "action.selected" : "transparent",
              "&:hover": {
                bgcolor: isActive ? "action.selected" : "action.hover",
              },
              borderRadius: 1,
              mb: 0.5,
              transition: "all 0.2s ease",
            }}
          >
            <ListItemButton
              component={isComingSoon ? "div" : Link}
              href={isComingSoon ? undefined : href}
              disabled={isComingSoon}
              sx={{
                pl: 1,
                py: 1,
                minHeight: "auto",
                "&:hover": {
                  bgcolor: "transparent",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  width: "100%",
                }}
              >
                {getIcon(node.type)}
                <ListItemText
                  primary={
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: isActive ? 600 : 500,
                        color: isComingSoon ? "text.disabled" : "text.primary",
                        textDecoration: isActive ? "underline" : "none",
                        fontSize: "0.95rem",
                      }}
                    >
                      {node.title}
                    </Typography>
                  }
                  sx={{ m: 0 }}
                />
              </Box>
            </ListItemButton>
          </ListItem>
        </Box>
      );
    }

    // Full Tree View (Admin-like Card Style)
    return (
      <Box key={node.id} sx={{ mb: 1.5 }}>
        <Paper
          elevation={0}
          onClick={(e) => {
            if (hasChildren) {
              e.preventDefault();
              toggleExpand(node);
            }
          }}
          sx={{
            p: 2,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            transition: "all 0.2s ease",
            cursor: hasChildren ? "pointer" : "default",
            "&:hover": {
              bgcolor: "rgba(0, 0, 0, 0.01)",
              borderColor: "primary.main",
            },
            ml: depth * 4, // Indentation
            position: "relative",
            "&::before":
              depth > 0
                ? {
                    content: '""',
                    position: "absolute",
                    left: -20,
                    top: "50%",
                    width: 20,
                    height: 1,
                    bgcolor: "divider",
                    display: "none", // Hidden for now, can enable for tree lines
                  }
                : {},
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, flex: 1 }}>
            {/* Expand/Collapse Button */}
            <Box sx={{ width: 24, display: "flex", justifyContent: "center" }}>
              {isLoading ? (
                <CircularProgress size={16} color="inherit" />
              ) : hasChildren ? (
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleExpand(node);
                  }}
                  sx={{
                    transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                    color: "text.secondary",
                  }}
                >
                  <ExpandMoreIcon fontSize="small" />
                </IconButton>
              ) : (
                <Box sx={{ width: 24 }} /> // Spacer
              )}
            </Box>

            {/* Icon */}
            {getIcon(node.type)}

            {/* Title */}
            <Typography
              component={!hasChildren && !isComingSoon ? Link : "div"}
              href={!hasChildren && !isComingSoon ? href : undefined}
              sx={{
                fontWeight: 500,
                color: "text.primary",
                textDecoration: "none",
                fontSize: "1rem",
                "&:hover": {
                  textDecoration:
                    !hasChildren && !isComingSoon ? "underline" : "none",
                },
                cursor: !hasChildren && !isComingSoon ? "pointer" : "inherit",
              }}
            >
              {node.title}
            </Typography>

            {/* Type Badge */}
            <Chip
              label={node.type}
              size="small"
              sx={{
                height: 22,
                fontSize: "0.75rem",
                bgcolor: getTypeColor(node.type),
                color: "white",
                textTransform: "capitalize",
                fontWeight: 500,
                borderRadius: 4,
                px: 0.5,
              }}
            />
          </Box>

          {/* Actions */}
          <Box
            sx={{ display: "flex", gap: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* View Action removed as per request */}
          </Box>
        </Paper>

        {/* Children */}
        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
          <Box sx={{ mt: 1.5 }}>
            {nodeChildren.length > 0 ? (
              nodeChildren.map((child) => renderNode(child, depth + 1, href))
            ) : isExpanded && !isLoading ? (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ ml: 6, py: 1 }}
              >
                No content available
              </Typography>
            ) : null}
          </Box>
        </Collapse>
      </Box>
    );
  };

  // Sidebar View (Simple List)
  if (variant === "sidebar") {
    return (
      <Paper
        elevation={2}
        sx={{
          p: 2,
          bgcolor: "background.paper",
          borderRadius: 2,
          maxHeight: "calc(100vh - 200px)",
          overflowY: "auto",
          "&::-webkit-scrollbar": { width: "8px" },
          "&::-webkit-scrollbar-track": {
            bgcolor: "rgba(0, 0, 0, 0.05)",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb": {
            bgcolor: "rgba(0, 0, 0, 0.2)",
            borderRadius: "4px",
            "&:hover": { bgcolor: "rgba(0, 0, 0, 0.3)" },
          },
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, pl: 1 }}>
          Contents
        </Typography>
        <List dense sx={{ "& .MuiListItem-root": { mb: 0 } }}>
          {items.map((item) => renderNode(item))}
        </List>
      </Paper>
    );
  }

  // Full View Container
  return (
    <Box sx={{ width: "100%" }}>
      <Box>{items.map((item) => renderNode(item))}</Box>
    </Box>
  );
}
