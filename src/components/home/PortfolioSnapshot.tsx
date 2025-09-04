import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github, Eye } from "lucide-react";

const PortfolioSnapshot = () => {
  const portfolioItems = [
    {
      id: 1,
      title: "E-commerce Platform",
      description: "Full-stack e-commerce solution with React, Node.js, and MongoDB",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
      technologies: ["React", "Node.js", "MongoDB", "Stripe"],
      category: "Web Development",
      status: "Live",
      views: 1250,
      likes: 89,
      demoUrl: "#",
      githubUrl: "#"
    },
    {
      id: 2,
      title: "Mobile Banking App",
      description: "Secure mobile banking application with biometric authentication",
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop",
      technologies: ["React Native", "Firebase", "TypeScript"],
      category: "Mobile Development",
      status: "In Progress",
      views: 876,
      likes: 67,
      demoUrl: "#",
      githubUrl: "#"
    },
    {
      id: 3,
      title: "AI Content Generator",
      description: "AI-powered tool for generating marketing content using GPT models",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop",
      technologies: ["Python", "OpenAI API", "FastAPI", "React"],
      category: "AI/ML",
      status: "Live",
      views: 2100,
      likes: 156,
      demoUrl: "#",
      githubUrl: "#"
    }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge className="mb-4">Portfolio Highlights</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Featured Projects
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Showcase of my recent work and achievements in various domains of technology and design.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {portfolioItems.map((item) => (
            <Card key={item.id} className="group hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 overflow-hidden bg-card">
              <div className="relative overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                  <Button size="sm" variant="secondary" className="bg-white/90 text-black hover:bg-white">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Demo
                  </Button>
                  <Button size="sm" variant="secondary" className="bg-white/90 text-black hover:bg-white">
                    <Github className="w-4 h-4 mr-2" />
                    Code
                  </Button>
                </div>
                
                <div className="absolute top-4 left-4">
                  <Badge className={`${
                    item.status === 'Live' ? 'bg-green-500' : 'bg-yellow-500'
                  } text-white`}>
                    {item.status}
                  </Badge>
                </div>
                
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="bg-black/50 text-white">
                    {item.category}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {item.description}
                </p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {item.technologies.map((tech) => (
                    <Badge key={tech} variant="outline" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{item.views} views</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>❤️ {item.likes}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg">
            View Full Portfolio
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PortfolioSnapshot;