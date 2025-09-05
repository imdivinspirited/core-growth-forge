import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";

const Portfolio = () => {
  const projects = [
    {
      id: 1,
      title: "E-Commerce Platform",
      type: "Fullstack",
      description: "A complete e-commerce solution built with React, Node.js, and PostgreSQL. Features include payment processing, inventory management, and real-time notifications.",
      image: "/placeholder.svg",
      technologies: ["React", "Node.js", "PostgreSQL", "Stripe", "Socket.io"],
      liveUrl: "https://demo-ecommerce.com",
      githubUrl: "https://github.com/johndeveloper/ecommerce-platform",
      featured: true
    },
    {
      id: 2,
      title: "Task Management App",
      type: "Frontend",
      description: "A modern task management application with drag-and-drop functionality, real-time collaboration, and advanced filtering options.",
      image: "/placeholder.svg",
      technologies: ["React", "TypeScript", "Tailwind CSS", "Framer Motion"],
      liveUrl: "https://demo-taskapp.com",
      githubUrl: "https://github.com/johndeveloper/task-manager",
      featured: true
    },
    {
      id: 3,
      title: "Weather Mobile App",
      type: "Mobile",
      description: "Cross-platform mobile app providing detailed weather forecasts with beautiful animations and location-based services.",
      image: "/placeholder.svg",
      technologies: ["React Native", "Expo", "Weather API", "AsyncStorage"],
      liveUrl: "https://app-store-link.com",
      githubUrl: "https://github.com/johndeveloper/weather-app",
      featured: false
    },
    {
      id: 4,
      title: "Portfolio Website",
      type: "Frontend",
      description: "Personal portfolio website showcasing projects and skills with modern design and smooth animations.",
      image: "/placeholder.svg",
      technologies: ["Next.js", "Tailwind CSS", "Framer Motion", "MDX"],
      liveUrl: "https://johndeveloper.com",
      githubUrl: "https://github.com/johndeveloper/portfolio",
      featured: false
    }
  ];

  const featuredProjects = projects.filter(project => project.featured);
  const otherProjects = projects.filter(project => !project.featured);

  const ProjectCard = ({ project, featured = false }) => (
    <Card className={`group overflow-hidden ${featured ? 'md:col-span-2' : ''}`}>
      <div className="aspect-video bg-muted relative overflow-hidden">
        <img 
          src={project.image} 
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          <Button size="sm" variant="secondary" asChild>
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-1" />
              Live Demo
            </a>
          </Button>
          <Button size="sm" variant="secondary" asChild>
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
              <Github className="w-4 h-4 mr-1" />
              Code
            </a>
          </Button>
        </div>
      </div>
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{project.title}</CardTitle>
          <Badge variant="secondary">{project.type}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm mb-4">{project.description}</p>
        <div className="flex flex-wrap gap-1">
          {project.technologies.map((tech, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tech}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      {/* Featured Projects */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Featured Projects</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} featured />
          ))}
        </div>
      </section>

      {/* Other Projects */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Other Projects</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {otherProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Portfolio;
