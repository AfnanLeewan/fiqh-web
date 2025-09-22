import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BreadcrumbItem {
  title: string;
  href: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
      {items.map((item, index) => (
        <div key={item.href} className="flex items-center gap-2">
          {index > 0 && <ChevronRight className="h-4 w-4" />}
          {index === items.length - 1 ? (
            <span className="text-foreground font-medium">{item.title}</span>
          ) : (
            <Link 
              to={item.href} 
              className="hover:text-primary transition-colors"
            >
              {item.title}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}