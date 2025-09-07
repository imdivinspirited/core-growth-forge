-- Create blogs table
CREATE TABLE public.blogs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  tags TEXT[] DEFAULT '{}',
  author_id UUID NOT NULL,
  thumbnail_url TEXT,
  published BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,
  reading_time INTEGER DEFAULT 5,
  language TEXT DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create community posts table
CREATE TABLE public.community_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'discussion', -- discussion, question, poll, blog_submission
  category TEXT NOT NULL DEFAULT 'general',
  author_id UUID NOT NULL,
  status TEXT DEFAULT 'published', -- published, pending, archived
  vote_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  poll_options JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bookmarks table
CREATE TABLE public.bookmarks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  blog_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, blog_id)
);

-- Create blog categories table
CREATE TABLE public.blog_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  color TEXT NOT NULL DEFAULT '#3B82F6',
  description TEXT,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for blogs
CREATE POLICY "Published blogs are viewable by everyone" 
ON public.blogs 
FOR SELECT 
USING (published = true);

CREATE POLICY "Authors can view their own blogs" 
ON public.blogs 
FOR SELECT 
USING (auth.uid() = author_id);

CREATE POLICY "Authors can create their own blogs" 
ON public.blogs 
FOR INSERT 
WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update their own blogs" 
ON public.blogs 
FOR UPDATE 
USING (auth.uid() = author_id);

-- Create RLS policies for community posts
CREATE POLICY "Published community posts are viewable by everyone" 
ON public.community_posts 
FOR SELECT 
USING (status = 'published');

CREATE POLICY "Authors can view their own community posts" 
ON public.community_posts 
FOR SELECT 
USING (auth.uid() = author_id);

CREATE POLICY "Users can create community posts" 
ON public.community_posts 
FOR INSERT 
WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update their own community posts" 
ON public.community_posts 
FOR UPDATE 
USING (auth.uid() = author_id);

-- Create RLS policies for bookmarks
CREATE POLICY "Users can view their own bookmarks" 
ON public.bookmarks 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookmarks" 
ON public.bookmarks 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks" 
ON public.bookmarks 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for blog categories
CREATE POLICY "Blog categories are viewable by everyone" 
ON public.blog_categories 
FOR SELECT 
USING (true);

-- Create triggers for updated_at
CREATE TRIGGER update_blogs_updated_at
BEFORE UPDATE ON public.blogs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_community_posts_updated_at
BEFORE UPDATE ON public.community_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert dummy blog categories
INSERT INTO public.blog_categories (name, color, description, icon) VALUES
('Technology', '#3B82F6', 'Latest tech trends and tutorials', 'laptop'),
('Career', '#10B981', 'Career development and professional growth', 'briefcase'),
('Personal', '#F59E0B', 'Personal experiences and insights', 'user'),
('Business', '#EF4444', 'Business strategies and entrepreneurship', 'building'),
('Health', '#8B5CF6', 'Health and wellness tips', 'heart');

-- Insert dummy blogs
INSERT INTO public.blogs (title, content, excerpt, category, tags, author_id, thumbnail_url, published, featured, view_count, like_count, reading_time, language) VALUES
('The Future of AI in Web Development', 'Artificial Intelligence is revolutionizing how we build web applications. From automated code generation to intelligent debugging, AI tools are becoming indispensable for developers. In this comprehensive guide, we explore the latest AI technologies that are shaping the future of web development...', 'Explore how AI is transforming web development with automated tools and intelligent solutions.', 'Technology', '{"AI", "Web Development", "Future Tech"}', (SELECT user_id FROM profiles LIMIT 1), 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800', true, true, 245, 34, 8, 'en'),
('Building Your Personal Brand in Tech', 'In today''s competitive tech landscape, having a strong personal brand is crucial for career advancement. Your personal brand is what sets you apart from other professionals and showcases your unique value proposition. Here''s how to build an authentic and compelling personal brand...', 'Learn essential strategies for building a powerful personal brand in the technology industry.', 'Career', '{"Personal Branding", "Career", "Professional Development"}', (SELECT user_id FROM profiles LIMIT 1), 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800', true, false, 178, 22, 6, 'en'),
('My Journey from Beginner to Full Stack Developer', 'Three years ago, I couldn''t write a single line of code. Today, I''m working as a full-stack developer at a tech startup. This is the story of my coding journey, the challenges I faced, the resources that helped me, and the lessons I learned along the way...', 'A personal story of transformation from coding beginner to professional developer.', 'Personal', '{"Coding Journey", "Learning", "Career Change"}', (SELECT user_id FROM profiles LIMIT 1), 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800', true, false, 156, 28, 5, 'en'),
('Scaling Your Startup: Lessons from the Trenches', 'Scaling a startup is one of the most challenging yet rewarding experiences an entrepreneur can face. After successfully growing my company from 2 to 50 employees, I want to share the key lessons, mistakes, and strategies that shaped our journey...', 'Real-world insights and strategies for successfully scaling your startup.', 'Business', '{"Startup", "Scaling", "Entrepreneurship"}', (SELECT user_id FROM profiles LIMIT 1), 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800', true, true, 203, 41, 10, 'en'),
('Work-Life Balance for Remote Developers', 'Remote work has become the new normal for many developers, but maintaining a healthy work-life balance while working from home presents unique challenges. Here are practical strategies to maintain productivity while preserving your mental health and personal relationships...', 'Practical tips for maintaining work-life balance as a remote developer.', 'Health', '{"Remote Work", "Work-Life Balance", "Mental Health"}', (SELECT user_id FROM profiles LIMIT 1), 'https://images.unsplash.com/photo-1587560699334-cc4ff634909a?w=800', true, false, 134, 19, 7, 'en');

-- Insert dummy community posts
INSERT INTO public.community_posts (title, content, type, category, author_id, vote_count, comment_count, tags) VALUES
('Best practices for React component optimization?', 'I''m working on a large React application and noticing performance issues. What are your go-to strategies for optimizing React components? Looking for both basic and advanced techniques.', 'question', 'Technology', (SELECT user_id FROM profiles LIMIT 1), 15, 8, '{"React", "Performance", "Optimization"}'),
('What programming language should I learn next?', 'I''m proficient in JavaScript and Python. Considering learning either Go, Rust, or TypeScript next. What would you recommend for someone interested in backend development and system programming?', 'question', 'Career', (SELECT user_id FROM profiles LIMIT 1), 23, 12, '{"Programming Languages", "Career Advice"}'),
('Poll: Favorite code editor in 2024', 'What''s your preferred code editor/IDE for development in 2024? Share your choice and why you love it!', 'poll', 'Technology', (SELECT user_id FROM profiles LIMIT 1), 45, 25, '{"Development Tools", "Poll"}'),
('My experience transitioning to DevOps', 'After 5 years as a frontend developer, I recently made the transition to DevOps engineering. Here''s what I learned during the process and resources that helped me succeed...', 'blog_submission', 'Career', (SELECT user_id FROM profiles LIMIT 1), 31, 6, '{"DevOps", "Career Transition"}');