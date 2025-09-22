import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ContentNode, ViewMode } from '@/types/content';
import { i18n } from '@/lib/i18n';
import { FileText, Folder } from 'lucide-react';
import { Link } from 'react-router-dom';

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
      <div className="flex items-center gap-3">
        {badgeNumber && (
          <Badge variant="destructive" className="bg-primary text-primary-foreground">
            {badgeNumber}
          </Badge>
        )}
        <div className="flex-1">
          <h3 className="font-medium text-foreground">{item.title}</h3>
          {item.summary && (
            <p className="text-sm text-muted-foreground mt-1">{item.summary}</p>
          )}
        </div>
        {isArticle ? (
          <FileText className="h-5 w-5 text-primary" />
        ) : (
          <Folder className="h-5 w-5 text-muted-foreground" />
        )}
      </div>
      {isComingSoon && (
        <Badge variant="secondary" className="mt-2 text-muted-foreground">
          {i18n.comingSoon}
        </Badge>
      )}
    </>
  );

  if (viewMode === 'card') {
    return (
      <Card className={`h-full ${isComingSoon ? 'opacity-60' : 'hover:shadow-md transition-shadow cursor-pointer'}`}>
        <CardContent className="p-4">
          {isComingSoon ? (
            <div title={i18n.comingSoon}>
              {content}
            </div>
          ) : (
            <Link to={href} onClick={() => onItemClick?.(item)}>
              {content}
            </Link>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`p-4 border-b border-border ${isComingSoon ? 'opacity-60' : 'hover:bg-muted/50 transition-colors cursor-pointer'}`}>
      {isComingSoon ? (
        <div title={i18n.comingSoon}>
          {content}
        </div>
      ) : (
        <Link to={href} onClick={() => onItemClick?.(item)} className="block">
          {content}
        </Link>
      )}
    </div>
  );
}