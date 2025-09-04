import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Vote, 
  HelpCircle, 
  Users, 
  ThumbsUp, 
  MessageCircle, 
  Trophy,
  CheckCircle,
  Clock
} from "lucide-react";

const InteractiveElements = () => {
  const [selectedPollOption, setSelectedPollOption] = useState<string>("");
  const [quizAnswers, setQuizAnswers] = useState<{[key: string]: string}>({});
  const [showResults, setShowResults] = useState(false);

  const activePoll = {
    id: 1,
    question: "What's your biggest challenge in professional development?",
    totalVotes: 1247,
    options: [
      { id: "skill-gap", text: "Keeping up with new technologies", votes: 423, percentage: 34 },
      { id: "time-mgmt", text: "Managing time for learning", votes: 387, percentage: 31 },
      { id: "networking", text: "Building professional network", votes: 298, percentage: 24 },
      { id: "feedback", text: "Getting constructive feedback", votes: 139, percentage: 11 }
    ],
    endsAt: "2 days left"
  };

  const quiz = {
    id: 1,
    title: "Frontend Development Quick Quiz",
    description: "Test your knowledge of modern frontend development practices",
    totalQuestions: 3,
    timeLimit: "5 minutes",
    difficulty: "Intermediate",
    questions: [
      {
        id: "q1",
        question: "Which React hook is used for side effects?",
        options: ["useState", "useEffect", "useContext", "useMemo"],
        correct: "useEffect"
      },
      {
        id: "q2", 
        question: "What does CSS Grid provide that Flexbox doesn't?",
        options: ["1D layout", "2D layout", "Better browser support", "Smaller file size"],
        correct: "2D layout"
      },
      {
        id: "q3",
        question: "Which tool is commonly used for bundling JavaScript applications?",
        options: ["npm", "Git", "Webpack", "Docker"],
        correct: "Webpack"
      }
    ]
  };

  const handlePollVote = (optionId: string) => {
    setSelectedPollOption(optionId);
  };

  const handleQuizAnswer = (questionId: string, answer: string) => {
    setQuizAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const submitQuiz = () => {
    setShowResults(true);
  };

  const getQuizScore = () => {
    let correct = 0;
    quiz.questions.forEach(q => {
      if (quizAnswers[q.id] === q.correct) correct++;
    });
    return Math.round((correct / quiz.questions.length) * 100);
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge className="mb-4">
            <Vote className="w-4 h-4 mr-2" />
            Interactive Zone
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Engage & Learn
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Participate in polls, take quick quizzes, and connect with the community through interactive content.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Active Poll */}
          <Card className="bg-card hover:shadow-card-hover transition-all duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge className="bg-primary text-primary-foreground">
                  <Vote className="w-3 h-3 mr-1" />
                  Live Poll
                </Badge>
                <Badge variant="outline">
                  <Clock className="w-3 h-3 mr-1" />
                  {activePoll.endsAt}
                </Badge>
              </div>
              <CardTitle className="text-xl">
                {activePoll.question}
              </CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                {activePoll.totalVotes.toLocaleString()} votes so far
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {activePoll.options.map((option) => (
                <div 
                  key={option.id}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    selectedPollOption === option.id 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50 hover:bg-muted/50'
                  }`}
                  onClick={() => handlePollVote(option.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{option.text}</span>
                    <span className="text-sm text-muted-foreground">{option.percentage}%</span>
                  </div>
                  <Progress value={option.percentage} className="h-2" />
                  <div className="text-xs text-muted-foreground mt-1">
                    {option.votes} votes
                  </div>
                </div>
              ))}
              
              <div className="flex items-center justify-between pt-4">
                <Button 
                  disabled={!selectedPollOption}
                  className="flex-1 mr-2"
                >
                  {selectedPollOption ? 'Vote Submitted!' : 'Submit Vote'}
                </Button>
                <Button variant="outline" size="sm">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Discuss
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Quiz */}
          <Card className="bg-card hover:shadow-card-hover transition-all duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge className="bg-green-500 text-white">
                  <HelpCircle className="w-3 h-3 mr-1" />
                  Quick Quiz
                </Badge>
                <Badge variant="outline">{quiz.difficulty}</Badge>
              </div>
              <CardTitle className="text-xl">
                {quiz.title}
              </CardTitle>
              <CardDescription>
                {quiz.description}
              </CardDescription>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{quiz.totalQuestions} questions</span>
                <span>⏱️ {quiz.timeLimit}</span>
              </div>
            </CardHeader>
            <CardContent>
              {!showResults ? (
                <div className="space-y-6">
                  {quiz.questions.map((question, index) => (
                    <div key={question.id} className="space-y-3">
                      <h4 className="font-medium">
                        {index + 1}. {question.question}
                      </h4>
                      <div className="grid grid-cols-1 gap-2">
                        {question.options.map((option) => (
                          <Button
                            key={option}
                            variant={quizAnswers[question.id] === option ? "default" : "outline"}
                            size="sm"
                            className="justify-start text-left h-auto py-2"
                            onClick={() => handleQuizAnswer(question.id, option)}
                          >
                            {option}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  <Button 
                    onClick={submitQuiz}
                    disabled={Object.keys(quizAnswers).length < quiz.questions.length}
                    className="w-full"
                  >
                    Submit Quiz
                  </Button>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div className="text-6xl">
                    {getQuizScore() >= 80 ? '🏆' : getQuizScore() >= 60 ? '👍' : '💪'}
                  </div>
                  <h3 className="text-2xl font-bold">Quiz Complete!</h3>
                  <p className="text-lg">You scored {getQuizScore()}%</p>
                  <div className="space-y-2">
                    {quiz.questions.map((q, index) => (
                      <div key={q.id} className="flex items-center gap-2 text-sm">
                        {quizAnswers[q.id] === q.correct ? 
                          <CheckCircle className="w-4 h-4 text-green-500" /> :
                          <div className="w-4 h-4 rounded-full bg-red-500"></div>
                        }
                        <span>Question {index + 1}: {quizAnswers[q.id] === q.correct ? 'Correct' : 'Incorrect'}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => {setShowResults(false); setQuizAnswers({});}} variant="outline" className="flex-1">
                      Retake Quiz
                    </Button>
                    <Button className="flex-1">
                      View Explanation
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Community Engagement */}
        <div className="mt-12 max-w-4xl mx-auto">
          <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Trophy className="w-5 h-5" />
                Community Challenges
              </CardTitle>
              <CardDescription>
                Join ongoing challenges and compete with other learners
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-card rounded-lg">
                  <div className="text-2xl mb-2">🚀</div>
                  <h4 className="font-semibold">30-Day Coding</h4>
                  <p className="text-sm text-muted-foreground">Code daily for 30 days</p>
                  <Badge className="mt-2">245 participants</Badge>
                </div>
                <div className="text-center p-4 bg-card rounded-lg">
                  <div className="text-2xl mb-2">📚</div>
                  <h4 className="font-semibold">Read & Review</h4>
                  <p className="text-sm text-muted-foreground">Review 5 articles weekly</p>
                  <Badge className="mt-2">189 participants</Badge>
                </div>
                <div className="text-center p-4 bg-card rounded-lg">
                  <div className="text-2xl mb-2">🤝</div>
                  <h4 className="font-semibold">Mentor Match</h4>
                  <p className="text-sm text-muted-foreground">Help fellow learners</p>
                  <Badge className="mt-2">156 participants</Badge>
                </div>
              </div>
              <div className="text-center mt-6">
                <Button>Join a Challenge</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default InteractiveElements;