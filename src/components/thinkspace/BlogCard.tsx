import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, Eye, Clock, Share2, Bookmark, BookmarkCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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

interface BlogCardProps {
  blog: Blog;
  featured?: boolean;
}

export const BlogCard = ({ blog, featured = false }: BlogCardProps) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const { toast } = useToast();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleBookmark = async () => {
    try {
      if (isBookmarked) {
        // Remove bookmark
        const { error } = await supabase
          .from('bookmarks')
          .delete()
          .match({ blog_id: blog.id });

        if (error) throw error;
        setIsBookmarked(false);
        toast({ description: "Bookmark removed" });
      } else {
        // Add bookmark
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');
        
        const { error } = await supabase
          .from('bookmarks')
          .insert([{ blog_id: blog.id, user_id: user.id }]);

        if (error) throw error;
        setIsBookmarked(true);
        toast({ description: "Blog bookmarked" });
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      toast({ 
        variant: "destructive",
        description: "Please sign in to bookmark posts" 
      });
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast({ description: isLiked ? "Like removed" : "Blog liked!" });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.origin + `/blog/${blog.id}`);
    toast({ description: "Link copied to clipboard" });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Technology': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'Career': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'Personal': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'Business': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      'Health': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    };
    return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  };

  return (
    <Card className={`overflow-hidden transition-all hover:shadow-lg hover-scale ${featured ? 'ring-2 ring-primary/20' : ''}`}>
      {blog.thumbnail_url && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={blog.thumbnail_url}
            alt={blog.title}
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
          {featured && (
            <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
              Featured
            </Badge>
          )}
          <Badge className={`absolute top-2 right-2 ${getCategoryColor(blog.category)}`}>
            {blog.category}
          </Badge>
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-center gap-2 mb-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={blog.profiles?.avatar_url} />
            <AvatarFallback className="text-xs">
              {(blog.profiles?.full_name || blog.profiles?.username || 'A').charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">
            {blog.profiles?.full_name || blog.profiles?.username || 'Anonymous'}
          </span>
          <span className="text-sm text-muted-foreground">•</span>
          <span className="text-sm text-muted-foreground">
            {formatDate(blog.created_at)}
          </span>
        </div>
        
        <h3 className="font-semibold text-lg leading-tight line-clamp-2 hover:text-primary cursor-pointer">
          {blog.title}
        </h3>
        
        {blog.excerpt && (
          <p className="text-muted-foreground text-sm line-clamp-3 mt-2">
            {blog.excerpt}
          </p>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-1 mb-3">
          {blog.tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {blog.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{blog.tags.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-0 flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            {blog.view_count}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {blog.reading_time}m
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={`h-8 w-8 p-0 ${isLiked ? 'text-red-500' : ''}`}
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBookmark}
            className={`h-8 w-8 p-0 ${isBookmarked ? 'text-primary' : ''}`}
          >
            {isBookmarked ? (
              <BookmarkCheck className="h-4 w-4 fill-current" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="h-8 w-8 p-0"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};