import { z } from "zod";

export const signUpSchema = z.object({
  email: z.string().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password must be less than 72 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  fullName: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
});

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const profileSchema = z.object({
  username: z.string().trim().min(3, "Username must be at least 3 characters").max(30, "Username must be less than 30 characters").optional(),
  full_name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number").optional().or(z.literal("")),
  language_preference: z.enum(["en", "es", "fr", "de", "zh"]).optional(),
  theme_preference: z.enum(["light", "dark", "system"]).optional(),
  privacy_profile: z.enum(["public", "private"]).optional(),
});

export const blogSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  content: z.string().trim().min(1, "Content is required").max(50000, "Content must be less than 50,000 characters"),
  excerpt: z.string().max(500, "Excerpt must be less than 500 characters").optional(),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string().max(30)).max(10, "Maximum 10 tags allowed").optional(),
  language: z.enum(["en", "es", "fr", "de", "zh"]).optional(),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type BlogInput = z.infer<typeof blogSchema>;
