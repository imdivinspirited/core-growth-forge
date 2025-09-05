import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Award, Calendar, Clock, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const ContinuousLearning = () => {
  const certificates = [
    {
      name: "AWS Certified Solutions Architect",
      organization: "Amazon Web Services",
      date: "2024-01-15",
      credentialId: "AWS-SA-123456",
      status: "Active",
      verifyUrl: "https://aws.amazon.com/verification/ABC123"
    },
    {
      name: "React Advanced Patterns",
      organization: "Frontend Masters",
      date: "2023-11-20",
      credentialId: "FM-REACT-789",
      status: "Active",
      verifyUrl: "https://frontendmasters.com/certificates/ABC"
    },
    {
      name: "Node.js Application Development",
      organization: "The Linux Foundation",
      date: "2023-08-10",
      credentialId: "LF-NODE-456",
      status: "Active",
      verifyUrl: "https://trainingportal.linuxfoundation.org/certificate"
    },
    {
      name: "MongoDB Certified Developer",
      organization: "MongoDB University",
      date: "2023-05-22",
      credentialId: "MONGO-DEV-321",
      status: "Active",
      verifyUrl: "https://university.mongodb.com/certificate"
    }
  ];

  const currentCourses = [
    {
      title: "Advanced TypeScript Techniques",
      provider: "TypeScript Deep Dive",
      progress: 75,
      estimatedCompletion: "2024-02-15",
      status: "In Progress"
    },
    {
      title: "Kubernetes for Developers",
      provider: "Cloud Native Computing Foundation",
      progress: 45,
      estimatedCompletion: "2024-03-01",
      status: "In Progress"
    },
    {
      title: "System Design Interview Prep",
      provider: "Educative",
      progress: 90,
      estimatedCompletion: "2024-01-30",
      status: "Almost Complete"
    }
  ];

  const badges = [
    { name: "JavaScript Expert", level: "Advanced", earned: "2023-12-01" },
    { name: "React Specialist", level: "Expert", earned: "2023-10-15" },
    { name: "Full-Stack Developer", level: "Senior", earned: "2023-09-20" },
    { name: "Open Source Contributor", level: "Active", earned: "2023-08-05" },
    { name: "Problem Solver", level: "Advanced", earned: "2023-07-12" },
    { name: "Team Leader", level: "Experienced", earned: "2023-06-30" }
  ];

  const getBadgeColor = (level) => {
    switch (level) {
      case "Expert": return "bg-purple-100 text-purple-800 border-purple-200";
      case "Advanced": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Senior": return "bg-green-100 text-green-800 border-green-200";
      case "Experienced": return "bg-orange-100 text-orange-800 border-orange-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 60) return "bg-blue-500";
    if (progress >= 40) return "bg-yellow-500";
    return "bg-orange-500";
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Continuous Learning</h2>
        <p className="text-muted-foreground">My commitment to staying current with technology trends</p>
      </div>

      {/* Certificates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Professional Certificates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {certificates.map((cert, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{cert.name}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{cert.organization}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(cert.date).toLocaleDateString()}
                    </div>
                    <span>ID: {cert.credentialId}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{cert.status}</Badge>
                  <Button size="sm" variant="outline" asChild>
                    <a href={cert.verifyUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Verify
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Courses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Current Learning
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {currentCourses.map((course, index) => (
              <div key={index} className="space-y-3 p-4 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{course.title}</h4>
                    <p className="text-sm text-muted-foreground">{course.provider}</p>
                  </div>
                  <Badge variant="outline">{course.status}</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(course.progress)}`}
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Expected completion: {new Date(course.estimatedCompletion).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievement Badges */}
      <Card>
        <CardHeader>
          <CardTitle>Achievement Badges</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {badges.map((badge, index) => (
              <div key={index} className="text-center p-4 border rounded-lg">
                <div className="w-12 h-12 mx-auto mb-2 bg-primary/10 rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-medium text-sm mb-1">{badge.name}</h4>
                <div className={`inline-flex px-2 py-1 rounded-full text-xs border ${getBadgeColor(badge.level)}`}>
                  {badge.level}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(badge.earned).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContinuousLearning;