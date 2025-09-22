import { Search, Menu, Grid3X3, List, Settings } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { i18n } from '@/lib/i18n';
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchContent } from '@/lib/contentUtils';
import { SearchResult } from '@/types/content';
import { ViewMode } from '@/types/content';

interface HeaderProps {
  title?: string;
  showViewToggle?: boolean;
  viewMode?: ViewMode;
  onViewModeChange?: (mode: ViewMode) => void;
  onSearch?: (query: string) => void;
}

export function Header({ title = 'สารบัญกรณ์', showViewToggle = false, viewMode = 'list', onViewModeChange, onSearch }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
    
    if (query.trim()) {
      const results = searchContent(query);
      setSearchResults(results);
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [onSearch]);

  const handleResultClick = (result: SearchResult) => {
    if (result.type === 'category') {
      navigate(`/c/${result.slug}`);
    } else {
      navigate(`/c${result.path}`);
    }
    setShowResults(false);
    setSearchQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchResults.length > 0) {
      handleResultClick(searchResults[0]);
    }
    if (e.key === 'Escape') {
      setShowResults(false);
    }
  };

  return (
    <header className="bg-header text-header-foreground shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-header-foreground hover:bg-white/10">
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold">{title}</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={i18n.search}
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => searchResults.length > 0 && setShowResults(true)}
                  onBlur={() => setTimeout(() => setShowResults(false), 200)}
                  className="pl-10 pr-4 w-64 bg-white/90 border-white/20 focus:bg-white"
                />
              </div>
              
              {showResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-md shadow-lg z-50 max-h-64 overflow-y-auto">
                  {searchResults.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => handleResultClick(result)}
                      className="w-full px-4 py-2 text-left hover:bg-muted flex items-center gap-2 border-b border-border last:border-b-0"
                    >
                      <div className="flex-shrink-0">
                        {result.type === 'category' && <Grid3X3 className="h-4 w-4 text-primary" />}
                        {result.type === 'chapter' && <List className="h-4 w-4 text-muted-foreground" />}
                        {result.type === 'article' && <div className="w-4 h-4 bg-primary rounded-sm"></div>}
                      </div>
                      <div>
                        <div className="font-medium">{result.title}</div>
                        <div className="text-xs text-muted-foreground capitalize">{result.type}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {showViewToggle && (
              <div className="flex bg-white/10 rounded-md">
                <Button
                  variant="ghost" 
                  size="sm"
                  onClick={() => onViewModeChange?.('list')}
                  className={`${viewMode === 'list' ? 'bg-white/20' : ''} text-header-foreground hover:bg-white/20`}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost" 
                  size="sm"
                  onClick={() => onViewModeChange?.('card')}
                  className={`${viewMode === 'card' ? 'bg-white/20' : ''} text-header-foreground hover:bg-white/20`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
              </div>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/admin/login')}
              className="text-header-foreground hover:bg-white/10"
              title="Admin Login"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}