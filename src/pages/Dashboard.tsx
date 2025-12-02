import { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  User, 
  TrendingUp, 
  Award, 
  FileText, 
  BarChart3, 
  Trophy,
  Share2,
  Download,
  BookOpen,
  Clock
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const Dashboard = () => {
  const [profile, setProfile] = useState<any>(null);
  const [userProgress, setUserProgress] = useState<any[]>([]);
  const [userBadges, setUserBadges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      setProfile(profileData);

      // Fetch progress
      const { data: progressData } = await supabase
        .from('user_progress')
        .select(`
          *,
          courses:course_id (title, category),
          lessons:lesson_id (title)
        `)
        .eq('user_id', user.id);
      
      setUserProgress(progressData || []);

      // Fetch badges
      const { data: badgesData } = await supabase
        .from('user_badges')
        .select('*')
        .eq('user_id', user.id)
        .order('earned_at', { ascending: false });
      
      setUserBadges(badgesData || []);
    } catch (error: any) {
      toast({
        title: "Error loading dashboard",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const completedCourses = userProgress.filter(p => p.completed).length;
  const totalScore = userProgress.reduce((sum, p) => sum + (p.score || 0), 0);
  const averageScore = completedCourses > 0 ? Math.round(totalScore / completedCourses) : 0;
  const totalLearningTime = userProgress.reduce((sum, p) => sum + (p.time_spent || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
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
            {/* Profile Header */}
            <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background py-12 px-4">
              <div className="container mx-auto max-w-6xl">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-6"
                >
                  <Avatar className="w-24 h-24 border-4 border-primary/20">
                    <AvatarImage src={profile?.avatar_url} />
                    <AvatarFallback className="text-2xl">
                      {profile?.full_name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold mb-2">{profile?.full_name || 'User'}</h1>
                    <p className="text-muted-foreground">@{profile?.username || 'username'}</p>
                  </div>
                  <Button>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Profile
                  </Button>
                </motion.div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary mb-1">{completedCourses}</div>
                        <div className="text-sm text-muted-foreground">Courses Completed</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary mb-1">{userBadges.length}</div>
                        <div className="text-sm text-muted-foreground">Badges Earned</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary mb-1">{averageScore}%</div>
                        <div className="text-sm text-muted-foreground">Average Score</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary mb-1">{totalLearningTime}m</div>
                        <div className="text-sm text-muted-foreground">Learning Time</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* Dashboard Tabs */}
            <div className="container mx-auto max-w-6xl px-4 py-8">
              <Tabs defaultValue="progress" className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-8">
                  <TabsTrigger value="progress">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Progress
                  </TabsTrigger>
                  <TabsTrigger value="badges">
                    <Award className="w-4 h-4 mr-2" />
                    Badges
                  </TabsTrigger>
                  <TabsTrigger value="certificates">
                    <FileText className="w-4 h-4 mr-2" />
                    Certificates
                  </TabsTrigger>
                  <TabsTrigger value="stats">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Stats
                  </TabsTrigger>
                  <TabsTrigger value="achievements">
                    <Trophy className="w-4 h-4 mr-2" />
                    Achievements
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="progress" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Learning Progress</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {userProgress.length > 0 ? (
                        userProgress.map((progress, idx) => (
                          <div key={idx} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-primary" />
                                <span className="font-medium">{progress.lessons?.title || 'Lesson'}</span>
                              </div>
                              <Badge variant={progress.completed ? "default" : "secondary"}>
                                {progress.completed ? "Completed" : "In Progress"}
                              </Badge>
                            </div>
                            <Progress value={progress.completed ? 100 : 50} />
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                              <span>{progress.courses?.title || 'Course'}</span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {progress.time_spent || 0}m
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-12">
                          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">No progress yet. Start learning!</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="badges" className="space-y-6">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {userBadges.length > 0 ? (
                      userBadges.map((badge, idx) => (
                        <Card key={idx} className="text-center">
                          <CardContent className="pt-6">
                            <div className="text-5xl mb-4">{badge.badge_icon || '🏆'}</div>
                            <h3 className="font-semibold mb-2">{badge.badge_name}</h3>
                            <p className="text-sm text-muted-foreground mb-2">{badge.badge_description}</p>
                            <p className="text-xs text-muted-foreground">
                              Earned: {new Date(badge.earned_at).toLocaleDateString()}
                            </p>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-12">
                        <Award className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No badges earned yet</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="certificates">
                  <Card>
                    <CardContent className="py-12 text-center">
                      <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">No certificates available yet</p>
                      <Button>
                        <Download className="w-4 h-4 mr-2" />
                        Generate Certificate
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="stats">
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Performance Overview</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span>Completion Rate</span>
                          <span className="font-bold text-primary">{averageScore}%</span>
                        </div>
                        <Progress value={averageScore} />
                        <div className="flex justify-between items-center">
                          <span>Total Learning Hours</span>
                          <span className="font-bold text-primary">{Math.round(totalLearningTime / 60)}h</span>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {userProgress.slice(0, 5).map((p, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm">
                              <div className="w-2 h-2 rounded-full bg-primary"></div>
                              <span className="text-muted-foreground">
                                {p.completed ? 'Completed' : 'Started'} {p.lessons?.title || 'Lesson'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="achievements">
                  <Card>
                    <CardHeader>
                      <CardTitle>All Achievements</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="text-center p-6 border border-border rounded-lg">
                          <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
                          <h3 className="font-semibold mb-1">Early Adopter</h3>
                          <p className="text-sm text-muted-foreground">Joined AuraUp</p>
                        </div>
                        <div className="text-center p-6 border border-border rounded-lg opacity-50">
                          <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                          <h3 className="font-semibold mb-1">Course Master</h3>
                          <p className="text-sm text-muted-foreground">Complete 5 courses</p>
                        </div>
                        <div className="text-center p-6 border border-border rounded-lg opacity-50">
                          <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                          <h3 className="font-semibold mb-1">Dedication</h3>
                          <p className="text-sm text-muted-foreground">7-day streak</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
