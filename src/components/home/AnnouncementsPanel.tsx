import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Megaphone, 
  Calendar, 
  Star, 
  Gift, 
  Users, 
  ArrowRight,
  Clock,
  Pin
} from "lucide-react";

const AnnouncementsPanel = () => {
  const announcements = [
    {
      id: 1,
      title: "New AI-Powered Resume Builder Launch",
      description: "We're excited to announce our revolutionary AI resume builder with personalized suggestions and ATS optimization.",
      type: "product",
      priority: "high",
      date: "Dec 15, 2024",
      time: "2:00 PM EST",
      icon: Star,
      color: "bg-yellow-500",
      pinned: true,
      actions: ["Learn More", "Try Now"]
    },
    {
      id: 2,
      title: "Winter Learning Festival",
      description: "Join our month-long celebration with 50% off premium courses, exclusive workshops, and networking events.",
      type: "event",
      priority: "medium",
      date: "Dec 20 - Jan 20",
      time: "All Day",
      icon: Gift,
      color: "bg-green-500",
      pinned: false,
      actions: ["Register", "View Schedule"]
    },
    {
      id: 3,
      title: "Community Milestone: 100K Members!",
      description: "We've reached 100,000 active members! Thank you for being part of our growing professional community.",
      type: "milestone",
      priority: "medium",
      date: "Dec 12, 2024",
      time: "12:00 PM EST",
      icon: Users,
      color: "bg-blue-500",
      pinned: false,
      actions: ["Celebrate", "Share"]
    },
    {
      id: 4,
      title: "Scheduled Maintenance",
      description: "Brief system maintenance scheduled for performance improvements. Expected downtime: 30 minutes.",
      type: "maintenance",
      priority: "low",
      date: "Dec 18, 2024",
      time: "3:00 AM EST",
      icon: Clock,
      color: "bg-orange-500",
      pinned: false,
      actions: ["Details"]
    }
  ];

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-500 text-white">High Priority</Badge>;
      case "medium":
        return <Badge className="bg-yellow-500 text-white">Important</Badge>;
      case "low":
        return <Badge variant="secondary">Info</Badge>;
      default:
        return null;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "product": return Star;
      case "event": return Calendar;
      case "milestone": return Users;
      case "maintenance": return Clock;
      default: return Megaphone;
    }
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge className="mb-4">
            <Megaphone className="w-4 h-4 mr-2" />
            Announcements
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Stay Updated
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Important updates, new features, and community news to keep you informed.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {announcements.map((announcement) => {
            const IconComponent = getTypeIcon(announcement.type);
            
            return (
              <Card 
                key={announcement.id} 
                className={`hover:shadow-card-hover transition-all duration-300 ${
                  announcement.pinned ? 'ring-2 ring-primary/20 bg-primary/5' : 'hover:-translate-y-1'
                } bg-card`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${announcement.color}`}>
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex items-center gap-2">
                        {announcement.pinned && (
                          <Pin className="w-4 h-4 text-primary" />
                        )}
                        {getPriorityBadge(announcement.priority)}
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {announcement.type.charAt(0).toUpperCase() + announcement.type.slice(1)}
                    </Badge>
                  </div>
                  
                  <CardTitle className="text-xl">
                    {announcement.title}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {announcement.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {announcement.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {announcement.time}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {announcement.actions.map((action, index) => (
                        <Button 
                          key={index}
                          variant={index === 0 ? "default" : "outline"}
                          size="sm"
                        >
                          {action}
                          {index === 0 && <ArrowRight className="ml-2 h-3 w-3" />}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-4 p-4 bg-muted/50 rounded-lg border">
            <span className="text-sm text-muted-foreground">Want to stay updated?</span>
            <Button variant="outline" size="sm">
              Subscribe to Notifications
            </Button>
            <Button variant="outline" size="sm">
              View All Announcements
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnnouncementsPanel;