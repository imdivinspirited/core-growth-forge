import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  StickyNote, 
  Calculator, 
  Calendar, 
  Target, 
  Zap, 
  Clock,
  ArrowRight 
} from "lucide-react";

const QuickAccessTools = () => {
  const tools = [
    {
      id: 1,
      title: "Resume Builder",
      description: "Create professional resumes with AI-powered suggestions",
      icon: FileText,
      color: "bg-blue-500",
      gradient: "from-blue-500 to-blue-600",
      features: ["ATS-friendly templates", "AI content suggestions", "PDF export"],
      usage: "Used 2.3k times this week",
      trending: true
    },
    {
      id: 2,
      title: "Smart Notes",
      description: "Organize ideas with intelligent tagging and search",
      icon: StickyNote,
      color: "bg-green-500",
      gradient: "from-green-500 to-green-600",
      features: ["Rich text editor", "Auto-categorization", "Quick search"],
      usage: "1.8k active users",
      trending: false
    },
    {
      id: 3,
      title: "Goal Calculator",
      description: "Calculate learning paths and career milestones",
      icon: Calculator,
      color: "bg-purple-500",
      gradient: "from-purple-500 to-purple-600",
      features: ["Timeline estimation", "Milestone tracking", "Progress analytics"],
      usage: "Featured tool of the month",
      trending: true
    },
    {
      id: 4,
      title: "Event Scheduler",
      description: "Plan workshops, meetings, and learning sessions",
      icon: Calendar,
      color: "bg-orange-500",
      gradient: "from-orange-500 to-orange-600",
      features: ["Smart scheduling", "Reminder system", "Team coordination"],
      usage: "950+ events scheduled",
      trending: false
    },
    {
      id: 5,
      title: "Project Tracker",
      description: "Monitor progress on personal and professional projects",
      icon: Target,
      color: "bg-red-500",
      gradient: "from-red-500 to-red-600",
      features: ["Kanban boards", "Time tracking", "Progress reports"],
      usage: "1.2k projects tracked",
      trending: false
    },
    {
      id: 6,
      title: "Quick Actions",
      description: "Access frequently used features instantly",
      icon: Zap,
      color: "bg-yellow-500",
      gradient: "from-yellow-500 to-yellow-600",
      features: ["One-click actions", "Custom shortcuts", "Voice commands"],
      usage: "New feature",
      trending: true
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge className="mb-4">Productivity Tools</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Quick Access Tools
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Boost your productivity with our suite of professional tools designed to streamline your workflow.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {tools.map((tool) => {
            const IconComponent = tool.icon;
            
            return (
              <Card key={tool.id} className="group hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 relative overflow-hidden bg-card">
                {tool.trending && (
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-primary text-primary-foreground">
                      <Zap className="w-3 h-3 mr-1" />
                      Trending
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${tool.gradient} mb-4`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  
                  <CardTitle className="group-hover:text-primary transition-colors">
                    {tool.title}
                  </CardTitle>
                  <CardDescription>
                    {tool.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-0">
                  {/* Features */}
                  <div className="space-y-2 mb-4">
                    {tool.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
                        {feature}
                      </div>
                    ))}
                  </div>

                  {/* Usage Stats */}
                  <div className="flex items-center text-xs text-muted-foreground mb-4">
                    <Clock className="w-3 h-3 mr-1" />
                    {tool.usage}
                  </div>

                  {/* Action Button */}
                  <Button className="w-full group/btn">
                    Launch Tool
                    <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Launch Bar */}
        <div className="mt-12 p-6 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold mb-2">Quick Launch</h3>
            <p className="text-muted-foreground text-sm">
              Access your most-used tools with a single click
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="outline" size="sm">
              <FileText className="w-4 h-4 mr-2" />
              New Resume
            </Button>
            <Button variant="outline" size="sm">
              <StickyNote className="w-4 h-4 mr-2" />
              Quick Note
            </Button>
            <Button variant="outline" size="sm">
              <Calculator className="w-4 h-4 mr-2" />
              Calculate Goals
            </Button>
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Event
            </Button>
            <Button variant="outline" size="sm">
              <Target className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuickAccessTools;