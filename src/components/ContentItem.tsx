import { Card, CardContent, Chip, Typography, Box } from "@mui/material";
import { ContentNode, ViewMode } from "@/types/content";
import { i18n } from "@/lib/i18n";
import Link from "next/link";
import { findSpecificIcon, getDefaultIcon, getIconByName } from "@/lib/iconMapper";
import { SvgIconComponent } from "@mui/icons-material";

interface ContentItemProps {
  item: ContentNode;
  viewMode: ViewMode;
  basePath: string;
  onItemClick?: (item: ContentNode) => void;
  inheritedIcon?: SvgIconComponent; // New prop
}

export function ContentItem({
  item,
  viewMode,
  basePath,
  onItemClick,
  inheritedIcon,
}: ContentItemProps) {
  const isComingSoon = item.badge === "coming-soon";
  const href = `${basePath}/${item.slug}`;

  // Resolve Icon: Inherited -> Explicit (Item's own) -> Specific (Slug/Title) -> Default
  const explicitIcon = getIconByName(item.icon);
  const specificIcon = findSpecificIcon(item.slug, item.title);
  
  // Note: user requested "use for entire children", implying inheritance is high priority.
  // However, usually explicit setting on an item should override inheritance?
  // Let's assume: Explicit Icon overrides Inherited, so a sub-chapter can have a different icon.
  // BUT, the prop is called "inheritedIcon", which comes from the parent context.
  // If the Parent Context says "All my children use X", then X should probably win unless the child has a specific override.
  
  // Logic: Explicit > Inherited > Specific > Default
  const IconComponent = explicitIcon || inheritedIcon || specificIcon || getDefaultIcon(item.type);

  const badgeNumber = typeof item.badge === "number" ? item.badge : null;

  const content = (
    <>
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
        {badgeNumber && (
          <Chip
            label={badgeNumber}
            color="primary"
            size="small"
            sx={{ fontSize: "0.75rem", height: 24 }}
          />
        )}
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="subtitle1"
            component="h3"
            fontWeight={500}
            gutterBottom
          >
            {item.title}
          </Typography>
          {item.summary && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5, lineHeight: 1.5 }}
            >
              {item.summary}
            </Typography>
          )}
        </Box>
        <IconComponent
          color={item.type === "category" || item.type === "article" ? "primary" : "action"}
          sx={{ mt: 0.5 }}
        />
      </Box>
      {isComingSoon && (
        <Box sx={{ mt: 2 }}>
          <Chip
            label={i18n.comingSoon}
            size="small"
            color="default"
            variant="outlined"
            sx={{ fontSize: "0.7rem" }}
          />
        </Box>
      )}
    </>
  );

  if (viewMode === "card") {
    return (
      <Card
        sx={{
          height: "100%",
          ...(isComingSoon
            ? {
              opacity: 0.6,
            }
            : {
              transition: "box-shadow 0.2s ease-in-out",
              cursor: "pointer",
              "&:hover": {
                boxShadow: 4,
              },
            }),
        }}
      >
        <CardContent sx={{ p: 3 }}>
          {isComingSoon ? (
            <Box title={i18n.comingSoon}>{content}</Box>
          ) : (
            <Box
              component={Link}
              href={href}
              onClick={() => onItemClick?.(item)}
              sx={{
                textDecoration: "none",
                color: "inherit",
                display: "block",
              }}
            >
              {content}
            </Box>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Box
      sx={{
        p: 3,
        ...(isComingSoon
          ? {
            opacity: 0.6,
          }
          : {
            transition: "background-color 0.2s ease-in-out",
            cursor: "pointer",
            "&:hover": {
              bgcolor: "action.hover",
            },
          }),
      }}
    >
      {isComingSoon ? (
        <Box title={i18n.comingSoon}>{content}</Box>
      ) : (
        <Box
          component={Link}
          href={href}
          onClick={() => onItemClick?.(item)}
          sx={{
            textDecoration: "none",
            color: "inherit",
            display: "block",
          }}
        >
          {content}
        </Box>
      )}
    </Box>
  );
}
