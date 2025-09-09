import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Video, VideoOff, Mic, MicOff, Users, Clock, Calendar } from "lucide-react";

interface LiveSession {
  id: string;
  title: string;
  instructor: string;
  participants: number;
  duration: string;
  status: "live" | "upcoming" | "ended";
  startTime: string;
  description: string;
}

const mockSessions: LiveSession[] = [
  {
    id: "1",
    title: "Advanced React Patterns",
    instructor: "Sarah Chen",
    participants: 24,
    duration: "2h 30m",
    status: "live",
    startTime: "10:00 AM",
    description: "Deep dive into advanced React patterns and performance optimization"
  },
  {
    id: "2",
    title: "Machine Learning Fundamentals",
    instructor: "Dr. Michael Rodriguez",
    participants: 18,
    duration: "3h",
    status: "upcoming",
    startTime: "2:00 PM",
    description: "Introduction to ML concepts and practical implementations"
  },
  {
    id: "3",
    title: "UI/UX Design Workshop",
    instructor: "Emily Johnson",
    participants: 31,
    duration: "1h 45m",
    status: "ended",
    startTime: "9:00 AM",
    description: "Creating user-centered designs with modern tools"
  }
];

export const LiveSessions = () => {
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [joinedSession, setJoinedSession] = useState<string | null>(null);

  const getStatusColor = (status: LiveSession["status"]) => {
    switch (status) {
      case "live": return "bg-red-500";
      case "upcoming": return "bg-blue-500";
      case "ended": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  const handleJoinSession = (sessionId: string) => {
    setJoinedSession(sessionId);
  };

  const handleLeaveSession = () => {
    setJoinedSession(null);
    setVideoEnabled(false);
    setAudioEnabled(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Live Sessions</h2>
        {joinedSession && (
          <div className="flex items-center gap-2">
            <Button
              variant={videoEnabled ? "default" : "outline"}
              size="sm"
              onClick={() => setVideoEnabled(!videoEnabled)}
            >
              {videoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
            </Button>
            <Button
              variant={audioEnabled ? "default" : "outline"}
              size="sm"
              onClick={() => setAudioEnabled(!audioEnabled)}
            >
              {audioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
            </Button>
            <Button variant="destructive" size="sm" onClick={handleLeaveSession}>
              Leave Session
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-4">
        {mockSessions.map((session) => (
          <Card key={session.id} className="border border-border">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{session.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">by {session.instructor}</p>
                </div>
                <Badge variant="secondary" className={`${getStatusColor(session.status)} text-white`}>
                  {session.status.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{session.description}</p>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{session.participants} participants</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{session.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{session.startTime}</span>
                </div>
              </div>

              <div className="flex justify-end">
                {session.status === "live" && joinedSession !== session.id && (
                  <Button onClick={() => handleJoinSession(session.id)}>
                    Join Session
                  </Button>
                )}
                {session.status === "upcoming" && (
                  <Button variant="outline" disabled>
                    Session Starts Soon
                  </Button>
                )}
                {session.status === "ended" && (
                  <Button variant="outline">
                    View Recording
                  </Button>
                )}
                {joinedSession === session.id && (
                  <Badge variant="default" className="bg-green-500">
                    Connected
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};