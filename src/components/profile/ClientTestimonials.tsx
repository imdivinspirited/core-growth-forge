import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Quote, Building, Calendar } from "lucide-react";

const ClientTestimonials = () => {
  const testimonials = [
    {
      id: 1,
      clientName: "Sarah Johnson",
      clientRole: "CTO",
      company: "TechStartup Inc.",
      companyType: "Fintech",
      rating: 5,
      date: "2024-01-15",
      testimonial: "John delivered an exceptional e-commerce platform that exceeded our expectations. His attention to detail and technical expertise helped us launch on time and within budget. The system handles thousands of transactions daily without any issues.",
      projectType: "E-commerce Platform",
      duration: "6 months",
      featured: true
    },
    {
      id: 2,
      clientName: "Michael Chen",
      clientRole: "Product Manager",
      company: "GlobalCorp",
      companyType: "Enterprise",
      rating: 5,
      date: "2023-11-20",
      testimonial: "Working with John was a game-changer for our team. He not only built our React dashboard but also mentored our junior developers. His code quality and documentation are top-notch. Highly recommended!",
      projectType: "Dashboard Application",
      duration: "4 months",
      featured: true
    },
    {
      id: 3,
      clientName: "Emily Rodriguez",
      clientRole: "Founder",
      company: "HealthTech Solutions",
      companyType: "Healthcare",
      rating: 5,
      date: "2023-09-10",
      testimonial: "John built our mobile app from scratch and it's been running flawlessly for months. His expertise in React Native saved us significant development time. The app has great performance and user experience.",
      projectType: "Mobile Application",
      duration: "5 months",
      featured: false
    },
    {
      id: 4,
      clientName: "David Wilson",
      clientRole: "Tech Lead",
      company: "DataFlow Systems",
      companyType: "Analytics",
      rating: 5,
      date: "2023-07-05",
      testimonial: "John's full-stack development skills are impressive. He successfully integrated our complex data visualization requirements with a clean, intuitive interface. His problem-solving approach is methodical and effective.",
      projectType: "Data Visualization Platform",
      duration: "3 months",
      featured: false
    },
    {
      id: 5,
      clientName: "Lisa Thompson",
      clientRole: "CEO",
      company: "EduTech Innovations",
      companyType: "Education",
      rating: 5,
      date: "2023-05-18",
      testimonial: "Outstanding work on our learning management system. John understood our educational requirements perfectly and delivered a platform that our students and teachers love. Very professional and reliable.",
      projectType: "Learning Management System",
      duration: "7 months",
      featured: true
    },
    {
      id: 6,
      clientName: "Robert Kim",
      clientRole: "Engineering Manager",
      company: "CloudServ Pro",
      companyType: "Cloud Services",
      rating: 5,
      date: "2023-03-22",
      testimonial: "John helped us modernize our legacy system with cutting-edge technologies. His expertise in cloud architecture and modern development practices was invaluable. The new system is 3x faster than before.",
      projectType: "System Modernization",
      duration: "8 months",
      featured: false
    }
  ];

  const overallStats = {
    totalClients: 15,
    averageRating: 4.9,
    totalProjects: 25,
    repeatClients: 8,
    projectTypes: ["Web Applications", "Mobile Apps", "E-commerce", "Dashboards", "APIs"]
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const featuredTestimonials = testimonials.filter(t => t.featured);
  const otherTestimonials = testimonials.filter(t => !t.featured);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Client Testimonials</h2>
        <p className="text-muted-foreground">What my clients say about working with me</p>
      </div>

      {/* Overall Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Client Satisfaction Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{overallStats.totalClients}+</div>
              <div className="text-sm text-muted-foreground">Happy Clients</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{overallStats.averageRating}/5</div>
              <div className="text-sm text-muted-foreground">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{overallStats.totalProjects}+</div>
              <div className="text-sm text-muted-foreground">Projects Delivered</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{overallStats.repeatClients}</div>
              <div className="text-sm text-muted-foreground">Repeat Clients</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Featured Testimonials */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Featured Reviews</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {featuredTestimonials.map((testimonial) => (
            <Card key={testimonial.id} className="relative">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Building className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">{testimonial.clientName}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.clientRole}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Featured</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {renderStars(testimonial.rating)}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {new Date(testimonial.date).toLocaleDateString()}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Quote className="absolute -top-2 -left-2 w-6 h-6 text-muted-foreground/20" />
                  <p className="text-muted-foreground italic pl-4">"{testimonial.testimonial}"</p>
                </div>
                <div className="flex flex-wrap gap-2 pt-2 border-t">
                  <Badge variant="outline">{testimonial.projectType}</Badge>
                  <Badge variant="outline">{testimonial.companyType}</Badge>
                  <Badge variant="outline">{testimonial.duration}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Other Testimonials */}
      <section>
        <h3 className="text-xl font-semibold mb-4">More Reviews</h3>
        <div className="space-y-4">
          {otherTestimonials.map((testimonial) => (
            <Card key={testimonial.id}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Building className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{testimonial.clientName}</h4>
                        <p className="text-sm text-muted-foreground">
                          {testimonial.clientRole} at {testimonial.company}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {new Date(testimonial.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {renderStars(testimonial.rating)}
                    </div>
                    <p className="text-muted-foreground">"{testimonial.testimonial}"</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-xs">{testimonial.projectType}</Badge>
                      <Badge variant="outline" className="text-xs">{testimonial.duration}</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ClientTestimonials;
