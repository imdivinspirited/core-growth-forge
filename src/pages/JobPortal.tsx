/**
 * JobPortal Page Component
 * 
 * A comprehensive job portal with listings, search, filters, and application management.
 * 
 * Concept: Feature-based page component with state management
 * Concept: React Query for data fetching (future implementation)
 * Concept: Responsive grid layout with Tailwind CSS
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Clock, 
  DollarSign,
  Filter,
  Building2,
  BookmarkPlus,
  ChevronRight,
  Star,
  Users,
  Zap,
  TrendingUp,
  Globe
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { PageTransition } from "@/components/animations/PageTransition";

/**
 * Job Interface
 * Concept: TypeScript interfaces for type safety
 */
interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: "full-time" | "part-time" | "contract" | "remote";
  salary: string;
  experience: string;
  posted: string;
  logo?: string;
  featured?: boolean;
  skills: string[];
  description: string;
}

/**
 * Mock job data (will be replaced with Supabase queries)
 */
const mockJobs: Job[] = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    company: "TechCorp Inc",
    location: "San Francisco, CA",
    type: "full-time",
    salary: "$120k - $180k",
    experience: "5+ years",
    posted: "2 days ago",
    featured: true,
    skills: ["React", "TypeScript", "Node.js", "GraphQL"],
    description: "Join our team to build cutting-edge web applications..."
  },
  {
    id: "2",
    title: "UX/UI Designer",
    company: "DesignHub",
    location: "Remote",
    type: "remote",
    salary: "$90k - $130k",
    experience: "3+ years",
    posted: "1 week ago",
    skills: ["Figma", "Adobe XD", "User Research", "Prototyping"],
    description: "Create beautiful and intuitive user experiences..."
  },
  {
    id: "3",
    title: "Full Stack Engineer",
    company: "StartupXYZ",
    location: "New York, NY",
    type: "full-time",
    salary: "$100k - $150k",
    experience: "4+ years",
    posted: "3 days ago",
    featured: true,
    skills: ["Python", "React", "PostgreSQL", "AWS"],
    description: "Build and scale our core platform infrastructure..."
  },
  {
    id: "4",
    title: "DevOps Engineer",
    company: "CloudNine Systems",
    location: "Austin, TX",
    type: "contract",
    salary: "$80/hr",
    experience: "6+ years",
    posted: "1 day ago",
    skills: ["Kubernetes", "Docker", "Terraform", "CI/CD"],
    description: "Design and implement cloud infrastructure..."
  },
  {
    id: "5",
    title: "Data Scientist",
    company: "AI Innovations",
    location: "Remote",
    type: "remote",
    salary: "$130k - $170k",
    experience: "4+ years",
    posted: "5 days ago",
    skills: ["Python", "Machine Learning", "TensorFlow", "SQL"],
    description: "Develop ML models to drive business insights..."
  },
  {
    id: "6",
    title: "Product Manager",
    company: "ProductPro",
    location: "Seattle, WA",
    type: "full-time",
    salary: "$140k - $190k",
    experience: "5+ years",
    posted: "1 week ago",
    skills: ["Agile", "Roadmapping", "User Stories", "Analytics"],
    description: "Lead product strategy and development..."
  }
];

const categories = [
  { name: "Technology", count: 1234, icon: Zap },
  { name: "Design", count: 567, icon: Star },
  { name: "Marketing", count: 890, icon: TrendingUp },
  { name: "Sales", count: 456, icon: Users },
  { name: "Remote", count: 2100, icon: Globe },
];

/**
 * Job Card Component
 * Concept: Reusable presentational component
 */
const JobCard = ({ job }: { job: Job }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <Card className={cn(
      "group cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-primary/30",
      job.featured && "border-primary/50 bg-gradient-to-br from-primary/5 to-transparent"
    )}>
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Company Logo */}
          <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
            <Building2 className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
          </div>
          
          {/* Job Details */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {job.featured && (
                <Badge variant="default" className="bg-primary/90 text-xs">
                  Featured
                </Badge>
              )}
              <Badge variant="outline" className="text-xs capitalize">
                {job.type.replace("-", " ")}
              </Badge>
            </div>
            
            <h3 className="font-semibold text-base sm:text-lg text-foreground group-hover:text-primary transition-colors truncate">
              {job.title}
            </h3>
            <p className="text-muted-foreground text-sm mb-3">{job.company}</p>
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {job.location}
              </span>
              <span className="flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5" />
                {job.salary}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {job.posted}
              </span>
            </div>
            
            {/* Skills */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {job.skills.slice(0, 4).map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs font-normal">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex sm:flex-col items-center gap-2 mt-2 sm:mt-0">
            <Button variant="ghost" size="icon" className="rounded-full">
              <BookmarkPlus className="w-4 h-4" />
            </Button>
            <Button size="sm" className="gap-1">
              Apply
              <ChevronRight className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

/**
 * Main Job Portal Component
 */
export default function JobPortal() {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("browse");

  // Filter jobs based on search and filters
  const filteredJobs = mockJobs.filter((job) => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = typeFilter === "all" || job.type === typeFilter;
    const matchesLocation = locationFilter === "all" || 
      (locationFilter === "remote" && job.type === "remote") ||
      job.location.toLowerCase().includes(locationFilter.toLowerCase());
    
    return matchesSearch && matchesType && matchesLocation;
  });

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5 overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto text-center"
            >
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                Find Your <span className="text-primary">Dream Job</span>
              </h1>
              <p className="text-muted-foreground text-base sm:text-lg mb-8">
                Discover thousands of opportunities from top companies worldwide
              </p>
              
              {/* Search Bar */}
              <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Job title, company, or skills..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 text-base"
                  />
                </div>
                <Button size="lg" className="h-12 px-8">
                  Search Jobs
                </Button>
              </div>
            </motion.div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 max-w-4xl mx-auto">
              {[
                { label: "Active Jobs", value: "10,000+" },
                { label: "Companies", value: "2,500+" },
                { label: "Job Seekers", value: "50,000+" },
                { label: "Hired This Month", value: "1,200+" }
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50"
                >
                  <p className="text-2xl sm:text-3xl font-bold text-primary">{stat.value}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="container mx-auto px-4 py-8 sm:py-12">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <TabsList className="w-full sm:w-auto">
                <TabsTrigger value="browse">Browse Jobs</TabsTrigger>
                <TabsTrigger value="saved">Saved</TabsTrigger>
                <TabsTrigger value="applied">Applied</TabsTrigger>
              </TabsList>

              {/* Filters */}
              <div className="flex flex-wrap gap-2">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[140px]">
                    <Briefcase className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Job Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="full-time">Full Time</SelectItem>
                    <SelectItem value="part-time">Part Time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger className="w-[140px]">
                    <MapPin className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="san francisco">San Francisco</SelectItem>
                    <SelectItem value="new york">New York</SelectItem>
                    <SelectItem value="austin">Austin</SelectItem>
                    <SelectItem value="seattle">Seattle</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" size="icon">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="grid lg:grid-cols-4 gap-6">
              {/* Sidebar - Categories */}
              <aside className="hidden lg:block">
                <Card className="sticky top-24">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Categories</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1">
                    {categories.map((cat) => {
                      const Icon = cat.icon;
                      return (
                        <button
                          key={cat.name}
                          className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-muted transition-colors text-sm"
                        >
                          <span className="flex items-center gap-2">
                            <Icon className="w-4 h-4 text-primary" />
                            {cat.name}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {cat.count}
                          </Badge>
                        </button>
                      );
                    })}
                  </CardContent>
                </Card>
              </aside>

              {/* Job Listings */}
              <div className="lg:col-span-3">
                <TabsContent value="browse" className="mt-0 space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-muted-foreground">
                      Showing {filteredJobs.length} jobs
                    </p>
                    <Select defaultValue="recent">
                      <SelectTrigger className="w-[150px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recent">Most Recent</SelectItem>
                        <SelectItem value="relevant">Most Relevant</SelectItem>
                        <SelectItem value="salary-high">Salary: High-Low</SelectItem>
                        <SelectItem value="salary-low">Salary: Low-High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    {filteredJobs.map((job) => (
                      <JobCard key={job.id} job={job} />
                    ))}
                  </div>

                  {filteredJobs.length === 0 && (
                    <div className="text-center py-12">
                      <Briefcase className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No jobs found</h3>
                      <p className="text-muted-foreground text-sm">
                        Try adjusting your search or filters
                      </p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="saved" className="mt-0">
                  <div className="text-center py-12">
                    <BookmarkPlus className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No saved jobs yet</h3>
                    <p className="text-muted-foreground text-sm">
                      Save jobs you're interested in to review later
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="applied" className="mt-0">
                  <div className="text-center py-12">
                    <Briefcase className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No applications yet</h3>
                    <p className="text-muted-foreground text-sm">
                      Start applying to jobs to track your progress here
                    </p>
                  </div>
                </TabsContent>
              </div>
            </div>
          </Tabs>
        </section>
      </div>
    </PageTransition>
  );
}
