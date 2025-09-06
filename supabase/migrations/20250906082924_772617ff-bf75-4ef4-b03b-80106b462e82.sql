-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT,
  bio TEXT,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  cover_photo_url TEXT,
  language_preference TEXT DEFAULT 'en',
  theme_preference TEXT DEFAULT 'light',
  privacy_profile TEXT DEFAULT 'public',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create courses table
CREATE TABLE public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('Career', 'Tech', 'Hobbies')),
  difficulty_level TEXT DEFAULT 'Beginner' CHECK (difficulty_level IN ('Beginner', 'Intermediate', 'Advanced')),
  image_url TEXT,
  total_lessons INTEGER DEFAULT 0,
  estimated_hours INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for courses
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- Create policy for courses (public read)
CREATE POLICY "Courses are viewable by everyone" 
ON public.courses 
FOR SELECT 
USING (true);

-- Create lessons table
CREATE TABLE public.lessons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  lesson_order INTEGER NOT NULL,
  exercise_code TEXT,
  solution_code TEXT,
  resources JSONB DEFAULT '[]',
  lesson_type TEXT DEFAULT 'tutorial' CHECK (lesson_type IN ('tutorial', 'exercise', 'project')),
  programming_language TEXT DEFAULT 'javascript',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for lessons
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- Create policy for lessons (public read)
CREATE POLICY "Lessons are viewable by everyone" 
ON public.lessons 
FOR SELECT 
USING (true);

-- Create user progress table
CREATE TABLE public.user_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  score INTEGER DEFAULT 0,
  time_spent INTEGER DEFAULT 0, -- in minutes
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

-- Enable RLS for user progress
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- Create policies for user progress
CREATE POLICY "Users can view their own progress" 
ON public.user_progress 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress" 
ON public.user_progress 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" 
ON public.user_progress 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create user badges table
CREATE TABLE public.user_badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_name TEXT NOT NULL,
  badge_description TEXT,
  badge_icon TEXT,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  category TEXT DEFAULT 'general'
);

-- Enable RLS for user badges
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- Create policies for user badges
CREATE POLICY "Users can view their own badges" 
ON public.user_badges 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own badges" 
ON public.user_badges 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_courses_updated_at
BEFORE UPDATE ON public.courses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at
BEFORE UPDATE ON public.lessons
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at
BEFORE UPDATE ON public.user_progress
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name'),
    NEW.email
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Insert dummy courses
INSERT INTO public.courses (title, description, category, difficulty_level, total_lessons, estimated_hours, is_featured) VALUES
('JavaScript Fundamentals', 'Master the basics of JavaScript programming with hands-on exercises', 'Tech', 'Beginner', 8, 12, true),
('React Development', 'Build modern web applications with React and its ecosystem', 'Tech', 'Intermediate', 12, 20, true),
('Career Planning 101', 'Strategic career development and personal branding', 'Career', 'Beginner', 6, 8, true),
('Python for Beginners', 'Learn Python programming from scratch', 'Tech', 'Beginner', 10, 15, false),
('Photography Basics', 'Capture stunning photos with professional techniques', 'Hobbies', 'Beginner', 8, 10, false),
('Leadership Skills', 'Develop effective leadership and management skills', 'Career', 'Intermediate', 7, 12, false);

-- Insert dummy lessons for JavaScript Fundamentals
INSERT INTO public.lessons (course_id, title, description, lesson_order, lesson_type, exercise_code, solution_code, programming_language) VALUES
((SELECT id FROM public.courses WHERE title = 'JavaScript Fundamentals'), 'Variables and Data Types', 'Learn about JavaScript variables and basic data types', 1, 'tutorial', 'let name = ""; // Create a variable', 'let name = "John"; console.log(name);', 'javascript'),
((SELECT id FROM public.courses WHERE title = 'JavaScript Fundamentals'), 'Functions Basics', 'Understanding functions in JavaScript', 2, 'exercise', 'function greet() { // Complete this function }', 'function greet(name) { return `Hello, ${name}!`; }', 'javascript'),
((SELECT id FROM public.courses WHERE title = 'JavaScript Fundamentals'), 'Arrays and Objects', 'Working with arrays and objects', 3, 'tutorial', 'const numbers = []; // Create an array', 'const numbers = [1, 2, 3, 4, 5]; console.log(numbers);', 'javascript');

-- Insert dummy lessons for React Development
INSERT INTO public.lessons (course_id, title, description, lesson_order, lesson_type, exercise_code, solution_code, programming_language) VALUES
((SELECT id FROM public.courses WHERE title = 'React Development'), 'Component Basics', 'Creating your first React component', 1, 'tutorial', 'function App() { // Return JSX }', 'function App() { return <h1>Hello World</h1>; }', 'javascript'),
((SELECT id FROM public.courses WHERE title = 'React Development'), 'Props and State', 'Managing component props and state', 2, 'exercise', 'const [count, setCount] = useState(); // Initialize state', 'const [count, setCount] = useState(0);', 'javascript');

-- Insert dummy lessons for Career Planning
INSERT INTO public.lessons (course_id, title, description, lesson_order, lesson_type, programming_language) VALUES
((SELECT id FROM public.courses WHERE title = 'Career Planning 101'), 'Setting Career Goals', 'How to set and achieve meaningful career objectives', 1, 'tutorial', 'text'),
((SELECT id FROM public.courses WHERE title = 'Career Planning 101'), 'Building Your Network', 'Strategies for professional networking', 2, 'tutorial', 'text'),
((SELECT id FROM public.courses WHERE title = 'Career Planning 101'), 'Personal Branding', 'Create a compelling personal brand', 3, 'tutorial', 'text');