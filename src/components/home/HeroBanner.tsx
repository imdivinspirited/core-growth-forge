import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Briefcase, User, ArrowRight, Sparkles } from "lucide-react";

const HeroBanner = () => {
  const [selectedRole, setSelectedRole] = useState<string>("");

  const roles = [
    {
      id: "explorer",
      title: "Explorer",
      description: "Discover amazing destinations and cultures",
      icon: User,
      color: "bg-gradient-to-br from-blue-500 to-cyan-400"
    },
    {
      id: "traveler",
      title: "Traveler",
      description: "Plan and share your journey experiences",
      icon: GraduationCap,
      color: "bg-gradient-to-br from-emerald-500 to-teal-400"
    },
    {
      id: "wanderer",
      title: "Wanderer",
      description: "Connect with fellow adventurers worldwide",
      icon: Briefcase,
      color: "bg-gradient-to-br from-purple-500 to-pink-400"
    }
  ];

  return (
    <section className="relative bg-gradient-to-br from-primary via-accent to-primary dark:from-primary/80 dark:via-accent/80 dark:to-primary/80 text-white overflow-hidden min-h-[600px]">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-white/5 animate-gradient" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.2'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>
      
      {/* Decorative Gradient Orbs */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-accent/30 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      
      <div className="container mx-auto px-4 py-20 lg:py-32 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30">
              <Sparkles className="w-4 h-4 mr-2" />
              Welcome to Your Personal Brand
            </Badge>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight animate-fade-in">
              Discover Your Next
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 animate-gradient">
                Adventure Awaits
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/95 mb-8 max-w-3xl mx-auto animate-slide-up">
              Join a vibrant community of travelers, share experiences, and explore destinations with AI-powered recommendations tailored just for you.
            </p>
          </div>

          {/* Role Selection */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-center mb-8">Choose Your Path</h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {roles.map((role) => {
                const IconComponent = role.icon;
                const isSelected = selectedRole === role.id;
                
                return (
                  <Card 
                    key={role.id}
                    className={`p-6 cursor-pointer transition-all duration-300 hover:scale-105 bg-white/10 dark:bg-white/5 backdrop-blur-md border-white/20 dark:border-white/10 hover:shadow-strong ${
                      isSelected ? 'ring-2 ring-white dark:ring-white/80 bg-white/20 dark:bg-white/10' : 'hover:bg-white/15 dark:hover:bg-white/10'
                    }`}
                    onClick={() => setSelectedRole(role.id)}
                  >
                    <div className="text-center text-white">
                      <div className={`w-16 h-16 ${role.color} rounded-full flex items-center justify-center mx-auto mb-4 shadow-medium`}>
                        <IconComponent className="w-8 h-8 text-white drop-shadow-lg" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{role.title}</h3>
                      <p className="text-white/90 dark:text-white/80 text-sm">{role.description}</p>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 dark:bg-white dark:text-primary dark:hover:bg-white/95 text-lg px-8 py-3 shadow-strong hover:shadow-medium transition-all"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-white/70 dark:border-white/60 text-white hover:bg-white/20 dark:hover:bg-white/10 text-lg px-8 py-3 backdrop-blur-sm"
              >
                Watch Demo
              </Button>
            </div>
            <p className="text-white/70 text-sm mt-4">
              No credit card required • Free 14-day trial
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;