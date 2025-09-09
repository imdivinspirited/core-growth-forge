import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Award, TrendingUp, Edit } from "lucide-react";

export const ProfileOverview = () => {
  return (
    <Card className="border border-border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Profile Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Profile Header */}
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>JS</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <h3 className="text-lg font-semibold text-foreground">John Smith</h3>
            <p className="text-sm text-muted-foreground">Full Stack Developer</p>
            <div className="flex items-center gap-2">
              <Badge variant="default" className="bg-blue-500">
                Level 12
              </Badge>
              <Badge variant="outline">Pro Member</Badge>
            </div>
          </div>
          <Button size="sm" variant="outline">
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
        </div>

        {/* Skill Score */}
        <div className="p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Overall Skill Score</span>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-muted rounded-full h-3">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full w-[78%]" />
            </div>
            <span className="text-lg font-bold text-foreground">1,247</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            +156 points this month
          </p>
        </div>

        {/* Recent Badges */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
            <Award className="h-4 w-4" />
            Recent Badges
          </h4>
          <div className="flex gap-2 flex-wrap">
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
              🏆 Workshop Master
            </Badge>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              💻 Code Ninja
            </Badge>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              📚 Learning Streak
            </Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border">
          <div className="text-center">
            <div className="text-xl font-bold text-foreground">24</div>
            <div className="text-xs text-muted-foreground">Courses</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-foreground">156</div>
            <div className="text-xs text-muted-foreground">Exercises</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-foreground">12</div>
            <div className="text-xs text-muted-foreground">Badges</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};