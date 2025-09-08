import { useState, useEffect } from "react";
import { BlogCard } from "./BlogCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Filter } from "lucide-react";

interface Blog {
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
}

interface BlogCategory {
  id: string;
  name: string;
  color: string;
  description?: string;
  icon?: string;
}

interface BlogListingProps {
  searchQuery: string;
}

export const BlogListing = ({ searchQuery }: BlogListingProps) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("latest");

  useEffect(() => {
    fetchBlogs();
    fetchCategories();
  }, []);

  const fetchBlogs = async () => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select(`
          *,
          profiles!blogs_author_id_fkey (
            full_name,
            username,
            avatar_url
          )
        `)
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBlogs(data || []);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const filteredBlogs = blogs
    .filter(blog => {
      const matchesSearch = !searchQuery || 
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === "all" || blog.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.view_count - a.view_count;
        case 'liked':
          return b.like_count - a.like_count;
        case 'latest':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

  const featuredBlogs = filteredBlogs.filter(blog => blog.featured);
  const regularBlogs = filteredBlogs.filter(blog => !blog.featured);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-20" />
          ))}
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
      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("all")}
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.name ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.name)}
                style={{
                  backgroundColor: selectedCategory === category.name ? category.color : undefined,
                  borderColor: category.color,
                  color: selectedCategory === category.name ? 'white' : category.color
                }}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Sort Filter */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="popular">Most Viewed</SelectItem>
              <SelectItem value="liked">Most Liked</SelectItem>
            </SelectContent>
          </Select>

          <Button 
            className="flex items-center gap-2"
            onClick={() => window.location.href = '/thinkspace/write'}
          >
            <Plus className="h-4 w-4" />
            Write Blog
          </Button>
        </div>
      </div>

      {/* Featured Blogs */}
      {featuredBlogs.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-2xl font-semibold">Featured</h2>
            <Badge variant="secondary">Hot</Badge>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredBlogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} featured />
            ))}
          </div>
        </section>
      )}

      {/* Regular Blogs */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">
          {featuredBlogs.length > 0 ? "Latest Posts" : "All Posts"}
        </h2>
        {regularBlogs.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {regularBlogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No blogs found matching your criteria.</p>
            <Button className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Be the first to write
            </Button>
          </div>
        )}
      </section>
    </div>
  );
};