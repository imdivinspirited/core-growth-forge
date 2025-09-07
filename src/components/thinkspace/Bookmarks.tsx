import { useState, useEffect } from "react";
import { BlogCard } from "./BlogCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Bookmark, Trash2, Filter } from "lucide-react";

interface BookmarkedBlog {
  id: string;
  created_at: string;
  blogs: {
    id: string;
    title: string;
    content: string;
    excerpt?: string;
    category: string;
    tags: string[];
    author_id: string;
    thumbnail_url?: string;
    published: boolean;
    featured: boolean;
    view_count: number;
    like_count: number;
    reading_time: number;
    language: string;
    created_at: string;
    profiles?: {
      full_name?: string;
      username?: string;
      avatar_url?: string;
    };
  };
}

interface BookmarksProps {
  searchQuery: string;
}

export const Bookmarks = ({ searchQuery }: BookmarksProps) => {
  const [bookmarks, setBookmarks] = useState<BookmarkedBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<string>("recent");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .select(`
          id,
          created_at,
          blogs!bookmarks_blog_id_fkey (
            id,
            title,
            content,
            excerpt,
            category,
            tags,
            author_id,
            thumbnail_url,
            published,
            featured,
            view_count,
            like_count,
            reading_time,
            language,
            created_at,
            profiles!blogs_author_id_fkey (
              full_name,
              username,
              avatar_url
            )
          )
        `)
        .eq('blogs.published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookmarks(data || []);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeBookmark = async (bookmarkId: string) => {
    try {
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('id', bookmarkId);

      if (error) throw error;
      
      setBookmarks(prev => prev.filter(bookmark => bookmark.id !== bookmarkId));
    } catch (error) {
      console.error('Error removing bookmark:', error);
    }
  };

  const filteredBookmarks = bookmarks
    .filter(bookmark => {
      const blog = bookmark.blogs;
      const matchesSearch = !searchQuery || 
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === "all" || blog.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'title':
          return a.blogs.title.localeCompare(b.blogs.title);
        case 'category':
          return a.blogs.category.localeCompare(b.blogs.category);
        case 'recent':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

  const categories = Array.from(new Set(bookmarks.map(bookmark => bookmark.blogs.category)));

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-80" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bookmark className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-semibold">My Bookmarks</h2>
          <span className="text-sm text-muted-foreground">
            ({filteredBookmarks.length} saved)
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Category Filter */}
          {categories.length > 0 && (
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Sort Filter */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Recently Saved</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="title">Title A-Z</SelectItem>
              <SelectItem value="category">Category</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Bookmarked Blogs */}
      {filteredBookmarks.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredBookmarks.map((bookmark) => (
            <div key={bookmark.id} className="relative group">
              <BlogCard blog={bookmark.blogs} />
              
              {/* Remove Bookmark Button */}
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                onClick={() => removeBookmark(bookmark.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              
              {/* Bookmark Date */}
              <div className="mt-2 text-xs text-muted-foreground">
                Saved on {new Date(bookmark.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Bookmark className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">
            {searchQuery ? "No bookmarked blogs match your search." : "You haven't bookmarked any blogs yet."}
          </p>
          <p className="text-sm text-muted-foreground">
            Start exploring and bookmark your favorite articles!
          </p>
        </div>
      )}
    </div>
  );
};