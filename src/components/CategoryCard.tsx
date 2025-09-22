import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ContentNode } from '@/types/content';
import { i18n } from '@/lib/i18n';
import Link from 'next/link';

interface CategoryCardProps {
  category: ContentNode;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const isComingSoon = category.badge === 'coming-soon' || !category.children?.length;

  return (
    <Card className="h-full flex flex-col">
      <CardContent className="flex-1 pt-6">
        <h3 className="text-xl font-semibold mb-3">{category.title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {category.summary}
        </p>
      </CardContent>
      <CardFooter className="pt-0">
        {isComingSoon ? (
          <div className="w-full flex justify-between items-center">
            <Badge variant="secondary" className="text-muted-foreground">
              {i18n.comingSoon}
            </Badge>
          </div>
        ) : (
          <Button asChild className="ml-auto" size="sm">
            <Link href={`/c/${category.slug}`}>
              {i18n.read}
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}