import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, X, FileText, BookOpen, Users, Sparkles, Clock, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useDebounce } from "@/hooks/useDebounce";

interface SearchResult {
  type: 'blog' | 'course' | 'community';
  id: string;
  title: string;
  description: string;
  category?: string;
  url: string;
}

export const GlobalSearch = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const debouncedQuery = useDebounce(query, 300);
  const navigate = useNavigate();

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('recentSearches');
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  }, []);

  // Save search to recent searches
  const saveToRecent = useCallback((searchTerm: string) => {
    if (!searchTerm.trim()) return;
    const updated = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  }, [recentSearches]);

  // Clear recent searches
  const clearRecent = useCallback(() => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setResults([]);
      return;
    }

    const searchContent = async () => {
      setLoading(true);
      try {
        const searchTerm = `%${debouncedQuery}%`;

        // Search blogs
        const { data: blogs } = await supabase
          .from('blogs')
          .select('id, title, excerpt, category')
          .eq('published', true)
          .or(`title.ilike.${searchTerm},content.ilike.${searchTerm},excerpt.ilike.${searchTerm}`)
          .limit(5);

        // Search courses
        const { data: courses } = await supabase
          .from('courses')
          .select('id, title, description, category')
          .or(`title.ilike.${searchTerm},description.ilike.${searchTerm}`)
          .limit(5);

        // Search community posts
        const { data: posts } = await supabase
          .from('community_posts')
          .select('id, title, content, category')
          .eq('status', 'published')
          .or(`title.ilike.${searchTerm},content.ilike.${searchTerm}`)
          .limit(5);

        const searchResults: SearchResult[] = [
          ...(blogs || []).map(b => ({
            type: 'blog' as const,
            id: b.id,
            title: b.title,
            description: b.excerpt || '',
            category: b.category,
            url: `/thinkspace?blog=${b.id}`,
          })),
          ...(courses || []).map(c => ({
            type: 'course' as const,
            id: c.id,
            title: c.title,
            description: c.description || '',
            category: c.category,
            url: `/learn?course=${c.id}`,
          })),
          ...(posts || []).map(p => ({
            type: 'community' as const,
            id: p.id,
            title: p.title,
            description: p.content.substring(0, 100),
            category: p.category,
            url: `/thinkspace?post=${p.id}`,
          })),
        ];

        setResults(searchResults);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };

    searchContent();
  }, [debouncedQuery]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'blog': return <FileText className="h-4 w-4" />;
      case 'course': return <BookOpen className="h-4 w-4" />;
      case 'community': return <Users className="h-4 w-4" />;
      default: return <Sparkles className="h-4 w-4" />;
    }
  };

  const handleResultClick = (url: string) => {
    saveToRecent(query);
    navigate(url);
    setIsOpen(false);
    setQuery("");
  };

  const handleRecentClick = (searchTerm: string) => {
    setQuery(searchTerm);
  };

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        className="w-full max-w-sm flex items-center justify-between"
        onClick={() => setIsOpen(true)}
      >
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4" />
          <span className="text-muted-foreground">Search...</span>
        </div>
        <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="container flex items-start justify-center pt-20">
        <Card className="w-full max-w-2xl shadow-strong animate-in slide-in-from-top-4 duration-300">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Search className="h-5 w-5 text-muted-foreground" />
              <Input
                autoFocus
                placeholder="Search blogs, courses, community posts..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="border-0 focus-visible:ring-0 bg-transparent"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setIsOpen(false);
                  setQuery("");
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {loading && (
              <div className="flex items-center gap-2 py-4">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <p className="text-sm text-muted-foreground">Searching...</p>
              </div>
            )}

            {!loading && query.length < 2 && recentSearches.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-medium">Recent Searches</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearRecent}
                    className="h-auto py-1 px-2 text-xs"
                  >
                    Clear
                  </Button>
                </div>
                {recentSearches.map((search, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-lg hover:bg-accent cursor-pointer transition-colors"
                    onClick={() => handleRecentClick(search)}
                  >
                    <p className="text-sm text-muted-foreground">{search}</p>
                  </div>
                ))}
              </div>
            )}

            {results.length > 0 && (
              <ScrollArea className="h-auto max-h-96">
                <div className="space-y-2">
                  {results.map((result) => (
                    <div
                      key={`${result.type}-${result.id}`}
                      className="p-3 rounded-lg hover:bg-accent cursor-pointer transition-all duration-200 hover:shadow-soft"
                      onClick={() => handleResultClick(result.url)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1 text-primary">{getIcon(result.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium truncate">{result.title}</h4>
                            <Badge variant="secondary" className="text-xs">
                              {result.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {result.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}

            {!loading && debouncedQuery.length >= 2 && results.length === 0 && (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground mb-1">
                  No results found for "{debouncedQuery}"
                </p>
                <p className="text-xs text-muted-foreground">
                  Try different keywords or check spelling
                </p>
              </div>
            )}

            {!loading && query.length === 0 && recentSearches.length === 0 && (
              <div className="text-center py-8">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Start typing to search across blogs, courses, and community posts
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
