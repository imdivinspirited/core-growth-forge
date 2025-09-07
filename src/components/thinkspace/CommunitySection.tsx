import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, ArrowUp, ArrowDown, Plus, HelpCircle, BarChart3, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface CommunityPost {
  id: string;
  title: string;
  content: string;
  type: string;
  category: string;
  author_id: string;
  status: string;
  vote_count: number;
  comment_count: number;
  tags: string[];
  created_at: string;
  profiles?: {
    full_name?: string;
    username?: string;
    avatar_url?: string;
  };
}

interface CommunitySectionProps {
  searchQuery: string;
}

export const CommunitySection = ({ searchQuery }: CommunitySectionProps) => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchCommunityPosts();
  }, []);

  const fetchCommunityPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('community_posts')
        .select(`
          *,
          profiles!community_posts_author_id_fkey (
            full_name,
            username,
            avatar_url
          )
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching community posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = !searchQuery || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesTab = activeTab === "all" || post.type === activeTab;
    
    return matchesSearch && matchesTab;
  });

  const getPostIcon = (type: string) => {
    switch (type) {
      case 'question':
        return <HelpCircle className="h-4 w-4" />;
      case 'poll':
        return <BarChart3 className="h-4 w-4" />;
      case 'blog_submission':
        return <FileText className="h-4 w-4" />;
      default:
        return <MessageCircle className="h-4 w-4" />;
    }
  };

  const getPostTypeColor = (type: string) => {
    switch (type) {
      case 'question':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'poll':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'blog_submission':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Community Discussions</h2>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Start Discussion
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-lg grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="question">Questions</TabsTrigger>
          <TabsTrigger value="poll">Polls</TabsTrigger>
          <TabsTrigger value="blog_submission">Submissions</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4 mt-6">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <Card key={post.id} className="transition-all hover:shadow-md hover-scale">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getPostTypeColor(post.type)}>
                          <div className="flex items-center gap-1">
                            {getPostIcon(post.type)}
                            {post.type.replace('_', ' ')}
                          </div>
                        </Badge>
                        <Badge variant="outline">{post.category}</Badge>
                      </div>
                      
                      <h3 className="font-semibold text-lg leading-tight mb-2 hover:text-primary cursor-pointer">
                        {post.title}
                      </h3>
                      
                      <p className="text-muted-foreground text-sm line-clamp-2">
                        {post.content}
                      </p>
                    </div>

                    {/* Vote Section */}
                    <div className="flex flex-col items-center gap-1 min-w-0">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <span className="text-sm font-semibold text-center">
                        {post.vote_count}
                      </span>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={post.profiles?.avatar_url} />
                          <AvatarFallback className="text-xs">
                            {(post.profiles?.full_name || post.profiles?.username || 'A').charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-muted-foreground">
                          {post.profiles?.full_name || post.profiles?.username || 'Anonymous'}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-4 w-4" />
                          {post.comment_count} replies
                        </div>
                        <span>{formatDate(post.created_at)}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 2).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {post.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{post.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                {searchQuery ? "No discussions found matching your search." : "No discussions yet."}
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Start the conversation
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};