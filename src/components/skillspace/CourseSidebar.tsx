import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, BookOpen, Code, CheckCircle, Circle } from "lucide-react";

const CourseSidebar = ({ 
  course, 
  lessons, 
  selectedLesson, 
  onLessonSelect, 
  onBackToCourses,
  userProgress 
}) => {
  const getProgressForLesson = (lessonId) => {
    return userProgress.find(p => p.lesson_id === lessonId && p.completed);
  };

  const completedLessons = lessons.filter(lesson => 
    getProgressForLesson(lesson.id)
  ).length;

  const progressPercentage = lessons.length > 0 
    ? (completedLessons / lessons.length) * 100 
    : 0;

  return (
    <div className="space-y-4">
      {/* Back Button */}
      <Button
        variant="outline"
        onClick={onBackToCourses}
        className="w-full justify-start"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Courses
      </Button>

      {/* Course Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{course.title}</CardTitle>
          <Badge variant="secondary">{course.category}</Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {course.description}
            </p>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{completedLessons}/{lessons.length}</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {Math.round(progressPercentage)}% complete
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lessons List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Lessons</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {lessons.map((lesson, index) => {
              const isCompleted = getProgressForLesson(lesson.id);
              const isSelected = selectedLesson?.id === lesson.id;
              
              return (
                <Button
                  key={lesson.id}
                  variant={isSelected ? "default" : "ghost"}
                  className={`w-full justify-start h-auto p-3 ${
                    isCompleted ? "bg-green-50 hover:bg-green-100" : ""
                  }`}
                  onClick={() => onLessonSelect(lesson)}
                >
                  <div className="flex items-start gap-3 w-full">
                    <div className="flex-shrink-0 mt-0.5">
                      {isCompleted ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <Circle className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                    
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-muted-foreground">
                          {index + 1}.
                        </span>
                        {lesson.lesson_type === 'exercise' ? (
                          <Code className="w-3 h-3" />
                        ) : (
                          <BookOpen className="w-3 h-3" />
                        )}
                      </div>
                      <p className="font-medium text-sm leading-tight">
                        {lesson.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {lesson.description}
                      </p>
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseSidebar;