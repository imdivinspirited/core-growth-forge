import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Github, Download, ExternalLink, GitBranch, Star, Users } from "lucide-react";

const GitHubResume = () => {
  const githubStats = {
    username: "johndeveloper",
    profileUrl: "https://github.com/johndeveloper",
    repositories: 42,
    followers: 156,
    following: 89,
    contributions: 1247,
    totalStars: 298,
    languages: ["JavaScript", "TypeScript", "Python", "Go"],
    topRepositories: [
      {
        name: "react-dashboard-kit",
        description: "A comprehensive React dashboard template with modern UI components",
        stars: 87,
        forks: 23,
        language: "TypeScript",
        url: "https://github.com/johndeveloper/react-dashboard-kit"
      },
      {
        name: "node-api-boilerplate",
        description: "Production-ready Node.js API boilerplate with authentication and testing",
        stars: 65,
        forks: 18,
        language: "JavaScript",
        url: "https://github.com/johndeveloper/node-api-boilerplate"
      },
      {
        name: "mobile-expense-tracker",
        description: "Cross-platform expense tracking app built with React Native",
        stars: 43,
        forks: 12,
        language: "JavaScript",
        url: "https://github.com/johndeveloper/mobile-expense-tracker"
      }
    ]
  };

  const experienceSummary = {
    totalExperience: "5+ years",
    currentRole: "Senior Full-Stack Developer",
    specializations: ["React Ecosystem", "Node.js Backend", "Cloud Architecture", "Mobile Development"],
    keyAchievements: [
      "Led development of 15+ production applications",
      "Mentored 8 junior developers",
      "Contributed to 25+ open source projects",
      "Architected systems serving 100K+ users"
    ]
  };

  const resumeUrl = "/resume-john-developer.pdf";

  return (
    <div className="space-y-6">
      {/* GitHub Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Github className="w-5 h-5" />
            GitHub Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">@{githubStats.username}</h3>
              <p className="text-sm text-muted-foreground">Open source contributor & maintainer</p>
            </div>
            <Button variant="outline" asChild>
              <a href={githubStats.profileUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Profile
              </a>
            </Button>
          </div>

          {/* GitHub Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{githubStats.repositories}</div>
              <div className="text-xs text-muted-foreground">Repositories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{githubStats.totalStars}</div>
              <div className="text-xs text-muted-foreground">Total Stars</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{githubStats.followers}</div>
              <div className="text-xs text-muted-foreground">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{githubStats.contributions}</div>
              <div className="text-xs text-muted-foreground">Contributions</div>
            </div>
          </div>

          {/* Top Repositories */}
          <div>
            <h4 className="font-medium mb-3">Popular Repositories</h4>
            <div className="space-y-3">
              {githubStats.topRepositories.map((repo, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h5 className="font-medium text-sm">{repo.name}</h5>
                      <p className="text-xs text-muted-foreground">{repo.description}</p>
                    </div>
                    <Button size="sm" variant="ghost" asChild>
                      <a href={repo.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </Button>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      {repo.language}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      {repo.stars}
                    </span>
                    <span className="flex items-center gap-1">
                      <GitBranch className="w-3 h-3" />
                      {repo.forks}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resume & Experience */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Resume & Experience
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <h3 className="font-medium">Professional Resume</h3>
              <p className="text-sm text-muted-foreground">Download my complete professional resume</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View
                </a>
              </Button>
              <Button size="sm" asChild>
                <a href={resumeUrl} download="John-Developer-Resume.pdf">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </a>
              </Button>
            </div>
          </div>

          {/* Experience Summary */}
          <div className="space-y-4">
            <h4 className="font-medium">Experience Summary</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h5 className="text-sm font-medium mb-2">Current Position</h5>
                <p className="text-sm text-muted-foreground">{experienceSummary.currentRole}</p>
                <p className="text-sm text-muted-foreground">{experienceSummary.totalExperience} of experience</p>
              </div>
              <div>
                <h5 className="text-sm font-medium mb-2">Specializations</h5>
                <div className="flex flex-wrap gap-1">
                  {experienceSummary.specializations.map((spec, index) => (
                    <span key={index} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div>
              <h5 className="text-sm font-medium mb-2">Key Achievements</h5>
              <ul className="space-y-1">
                {experienceSummary.keyAchievements.map((achievement, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    {achievement}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GitHubResume;