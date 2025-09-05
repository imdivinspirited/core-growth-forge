import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Send, Calendar, MessageCircle, Phone } from "lucide-react";

const QuickContact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    inquiryType: "",
    message: "",
    preferredContact: "",
    timeline: ""
  });

  const inquiryTypes = [
    "Web Development",
    "Mobile App Development",
    "Full-Stack Project",
    "Consulting",
    "Code Review",
    "Technical Mentoring",
    "Other"
  ];

  const contactPreferences = [
    "Email",
    "Phone Call",
    "Video Meeting",
    "No Preference"
  ];

  const timelines = [
    "ASAP",
    "Within 1 week",
    "Within 1 month",
    "Within 3 months",
    "Just exploring"
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields (Name, Email, and Message).",
        variant: "destructive"
      });
      return;
    }

    // In a real application, you would send this data to your backend
    console.log("Contact form submitted:", formData);
    
    toast({
      title: "Message Sent Successfully!",
      description: "Thank you for reaching out. I'll get back to you within 24 hours.",
    });

    // Reset form
    setFormData({
      name: "",
      email: "",
      company: "",
      inquiryType: "",
      message: "",
      preferredContact: "",
      timeline: ""
    });
  };

  const quickActionButtons = [
    {
      icon: Calendar,
      label: "Schedule Call",
      description: "Book a free 30-min consultation",
      action: () => {
        toast({
          title: "Scheduling Feature",
          description: "This would open a calendar booking system in a real application.",
        });
      }
    },
    {
      icon: MessageCircle,
      label: "Live Chat",
      description: "Start an instant conversation",
      action: () => {
        toast({
          title: "Chat Feature",
          description: "This would open a live chat widget in a real application.",
        });
      }
    },
    {
      icon: Phone,
      label: "Call Now",
      description: "Direct phone line",
      action: () => {
        window.open("tel:+15551234567");
      }
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="w-5 h-5" />
          Quick Contact
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quick Action Buttons */}
        <div className="grid gap-3">
          <h4 className="text-sm font-medium">Quick Actions</h4>
          {quickActionButtons.map((button, index) => (
            <Button
              key={index}
              variant="outline"
              className="w-full justify-start h-auto p-3"
              onClick={button.action}
            >
              <button.icon className="w-4 h-4 mr-3 flex-shrink-0" />
              <div className="text-left">
                <div className="font-medium text-sm">{button.label}</div>
                <div className="text-xs text-muted-foreground">{button.description}</div>
              </div>
            </Button>
          ))}
        </div>

        <div className="border-t pt-6">
          <h4 className="text-sm font-medium mb-4">Send a Message</h4>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Your name"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="your.email@example.com"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => handleInputChange("company", e.target.value)}
                  placeholder="Your company name (optional)"
                />
              </div>
              
              <div>
                <Label htmlFor="inquiryType">Inquiry Type</Label>
                <Select onValueChange={(value) => handleInputChange("inquiryType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select inquiry type" />
                  </SelectTrigger>
                  <SelectContent>
                    {inquiryTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="timeline">Project Timeline</Label>
                <Select onValueChange={(value) => handleInputChange("timeline", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="When do you need this?" />
                  </SelectTrigger>
                  <SelectContent>
                    {timelines.map((timeline) => (
                      <SelectItem key={timeline} value={timeline}>
                        {timeline}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="preferredContact">Preferred Contact Method</Label>
                <Select onValueChange={(value) => handleInputChange("preferredContact", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="How should I contact you?" />
                  </SelectTrigger>
                  <SelectContent>
                    {contactPreferences.map((preference) => (
                      <SelectItem key={preference} value={preference}>
                        {preference}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  placeholder="Tell me about your project, goals, and any specific requirements..."
                  rows={4}
                  required
                />
              </div>
            </div>
            
            <Button type="submit" className="w-full">
              <Send className="w-4 h-4 mr-2" />
              Send Message
            </Button>
          </form>
        </div>

        <div className="text-xs text-muted-foreground">
          <p>* Required fields</p>
          <p>I typically respond within 24 hours during business days.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickContact;