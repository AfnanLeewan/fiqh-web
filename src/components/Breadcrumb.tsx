import Link from "next/link";
import { Breadcrumbs, Typography, Link as MuiLink, Box } from "@mui/material";
import { NavigateNext as ChevronRightIcon } from "@mui/icons-material";

interface BreadcrumbItem {
  title: string;
  href: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  // Ensure items is always an array
  const safeItems = Array.isArray(items) ? items : [];

  return (
    <Box sx={{ mb: { xs: 2, md: 3 }, overflowX: "auto", pb: 1 }}>
      <Breadcrumbs
        separator={<ChevronRightIcon fontSize="small" />}
        aria-label="breadcrumb"
        sx={{
          whiteSpace: "nowrap",
          minWidth: "max-content",
          "& .MuiBreadcrumbs-ol": {
            fontSize: "0.875rem",
          },
        }}
      >
        {safeItems.map((item, index) =>
          index === safeItems.length - 1 ? (
            <Typography
              key={item.href}
              color="text.primary"
              fontSize="0.875rem"
              fontWeight={500}
            >
              {item.title}
            </Typography>
          ) : (
            <MuiLink
              key={item.href}
              component={Link}
              href={item.href}
              underline="hover"
              color="text.secondary"
              fontSize="0.875rem"
              sx={{
                "&:hover": {
                  color: "primary.main",
                },
              }}
            >
              {item.title}
            </MuiLink>
          ),
        )}
      </Breadcrumbs>
    </Box>
  );
}
