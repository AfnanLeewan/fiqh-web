import {
  Card,
  CardContent,
  Chip,
  Typography,
  Box
} from '@mui/material';
import {
  Article as FileTextIcon,
  Folder as FolderIcon
} from '@mui/icons-material';
import { ContentNode, ViewMode } from '@/types/content';
import { i18n } from '@/lib/i18n';
import Link from 'next/link';

interface ContentItemProps {
  item: ContentNode;
  viewMode: ViewMode;
  basePath: string;
  onItemClick?: (item: ContentNode) => void;
}

export function ContentItem({ item, viewMode, basePath, onItemClick }: ContentItemProps) {
  const isComingSoon = item.badge === 'coming-soon';
  const isArticle = item.type === 'article';
  const href = `${basePath}/${item.slug}`;

  const badgeNumber = typeof item.badge === 'number' ? item.badge : null;

  const content = (
    <>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
        {badgeNumber && (
          <Chip
            label={badgeNumber}
            color="primary"
            size="small"
            sx={{ fontSize: '0.75rem', height: 24 }}
          />
        )}
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1" component="h3" fontWeight={500} gutterBottom>
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
        {isArticle ? (
          <FileTextIcon color="primary" sx={{ mt: 0.5 }} />
        ) : (
          <FolderIcon color="action" sx={{ mt: 0.5 }} />
        )}
      </Box>
      {isComingSoon && (
        <Box sx={{ mt: 2 }}>
          <Chip
            label={i18n.comingSoon}
            size="small"
            color="default"
            variant="outlined"
            sx={{ fontSize: '0.7rem' }}
          />
        </Box>
      )}
    </>
  );

  if (viewMode === 'card') {
    return (
      <Card 
        sx={{ 
          height: '100%',
          ...(isComingSoon ? {
            opacity: 0.6,
          } : {
            transition: 'box-shadow 0.2s ease-in-out',
            cursor: 'pointer',
            '&:hover': {
              boxShadow: 4,
            },
          }),
        }}
      >
        <CardContent sx={{ p: 3 }}>
          {isComingSoon ? (
            <Box title={i18n.comingSoon}>
              {content}
            </Box>
          ) : (
            <Box 
              component={Link} 
              href={href} 
              onClick={() => onItemClick?.(item)}
              sx={{ 
                textDecoration: 'none',
                color: 'inherit',
                display: 'block',
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
        ...(isComingSoon ? {
          opacity: 0.6,
        } : {
          transition: 'background-color 0.2s ease-in-out',
          cursor: 'pointer',
          '&:hover': {
            bgcolor: 'action.hover',
          },
        }),
      }}
    >
      {isComingSoon ? (
        <Box title={i18n.comingSoon}>
          {content}
        </Box>
      ) : (
        <Box 
          component={Link} 
          href={href} 
          onClick={() => onItemClick?.(item)}
          sx={{ 
            textDecoration: 'none',
            color: 'inherit',
            display: 'block',
          }}
        >
          {content}
        </Box>
      )}
    </Box>
  );
}