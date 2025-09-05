import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const SkillsTechnologies = () => {
  const skillCategories = {
    frontend: {
      title: "Frontend Technologies",
      skills: [
        { name: "React", level: 95, experience: "5 years" },
        { name: "TypeScript", level: 90, experience: "4 years" },
        { name: "Next.js", level: 85, experience: "3 years" },
        { name: "Tailwind CSS", level: 90, experience: "3 years" },
        { name: "JavaScript (ES6+)", level: 95, experience: "5 years" },
        { name: "HTML5 & CSS3", level: 95, experience: "6 years" },
        { name: "Vue.js", level: 70, experience: "2 years" },
        { name: "Sass/SCSS", level: 85, experience: "4 years" }
      ]
    },
    backend: {
      title: "Backend Technologies",
      skills: [
        { name: "Node.js", level: 90, experience: "4 years" },
        { name: "Express.js", level: 85, experience: "4 years" },
        { name: "PostgreSQL", level: 80, experience: "3 years" },
        { name: "MongoDB", level: 75, experience: "3 years" },
        { name: "Redis", level: 70, experience: "2 years" },
        { name: "GraphQL", level: 75, experience: "2 years" },
        { name: "REST APIs", level: 90, experience: "4 years" },
        { name: "Python", level: 65, experience: "2 years" }
      ]
    },
    tools: {
      title: "Tools & DevOps",
      skills: [
        { name: "Git & GitHub", level: 95, experience: "5 years" },
        { name: "Docker", level: 80, experience: "3 years" },
        { name: "AWS", level: 75, experience: "2 years" },
        { name: "Vercel", level: 85, experience: "3 years" },
        { name: "Jest & Testing", level: 80, experience: "3 years" },
        { name: "Webpack", level: 75, experience: "3 years" },
        { name: "CI/CD", level: 70, experience: "2 years" },
        { name: "Figma", level: 80, experience: "4 years" }
      ]
    },
    mobile: {
      title: "Mobile Development",
      skills: [
        { name: "React Native", level: 80, experience: "3 years" },
        { name: "Expo", level: 85, experience: "3 years" },
        { name: "Flutter", level: 60, experience: "1 year" },
        { name: "Mobile UI/UX", level: 75, experience: "3 years" }
      ]
    }
  };

  const getSkillColor = (level) => {
    if (level >= 90) return "bg-green-500";
    if (level >= 80) return "bg-blue-500";
    if (level >= 70) return "bg-yellow-500";
    return "bg-orange-500";
  };

  const SkillCard = ({ category, data }) => (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{data.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.skills.map((skill, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-sm">{skill.name}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {skill.experience}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{skill.level}%</span>
                </div>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${getSkillColor(skill.level)}`}
                  style={{ width: `${skill.level}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Skills & Technologies</h2>
        <p className="text-muted-foreground">My technical expertise across different domains</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <SkillCard category="frontend" data={skillCategories.frontend} />
        <SkillCard category="backend" data={skillCategories.backend} />
        <SkillCard category="tools" data={skillCategories.tools} />
        <SkillCard category="mobile" data={skillCategories.mobile} />
      </div>

      {/* Summary Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Technical Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">5+</div>
              <div className="text-sm text-muted-foreground">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">25+</div>
              <div className="text-sm text-muted-foreground">Technologies</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">50+</div>
              <div className="text-sm text-muted-foreground">Projects Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">98%</div>
              <div className="text-sm text-muted-foreground">Client Satisfaction</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SkillsTechnologies;