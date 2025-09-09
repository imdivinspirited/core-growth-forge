import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, BarChart3, Target, Lightbulb } from "lucide-react";

export const PerformanceAnalytics = () => {
  const stats = [
    {
      label: "Weekly Progress",
      value: "85%",
      change: "+12%",
      trend: "up",
      icon: TrendingUp
    },
    {
      label: "Completion Rate",
      value: "92%",
      change: "+5%",
      trend: "up",
      icon: Target
    },
    {
      label: "Study Streak",
      value: "7 days",
      change: "Active",
      trend: "up",
      icon: BarChart3
    }
  ];

  const suggestions = [
    "Focus on JavaScript advanced concepts to boost your score",
    "Complete 2 more exercises to maintain your streak",
    "Try the new React workshop to expand your skills"
  ];

  return (
    <Card className="border border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Performance Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {stats.map((stat, index) => (
            <div key={index} className="p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <stat.icon className={`h-4 w-4 ${
                  stat.trend === "up" ? "text-green-500" : "text-red-500"
                }`} />
                <Badge variant={stat.trend === "up" ? "default" : "destructive"} className="text-xs">
                  {stat.change}
                </Badge>
              </div>
              <div className="text-xl font-bold text-foreground">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* AI Suggestions */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            AI Suggestions
          </h4>
          <div className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="p-2 bg-blue-50/50 border border-blue-200 rounded text-sm">
                {suggestion}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};