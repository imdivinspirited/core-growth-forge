import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Briefcase, User, ArrowRight, Sparkles, Map, Plane, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroBanner = () => {
  const [selectedRole, setSelectedRole] = useState<string>("");
  const navigate = useNavigate();

  const roles = [
    {
      id: "explorer",
      title: "Explorer",
      description: "Discover amazing destinations and experiences",
      icon: Map,
      gradient: "from-emerald-500 to-teal-500"
    },
    {
      id: "traveler",
      title: "Traveler",
      description: "Share your journey with the world",
      icon: Plane,
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      id: "wanderer",
      title: "Wanderer",
      description: "Connect with fellow adventurers",
      icon: Globe,
      gradient: "from-purple-500 to-pink-500"
    }
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-accent to-primary bg-[length:200%_200%] animate-gradient">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M40 40c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8-8-3.6-8-8zm-16 0c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8-8-3.6-8-8z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      {/* Gradient Orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-accent/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/30 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 py-16 lg:py-24 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
              Your Ultimate Travel Companion
            </Badge>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-white">
              Explore the World,
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300">
                Share Your Story
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              Join a vibrant community of travelers. Discover destinations, share experiences, and get AI-powered recommendations tailored just for you.
            </p>
          </div>

          {/* Role Selection */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-center mb-8 text-white">Start Your Journey As</h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {roles.map((role) => {
                const IconComponent = role.icon;
                const isSelected = selectedRole === role.id;
                
                return (
                  <Card 
                    key={role.id}
                    className={`p-6 cursor-pointer transition-all duration-300 hover:scale-105 bg-white/10 backdrop-blur-md border-white/20 ${
                      isSelected ? 'ring-2 ring-white bg-white/20 shadow-strong' : 'hover:bg-white/15'
                    }`}
                    onClick={() => setSelectedRole(role.id)}
                  >
                    <div className="text-center text-white">
                      <div className={`w-16 h-16 bg-gradient-to-br ${role.gradient} rounded-full flex items-center justify-center mx-auto mb-4 shadow-medium`}>
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
                onClick={() => navigate("/tourism")}
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 shadow-strong hover:shadow-medium transition-all"
              >
                Explore Destinations
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                onClick={() => navigate("/auth")}
                variant="outline" 
                size="lg" 
                className="border-2 border-white/50 text-white hover:bg-white/10 text-lg px-8 py-6 backdrop-blur-sm"
              >
                Join Community
              </Button>
            </div>
            <p className="text-white/80 text-sm mt-6">
              Free to join • AI-powered recommendations • Real-time chat
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;