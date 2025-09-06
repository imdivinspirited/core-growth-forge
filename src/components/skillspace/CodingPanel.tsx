import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Play, CheckCircle, XCircle, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const CodingPanel = ({ lesson, onComplete }) => {
  const [code, setCode] = useState(lesson.exercise_code || "");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const { toast } = useToast();

  const runCode = async () => {
    setIsRunning(true);
    setOutput("");

    try {
      // Simulate code execution for demo purposes
      setTimeout(() => {
        try {
          // For JavaScript, we can actually run simple code
          if (lesson.programming_language === 'javascript') {
            const result = eval(code);
            setOutput(result ? String(result) : "Code executed successfully!");
          } else {
            setOutput("Code compiled and executed successfully!\n\nThis is a demo output.");
          }
        } catch (error) {
          setOutput(`Error: ${error.message}`);
        }
        setIsRunning(false);
      }, 1000);

    } catch (error) {
      setOutput(`Error: ${error.message}`);
      setIsRunning(false);
    }
  };

  const resetCode = () => {
    setCode(lesson.exercise_code || "");
    setOutput("");
    setShowSolution(false);
  };

  const markAsComplete = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Please log in",
          description: "You need to be logged in to track progress",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          course_id: lesson.course_id,
          lesson_id: lesson.id,
          completed: true,
          completed_at: new Date().toISOString(),
          score: 100
        });

      if (error) throw error;

      toast({
        title: "Lesson completed!",
        description: "Great job! Your progress has been saved.",
      });

      if (onComplete) onComplete();
    } catch (error) {
      toast({
        title: "Error saving progress",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Exercise Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Play className="w-5 h-5" />
              Coding Exercise
            </CardTitle>
            <Badge variant="outline">
              {lesson.programming_language || 'javascript'}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Code Editor */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Code Editor</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetCode}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSolution(!showSolution)}
                >
                  {showSolution ? "Hide" : "Show"} Solution
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              value={showSolution ? lesson.solution_code : code}
              onChange={(e) => setCode(e.target.value)}
              className="min-h-[300px] font-mono text-sm"
              placeholder="Write your code here..."
              readOnly={showSolution}
            />
            <div className="flex gap-2 mt-4">
              <Button
                onClick={runCode}
                disabled={isRunning}
                className="flex-1"
              >
                {isRunning ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Run Code
                  </>
                )}
              </Button>
              <Button
                onClick={markAsComplete}
                variant="default"
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Complete
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Output Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Output</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-black text-green-400 p-4 rounded-md min-h-[300px] font-mono text-sm">
              {output || "Click 'Run Code' to see the output..."}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              {lesson.description}
            </p>
            <Separator />
            <div className="space-y-2">
              <h4 className="font-medium">Tips:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Read the instructions carefully before starting</li>
                <li>Test your code frequently as you write</li>
                <li>Don't hesitate to check the solution if you're stuck</li>
                <li>Practice makes perfect - try variations of the exercise</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CodingPanel;