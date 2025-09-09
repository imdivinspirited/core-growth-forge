import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Star, ThumbsUp, ThumbsDown, MessageCircle } from "lucide-react";

interface FeedbackItem {
  id: string;
  author: string;
  rating: number;
  comment: string;
  timestamp: string;
  helpful: number;
}

const mockFeedback: FeedbackItem[] = [
  {
    id: "1",
    author: "Alex M.",
    rating: 5,
    comment: "Excellent workshop! The practical examples really helped me understand the concepts.",
    timestamp: "2 hours ago",
    helpful: 8
  },
  {
    id: "2",
    author: "Sarah K.",
    rating: 4,
    comment: "Great content, but could use more interactive exercises.",
    timestamp: "1 day ago",
    helpful: 5
  }
];

export const FeedbackPanel = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hoveredStar, setHoveredStar] = useState(0);

  const handleSubmitFeedback = () => {
    if (rating > 0) {
      // Handle feedback submission
      console.log("Feedback submitted:", { rating, comment });
      setRating(0);
      setComment("");
    }
  };

  const renderStars = (rating: number, interactive = false) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 cursor-pointer ${
          index < rating
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300"
        }`}
        onClick={interactive ? () => setRating(index + 1) : undefined}
        onMouseEnter={interactive ? () => setHoveredStar(index + 1) : undefined}
        onMouseLeave={interactive ? () => setHoveredStar(0) : undefined}
      />
    ));
  };

  return (
    <Card className="border border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Workshop Feedback
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Submit New Feedback */}
        <div className="space-y-4 p-4 border border-border rounded-lg bg-muted/30">
          <h3 className="font-semibold text-foreground">Rate this workshop</h3>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Your rating:</span>
            <div className="flex gap-1">
              {renderStars(hoveredStar || rating, true)}
            </div>
            {rating > 0 && (
              <span className="text-sm text-muted-foreground">
                ({rating} star{rating !== 1 ? 's' : ''})
              </span>
            )}
          </div>
          
          <Textarea
            placeholder="Share your thoughts about this workshop..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-[80px]"
          />
          
          <Button 
            onClick={handleSubmitFeedback}
            disabled={rating === 0}
            className="w-full"
          >
            Submit Feedback
          </Button>
        </div>

        {/* Existing Feedback */}
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground">Recent Feedback</h3>
          
          {mockFeedback.map((feedback) => (
            <div
              key={feedback.id}
              className="p-4 border border-border rounded-lg space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{feedback.author}</span>
                    <div className="flex items-center gap-1">
                      {renderStars(feedback.rating)}
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{feedback.timestamp}</span>
                </div>
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  {feedback.rating}/5
                </Badge>
              </div>
              
              <p className="text-sm text-muted-foreground">{feedback.comment}</p>
              
              <div className="flex items-center gap-2">
                <Button size="sm" variant="ghost" className="h-8 px-2">
                  <ThumbsUp className="h-3 w-3 mr-1" />
                  {feedback.helpful}
                </Button>
                <Button size="sm" variant="ghost" className="h-8 px-2">
                  <ThumbsDown className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Workshop Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">4.6</div>
            <div className="text-xs text-muted-foreground">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">47</div>
            <div className="text-xs text-muted-foreground">Total Reviews</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">94%</div>
            <div className="text-xs text-muted-foreground">Recommended</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
