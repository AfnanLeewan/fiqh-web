import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { CategoryCard } from '@/components/CategoryCard';
import { mockData } from '@/data/mockData';
import { ContentNode } from '@/types/content';
import { searchContent } from '@/lib/contentUtils';
import { i18n } from '@/lib/i18n';

export default function Landing() {
  const [filteredCategories, setFilteredCategories] = useState<ContentNode[]>(mockData);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const results = searchContent(query);
      const categoryIds = new Set(results.filter(r => r.type === 'category').map(r => r.id));
      setFilteredCategories(mockData.filter(cat => categoryIds.has(cat.id)));
    } else {
      setFilteredCategories(mockData);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={handleSearch} />
      
      <main className="container mx-auto px-4 py-8">
        {searchQuery && filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{i18n.noResults}</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCategories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </main>
    </div>
  );
}