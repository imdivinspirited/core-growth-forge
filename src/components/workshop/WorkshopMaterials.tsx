import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Download, Link, Video, Code, MessageSquare } from "lucide-react";

interface Resource {
  id: string;
  title: string;
  type: "pdf" | "video" | "code" | "link";
  size?: string;
  downloadUrl: string;
}

interface QAItem {
  id: string;
  question: string;
  answer: string;
  author: string;
  timestamp: string;
}

const mockResources: Resource[] = [
  {
    id: "1",
    title: "React Advanced Patterns Guide",
    type: "pdf",
    size: "2.4 MB",
    downloadUrl: "#"
  },
  {
    id: "2",
    title: "Workshop Recording - Session 1",
    type: "video",
    size: "245 MB",
    downloadUrl: "#"
  },
  {
    id: "3",
    title: "Code Examples Repository",
    type: "code",
    downloadUrl: "#"
  },
  {
    id: "4",
    title: "Additional Reading Materials",
    type: "link",
    downloadUrl: "#"
  }
];

const mockQA: QAItem[] = [
  {
    id: "1",
    question: "How do we handle state management in large React applications?",
    answer: "For large applications, consider using Redux Toolkit or Zustand. Context API works well for smaller applications but can cause performance issues when overused.",
    author: "Sarah Chen",
    timestamp: "2 hours ago"
  },
  {
    id: "2",
    question: "What's the difference between useMemo and useCallback?",
    answer: "useMemo memoizes the result of a computation, while useCallback memoizes a function itself. Use useMemo for expensive calculations and useCallback for functions passed to child components.",
    author: "Sarah Chen",
    timestamp: "1 hour ago"
  }
];

export const WorkshopMaterials = () => {
  const getResourceIcon = (type: Resource["type"]) => {
    switch (type) {
      case "pdf": return <FileText className="h-4 w-4" />;
      case "video": return <Video className="h-4 w-4" />;
      case "code": return <Code className="h-4 w-4" />;
      case "link": return <Link className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getResourceTypeColor = (type: Resource["type"]) => {
    switch (type) {
      case "pdf": return "bg-red-100 text-red-800";
      case "video": return "bg-blue-100 text-blue-800";
      case "code": return "bg-green-100 text-green-800";
      case "link": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="border border-border">
      <CardHeader>
        <CardTitle>Workshop Materials & Q&A</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="resources" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="qa">Q&A Panel</TabsTrigger>
          </TabsList>
          
          <TabsContent value="resources" className="space-y-4">
            <div className="space-y-3">
              {mockResources.map((resource) => (
                <div
                  key={resource.id}
                  className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {getResourceIcon(resource.type)}
                    <div>
                      <h4 className="font-medium text-foreground">{resource.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className={getResourceTypeColor(resource.type)}>
                          {resource.type.toUpperCase()}
                        </Badge>
                        {resource.size && (
                          <span className="text-xs text-muted-foreground">{resource.size}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="qa" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span className="text-sm font-medium">Live Q&A Session</span>
                <Badge variant="default" className="bg-green-500">
                  Active
                </Badge>
              </div>
              
              <div className="space-y-3">
                {mockQA.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 border border-border rounded-lg space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <h4 className="font-medium text-foreground pr-4">{item.question}</h4>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {item.timestamp}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.answer}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        Answered by {item.author}
                      </span>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" className="h-6 px-2 text-xs">
                          👍 12
                        </Button>
                        <Button size="sm" variant="ghost" className="h-6 px-2 text-xs">
                          Reply
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4">
                <Button className="w-full" variant="outline">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Ask a Question
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};