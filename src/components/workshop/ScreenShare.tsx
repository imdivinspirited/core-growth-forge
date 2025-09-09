import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Monitor, MonitorOff, Share, Eye, Users } from "lucide-react";

export const ScreenShare = () => {
  const [isSharing, setIsSharing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);

  const handleStartSharing = () => {
    setIsSharing(true);
    // Placeholder for actual screen sharing logic
  };

  const handleStopSharing = () => {
    setIsSharing(false);
  };

  const handleStartViewing = () => {
    setIsViewing(true);
  };

  const handleStopViewing = () => {
    setIsViewing(false);
  };

  return (
    <Card className="border border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Monitor className="h-5 w-5" />
          Screen Share
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Share Your Screen */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Share Your Screen</h3>
            <p className="text-sm text-muted-foreground">
              Share your screen with workshop participants
            </p>
            <Button
              onClick={isSharing ? handleStopSharing : handleStartSharing}
              variant={isSharing ? "destructive" : "default"}
              className="w-full"
            >
              {isSharing ? (
                <>
                  <MonitorOff className="h-4 w-4 mr-2" />
                  Stop Sharing
                </>
              ) : (
                <>
                  <Share className="h-4 w-4 mr-2" />
                  Start Sharing
                </>
              )}
            </Button>
            {isSharing && (
              <Badge variant="default" className="w-full justify-center bg-green-500">
                <Users className="h-3 w-3 mr-1" />
                Sharing with 12 participants
              </Badge>
            )}
          </div>

          {/* View Shared Screen */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">View Instructor's Screen</h3>
            <p className="text-sm text-muted-foreground">
              View the instructor's shared screen
            </p>
            <Button
              onClick={isViewing ? handleStopViewing : handleStartViewing}
              variant={isViewing ? "outline" : "default"}
              className="w-full"
            >
              {isViewing ? (
                <>
                  <MonitorOff className="h-4 w-4 mr-2" />
                  Stop Viewing
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  View Screen
                </>
              )}
            </Button>
            {isViewing && (
              <Badge variant="default" className="w-full justify-center bg-blue-500">
                <Monitor className="h-3 w-3 mr-1" />
                Viewing Sarah's screen
              </Badge>
            )}
          </div>
        </div>

        {/* Screen Share Preview */}
        {(isSharing || isViewing) && (
          <div className="mt-6">
            <div className="relative aspect-video bg-muted rounded-lg overflow-hidden border border-border">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-2">
                  <Monitor className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {isSharing ? "Your screen is being shared" : "Viewing shared screen"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Screen sharing placeholder - real implementation would show actual screen content
                  </p>
                </div>
              </div>
              {isSharing && (
                <Badge className="absolute top-2 right-2 bg-red-500">
                  LIVE
                </Badge>
              )}
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground text-center">
          Screen sharing requires browser permissions and a secure connection
        </div>
      </CardContent>
    </Card>
  );
};