import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Play, Users, ExternalLink } from "lucide-react";

interface WorkshopEvent {
  id: string;
  title: string;
  instructor: string;
  date: string;
  time: string;
  duration: string;
  participants: number;
  status: "upcoming" | "live" | "completed";
  joinLink?: string;
  recordingLink?: string;
  category: string;
}

const mockEvents: WorkshopEvent[] = [
  {
    id: "1",
    title: "Advanced React Patterns & Performance",
    instructor: "Sarah Chen",
    date: "2024-01-15",
    time: "10:00 AM",
    duration: "2h 30m",
    participants: 45,
    status: "upcoming",
    joinLink: "#",
    category: "Frontend Development"
  },
  {
    id: "2",
    title: "Machine Learning with Python",
    instructor: "Dr. Michael Rodriguez",
    date: "2024-01-12",
    time: "2:00 PM",
    duration: "3h",
    participants: 38,
    status: "live",
    joinLink: "#",
    category: "Data Science"
  },
  {
    id: "3",
    title: "UI/UX Design Principles",
    instructor: "Emily Johnson",
    date: "2024-01-10",
    time: "9:00 AM",
    duration: "1h 45m",
    participants: 52,
    status: "completed",
    recordingLink: "#",
    category: "Design"
  },
  {
    id: "4",
    title: "DevOps Best Practices",
    instructor: "Alex Thompson",
    date: "2024-01-08",
    time: "11:00 AM",
    duration: "2h",
    participants: 29,
    status: "completed",
    recordingLink: "#",
    category: "DevOps"
  }
];

export const EventsCalendar = () => {
  const getStatusColor = (status: WorkshopEvent["status"]) => {
    switch (status) {
      case "live": return "bg-red-500";
      case "upcoming": return "bg-blue-500";
      case "completed": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      "Frontend Development": "bg-purple-100 text-purple-800",
      "Data Science": "bg-green-100 text-green-800",
      "Design": "bg-pink-100 text-pink-800",
      "DevOps": "bg-orange-100 text-orange-800"
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <Card className="border border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Workshop Calendar
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockEvents.map((event) => (
            <div
              key={event.id}
              className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-foreground">{event.title}</h3>
                  <Badge variant="secondary" className={getStatusColor(event.status) + " text-white"}>
                    {event.status.toUpperCase()}
                  </Badge>
                  <Badge variant="outline" className={getCategoryColor(event.category)}>
                    {event.category}
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  Instructor: {event.instructor}
                </p>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{event.time} ({event.duration})</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{event.participants} registered</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {event.status === "live" && event.joinLink && (
                  <Button size="sm" className="bg-red-500 hover:bg-red-600">
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Join Live
                  </Button>
                )}
                {event.status === "upcoming" && event.joinLink && (
                  <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4 mr-1" />
                    Add to Calendar
                  </Button>
                )}
                {event.status === "completed" && event.recordingLink && (
                  <Button variant="outline" size="sm">
                    <Play className="h-4 w-4 mr-1" />
                    Watch Recording
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 text-center">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            View Full Calendar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};