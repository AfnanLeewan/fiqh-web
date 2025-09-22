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
          bgcolor: '#f8fdf8', // Very light green background
          borderRight: 1,
          borderColor: '#e8f5e8', // Light green border
          boxShadow: '0 0 10px rgba(76, 175, 80, 0.1)', // Subtle green shadow
        },
      }}
    >
      <Box sx={{ p: 3, pt: 2 }}>
        <List dense sx={{ '& .MuiListItem-root': { px: 0 } }}>
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
                      borderRadius: 2,
                      mx: 1,
                      my: 0.5,
                      bgcolor: '#f0f7f0', // Light green background for disabled items
                      '&.Mui-disabled': {
                        opacity: 0.7,
                        bgcolor: '#f0f7f0',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                      {badgeNumber && (
                        <Chip
                          label={badgeNumber}
                          size="small"
                          variant="outlined"
                          sx={{ 
                            fontSize: '0.75rem', 
                            height: 22,
                            minWidth: 28,
                            borderColor: '#c8e6c9',
                            color: '#81c784',
                            bgcolor: 'rgba(200, 230, 201, 0.3)',
                          }}
                        />
                      )}
                      <ListItemText 
                        primary={item.title}
                        primaryTypographyProps={{ 
                          fontSize: '0.9rem',
                          color: '#81c784',
                          fontWeight: 500,
                        }}
                      />
                      <Chip
                        label={i18n.comingSoon}
                        size="small"
                        sx={{ 
                          fontSize: '0.7rem', 
                          height: 20,
                          bgcolor: '#c8e6c9',
                          color: '#2e7d32',
                          fontWeight: 500,
                        }}
                      />
                    </Box>
                  </ListItemButton>
                ) : (
                  <ListItemButton
                    component={Link}
                    href={href}
                    selected={isActive}
                    sx={{
                      borderRadius: 2,
                      mx: 1,
                      my: 0.5,
                      transition: 'all 0.2s ease-in-out',
                      '&.Mui-selected': {
                        bgcolor: '#4caf50', // Primary green
                        color: 'white',
                        boxShadow: '0 2px 8px rgba(76, 175, 80, 0.3)',
                        '&:hover': {
                          bgcolor: '#45a049', // Darker green on hover
                          boxShadow: '0 4px 12px rgba(76, 175, 80, 0.4)',
                        },
                        '& .MuiListItemText-primary': {
                          color: 'white',
                          fontWeight: 600,
                        },
                      },
                      '&:hover': {
                        bgcolor: isActive ? '#45a049' : '#e8f5e8', // Light green hover
                        transform: 'translateX(4px)',
                        boxShadow: isActive ? '0 4px 12px rgba(76, 175, 80, 0.4)' : '0 2px 6px rgba(76, 175, 80, 0.2)',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                      {badgeNumber && (
                        <Chip
                          label={badgeNumber}
                          size="small"
                          variant={isActive ? "filled" : "outlined"}
                          sx={{ 
                            fontSize: '0.75rem', 
                            height: 22,
                            minWidth: 28,
                            ...(isActive ? {
                              bgcolor: 'rgba(255, 255, 255, 0.9)',
                              color: '#2e7d32',
                              fontWeight: 600,
                              border: 'none',
                            } : {
                              borderColor: '#4caf50',
                              color: '#2e7d32',
                              bgcolor: 'rgba(76, 175, 80, 0.1)',
                            }),
                          }}
                        />
                      )}
                      <ListItemText 
                        primary={item.title}
                        primaryTypographyProps={{ 
                          fontSize: '0.9rem',
                          fontWeight: isActive ? 600 : 500,
                          color: isActive ? 'white' : '#2e7d32',
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