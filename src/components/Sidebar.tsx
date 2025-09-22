"use client";

import { ContentNode } from '@/types/content';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Chip,
  Box
} from '@mui/material';
import { i18n } from '@/lib/i18n';

interface SidebarProps {
  items: ContentNode[];
  basePath: string;
}

const SIDEBAR_WIDTH = 280;

export function Sidebar({ items, basePath }: SidebarProps) {
  const pathname = usePathname();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: SIDEBAR_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: SIDEBAR_WIDTH,
          boxSizing: 'border-box',
          position: 'relative',
          height: 'auto',
          bgcolor: 'grey.50',
          borderRight: 1,
          borderColor: 'divider',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <List dense>
          {items.map((item) => {
            const href = `${basePath}/${item.slug}`;
            const isActive = pathname === href;
            const isComingSoon = item.badge === 'coming-soon';
            const badgeNumber = typeof item.badge === 'number' ? item.badge : null;

            return (
              <ListItem key={item.id} disablePadding>
                {isComingSoon ? (
                  <ListItemButton
                    disabled
                    sx={{ 
                      borderRadius: 1,
                      mx: 0.5,
                      '&.Mui-disabled': {
                        opacity: 0.6,
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                      {badgeNumber && (
                        <Chip
                          label={badgeNumber}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.75rem', height: 20 }}
                        />
                      )}
                      <ListItemText 
                        primary={item.title}
                        primaryTypographyProps={{ 
                          fontSize: '0.875rem',
                          color: 'text.disabled'
                        }}
                      />
                      <Chip
                        label={i18n.comingSoon}
                        size="small"
                        color="default"
                        sx={{ fontSize: '0.7rem', height: 18 }}
                      />
                    </Box>
                  </ListItemButton>
                ) : (
                  <ListItemButton
                    component={Link}
                    href={href}
                    selected={isActive}
                    sx={{
                      borderRadius: 1,
                      mx: 0.5,
                      '&.Mui-selected': {
                        bgcolor: 'primary.main',
                        color: 'primary.contrastText',
                        '&:hover': {
                          bgcolor: 'primary.dark',
                        },
                        '& .MuiListItemText-primary': {
                          color: 'primary.contrastText',
                          fontWeight: 500,
                        },
                      },
                      '&:hover': {
                        bgcolor: isActive ? 'primary.dark' : 'action.hover',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                      {badgeNumber && (
                        <Chip
                          label={badgeNumber}
                          size="small"
                          variant={isActive ? "filled" : "outlined"}
                          color={isActive ? "default" : "primary"}
                          sx={{ 
                            fontSize: '0.75rem', 
                            height: 20,
                            ...(isActive && {
                              bgcolor: 'rgba(255, 255, 255, 0.2)',
                              color: 'inherit',
                            }),
                          }}
                        />
                      )}
                      <ListItemText 
                        primary={item.title}
                        primaryTypographyProps={{ 
                          fontSize: '0.875rem',
                          fontWeight: isActive ? 500 : 400,
                        }}
                      />
                    </Box>
                  </ListItemButton>
                )}
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Drawer>
  );
}