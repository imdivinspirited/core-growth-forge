import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code, BookOpen, Users, PenTool, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export const QuickLinks = () => {
  const quickActions = [
    {
      title: "Practice Coding",
      description: "Jump into coding exercises",
      icon: Code,
      link: "/skillspace",
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      title: "Read Blogs",
      description: "Explore latest articles",
      icon: BookOpen,
      link: "/thinkspace",
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      title: "Join Workshop",
      description: "Live learning sessions",
      icon: Users,
      link: "/workshop",
      color: "bg-purple-500 hover:bg-purple-600"
    },
    {
      title: "Write Blog",
      description: "Share your thoughts",
      icon: PenTool,
      link: "/thinkspace/write",
      color: "bg-orange-500 hover:bg-orange-600"
    }
  ];

  return (
    <Card className="border border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action, index) => (
            <Link key={index} to={action.link}>
              <Button
                variant="outline"
                className={`h-auto p-4 flex flex-col items-center gap-2 w-full text-white border-0 ${action.color}`}
              >
                <action.icon className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-medium text-sm">{action.title}</div>
                  <div className="text-xs opacity-90">{action.description}</div>
                </div>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};