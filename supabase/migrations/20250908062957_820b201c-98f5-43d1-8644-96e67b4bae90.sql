-- Add foreign key constraints for proper table relationships

-- Add foreign key constraint for blogs.author_id -> profiles.user_id
ALTER TABLE public.blogs 
ADD CONSTRAINT blogs_author_id_fkey 
FOREIGN KEY (author_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

-- Add foreign key constraint for bookmarks.blog_id -> blogs.id
ALTER TABLE public.bookmarks 
ADD CONSTRAINT bookmarks_blog_id_fkey 
FOREIGN KEY (blog_id) REFERENCES public.blogs(id) ON DELETE CASCADE;

-- Add foreign key constraint for bookmarks.user_id -> profiles.user_id
ALTER TABLE public.bookmarks 
ADD CONSTRAINT bookmarks_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

-- Add foreign key constraint for community_posts.author_id -> profiles.user_id
ALTER TABLE public.community_posts 
ADD CONSTRAINT community_posts_author_id_fkey 
FOREIGN KEY (author_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;