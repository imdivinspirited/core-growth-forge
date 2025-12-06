import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  User, 
  TrendingUp, 
  Award, 
  FileText, 
  BarChart3, 
  Trophy,
  Settings,
  BookOpen,
  Clock,
  Share2,
  LogOut
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface DashboardPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DashboardPanel = ({ isOpen, onClose }: DashboardPanelProps) => {
  const [profile, setProfile] = useState<any>(null);
  const [userProgress, setUserProgress] = useState<any[]>([]);
  const [userBadges, setUserBadges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && user) {
      fetchDashboardData();
    }
  }, [isOpen, user]);

  const fetchDashboardData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const [profileRes, progressRes, badgesRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('user_id', user.id).maybeSingle(),
        supabase.from('user_progress')
          .select('*, courses:course_id (title, category), lessons:lesson_id (title)')
          .eq('user_id', user.id),
        supabase.from('user_badges')
          .select('*')
          .eq('user_id', user.id)
          .order('earned_at', { ascending: false }),
      ]);

      setProfile(profileRes.data);
      setUserProgress(progressRes.data || []);
      setUserBadges(badgesRes.data || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    onClose();
  };

  const completedCourses = userProgress.filter(p => p.completed).length;
  const totalScore = userProgress.reduce((sum, p) => sum + (p.score || 0), 0);
  const averageScore = completedCourses > 0 ? Math.round(totalScore / completedCourses) : 0;
  const totalLearningTime = userProgress.reduce((sum, p) => sum + (p.time_spent || 0), 0);

  const panelVariants = {
    hidden: { x: '100%', opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { 
        type: 'spring' as const, 
        stiffness: 300, 
        damping: 30,
        staggerChildren: 0.1 
      }
    },
    exit: { 
      x: '100%', 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100]"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
          />
          
          {/* Panel */}
          <motion.div
            className="fixed right-0 top-0 h-full w-full max-w-xl bg-card border-l border-border shadow-2xl z-[101] overflow-hidden"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-primary/10 to-accent/10">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 border-2 border-primary/30">
                  <AvatarImage src={profile?.avatar_url} />
                  <AvatarFallback className="bg-primary/20 text-primary">
                    {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold text-lg">
                    {profile?.full_name || 'Welcome'}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    @{profile?.username || 'user'}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="h-[calc(100%-80px)] overflow-y-auto custom-scrollbar">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </div>
              ) : (
                <div className="p-4 space-y-6">
                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-primary">{completedCourses}</div>
                          <div className="text-xs text-muted-foreground">Courses Done</div>
                        </CardContent>
                      </Card>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                    >
                      <Card className="bg-gradient-to-br from-accent/10 to-transparent border-accent/20">
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-accent">{userBadges.length}</div>
                          <div className="text-xs text-muted-foreground">Badges</div>
                        </CardContent>
                      </Card>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Card>
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold">{averageScore}%</div>
                          <div className="text-xs text-muted-foreground">Avg Score</div>
                        </CardContent>
                      </Card>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                    >
                      <Card>
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold">{Math.round(totalLearningTime / 60)}h</div>
                          <div className="text-xs text-muted-foreground">Learn Time</div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </div>

                  {/* Tabs */}
                  <Tabs defaultValue="progress" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 h-auto">
                      <TabsTrigger value="progress" className="text-xs py-2">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Progress
                      </TabsTrigger>
                      <TabsTrigger value="badges" className="text-xs py-2">
                        <Award className="h-3 w-3 mr-1" />
                        Badges
                      </TabsTrigger>
                      <TabsTrigger value="achievements" className="text-xs py-2">
                        <Trophy className="h-3 w-3 mr-1" />
                        Achieve
                      </TabsTrigger>
                      <TabsTrigger value="stats" className="text-xs py-2">
                        <BarChart3 className="h-3 w-3 mr-1" />
                        Stats
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="progress" className="mt-4 space-y-3">
                      {userProgress.length > 0 ? (
                        userProgress.slice(0, 5).map((progress, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="p-3 bg-muted/50 rounded-lg space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <BookOpen className="h-4 w-4 text-primary" />
                                <span className="text-sm font-medium truncate max-w-[180px]">
                                  {progress.lessons?.title || 'Lesson'}
                                </span>
                              </div>
                              <Badge variant={progress.completed ? "default" : "secondary"} className="text-xs">
                                {progress.completed ? "Done" : "Active"}
                              </Badge>
                            </div>
                            <Progress value={progress.completed ? 100 : 50} className="h-1.5" />
                          </motion.div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No progress yet</p>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="badges" className="mt-4">
                      <div className="grid grid-cols-3 gap-3">
                        {userBadges.length > 0 ? (
                          userBadges.slice(0, 6).map((badge, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: idx * 0.05 }}
                              className="p-3 bg-muted/50 rounded-lg text-center"
                            >
                              <div className="text-2xl mb-1">{badge.badge_icon || '🏆'}</div>
                              <p className="text-xs font-medium truncate">{badge.badge_name}</p>
                            </motion.div>
                          ))
                        ) : (
                          <div className="col-span-3 text-center py-8 text-muted-foreground">
                            <Award className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No badges yet</p>
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="achievements" className="mt-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                          <Trophy className="h-8 w-8 text-yellow-500" />
                          <div>
                            <p className="font-medium text-sm">Early Adopter</p>
                            <p className="text-xs text-muted-foreground">Joined AuraUp</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg opacity-50">
                          <Trophy className="h-8 w-8 text-muted-foreground" />
                          <div>
                            <p className="font-medium text-sm">Course Master</p>
                            <p className="text-xs text-muted-foreground">Complete 5 courses</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg opacity-50">
                          <Trophy className="h-8 w-8 text-muted-foreground" />
                          <div>
                            <p className="font-medium text-sm">Dedication</p>
                            <p className="text-xs text-muted-foreground">7-day streak</p>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="stats" className="mt-4 space-y-4">
                      <Card>
                        <CardContent className="p-4 space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Completion Rate</span>
                            <span className="text-sm font-bold text-primary">{averageScore}%</span>
                          </div>
                          <Progress value={averageScore} className="h-2" />
                          
                          <div className="flex justify-between items-center pt-2">
                            <span className="text-sm">Learning Streak</span>
                            <span className="text-sm font-bold text-accent">0 days</span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Total XP</span>
                            <span className="text-sm font-bold">{totalScore} XP</span>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>

                  {/* Actions */}
                  <div className="space-y-2 pt-4 border-t border-border">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start" 
                      onClick={() => { navigate('/dashboard'); onClose(); }}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Full Dashboard
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => { navigate('/settings'); onClose(); }}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-destructive hover:text-destructive"
                      onClick={handleSignOut}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DashboardPanel;
