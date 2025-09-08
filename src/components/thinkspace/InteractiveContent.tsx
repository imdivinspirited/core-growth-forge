import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Code, 
  Play, 
  CheckCircle, 
  BarChart3, 
  BookOpen, 
  Lightbulb,
  Clock,
  Star
} from "lucide-react";

interface InteractiveContentProps {
  blogId: string;
  blogTitle: string;
}

export const InteractiveContent = ({ blogId, blogTitle }: InteractiveContentProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [codeOutput, setCodeOutput] = useState("");

  // Dummy quiz data
  const quizQuestions = [
    {
      question: "What is the main benefit of React components?",
      options: ["Reusability", "Performance", "Security", "All of the above"],
      correct: 3
    },
    {
      question: "Which hook is used for state management?",
      options: ["useEffect", "useState", "useContext", "useCallback"],
      correct: 1
    }
  ];

  // Dummy code snippet
  const codeSnippet = `// React Component Example
function Welcome(props) {
  return <h1>Hello, {props.name}!</h1>;
}

// Usage
<Welcome name="Developer" />`;

  // TL;DR Summary data
  const tldrPoints = [
    "React components promote code reusability",
    "Hooks make state management easier",
    "JSX syntax combines HTML and JavaScript",
    "Virtual DOM improves performance"
  ];

  const handleQuizAnswer = (answerIndex: number) => {
    const newAnswers = [...quizAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setQuizAnswers(newAnswers);

    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const runCode = () => {
    setCodeOutput("Hello, Developer!");
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setQuizAnswers([]);
    setShowResults(false);
  };

  const correctAnswers = quizAnswers.filter((answer, index) => 
    answer === quizQuestions[index].correct
  ).length;

  const quizScore = Math.round((correctAnswers / quizQuestions.length) * 100);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Interactive Content</h3>
        <Badge variant="secondary">Enhanced Learning</Badge>
      </div>

      <Tabs defaultValue="tldr" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tldr">TL;DR</TabsTrigger>
          <TabsTrigger value="quiz">Quiz</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
        </TabsList>

        {/* TL;DR Summary */}
        <TabsContent value="tldr">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                TL;DR Summary
                <Badge variant="outline">
                  <Clock className="h-3 w-3 mr-1" />
                  2 min read
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {tldrPoints.map((point, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">{point}</p>
                </div>
              ))}
              <Separator className="my-4" />
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Star className="h-3 w-3" />
                Key takeaway: Focus on component-based architecture for scalable applications
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Interactive Quiz */}
        <TabsContent value="quiz">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Knowledge Check
                <Badge variant="secondary">
                  {currentQuestionIndex + 1} of {quizQuestions.length}
                </Badge>
              </CardTitle>
              {!showResults && (
                <Progress 
                  value={((currentQuestionIndex + 1) / quizQuestions.length) * 100} 
                  className="w-full"
                />
              )}
            </CardHeader>
            <CardContent>
              {!showResults ? (
                <div className="space-y-4">
                  <h4 className="font-medium">
                    {quizQuestions[currentQuestionIndex].question}
                  </h4>
                  <div className="grid gap-2">
                    {quizQuestions[currentQuestionIndex].options.map((option, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="justify-start text-left h-auto p-3"
                        onClick={() => handleQuizAnswer(index)}
                      >
                        <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                        {option}
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div className="text-2xl font-bold">
                    {quizScore}% Score
                  </div>
                  <p className="text-muted-foreground">
                    You got {correctAnswers} out of {quizQuestions.length} questions correct!
                  </p>
                  <div className="flex gap-2 justify-center">
                    <Badge variant={quizScore >= 80 ? "default" : quizScore >= 60 ? "secondary" : "destructive"}>
                      {quizScore >= 80 ? "Excellent!" : quizScore >= 60 ? "Good Job!" : "Keep Learning!"}
                    </Badge>
                  </div>
                  <Button onClick={resetQuiz} variant="outline">
                    Retake Quiz
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Code Playground */}
        <TabsContent value="code">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Code Playground
                <Badge variant="outline">Interactive</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted rounded-lg p-4">
                <pre className="text-sm overflow-x-auto">
                  <code>{codeSnippet}</code>
                </pre>
              </div>
              <div className="flex items-center gap-2">
                <Button onClick={runCode} size="sm">
                  <Play className="h-4 w-4 mr-2" />
                  Run Code
                </Button>
                <Badge variant="secondary">JavaScript</Badge>
              </div>
              {codeOutput && (
                <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-3">
                  <div className="text-sm font-medium text-green-800 dark:text-green-200">Output:</div>
                  <div className="text-sm text-green-700 dark:text-green-300 mt-1">{codeOutput}</div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reading Statistics */}
        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Reading Analytics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">1.2k</div>
                  <div className="text-xs text-muted-foreground">Views</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">89%</div>
                  <div className="text-xs text-muted-foreground">Completion</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">4.8</div>
                  <div className="text-xs text-muted-foreground">Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">156</div>
                  <div className="text-xs text-muted-foreground">Bookmarks</div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Reading Progress</span>
                  <span>75%</span>
                </div>
                <Progress value={75} />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Quiz Completion</span>
                  <span>{showResults ? '100%' : '0%'}</span>
                </div>
                <Progress value={showResults ? 100 : 0} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};