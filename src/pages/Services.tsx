import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Code, 
  Palette, 
  Megaphone, 
  Users, 
  BookOpen, 
  Video,
  CheckCircle
} from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: Code,
      title: "Web Development",
      description: "Custom web applications built with modern technologies",
      features: ["React & TypeScript", "Full-stack Development", "API Integration", "Responsive Design"],
      color: "text-blue-500"
    },
    {
      icon: Palette,
      title: "UI/UX Design",
      description: "Beautiful and intuitive user interfaces",
      features: ["User Research", "Prototyping", "Visual Design", "Usability Testing"],
      color: "text-purple-500"
    },
    {
      icon: Megaphone,
      title: "Digital Marketing",
      description: "Strategic marketing to grow your online presence",
      features: ["SEO Optimization", "Content Strategy", "Social Media", "Analytics"],
      color: "text-pink-500"
    },
    {
      icon: Users,
      title: "Consulting",
      description: "Expert guidance for your tech journey",
      features: ["Tech Strategy", "Architecture Review", "Code Audits", "Team Training"],
      color: "text-green-500"
    },
    {
      icon: BookOpen,
      title: "Courses & Training",
      description: "Comprehensive learning programs",
      features: ["Live Sessions", "Hands-on Projects", "Mentorship", "Certificates"],
      color: "text-orange-500"
    },
    {
      icon: Video,
      title: "Content Creation",
      description: "Engaging content for your audience",
      features: ["Video Production", "Technical Writing", "Tutorials", "Documentation"],
      color: "text-red-500"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background py-16 px-4">
          <div className="container mx-auto max-w-6xl text-center">
            <h1 className="text-5xl font-bold mb-4">Our Services</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive solutions to help you achieve your goals and grow your business
            </p>
          </div>
        </div>

        {/* Services Grid */}
        <div className="container mx-auto max-w-6xl px-4 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, idx) => (
              <Card key={idx} className="hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4`}>
                    <service.icon className={`w-6 h-6 ${service.color}`} />
                  </div>
                  <CardTitle>{service.title}</CardTitle>
                  <p className="text-muted-foreground text-sm">{service.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, fidx) => (
                      <li key={fidx} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full">Learn More</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 py-16 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-muted-foreground mb-8">
              Let's discuss how we can help you achieve your goals
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">Contact Us</Button>
              <Button size="lg" variant="outline">View Portfolio</Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Services;