import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  Target, 
  BookOpen, 
  TrendingUp, 
  Star, 
  Calendar,
  Users,
  Award,
  Clock,
  BarChart3
} from "lucide-react";

const MiniDashboard = () => {
  const userStats = {
    totalPoints: 2847,
    level: 12,
    experienceToNext: 68,
    coursesCompleted: 23,
    coursesInProgress: 5,
    streakDays: 28,
    badgesEarned: 16,
    projectsCompleted: 8,
    weeklyGoalProgress: 85,
    monthlyTarget: 75
  };

  const recentBadges = [
    { id: 1, name: "React Master", icon: "⚛️", rarity: "rare", earnedAt: "2 days ago" },
    { id: 2, name: "Code Reviewer", icon: "👁️", rarity: "common", earnedAt: "5 days ago" },
    { id: 3, name: "Team Player", icon: "🤝", rarity: "uncommon", earnedAt: "1 week ago" },
    { id: 4, name: "Early Bird", icon: "🌅", rarity: "common", earnedAt: "1 week ago" }
  ];

  const weeklyActivity = [
    { day: "Mon", points: 120 },
    { day: "Tue", points: 85 },
    { day: "Wed", points: 190 },
    { day: "Thu", points: 145 },
    { day: "Fri", points: 110 },
    { day: "Sat", points: 75 },
    { day: "Sun", points: 200 }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "rare": return "text-purple-500";
      case "uncommon": return "text-blue-500";
      case "common": return "text-green-500";
      default: return "text-gray-500";
    }
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge className="mb-4">
            <BarChart3 className="w-4 h-4 mr-2" />
            Your Progress
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Dashboard Overview
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Track your learning journey, achievements, and goals all in one place.
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Total Points</p>
                    <p className="text-2xl font-bold">{userStats.totalPoints.toLocaleString()}</p>
                  </div>
                  <Trophy className="h-8 w-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Current Level</p>
                    <p className="text-2xl font-bold">{userStats.level}</p>
                  </div>
                  <Star className="h-8 w-8 text-green-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Completed</p>
                    <p className="text-2xl font-bold">{userStats.coursesCompleted}</p>
                  </div>
                  <BookOpen className="h-8 w-8 text-purple-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm">Streak Days</p>
                    <p className="text-2xl font-bold">{userStats.streakDays}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-orange-200" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Dashboard Content */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Progress Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Level Progress */}
              <Card className="bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Level Progress
                  </CardTitle>
                  <CardDescription>
                    Level {userStats.level} • {userStats.experienceToNext}% to Level {userStats.level + 1}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Progress value={userStats.experienceToNext} className="h-3 mb-4" />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Current: {userStats.totalPoints} XP</span>
                    <span>Next: {Math.ceil(userStats.totalPoints / (userStats.experienceToNext / 100))} XP</span>
                  </div>
                </CardContent>
              </Card>

              {/* Weekly Activity */}
              <Card className="bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Weekly Activity
                  </CardTitle>
                  <CardDescription>
                    Your learning activity over the past week
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between gap-2 h-32">
                    {weeklyActivity.map((day, index) => (
                      <div key={day.day} className="flex flex-col items-center gap-2 flex-1">
                        <div 
                          className="bg-primary rounded-t w-full transition-all hover:bg-primary/80"
                          style={{ height: `${(day.points / 200) * 100}%` }}
                        ></div>
                        <span className="text-xs text-muted-foreground">{day.day}</span>
                        <span className="text-xs font-medium">{day.points}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Goals Progress */}
              <Card className="bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Goals & Targets
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Weekly Learning Goal</span>
                      <span>{userStats.weeklyGoalProgress}%</span>
                    </div>
                    <Progress value={userStats.weeklyGoalProgress} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Monthly Target</span>
                      <span>{userStats.monthlyTarget}%</span>
                    </div>
                    <Progress value={userStats.monthlyTarget} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Recent Badges */}
              <Card className="bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Recent Badges
                  </CardTitle>
                  <CardDescription>
                    {userStats.badgesEarned} total badges earned
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentBadges.map((badge) => (
                    <div key={badge.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="text-2xl">{badge.icon}</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{badge.name}</p>
                        <p className={`text-xs ${getRarityColor(badge.rarity)}`}>
                          {badge.rarity} • {badge.earnedAt}
                        </p>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" className="w-full">
                    View All Badges
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Courses In Progress</span>
                    <span className="font-medium">{userStats.coursesInProgress}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Projects Completed</span>
                    <span className="font-medium">{userStats.projectsCompleted}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">This Week's Focus</span>
                    <Badge variant="secondary">React</Badge>
                  </div>
                  <div className="pt-2 border-t">
                    <Button className="w-full">
                      View Full Dashboard
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MiniDashboard;