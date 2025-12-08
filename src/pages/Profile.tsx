import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Edit3, Camera, Save, Award, TrendingUp, BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ContactInfo from "@/components/profile/ContactInfo";
import Portfolio from "@/components/profile/Portfolio";
import MyJourney from "@/components/profile/MyJourney";
import SkillsTechnologies from "@/components/profile/SkillsTechnologies";
import ContinuousLearning from "@/components/profile/ContinuousLearning";
import GitHubResume from "@/components/profile/GitHubResume";
import ClientTestimonials from "@/components/profile/ClientTestimonials";
import QuickContact from "@/components/profile/QuickContact";
import Footer from "@/components/profile/Footer";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userProgress, setUserProgress] = useState([]);
  const [userBadges, setUserBadges] = useState([]);
  const { toast } = useToast();

  const [editForm, setEditForm] = useState({
    full_name: '',
    username: '',
    bio: '',
    language_preference: 'en',
    theme_preference: 'light',
    privacy_profile: 'public'
  });

  useEffect(() => {
    fetchProfile();
    fetchUserProgress();
    fetchUserBadges();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile(data);
        setEditForm(data);
      } else {
        const defaultProfile = {
          user_id: user.id,
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          username: user.email?.split('@')[0],
          bio: 'Welcome to my profile!',
          language_preference: 'en',
          theme_preference: 'light',
          privacy_profile: 'public'
        };

        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert(defaultProfile)
          .select()
          .single();

        if (insertError) throw insertError;
        setProfile(newProfile);
        setEditForm(newProfile);
      }
    } catch (error) {
      toast({
        title: "Error loading profile",
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
        .select(`
          *,
          courses:course_id (title, category),
          lessons:lesson_id (title)
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      setUserProgress(data || []);
    } catch (error) {
      console.error('Error fetching user progress:', error);
    }
  };

  const fetchUserBadges = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_badges')
        .select('*')
        .eq('user_id', user.id)
        .order('earned_at', { ascending: false });

      if (error) throw error;
      setUserBadges(data || []);
    } catch (error) {
      console.error('Error fetching user badges:', error);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .update(editForm)
        .eq('user_id', user.id);

      if (error) throw error;

      setProfile({ ...profile, ...editForm });
      setIsEditing(false);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleInputChange = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const completedCourses = userProgress.filter(p => p.completed).length;
  const totalScore = userProgress.reduce((sum, p) => sum + (p.score || 0), 0);
  const averageScore = completedCourses > 0 ? Math.round(totalScore / completedCourses) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Hero Section with Edit Capability */}
      <section className="bg-gradient-to-br from-primary/10 via-primary/5 to-background py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="mb-8">
            <div className="relative inline-block mb-6">
              <Avatar className="w-32 h-32 border-4 border-primary/20 shadow-lg">
                <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} />
                <AvatarFallback className="text-2xl">
                  {profile?.full_name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button
                  size="sm"
                  className="absolute bottom-0 right-0 rounded-full w-10 h-10 p-0"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              )}
            </div>
            
            {isEditing ? (
              <div className="space-y-4 max-w-md mx-auto">
                <Input
                  value={editForm.full_name}
                  onChange={(e) => handleInputChange('full_name', e.target.value)}
                  placeholder="Full Name"
                  className="text-center text-2xl font-bold"
                />
                <Input
                  value={editForm.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  placeholder="Username"
                  className="text-center"
                />
                <Textarea
                  value={editForm.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Bio"
                  className="text-center resize-none"
                  rows={2}
                />
                <div className="flex gap-2 justify-center">
                  <Button onClick={handleSaveProfile}>
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <h1 className="text-4xl font-bold text-foreground">
                    {profile?.full_name || "User"}
                  </h1>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xl text-muted-foreground mb-6">
                  @{profile?.username || "username"}
                </p>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  {profile?.bio || "Welcome to my profile!"}
                </p>
                
                {/* Activity Overview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{completedCourses}</div>
                    <div className="text-sm text-muted-foreground">Courses Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{userBadges.length}</div>
                    <div className="text-sm text-muted-foreground">Badges Earned</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{averageScore}%</div>
                    <div className="text-sm text-muted-foreground">Average Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {userProgress.reduce((sum, p) => sum + (p.time_spent || 0), 0)}m
                    </div>
                    <div className="text-sm text-muted-foreground">Learning Time</div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <MyJourney />
                <GitHubResume />
              </div>
              <div className="space-y-8">
                <ContactInfo profile={profile} onUpdate={fetchProfile} />
                <QuickContact />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Learning Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary">{completedCourses}</div>
                        <div className="text-sm text-muted-foreground">Completed Courses</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary">{averageScore}%</div>
                        <div className="text-sm text-muted-foreground">Average Score</div>
                      </div>
                    </div>
                    
                    {userProgress.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-medium">Recent Activity</h4>
                        {userProgress.slice(0, 3).map((progress, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                            <div className="flex items-center gap-2">
                              <BookOpen className="w-4 h-4 text-primary" />
                              <span className="text-sm font-medium">
                                {progress.lessons?.title || "Lesson"}
                              </span>
                            </div>
                            <Badge variant={progress.completed ? "default" : "secondary"}>
                              {progress.completed ? "Completed" : "In Progress"}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Badges & Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {userBadges.length > 0 ? (
                    <div className="space-y-3">
                      {userBadges.map((badge, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-muted rounded-md">
                          <div className="text-2xl">{badge.badge_icon || "🏆"}</div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{badge.badge_name}</p>
                            <p className="text-xs text-muted-foreground">{badge.badge_description}</p>
                            <p className="text-xs text-muted-foreground">
                              Earned: {new Date(badge.earned_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Award className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No badges earned yet</p>
                      <p className="text-sm text-muted-foreground">Complete lessons to earn your first badge!</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <ContinuousLearning />
          </TabsContent>

          <TabsContent value="portfolio">
            <Portfolio />
          </TabsContent>

          <TabsContent value="skills" className="space-y-8">
            <SkillsTechnologies />
          </TabsContent>

          <TabsContent value="testimonials">
            <ClientTestimonials />
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;