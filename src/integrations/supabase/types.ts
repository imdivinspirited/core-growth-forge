export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      ai_recommendations: {
        Row: {
          confidence_score: number | null
          created_at: string
          description: string
          feedback: string | null
          id: string
          metadata: Json | null
          recommendation_type: string
          title: string
          user_id: string
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string
          description: string
          feedback?: string | null
          id?: string
          metadata?: Json | null
          recommendation_type: string
          title: string
          user_id: string
        }
        Update: {
          confidence_score?: number | null
          created_at?: string
          description?: string
          feedback?: string | null
          id?: string
          metadata?: Json | null
          recommendation_type?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: unknown
          new_data: Json | null
          old_data: Json | null
          record_id: string | null
          table_name: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address?: unknown
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: unknown
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      blog_categories: {
        Row: {
          color: string
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          color?: string
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          color?: string
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      blogs: {
        Row: {
          author_id: string
          category: string
          content: string
          created_at: string
          excerpt: string | null
          featured: boolean | null
          id: string
          language: string | null
          like_count: number | null
          published: boolean | null
          reading_time: number | null
          share_count: number | null
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          updated_at: string
          view_count: number | null
        }
        Insert: {
          author_id: string
          category?: string
          content: string
          created_at?: string
          excerpt?: string | null
          featured?: boolean | null
          id?: string
          language?: string | null
          like_count?: number | null
          published?: boolean | null
          reading_time?: number | null
          share_count?: number | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          view_count?: number | null
        }
        Update: {
          author_id?: string
          category?: string
          content?: string
          created_at?: string
          excerpt?: string | null
          featured?: boolean | null
          id?: string
          language?: string | null
          like_count?: number | null
          published?: boolean | null
          reading_time?: number | null
          share_count?: number | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "blogs_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      bookings: {
        Row: {
          booking_date: string
          booking_status: string | null
          created_at: string
          end_time: string | null
          id: string
          payment_status: string | null
          service_details: Json
          service_type: string
          start_time: string | null
          total_amount: number
          updated_at: string
          user_id: string
          vendor_id: string
        }
        Insert: {
          booking_date: string
          booking_status?: string | null
          created_at?: string
          end_time?: string | null
          id?: string
          payment_status?: string | null
          service_details: Json
          service_type: string
          start_time?: string | null
          total_amount: number
          updated_at?: string
          user_id: string
          vendor_id: string
        }
        Update: {
          booking_date?: string
          booking_status?: string | null
          created_at?: string
          end_time?: string | null
          id?: string
          payment_status?: string | null
          service_details?: Json
          service_type?: string
          start_time?: string | null
          total_amount?: number
          updated_at?: string
          user_id?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      bookmarks: {
        Row: {
          blog_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          blog_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          blog_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookmarks_blog_id_fkey"
            columns: ["blog_id"]
            isOneToOne: false
            referencedRelation: "blogs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookmarks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string
          deleted_at: string | null
          edited_at: string | null
          id: string
          message_type: string | null
          metadata: Json | null
          room_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          deleted_at?: string | null
          edited_at?: string | null
          id?: string
          message_type?: string | null
          metadata?: Json | null
          room_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          deleted_at?: string | null
          edited_at?: string | null
          id?: string
          message_type?: string | null
          metadata?: Json | null
          room_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_participants: {
        Row: {
          id: string
          joined_at: string
          last_read_at: string | null
          room_id: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          last_read_at?: string | null
          room_id: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          last_read_at?: string | null
          room_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_participants_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_rooms: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          metadata: Json | null
          name: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          metadata?: Json | null
          name: string
          type?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          metadata?: Json | null
          name?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      community_posts: {
        Row: {
          author_id: string
          category: string
          comment_count: number | null
          content: string
          created_at: string
          id: string
          poll_options: Json | null
          status: string | null
          tags: string[] | null
          title: string
          type: string
          updated_at: string
          vote_count: number | null
        }
        Insert: {
          author_id: string
          category?: string
          comment_count?: number | null
          content: string
          created_at?: string
          id?: string
          poll_options?: Json | null
          status?: string | null
          tags?: string[] | null
          title: string
          type?: string
          updated_at?: string
          vote_count?: number | null
        }
        Update: {
          author_id?: string
          category?: string
          comment_count?: number | null
          content?: string
          created_at?: string
          id?: string
          poll_options?: Json | null
          status?: string | null
          tags?: string[] | null
          title?: string
          type?: string
          updated_at?: string
          vote_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "community_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      courses: {
        Row: {
          category: string
          created_at: string
          description: string | null
          difficulty_level: string | null
          estimated_hours: number | null
          id: string
          image_url: string | null
          is_featured: boolean | null
          title: string
          total_lessons: number | null
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          difficulty_level?: string | null
          estimated_hours?: number | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          title: string
          total_lessons?: number | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          difficulty_level?: string | null
          estimated_hours?: number | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          title?: string
          total_lessons?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      custom_users: {
        Row: {
          auth_provider: string | null
          auth_user_id: string | null
          country_code: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          is_active: boolean | null
          is_verified: boolean | null
          last_login_at: string | null
          mobile_number: string | null
          password_hash: string
          updated_at: string | null
        }
        Insert: {
          auth_provider?: string | null
          auth_user_id?: string | null
          country_code?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          last_login_at?: string | null
          mobile_number?: string | null
          password_hash: string
          updated_at?: string | null
        }
        Update: {
          auth_provider?: string | null
          auth_user_id?: string | null
          country_code?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          last_login_at?: string | null
          mobile_number?: string | null
          password_hash?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      fraud_alerts: {
        Row: {
          alert_type: string
          created_at: string
          description: string
          id: string
          metadata: Json | null
          resolved_at: string | null
          resolved_by: string | null
          severity: string
          status: string | null
          user_id: string | null
        }
        Insert: {
          alert_type: string
          created_at?: string
          description: string
          id?: string
          metadata?: Json | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity: string
          status?: string | null
          user_id?: string | null
        }
        Update: {
          alert_type?: string
          created_at?: string
          description?: string
          id?: string
          metadata?: Json | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      kyc_documents: {
        Row: {
          created_at: string
          document_type: string
          document_url: string
          id: string
          rejection_reason: string | null
          updated_at: string
          vendor_id: string
          verification_status: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          created_at?: string
          document_type: string
          document_url: string
          id?: string
          rejection_reason?: string | null
          updated_at?: string
          vendor_id: string
          verification_status?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          created_at?: string
          document_type?: string
          document_url?: string
          id?: string
          rejection_reason?: string | null
          updated_at?: string
          vendor_id?: string
          verification_status?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kyc_documents_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          content: string | null
          course_id: string
          created_at: string
          description: string | null
          exercise_code: string | null
          id: string
          lesson_order: number
          lesson_type: string | null
          programming_language: string | null
          resources: Json | null
          solution_code: string | null
          title: string
          updated_at: string
        }
        Insert: {
          content?: string | null
          course_id: string
          created_at?: string
          description?: string | null
          exercise_code?: string | null
          id?: string
          lesson_order: number
          lesson_type?: string | null
          programming_language?: string | null
          resources?: Json | null
          solution_code?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          content?: string | null
          course_id?: string
          created_at?: string
          description?: string | null
          exercise_code?: string | null
          id?: string
          lesson_order?: number
          lesson_type?: string | null
          programming_language?: string | null
          resources?: Json | null
          solution_code?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lessons_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          channel: string
          created_at: string
          id: string
          message: string
          metadata: Json | null
          read_at: string | null
          status: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          channel: string
          created_at?: string
          id?: string
          message: string
          metadata?: Json | null
          read_at?: string | null
          status?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          channel?: string
          created_at?: string
          id?: string
          message?: string
          metadata?: Json | null
          read_at?: string | null
          status?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      otp_codes: {
        Row: {
          created_at: string | null
          email: string | null
          expires_at: string
          id: string
          mobile_number: string | null
          otp_code: string
          otp_type: string
          used_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          expires_at: string
          id?: string
          mobile_number?: string | null
          otp_code: string
          otp_type: string
          used_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          expires_at?: string
          id?: string
          mobile_number?: string | null
          otp_code?: string
          otp_type?: string
          used_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "otp_codes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "custom_users"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          booking_id: string
          created_at: string
          currency: string | null
          id: string
          metadata: Json | null
          payment_gateway_id: string | null
          payment_method: string
          status: string | null
          transaction_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          booking_id: string
          created_at?: string
          currency?: string | null
          id?: string
          metadata?: Json | null
          payment_gateway_id?: string | null
          payment_method: string
          status?: string | null
          transaction_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          booking_id?: string
          created_at?: string
          currency?: string | null
          id?: string
          metadata?: Json | null
          payment_gateway_id?: string | null
          payment_method?: string
          status?: string | null
          transaction_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          country_code: string | null
          cover_photo_url: string | null
          created_at: string
          full_name: string | null
          id: string
          language_preference: string | null
          mobile_number: string | null
          mobile_verified: boolean | null
          privacy_profile: string | null
          theme_preference: string | null
          updated_at: string
          user_id: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          country_code?: string | null
          cover_photo_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          language_preference?: string | null
          mobile_number?: string | null
          mobile_verified?: boolean | null
          privacy_profile?: string | null
          theme_preference?: string | null
          updated_at?: string
          user_id: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          country_code?: string | null
          cover_photo_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          language_preference?: string | null
          mobile_number?: string | null
          mobile_verified?: boolean | null
          privacy_profile?: string | null
          theme_preference?: string | null
          updated_at?: string
          user_id?: string
          username?: string | null
        }
        Relationships: []
      }
      tourism_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          post_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          post_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          post_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tourism_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "tourism_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      tourism_likes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tourism_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "tourism_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      tourism_posts: {
        Row: {
          author_id: string
          category: string | null
          city: string | null
          comments_count: number | null
          content: string
          country: string | null
          created_at: string
          id: string
          images: Json | null
          latitude: number | null
          likes_count: number | null
          location_name: string | null
          longitude: number | null
          status: string | null
          tags: string[] | null
          title: string
          updated_at: string
          views_count: number | null
        }
        Insert: {
          author_id: string
          category?: string | null
          city?: string | null
          comments_count?: number | null
          content: string
          country?: string | null
          created_at?: string
          id?: string
          images?: Json | null
          latitude?: number | null
          likes_count?: number | null
          location_name?: string | null
          longitude?: number | null
          status?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          views_count?: number | null
        }
        Update: {
          author_id?: string
          category?: string | null
          city?: string | null
          comments_count?: number | null
          content?: string
          country?: string | null
          created_at?: string
          id?: string
          images?: Json | null
          latitude?: number | null
          likes_count?: number | null
          location_name?: string | null
          longitude?: number | null
          status?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          views_count?: number | null
        }
        Relationships: []
      }
      two_factor_recovery_codes: {
        Row: {
          code_hash: string
          created_at: string
          id: string
          used_at: string | null
          user_id: string
        }
        Insert: {
          code_hash: string
          created_at?: string
          id?: string
          used_at?: string | null
          user_id: string
        }
        Update: {
          code_hash?: string
          created_at?: string
          id?: string
          used_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "two_factor_recovery_codes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "custom_users"
            referencedColumns: ["id"]
          },
        ]
      }
      two_factor_settings: {
        Row: {
          created_at: string
          enabled: boolean
          id: string
          last_verified_at: string | null
          secret: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          enabled?: boolean
          id?: string
          last_verified_at?: string | null
          secret: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          enabled?: boolean
          id?: string
          last_verified_at?: string | null
          secret?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "two_factor_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "custom_users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_badges: {
        Row: {
          badge_description: string | null
          badge_icon: string | null
          badge_name: string
          category: string | null
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          badge_description?: string | null
          badge_icon?: string | null
          badge_name: string
          category?: string | null
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          badge_description?: string | null
          badge_icon?: string | null
          badge_name?: string
          category?: string | null
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          course_id: string
          created_at: string
          id: string
          lesson_id: string | null
          score: number | null
          time_spent: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          course_id: string
          created_at?: string
          id?: string
          lesson_id?: string | null
          score?: number | null
          time_spent?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          course_id?: string
          created_at?: string
          id?: string
          lesson_id?: string | null
          score?: number | null
          time_spent?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          ip_address: string | null
          last_activity_at: string | null
          refresh_token: string
          session_token: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: string
          ip_address?: string | null
          last_activity_at?: string | null
          refresh_token: string
          session_token: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          ip_address?: string | null
          last_activity_at?: string | null
          refresh_token?: string
          session_token?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "custom_users"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          address: string | null
          business_name: string
          business_type: string
          city: string | null
          country: string | null
          created_at: string
          description: string | null
          email: string | null
          id: string
          phone: string | null
          rating: number | null
          total_bookings: number | null
          updated_at: string
          user_id: string
          verification_status: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          business_name: string
          business_type: string
          city?: string | null
          country?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          phone?: string | null
          rating?: number | null
          total_bookings?: number | null
          updated_at?: string
          user_id: string
          verification_status?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          business_name?: string
          business_type?: string
          city?: string | null
          country?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          phone?: string | null
          rating?: number | null
          total_bookings?: number | null
          updated_at?: string
          user_id?: string
          verification_status?: string | null
          website?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      clean_expired_otps: { Args: never; Returns: undefined }
      clean_expired_sessions: { Args: never; Returns: undefined }
      get_public_vendor_info: {
        Args: { vendor_row: Database["public"]["Tables"]["vendors"]["Row"] }
        Returns: {
          business_name: string
          business_type: string
          city: string
          country: string
          created_at: string
          description: string
          id: string
          rating: number
          total_bookings: number
          updated_at: string
          user_id: string
          verification_status: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user" | "student" | "professional"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user", "student", "professional"],
    },
  },
} as const
