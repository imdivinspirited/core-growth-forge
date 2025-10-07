import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { MapPin, Heart, MessageCircle, Share2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/Navbar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface TourismPost {
  id: string;
  title: string;
  content: string;
  location_name: string | null;
  latitude: number | null;
  longitude: number | null;
  likes_count: number;
  comments_count: number;
  created_at: string;
  author_profile?: {
    full_name: string | null;
    avatar_url: string | null;
  };
}

const Tourism = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<TourismPost[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    location_name: "",
  });

  useEffect(() => {
    loadPosts();
    subscribeToRealtimePosts();
  }, []);

  const loadPosts = async () => {
    const { data } = await supabase
      .from("tourism_posts")
      .select(`
        id,
        title,
        content,
        location_name,
        latitude,
        longitude,
        likes_count,
        comments_count,
        created_at,
        author_id
      `)
      .eq("status", "published")
      .order("created_at", { ascending: false });

    if (data) {
      const postsWithProfiles = await Promise.all(
        data.map(async (post) => {
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name, avatar_url")
            .eq("user_id", post.author_id)
            .maybeSingle();
          return { ...post, author_profile: profile };
        })
      );
      setPosts(postsWithProfiles);
    }
  };

  const subscribeToRealtimePosts = () => {
    const channel = supabase
      .channel("tourism_posts")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "tourism_posts",
        },
        () => {
          loadPosts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const createPost = async () => {
    if (!newPost.title || !newPost.content) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase.from("tourism_posts").insert({
      author_id: user?.id,
      title: newPost.title,
      content: newPost.content,
      location_name: newPost.location_name,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Post created successfully",
      });
      setNewPost({ title: "", content: "", location_name: "" });
      setIsDialogOpen(false);
    }
  };

  const toggleLike = async (postId: string) => {
    const { data: existingLike } = await supabase
      .from("tourism_likes")
      .select("id")
      .eq("post_id", postId)
      .eq("user_id", user?.id)
      .maybeSingle();

    if (existingLike) {
      await supabase.from("tourism_likes").delete().eq("id", existingLike.id);
    } else {
      await supabase.from("tourism_likes").insert({
        post_id: postId,
        user_id: user?.id,
      });
    }

    loadPosts();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto p-6 mt-16">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Tourism Feed</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Share Your Experience
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Share Your Travel Experience</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Post Title"
                  value={newPost.title}
                  onChange={(e) =>
                    setNewPost({ ...newPost, title: e.target.value })
                  }
                />
                <Textarea
                  placeholder="Share your experience..."
                  value={newPost.content}
                  onChange={(e) =>
                    setNewPost({ ...newPost, content: e.target.value })
                  }
                  rows={5}
                />
                <Input
                  placeholder="Location"
                  value={newPost.location_name}
                  onChange={(e) =>
                    setNewPost({ ...newPost, location_name: e.target.value })
                  }
                />
                <Button onClick={createPost} className="w-full">
                  Post
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6">
          {posts.map((post) => (
            <Card key={post.id} className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  {post.author_profile?.full_name?.[0] || "U"}
                </div>
                <div>
                  <p className="font-semibold">
                    {post.author_profile?.full_name || "Unknown User"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(post.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <h2 className="text-xl font-bold mb-2">{post.title}</h2>
              <p className="text-muted-foreground mb-4">{post.content}</p>

              {post.location_name && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <MapPin className="w-4 h-4" />
                  <span>{post.location_name}</span>
                </div>
              )}

              <div className="flex items-center gap-4 pt-4 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleLike(post.id)}
                >
                  <Heart className="w-4 h-4 mr-2" />
                  {post.likes_count}
                </Button>
                <Button variant="ghost" size="sm">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  {post.comments_count}
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tourism;
