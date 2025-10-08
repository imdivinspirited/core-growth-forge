import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Briefcase, User, ArrowRight, Sparkles } from "lucide-react";

const HeroBanner = () => {
  const [selectedRole, setSelectedRole] = useState<string>("");

  const roles = [
    {
      id: "normal",
      title: "Normal User",
      description: "Explore and discover new opportunities",
      icon: User,
      color: "bg-blue-gradient"
    },
    {
      id: "student",
      title: "Student",
      description: "Learn, grow, and build your future",
      icon: GraduationCap,
      color: "bg-green-500"
    },
    {
      id: "professional",
      title: "Professional",
      description: "Advance your career and expertise",
      icon: Briefcase,
      color: "bg-purple-500"
    }
  ];

  return (
    <section className="relative bg-hero-gradient text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-white/5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      <div className="container mx-auto px-4 py-20 lg:py-32 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30">
              <Sparkles className="w-4 h-4 mr-2" />
              Welcome to Your Personal Brand
            </Badge>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Build Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400">
                Professional Legacy
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
              Create, showcase, and grow your personal brand with our comprehensive platform designed for ambitious individuals.
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
                    className={`p-6 cursor-pointer transition-all duration-300 hover:scale-105 bg-white/10 backdrop-blur-sm border-white/20 ${
                      isSelected ? 'ring-2 ring-white bg-white/20' : 'hover:bg-white/20'
                    }`}
                    onClick={() => setSelectedRole(role.id)}
                  >
                    <div className="text-center text-white">
                      <div className={`w-16 h-16 ${role.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{role.title}</h3>
                      <p className="text-white/80 text-sm">{role.description}</p>
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
                className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-3"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-white/50 text-white hover:bg-white/10 text-lg px-8 py-3"
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