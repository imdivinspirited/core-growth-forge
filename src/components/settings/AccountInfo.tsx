import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Camera, Save } from "lucide-react";

export const AccountInfo = () => {
  const [formData, setFormData] = useState({
    fullName: "John Smith",
    username: "johnsmith",
    bio: "Full Stack Developer passionate about creating innovative solutions. Always learning and exploring new technologies.",
    location: "San Francisco, CA"
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Handle save logic
    console.log("Saving account info:", formData);
  };

  return (
    <Card className="border border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Account Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile Picture */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="h-20 w-20">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>JS</AvatarFallback>
            </Avatar>
            <Button
              size="sm"
              variant="outline"
              className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full p-0"
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-foreground">Profile Picture</h3>
            <p className="text-sm text-muted-foreground">
              Upload a new profile picture
            </p>
            <div className="flex gap-2">
              <Badge variant="default">Pro Member</Badge>
              <Badge variant="outline">Level 12</Badge>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>

        {/* Account Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg">
          <div className="text-center">
            <div className="text-lg font-bold text-foreground">156</div>
            <div className="text-xs text-muted-foreground">Points</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-foreground">24</div>
            <div className="text-xs text-muted-foreground">Courses</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-foreground">8</div>
            <div className="text-xs text-muted-foreground">Badges</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-foreground">45</div>
            <div className="text-xs text-muted-foreground">Days Active</div>
          </div>
        </div>

        {/* Note about email/phone */}
        <div className="bg-muted/50 border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">
            <strong>Note:</strong> Email and phone number are managed through your authentication settings for security and privacy.
          </p>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};