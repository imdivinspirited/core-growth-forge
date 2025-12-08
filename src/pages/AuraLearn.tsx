import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Code, 
  Search, 
  Clock, 
  ChevronRight
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import CodingPanel from "@/components/skillspace/CodingPanel";
import ProgressTracker from "@/components/skillspace/ProgressTracker";
import CourseSidebar from "@/components/skillspace/CourseSidebar";

const AuraLearn = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [userProgress, setUserProgress] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const categories = ["All", "Career", "Tech", "Hobbies"];

  useEffect(() => {
    fetchCourses();
    fetchUserProgress();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      toast({
        title: "Error fetching courses",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProgress = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setUserProgress(data || []);
    } catch (error) {
      console.error('Error fetching user progress:', error);
    }
  };

  const fetchLessons = async (courseId) => {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('lesson_order');

      if (error) throw error;
      setLessons(data || []);
      if (data && data.length > 0) {
        setSelectedLesson(data[0]);
      }
    } catch (error) {
      toast({
        title: "Error fetching lessons",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const selectCourse = (course) => {
    setSelectedCourse(course);
    fetchLessons(course.id);
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getProgressForCourse = (courseId) => {
    const courseProgress = userProgress.filter(p => p.course_id === courseId);
    const completedLessons = courseProgress.filter(p => p.completed).length;
    const totalLessons = lessons.length;
    return totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading AuraLearn...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              AuraLearn
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              Master new skills with interactive lessons and coding challenges
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
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

      <div className="container mx-auto max-w-7xl px-4 py-8">
        {!selectedCourse ? (
          <>
            {/* Featured Courses */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Featured Courses</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.filter(course => course.is_featured).map((course) => (
                  <Card key={course.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="flex items-start justify-between">
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
                        onClick={() => selectCourse(course)}
                      >
                        Start Learning
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* All Courses */}
            <div>
              <h2 className="text-2xl font-bold mb-6">All Courses</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <Card key={course.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="flex items-start justify-between">
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
                      <div className="mb-3">
                        <Progress value={getProgressForCourse(course.id)} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-1">
                          {Math.round(getProgressForCourse(course.id))}% complete
                        </p>
                      </div>
                      <Button 
                        className="w-full" 
                        onClick={() => selectCourse(course)}
                        variant={getProgressForCourse(course.id) > 0 ? "default" : "outline"}
                      >
                        {getProgressForCourse(course.id) > 0 ? "Continue" : "Start Learning"}
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </>
        ) : (
          /* Course Learning Interface */
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <CourseSidebar 
                course={selectedCourse}
                lessons={lessons}
                selectedLesson={selectedLesson}
                onLessonSelect={setSelectedLesson}
                onBackToCourses={() => {
                  setSelectedCourse(null);
                  setSelectedLesson(null);
                  setLessons([]);
                }}
                userProgress={userProgress}
              />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {selectedLesson && (
                <Tabs defaultValue="tutorial" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="tutorial">Tutorial</TabsTrigger>
                    <TabsTrigger value="exercise">Exercise</TabsTrigger>
                    <TabsTrigger value="resources">Resources</TabsTrigger>
                  </TabsList>

                  <TabsContent value="tutorial" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>{selectedLesson.title}</CardTitle>
                        <p className="text-muted-foreground">{selectedLesson.description}</p>
                      </CardHeader>
                      <CardContent>
                        <div className="prose max-w-none">
                          <p>{selectedLesson.content || "Tutorial content will be available here."}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="exercise">
                    {selectedLesson.lesson_type === 'exercise' ? (
                      <CodingPanel 
                        lesson={selectedLesson}
                        onComplete={() => fetchUserProgress()}
                      />
                    ) : (
                      <Card>
                        <CardContent className="p-8 text-center">
                          <Code className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">
                            This lesson doesn't have coding exercises.
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>

                  <TabsContent value="resources">
                    <Card>
                      <CardHeader>
                        <CardTitle>Additional Resources</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="text-muted-foreground">
                            <p>📚 Recommended reading materials</p>
                            <p>🎥 Video tutorials and demonstrations</p>
                            <p>🔗 External links and documentation</p>
                            <p>💡 Tips and best practices</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Progress Tracker */}
      <ProgressTracker userProgress={userProgress} />
    </div>
  );
};

export default AuraLearn;