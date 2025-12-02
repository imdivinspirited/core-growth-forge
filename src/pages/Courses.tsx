import { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Clock, Search, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Courses = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const categories = ["All", "Career", "Tech", "Hobbies"];

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching courses",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-12 flex items-center border-b border-border/50 bg-background/95 backdrop-blur-md sticky top-0 z-40 px-4">
            <SidebarTrigger className="mr-4" />
          </header>
          
          <main className="flex-1 overflow-auto">
            {/* Header */}
            <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background py-12 px-4">
              <div className="container mx-auto max-w-6xl">
                <h1 className="text-4xl font-bold mb-4">Explore Courses</h1>
                <p className="text-xl text-muted-foreground mb-8">
                  Master new skills with interactive lessons and coding challenges
                </p>

                {/* Search and Filters */}
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search courses..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    {categories.map((category) => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Courses Grid */}
            <div className="container mx-auto max-w-6xl px-4 py-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <Card key={course.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant="secondary">{course.category}</Badge>
                        <Badge variant="outline">{course.difficulty_level}</Badge>
                      </div>
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {course.description}
                      </p>
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          {course.total_lessons} lessons
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {course.estimated_hours}h
                        </span>
                      </div>
                      <Button 
                        className="w-full" 
                        onClick={() => navigate('/skillspace')}
                      >
                        Start Learning
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Courses;
