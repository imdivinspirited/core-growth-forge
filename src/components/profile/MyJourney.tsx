import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Building } from "lucide-react";

const MyJourney = () => {
  const journeyData = {
    story: "Passionate full-stack developer with 5+ years of experience building scalable web applications. Started my journey as a self-taught programmer and evolved into a tech lead, specializing in React, Node.js, and cloud technologies. I love solving complex problems and mentoring junior developers.",
    timeline: [
      {
        year: "2024",
        role: "Senior Full-Stack Developer",
        company: "TechCorp Solutions",
        location: "San Francisco, CA",
        description: "Leading a team of 5 developers building enterprise SaaS platforms. Architected microservices handling 1M+ requests daily.",
        achievements: ["Improved system performance by 40%", "Mentored 3 junior developers", "Led migration to cloud infrastructure"]
      },
      {
        year: "2022",
        role: "Full-Stack Developer",
        company: "StartupX",
        location: "Austin, TX",
        description: "Developed core features for a fintech startup, working with React, Node.js, and PostgreSQL. Built the entire user authentication and payment systems.",
        achievements: ["Built payment system processing $1M+ monthly", "Reduced load times by 60%", "Implemented automated testing"]
      },
      {
        year: "2020",
        role: "Frontend Developer",
        company: "WebAgency Pro",
        location: "Remote",
        description: "Created responsive web applications for various clients. Specialized in React and modern CSS frameworks.",
        achievements: ["Delivered 15+ client projects", "Achieved 98% client satisfaction", "Introduced modern development practices"]
      },
      {
        year: "2019",
        role: "Junior Developer",
        company: "LocalTech Inc",
        location: "Denver, CO",
        description: "Started my professional journey building small business websites and learning industry best practices.",
        achievements: ["Completed 20+ small business websites", "Learned agile methodologies", "Gained SQL and backend experience"]
      }
    ]
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Journey</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold mb-3">About Me</h3>
          <p className="text-muted-foreground leading-relaxed">{journeyData.story}</p>
        </div>

        <div>
          <h3 className="font-semibold mb-4">Career Timeline</h3>
          <div className="space-y-6">
            {journeyData.timeline.map((item, index) => (
              <div key={index} className="relative pl-6 border-l-2 border-primary/20 last:border-l-0">
                <div className="absolute -left-2 top-0 w-4 h-4 bg-primary rounded-full"></div>
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">{item.year}</Badge>
                    <h4 className="font-medium">{item.role}</h4>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Building className="w-3 h-3" />
                      {item.company}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {item.location}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                  <div className="space-y-1">
                    <h5 className="text-xs font-medium text-foreground">Key Achievements:</h5>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {item.achievements.map((achievement, achievementIndex) => (
                        <li key={achievementIndex} className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MyJourney;