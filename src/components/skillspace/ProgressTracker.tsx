import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star, Clock, Target } from "lucide-react";

const ProgressTracker = ({ userProgress }) => {
  const completedLessons = userProgress.filter(p => p.completed).length;
  const totalScore = userProgress.reduce((sum, p) => sum + (p.score || 0), 0);
  const averageScore = completedLessons > 0 ? Math.round(totalScore / completedLessons) : 0;
  const totalTimeSpent = userProgress.reduce((sum, p) => sum + (p.time_spent || 0), 0);

  // Mock badges based on progress
  const getBadges = () => {
    const badges = [];
    
    if (completedLessons >= 1) {
      badges.push({ name: "First Steps", icon: "🎯", description: "Completed your first lesson" });
    }
    
    if (completedLessons >= 5) {
      badges.push({ name: "Getting Started", icon: "⭐", description: "Completed 5 lessons" });
    }
    
    if (completedLessons >= 10) {
      badges.push({ name: "Dedicated Learner", icon: "🏆", description: "Completed 10 lessons" });
    }
    
    if (averageScore >= 90) {
      badges.push({ name: "Excellence", icon: "💎", description: "Maintained 90%+ average score" });
    }
    
    return badges;
  };

  const badges = getBadges();

  if (userProgress.length === 0) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Card className="w-80">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Progress Tracker
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center py-4">
              Start learning to track your progress!
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-80 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Your Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{completedLessons}</div>
              <div className="text-xs text-muted-foreground">Lessons Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{averageScore}%</div>
              <div className="text-xs text-muted-foreground">Average Score</div>
            </div>
          </div>

          {/* Badges */}
          {badges.length > 0 && (
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Star className="w-4 h-4" />
                Recent Badges
              </h4>
              <div className="space-y-2">
                {badges.slice(-3).map((badge, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded-md">
                    <span className="text-lg">{badge.icon}</span>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{badge.name}</p>
                      <p className="text-xs text-muted-foreground">{badge.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Weekly Goal */}
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Weekly Goal
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Complete 5 lessons</span>
                <span>{Math.min(completedLessons, 5)}/5</span>
              </div>
              <Progress value={Math.min(completedLessons / 5 * 100, 100)} className="h-2" />
            </div>
          </div>

          {/* Time Spent */}
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              Time Spent
            </span>
            <span className="font-medium">{totalTimeSpent || 0}m</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressTracker;