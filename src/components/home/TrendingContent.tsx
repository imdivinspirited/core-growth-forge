import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Clock, Users, Eye, ArrowUpRight } from "lucide-react";

const TrendingContent = () => {
  const trendingItems = [
    {
      id: 1,
      title: "The Rise of Remote Work Culture",
      type: "Article",
      author: "Sarah Johnson",
      readTime: "5 min read",
      views: 12450,
      engagement: 89,
      trend: "+24%",
      category: "Career",
      publishedAt: "2 hours ago",
      excerpt: "How remote work is reshaping professional relationships and productivity..."
    },
    {
      id: 2,
      title: "Mastering TypeScript Patterns",
      type: "Tutorial",
      author: "Alex Chen",
      readTime: "12 min read",
      views: 8230,
      engagement: 94,
      trend: "+18%",
      category: "Development",
      publishedAt: "5 hours ago",
      excerpt: "Advanced TypeScript patterns every developer should know for better code..."
    },
    {
      id: 3,
      title: "Design Systems in 2024",
      type: "Case Study",
      author: "Maria Rodriguez",
      readTime: "8 min read",
      views: 6750,
      engagement: 76,
      trend: "+15%",
      category: "Design",
      publishedAt: "1 day ago",
      excerpt: "How modern design systems are evolving to meet new challenges..."
    },
    {
      id: 4,
      title: "AI Tools for Productivity",
      type: "Guide",
      author: "David Kim",
      readTime: "7 min read",
      views: 15670,
      engagement: 92,
      trend: "+31%",
      category: "Technology",
      publishedAt: "6 hours ago",
      excerpt: "Discover the best AI-powered tools to supercharge your workflow..."
    },
    {
      id: 5,
      title: "Building Personal Brand",
      type: "Workshop",
      author: "Emma Wilson",
      readTime: "45 min",
      views: 4320,
      engagement: 88,
      trend: "+22%",
      category: "Career",
      publishedAt: "3 hours ago",
      excerpt: "Live workshop on establishing your professional presence online..."
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Article": return "bg-blue-500";
      case "Tutorial": return "bg-green-500";
      case "Case Study": return "bg-purple-500";
      case "Guide": return "bg-orange-500";
      case "Workshop": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge className="mb-4">
            <TrendingUp className="w-4 h-4 mr-2" />
            Trending Now
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What's Popular Today
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Stay updated with the most engaging content from our community of professionals and learners.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
          {/* Featured Trending Item */}
          <Card className="lg:col-span-2 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20 hover:shadow-card-hover transition-all duration-300">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Badge className={`${getTypeColor(trendingItems[0].type)} text-white`}>
                    {trendingItems[0].type}
                  </Badge>
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {trendingItems[0].trend} this week
                  </Badge>
                </div>
                <Badge variant="outline">Featured</Badge>
              </div>
              <CardTitle className="text-2xl hover:text-primary transition-colors cursor-pointer">
                {trendingItems[0].title}
              </CardTitle>
              <CardDescription className="text-base">
                {trendingItems[0].excerpt}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <span>By {trendingItems[0].author}</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {trendingItems[0].readTime}
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {trendingItems[0].views.toLocaleString()} views
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {trendingItems[0].engagement}% engagement
                  </div>
                </div>
                <Button>
                  Read More
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Other Trending Items */}
          {trendingItems.slice(1).map((item, index) => (
            <Card key={item.id} className="group hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 bg-card">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <Badge className={`${getTypeColor(item.type)} text-white text-xs`}>
                    {item.type}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {item.trend}
                  </Badge>
                </div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors cursor-pointer line-clamp-2">
                  {item.title}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {item.excerpt}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                  <span>By {item.author}</span>
                  <span>{item.publishedAt}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.readTime}
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {item.views.toLocaleString()}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Read
                    <ArrowUpRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            View All Trending Content
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TrendingContent;
