import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Star, Users, Clock, Trophy, Target } from "lucide-react";

interface ParticipationBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: string;
  criteria: string;
  progress: number;
  maxProgress: number;
  rarity: "common" | "rare" | "epic" | "legendary";
}

const mockBadges: ParticipationBadge[] = [
  {
    id: "1",
    title: "Workshop Newcomer",
    description: "Attended your first workshop",
    icon: "🎓",
    earned: true,
    earnedDate: "2024-01-10",
    criteria: "Attend 1 workshop",
    progress: 1,
    maxProgress: 1,
    rarity: "common"
  },
  {
    id: "2",
    title: "Active Participant",
    description: "Asked 5 questions in workshops",
    icon: "🙋",
    earned: true,
    earnedDate: "2024-01-12",
    criteria: "Ask 5 questions",
    progress: 5,
    maxProgress: 5,
    rarity: "rare"
  },
  {
    id: "3",
    title: "Code Master",
    description: "Completed all coding exercises",
    icon: "💻",
    earned: false,
    criteria: "Complete 10 coding exercises",
    progress: 7,
    maxProgress: 10,
    rarity: "epic"
  },
  {
    id: "4",
    title: "Workshop Veteran",
    description: "Attended 20 workshops",
    icon: "⭐",
    earned: false,
    criteria: "Attend 20 workshops",
    progress: 12,
    maxProgress: 20,
    rarity: "legendary"
  },
  {
    id: "5",
    title: "Feedback Champion",
    description: "Left feedback for 10 workshops",
    icon: "💬",
    earned: true,
    earnedDate: "2024-01-15",
    criteria: "Leave feedback for 10 workshops",
    progress: 10,
    maxProgress: 10,
    rarity: "rare"
  }
];

export const ParticipationBadges = () => {
  const getRarityColor = (rarity: ParticipationBadge["rarity"]) => {
    switch (rarity) {
      case "common": return "bg-gray-100 text-gray-800 border-gray-300";
      case "rare": return "bg-blue-100 text-blue-800 border-blue-300";
      case "epic": return "bg-purple-100 text-purple-800 border-purple-300";
      case "legendary": return "bg-yellow-100 text-yellow-800 border-yellow-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getRarityIcon = (rarity: ParticipationBadge["rarity"]) => {
    switch (rarity) {
      case "common": return <Award className="h-4 w-4" />;
      case "rare": return <Star className="h-4 w-4" />;
      case "epic": return <Trophy className="h-4 w-4" />;
      case "legendary": return <Target className="h-4 w-4" />;
      default: return <Award className="h-4 w-4" />;
    }
  };

  const earnedBadges = mockBadges.filter(badge => badge.earned);
  const inProgressBadges = mockBadges.filter(badge => !badge.earned);

  return (
    <Card className="border border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Participation Badges
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Earned Badges */}
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Award className="h-4 w-4" />
            Earned Badges ({earnedBadges.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {earnedBadges.map((badge) => (
              <div
                key={badge.id}
                className="p-3 border border-border rounded-lg bg-green-50/50 hover:bg-green-50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{badge.icon}</div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-foreground">{badge.title}</h4>
                      <Badge variant="outline" className={getRarityColor(badge.rarity)}>
                        {getRarityIcon(badge.rarity)}
                        {badge.rarity}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{badge.description}</p>
                    <p className="text-xs text-green-600">
                      Earned on {new Date(badge.earnedDate!).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* In Progress Badges */}
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Clock className="h-4 w-4" />
            In Progress ({inProgressBadges.length})
          </h3>
          <div className="space-y-3">
            {inProgressBadges.map((badge) => (
              <div
                key={badge.id}
                className="p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl opacity-60">{badge.icon}</div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-foreground">{badge.title}</h4>
                      <Badge variant="outline" className={getRarityColor(badge.rarity)}>
                        {getRarityIcon(badge.rarity)}
                        {badge.rarity}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{badge.description}</p>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">{badge.criteria}</span>
                        <span className="text-foreground font-medium">
                          {badge.progress}/{badge.maxProgress}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(badge.progress / badge.maxProgress) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
          <div className="text-center">
            <div className="text-xl font-bold text-foreground">{earnedBadges.length}</div>
            <div className="text-xs text-muted-foreground">Earned</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-foreground">{inProgressBadges.length}</div>
            <div className="text-xs text-muted-foreground">In Progress</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-foreground">
              {earnedBadges.filter(b => b.rarity === "rare" || b.rarity === "epic" || b.rarity === "legendary").length}
            </div>
            <div className="text-xs text-muted-foreground">Rare+</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-foreground">78%</div>
            <div className="text-xs text-muted-foreground">Completion</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};