import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, MapPin, Linkedin, Github, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

const ContactInfo = ({ profile, onUpdate }) => {
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    // Fetch email from auth.users (secure source)
    const fetchUserEmail = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email || null);
      }
    };
    fetchUserEmail();
  }, []);

  const contactDetails = {
    email: userEmail || "Not provided",
    phone: "Available on request", // Phone removed from public profiles for privacy
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