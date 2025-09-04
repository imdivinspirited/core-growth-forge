import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Star, BookOpen, Video, Wrench } from "lucide-react";

const FeaturedContent = () => {
  const featuredItems = [
    {
      id: 1,
      type: "course",
      title: "Advanced React Development",
      description: "Master modern React patterns, hooks, and performance optimization techniques.",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=240&fit=crop",
      duration: "12 hours",
      students: 2834,
      rating: 4.8,
      price: "$89",
      category: "Development",
      icon: BookOpen,
      level: "Advanced"
    },
    {
      id: 2,
      type: "blog",
      title: "Building a Personal Brand in Tech",
      description: "Comprehensive guide to establishing your professional presence in the technology industry.",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=240&fit=crop",
      readTime: "8 min read",
      views: 15600,
      category: "Career",
      icon: BookOpen,
      featured: true
    },
    {
      id: 3,
      type: "workshop",
      title: "Portfolio Design Workshop",
      description: "Hands-on workshop to create stunning portfolios that get noticed by employers.",
      image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=240&fit=crop",
      duration: "3 hours",
      participants: 45,
      date: "Dec 15, 2024",
      price: "$49",
      category: "Design",
      icon: Wrench,
      live: true
    }
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case "course": return BookOpen;
      case "blog": return BookOpen;
      case "workshop": return Video;
      default: return BookOpen;
    }
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge className="mb-4">Featured Content</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Trending Learning Resources
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover our most popular courses, insightful blogs, and interactive workshops curated for your growth.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {featuredItems.map((item) => {
            const IconComponent = getIcon(item.type);
            
            return (
              <Card key={item.id} className="group hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 bg-card">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className={`${
                      item.type === 'course' ? 'bg-blue-500' :
                      item.type === 'blog' ? 'bg-green-500' : 'bg-purple-500'
                    } text-white`}>
                      <IconComponent className="w-3 h-3 mr-1" />
                      {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                    </Badge>
                  </div>
                  {item.featured && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-yellow-500 text-black">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    </div>
                  )}
                  {item.live && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-red-500 text-white animate-pulse">
                        Live
                      </Badge>
                    </div>
                  )}
                </div>

                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">{item.category}</Badge>
                    {item.level && (
                      <Badge variant="outline">{item.level}</Badge>
                    )}
                  </div>
                  <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-3">
                    {item.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {item.duration && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {item.duration}
                      </div>
                    )}
                    {item.readTime && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {item.readTime}
                      </div>
                    )}
                    {item.students && (
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {item.students.toLocaleString()}
                      </div>
                    )}
                    {item.views && (
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {item.views.toLocaleString()} views
                      </div>
                    )}
                    {item.participants && (
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {item.participants} spots left
                      </div>
                    )}
                  </div>
                  
                  {item.rating && (
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="font-medium">{item.rating}</span>
                      </div>
                    </div>
                  )}
                </CardContent>

                <CardFooter className="pt-0">
                  <div className="w-full flex items-center justify-between">
                    <div className="text-lg font-bold text-primary">
                      {item.price || "Free"}
                    </div>
                    <Button className="group-hover:bg-primary group-hover:text-primary-foreground">
                      {item.type === 'course' ? 'Enroll Now' : 
                       item.type === 'blog' ? 'Read More' : 'Join Workshop'}
                    </Button>
                  </div>
                  {item.date && (
                    <div className="w-full text-sm text-muted-foreground mt-2">
                      Starts {item.date}
                    </div>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            View All Content
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedContent;