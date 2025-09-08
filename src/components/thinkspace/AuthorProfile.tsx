import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  MapPin, 
  Calendar, 
  BookOpen, 
  Heart, 
  Eye, 
  Award,
  Link as LinkIcon,
  Twitter,
  Github,
  Linkedin
} from "lucide-react";

interface AuthorProfileProps {
  author: {
    id: string;
    full_name?: string;
    username?: string;
    avatar_url?: string;
    bio?: string;
    location?: string;
    joined_date?: string;
    social_links?: {
      twitter?: string;
      github?: string;
      linkedin?: string;
      website?: string;
    };
  };
  stats?: {
    total_blogs: number;
    total_views: number;
    total_likes: number;
    followers: number;
  };
  isCompact?: boolean;
}

export const AuthorProfile = ({ 
  author, 
  stats = {
    total_blogs: 12,
    total_views: 15420,
    total_likes: 892,
    followers: 284
  },
  isCompact = false 
}: AuthorProfileProps) => {
  const authorName = author.full_name || author.username || 'Anonymous';
  const authorInitials = authorName.charAt(0).toUpperCase();
  
  // Mock data for demonstration
  const authorData = {
    bio: author.bio || "Passionate developer and technical writer sharing insights about modern web development, React, and JavaScript best practices.",
    location: "San Francisco, CA",
    joined_date: "January 2023",
    expertise: ["React", "TypeScript", "Node.js", "UI/UX"],
    achievements: [
      { name: "Top Writer", icon: Award, color: "text-yellow-500" },
      { name: "100+ Articles", icon: BookOpen, color: "text-blue-500" },
      { name: "10k+ Readers", icon: Eye, color: "text-green-500" }
    ],
    social_links: {
      twitter: "@developer",
      github: "developer",
      linkedin: "developer",
      website: "https://developer.com"
    }
  };

  if (isCompact) {
    return (
      <Card className="w-full">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={author.avatar_url} />
              <AvatarFallback>{authorInitials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium truncate">{authorName}</h4>
              <p className="text-sm text-muted-foreground">
                {stats.total_blogs} articles • {stats.followers} followers
              </p>
            </div>
            <Button size="sm" variant="outline">
              Follow
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <Avatar className="h-20 w-20 mx-auto mb-4">
          <AvatarImage src={author.avatar_url} />
          <AvatarFallback className="text-lg">{authorInitials}</AvatarFallback>
        </Avatar>
        
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">{authorName}</h3>
          <p className="text-sm text-muted-foreground">
            {authorData.bio}
          </p>
        </div>

        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
          {authorData.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {authorData.location}
            </div>
          )}
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Joined {authorData.joined_date}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary">{stats.total_blogs}</div>
            <div className="text-xs text-muted-foreground">Articles</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">{stats.followers}</div>
            <div className="text-xs text-muted-foreground">Followers</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">{stats.total_views.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Total Views</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600">{stats.total_likes}</div>
            <div className="text-xs text-muted-foreground">Total Likes</div>
          </div>
        </div>

        <Separator />

        {/* Expertise */}
        <div>
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <Award className="h-4 w-4" />
            Expertise
          </h4>
          <div className="flex flex-wrap gap-1">
            {authorData.expertise.map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div>
          <h4 className="font-medium mb-2">Achievements</h4>
          <div className="space-y-2">
            {authorData.achievements.map((achievement, index) => (
              <div key={index} className="flex items-center gap-2">
                <achievement.icon className={`h-4 w-4 ${achievement.color}`} />
                <span className="text-sm">{achievement.name}</span>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Social Links */}
        <div>
          <h4 className="font-medium mb-2">Connect</h4>
          <div className="flex gap-2">
            {authorData.social_links.twitter && (
              <Button size="sm" variant="outline" className="p-2">
                <Twitter className="h-4 w-4" />
              </Button>
            )}
            {authorData.social_links.github && (
              <Button size="sm" variant="outline" className="p-2">
                <Github className="h-4 w-4" />
              </Button>
            )}
            {authorData.social_links.linkedin && (
              <Button size="sm" variant="outline" className="p-2">
                <Linkedin className="h-4 w-4" />
              </Button>
            )}
            {authorData.social_links.website && (
              <Button size="sm" variant="outline" className="p-2">
                <LinkIcon className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button className="flex-1">
            <User className="h-4 w-4 mr-2" />
            Follow
          </Button>
          <Button variant="outline" className="flex-1">
            <Heart className="h-4 w-4 mr-2" />
            Support
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};