import { ContentNode } from '@/types/content';
import { Link, useLocation } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { i18n } from '@/lib/i18n';

interface SidebarProps {
  items: ContentNode[];
  basePath: string;
}

export function Sidebar({ items, basePath }: SidebarProps) {
  const location = useLocation();

  return (
    <aside className="w-64 bg-muted/30 border-r border-border">
      <div className="p-4">
        <nav className="space-y-1">
          {items.map((item) => {
            const href = `${basePath}/${item.slug}`;
            const isActive = location.pathname === href;
            const isComingSoon = item.badge === 'coming-soon';
            const badgeNumber = typeof item.badge === 'number' ? item.badge : null;

            return (
              <div key={item.id}>
                {isComingSoon ? (
                  <div
                    className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground cursor-not-allowed"
                    title={i18n.comingSoon}
                  >
                    {badgeNumber && (
                      <Badge variant="secondary" className="text-xs">
                        {badgeNumber}
                      </Badge>
                    )}
                    <span>{item.title}</span>
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {i18n.comingSoon}
                    </Badge>
                  </div>
                ) : (
                  <Link
                    to={href}
                    className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${
                      isActive
                        ? 'bg-nav-active text-primary-foreground font-medium'
                        : 'text-foreground hover:bg-nav-hover hover:text-primary'
                    }`}
                  >
                    {badgeNumber && (
                      <Badge variant={isActive ? "secondary" : "outline"} className="text-xs">
                        {badgeNumber}
                      </Badge>
                    )}
                    <span>{item.title}</span>
                  </Link>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}