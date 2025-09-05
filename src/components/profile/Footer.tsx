import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { 
  Github, 
  Linkedin, 
  Twitter, 
  Mail, 
  Phone, 
  MapPin, 
  Send,
  Heart,
  ExternalLink
} from "lucide-react";

const Footer = () => {
  const { toast } = useToast();
  const [newsletterEmail, setNewsletterEmail] = useState("");

  const socialLinks = [
    {
      platform: "GitHub",
      url: "https://github.com/johndeveloper",
      icon: Github,
      username: "@johndeveloper"
    },
    {
      platform: "LinkedIn",
      url: "https://linkedin.com/in/johndeveloper",
      icon: Linkedin,
      username: "John Developer"
    },
    {
      platform: "Twitter",
      url: "https://twitter.com/johndeveloper",
      icon: Twitter,
      username: "@johndev"
    },
    {
      platform: "Email",
      url: "mailto:john.developer@email.com",
      icon: Mail,
      username: "john.developer@email.com"
    }
  ];

  const quickLinks = [
    { label: "Portfolio", href: "#portfolio" },
    { label: "Skills", href: "#skills" },
    { label: "Experience", href: "#experience" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "Contact", href: "#contact" },
    { label: "Resume", href: "/resume-john-developer.pdf" }
  ];

  const services = [
    "Web Development",
    "Mobile App Development",
    "Full-Stack Solutions",
    "Technical Consulting",
    "Code Review & Mentoring",
    "System Architecture"
  ];

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    
    if (!newsletterEmail) {
      toast({
        title: "Email Required",
        description: "Please enter your email address to subscribe.",
        variant: "destructive"
      });
      return;
    }

    // In a real application, you would send this to your backend
    console.log("Newsletter subscription:", newsletterEmail);
    
    toast({
      title: "Successfully Subscribed!",
      description: "Thank you for subscribing to my newsletter. You'll receive updates about new projects and tech insights.",
    });

    setNewsletterEmail("");
  };

  return (
    <footer className="bg-card border-t mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Brand & Contact Info */}
          <div className="lg:col-span-1 space-y-4">
            <div>
              <h3 className="text-xl font-bold text-foreground mb-2">John Developer</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Full-Stack Developer crafting digital experiences with modern technologies.
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>San Francisco, CA</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>john.developer@email.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Services</h4>
            <ul className="space-y-2">
              {services.map((service, index) => (
                <li key={index} className="text-sm text-muted-foreground">
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter & Social */}
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-foreground mb-4">Stay Updated</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Subscribe to get updates on new projects and tech insights.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="text-sm"
                />
                <Button type="submit" size="sm" className="w-full">
                  <Send className="w-3 h-3 mr-2" />
                  Subscribe
                </Button>
              </form>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Connect</h4>
              <div className="grid grid-cols-2 gap-2">
                {socialLinks.map((social, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className="justify-start h-auto p-2"
                    asChild
                  >
                    <a href={social.url} target="_blank" rel="noopener noreferrer">
                      <social.icon className="w-4 h-4 mr-2" />
                      <div className="text-left">
                        <div className="text-xs font-medium">{social.platform}</div>
                        <div className="text-xs text-muted-foreground">{social.username}</div>
                      </div>
                      <ExternalLink className="w-3 h-3 ml-auto opacity-50" />
                    </a>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              <p className="flex items-center gap-1">
                © 2024 John Developer. Made with 
                <Heart className="w-3 h-3 text-red-500 fill-current" />
                using React & TypeScript.
              </p>
            </div>
            
            <div className="flex items-center gap-6 text-sm">
              <a href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </a>
              <a href="/sitemap" className="text-muted-foreground hover:text-foreground transition-colors">
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;