import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Linkedin, Github, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";

const ContactInfo = ({ profile, onUpdate }) => {
  const contactDetails = {
    email: profile?.email || "john.developer@email.com",
    phone: profile?.phone || "+1 (555) 123-4567",
    location: "San Francisco, CA",
    socialLinks: [
      { platform: "LinkedIn", url: "https://linkedin.com/in/johndeveloper", icon: Linkedin },
      { platform: "GitHub", url: "https://github.com/johndeveloper", icon: Github },
      { platform: "Twitter", url: "https://twitter.com/johndeveloper", icon: Twitter },
    ]
  };

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-5 h-5" />
          Contact Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span>{contactDetails.email}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Phone className="w-4 h-4 text-muted-foreground" />
            <span>{contactDetails.phone}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span>{contactDetails.location}</span>
          </div>
        </div>

        <div className="pt-4 border-t">
          <h4 className="font-medium mb-3">Social Links</h4>
          <div className="space-y-2">
            {contactDetails.socialLinks.map((link, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start h-auto p-2"
                asChild
              >
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  <link.icon className="w-4 h-4 mr-2" />
                  {link.platform}
                </a>
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactInfo;