import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, Eye, Send, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const BlogWriter = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [newTag, setNewTag] = useState("");

  const [blogData, setBlogData] = useState({
    title: "",
    content: "",
    excerpt: "",
    category: "",
    tags: [],
    thumbnail_url: "",
    language: "en",
    published: false,
    featured: false
  });

  const categories = [
    "Technology", "Career", "Personal Development", "Tutorials",
    "Life Lessons", "Industry Insights", "Tools & Resources"
  ];

  const handleInputChange = (field, value) => {
    setBlogData(prev => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    if (newTag.trim() && !blogData.tags.includes(newTag.trim())) {
      setBlogData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setBlogData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (shouldPublish = false) => {
    if (!blogData.title || !blogData.content || !blogData.category) {
      toast({
        title: "Missing required fields",
        description: "Please fill in title, content, and category.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to write a blog.",
          variant: "destructive"
        });
        return;
      }

      const blogToSubmit = {
        ...blogData,
        author_id: user.id,
        published: shouldPublish,
        reading_time: Math.ceil(blogData.content.split(' ').length / 200), // Estimate reading time
        view_count: 0,
        like_count: 0,
        comment_count: 0
      };

      const { error } = await supabase
        .from('blogs')
        .insert([blogToSubmit]);

      if (error) throw error;

      toast({
        title: shouldPublish ? "Blog published!" : "Blog saved as draft!",
        description: shouldPublish 
          ? "Your blog has been published successfully." 
          : "Your blog has been saved as a draft."
      });

      navigate('/thinkspace');
    } catch (error) {
      toast({
        title: "Error saving blog",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isPreview) {
    return (
      <div className="min-h-screen bg-background">
        {/* Preview Header */}
        <header className="border-b border-border/50 bg-background/95 backdrop-blur-md sticky top-0 z-40 px-4 py-3">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => setIsPreview(false)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Editor
            </Button>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => handleSubmit(false)}
                disabled={isSubmitting}
                variant="outline"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              <Button
                onClick={() => handleSubmit(true)}
                disabled={isSubmitting}
              >
                <Send className="h-4 w-4 mr-2" />
                Publish
              </Button>
            </div>
          </div>
        </header>

        {/* Preview Content */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <article className="prose prose-lg max-w-none">
            <header className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary">{blogData.category}</Badge>
                {blogData.tags.map((tag) => (
                  <Badge key={tag} variant="outline">#{tag}</Badge>
                ))}
              </div>
              <h1 className="text-4xl font-bold mb-4">{blogData.title}</h1>
              {blogData.excerpt && (
                <p className="text-xl text-muted-foreground">{blogData.excerpt}</p>
              )}
            </header>
            <div className="whitespace-pre-wrap">{blogData.content}</div>
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Editor Header */}
      <header className="border-b border-border/50 bg-background/95 backdrop-blur-md sticky top-0 z-40 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate('/thinkspace')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to ThinkSpace
          </Button>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setIsPreview(true)}
              variant="outline"
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button
              onClick={() => handleSubmit(false)}
              disabled={isSubmitting}
              variant="outline"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            <Button
              onClick={() => handleSubmit(true)}
              disabled={isSubmitting}
            >
              <Send className="h-4 w-4 mr-2" />
              Publish
            </Button>
          </div>
        </div>
      </header>

      {/* Editor Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Editor */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Write Your Blog</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter your blog title..."
                    value={blogData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="text-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    placeholder="A brief description of your blog..."
                    value={blogData.excerpt}
                    onChange={(e) => handleInputChange('excerpt', e.target.value)}
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content *</Label>
                  <Textarea
                    id="content"
                    placeholder="Write your blog content here..."
                    value={blogData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    rows={20}
                    className="font-mono"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Settings */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Blog Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select value={blogData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select value={blogData.language} onValueChange={(value) => handleInputChange('language', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">Hindi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="thumbnail">Thumbnail URL</Label>
                  <Input
                    id="thumbnail"
                    placeholder="https://..."
                    value={blogData.thumbnail_url}
                    onChange={(e) => handleInputChange('thumbnail_url', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a tag..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  />
                  <Button onClick={addTag} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {blogData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      #{tag}
                      <button onClick={() => removeTag(tag)}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogWriter;