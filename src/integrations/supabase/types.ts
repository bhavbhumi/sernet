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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      analyses: {
        Row: {
          author: string
          body: string | null
          category: string
          created_at: string
          created_by: string | null
          excerpt: string | null
          icon_name: string | null
          id: string
          item_date: string | null
          media_url: string | null
          published_at: string | null
          status: Database["public"]["Enums"]["content_status"]
          thumbnail_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          author?: string
          body?: string | null
          category: string
          created_at?: string
          created_by?: string | null
          excerpt?: string | null
          icon_name?: string | null
          id?: string
          item_date?: string | null
          media_url?: string | null
          published_at?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          thumbnail_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          author?: string
          body?: string | null
          category?: string
          created_at?: string
          created_by?: string | null
          excerpt?: string | null
          icon_name?: string | null
          id?: string
          item_date?: string | null
          media_url?: string | null
          published_at?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      article_likes: {
        Row: {
          article_id: string
          created_at: string
          fingerprint: string
          id: string
        }
        Insert: {
          article_id: string
          created_at?: string
          fingerprint: string
          id?: string
        }
        Update: {
          article_id?: string
          created_at?: string
          fingerprint?: string
          id?: string
        }
        Relationships: []
      }
      article_shares: {
        Row: {
          article_id: string
          created_at: string
          fingerprint: string | null
          id: string
        }
        Insert: {
          article_id: string
          created_at?: string
          fingerprint?: string | null
          id?: string
        }
        Update: {
          article_id?: string
          created_at?: string
          fingerprint?: string | null
          id?: string
        }
        Relationships: []
      }
      articles: {
        Row: {
          author: string
          body: string | null
          category: string
          created_at: string
          created_by: string | null
          excerpt: string | null
          format: Database["public"]["Enums"]["article_format"]
          id: string
          item_date: string | null
          media_url: string | null
          published_at: string | null
          read_time: string | null
          status: Database["public"]["Enums"]["content_status"]
          thumbnail_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          author?: string
          body?: string | null
          category: string
          created_at?: string
          created_by?: string | null
          excerpt?: string | null
          format?: Database["public"]["Enums"]["article_format"]
          id?: string
          item_date?: string | null
          media_url?: string | null
          published_at?: string | null
          read_time?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          thumbnail_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          author?: string
          body?: string | null
          category?: string
          created_at?: string
          created_by?: string | null
          excerpt?: string | null
          format?: Database["public"]["Enums"]["article_format"]
          id?: string
          item_date?: string | null
          media_url?: string | null
          published_at?: string | null
          read_time?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      bulletins: {
        Row: {
          created_at: string
          created_by: string | null
          description: string
          expires_at: string | null
          id: string
          priority: Database["public"]["Enums"]["bulletin_priority"]
          published_at: string | null
          status: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description: string
          expires_at?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["bulletin_priority"]
          published_at?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string
          expires_at?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["bulletin_priority"]
          published_at?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      calculator_ai_logs: {
        Row: {
          calc_type: string
          created_at: string
          id: string
          lead_captured: boolean
          session_id: string
          turn_count: number
          updated_at: string
        }
        Insert: {
          calc_type: string
          created_at?: string
          id?: string
          lead_captured?: boolean
          session_id: string
          turn_count?: number
          updated_at?: string
        }
        Update: {
          calc_type?: string
          created_at?: string
          id?: string
          lead_captured?: boolean
          session_id?: string
          turn_count?: number
          updated_at?: string
        }
        Relationships: []
      }
      calculator_leads: {
        Row: {
          calculated_result: Json | null
          created_at: string
          email: string | null
          goal_text: string
          id: string
          name: string
          phone: string
          product_type: string
        }
        Insert: {
          calculated_result?: Json | null
          created_at?: string
          email?: string | null
          goal_text: string
          id?: string
          name: string
          phone: string
          product_type?: string
        }
        Update: {
          calculated_result?: Json | null
          created_at?: string
          email?: string | null
          goal_text?: string
          id?: string
          name?: string
          phone?: string
          product_type?: string
        }
        Relationships: []
      }
      circulars: {
        Row: {
          category: string
          created_at: string
          created_by: string | null
          id: string
          is_rss: boolean | null
          link: string | null
          published_at: string | null
          rss_feed_url: string | null
          source: string
          status: Database["public"]["Enums"]["content_status"]
          summary: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_rss?: boolean | null
          link?: string | null
          published_at?: string | null
          rss_feed_url?: string | null
          source: string
          status?: Database["public"]["Enums"]["content_status"]
          summary?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_rss?: boolean | null
          link?: string | null
          published_at?: string | null
          rss_feed_url?: string | null
          source?: string
          status?: Database["public"]["Enums"]["content_status"]
          summary?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      cms_settings: {
        Row: {
          id: string
          key: string
          updated_at: string
          updated_by: string | null
          value: Json
        }
        Insert: {
          id?: string
          key: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Update: {
          id?: string
          key?: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      content_summaries: {
        Row: {
          content_id: string
          content_type: string
          created_at: string
          id: string
          key_points: Json
          read_time: string
          sentiment: string
          tldr: string
        }
        Insert: {
          content_id: string
          content_type: string
          created_at?: string
          id?: string
          key_points?: Json
          read_time?: string
          sentiment?: string
          tldr: string
        }
        Update: {
          content_id?: string
          content_type?: string
          created_at?: string
          id?: string
          key_points?: Json
          read_time?: string
          sentiment?: string
          tldr?: string
        }
        Relationships: []
      }
      corporate_events: {
        Row: {
          amount: string | null
          company_name: string
          created_at: string
          created_by: string | null
          event_date: string
          event_details: string | null
          event_type: string
          ex_date: string | null
          id: string
          record_date: string | null
          status: string
          ticker: string | null
          updated_at: string
        }
        Insert: {
          amount?: string | null
          company_name: string
          created_at?: string
          created_by?: string | null
          event_date: string
          event_details?: string | null
          event_type?: string
          ex_date?: string | null
          id?: string
          record_date?: string | null
          status?: string
          ticker?: string | null
          updated_at?: string
        }
        Update: {
          amount?: string | null
          company_name?: string
          created_at?: string
          created_by?: string | null
          event_date?: string
          event_details?: string | null
          event_type?: string
          ex_date?: string | null
          id?: string
          record_date?: string | null
          status?: string
          ticker?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      economic_events: {
        Row: {
          actual_value: string | null
          category: string
          country: string
          created_at: string
          created_by: string | null
          description: string | null
          event_date: string
          event_name: string
          event_time: string | null
          forecast_value: string | null
          id: string
          impact: string
          previous_value: string | null
          status: string
          updated_at: string
        }
        Insert: {
          actual_value?: string | null
          category?: string
          country?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          event_date: string
          event_name: string
          event_time?: string | null
          forecast_value?: string | null
          id?: string
          impact?: string
          previous_value?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          actual_value?: string | null
          category?: string
          country?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          event_date?: string
          event_name?: string
          event_time?: string | null
          forecast_value?: string | null
          id?: string
          impact?: string
          previous_value?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      job_applications: {
        Row: {
          applied_at: string
          cover_note: string | null
          email: string
          full_name: string
          id: string
          job_id: string | null
          notes: string | null
          phone: string | null
          preferred_role: string | null
          resume_url: string | null
          reviewed_by: string | null
          status: string
        }
        Insert: {
          applied_at?: string
          cover_note?: string | null
          email: string
          full_name: string
          id?: string
          job_id?: string | null
          notes?: string | null
          phone?: string | null
          preferred_role?: string | null
          resume_url?: string | null
          reviewed_by?: string | null
          status?: string
        }
        Update: {
          applied_at?: string
          cover_note?: string | null
          email?: string
          full_name?: string
          id?: string
          job_id?: string | null
          notes?: string | null
          phone?: string | null
          preferred_role?: string | null
          resume_url?: string | null
          reviewed_by?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "job_openings"
            referencedColumns: ["id"]
          },
        ]
      }
      job_openings: {
        Row: {
          created_at: string
          created_by: string | null
          department: string
          description: string | null
          id: string
          is_featured: boolean | null
          job_type: string
          location: string
          published_at: string | null
          requirements: string | null
          status: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          department: string
          description?: string | null
          id?: string
          is_featured?: boolean | null
          job_type?: string
          location?: string
          published_at?: string | null
          requirements?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          department?: string
          description?: string | null
          id?: string
          is_featured?: boolean | null
          job_type?: string
          location?: string
          published_at?: string | null
          requirements?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          assigned_to: string | null
          context: Json | null
          created_at: string
          email: string | null
          id: string
          lead_type: string
          name: string
          notes: string | null
          phone: string
          source: string
          status: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          context?: Json | null
          created_at?: string
          email?: string | null
          id?: string
          lead_type?: string
          name: string
          notes?: string | null
          phone: string
          source?: string
          status?: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          context?: Json | null
          created_at?: string
          email?: string | null
          id?: string
          lead_type?: string
          name?: string
          notes?: string | null
          phone?: string
          source?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      market_holidays: {
        Row: {
          created_at: string
          created_by: string | null
          day_of_week: string | null
          holiday_date: string
          holiday_name: string
          holiday_type: string[]
          id: string
          markets: string
          notes: string | null
          status: string
          updated_at: string
          year: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          day_of_week?: string | null
          holiday_date: string
          holiday_name: string
          holiday_type?: string[]
          id?: string
          markets?: string
          notes?: string | null
          status?: string
          updated_at?: string
          year?: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          day_of_week?: string | null
          holiday_date?: string
          holiday_name?: string
          holiday_type?: string[]
          id?: string
          markets?: string
          notes?: string | null
          status?: string
          updated_at?: string
          year?: number
        }
        Relationships: []
      }
      news_items: {
        Row: {
          category: string
          created_at: string
          created_by: string | null
          id: string
          is_rss: boolean | null
          link: string | null
          published_at: string | null
          rss_feed_url: string | null
          source: string
          status: Database["public"]["Enums"]["content_status"]
          summary: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_rss?: boolean | null
          link?: string | null
          published_at?: string | null
          rss_feed_url?: string | null
          source: string
          status?: Database["public"]["Enums"]["content_status"]
          summary?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_rss?: boolean | null
          link?: string | null
          published_at?: string | null
          rss_feed_url?: string | null
          source?: string
          status?: Database["public"]["Enums"]["content_status"]
          summary?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string | null
          preferences: string[]
          status: string
          subscribed_at: string
          unsubscribed_at: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name: string
          id?: string
          last_name?: string | null
          preferences?: string[]
          status?: string
          subscribed_at?: string
          unsubscribed_at?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string | null
          preferences?: string[]
          status?: string
          subscribed_at?: string
          unsubscribed_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      newsletters: {
        Row: {
          body: string | null
          category: string
          created_at: string
          created_by: string | null
          id: string
          preview_text: string | null
          recipient_count: number | null
          scheduled_at: string | null
          sent_at: string | null
          status: string
          subject: string
          target_preferences: string[] | null
          updated_at: string
        }
        Insert: {
          body?: string | null
          category?: string
          created_at?: string
          created_by?: string | null
          id?: string
          preview_text?: string | null
          recipient_count?: number | null
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string
          subject: string
          target_preferences?: string[] | null
          updated_at?: string
        }
        Update: {
          body?: string | null
          category?: string
          created_at?: string
          created_by?: string | null
          id?: string
          preview_text?: string | null
          recipient_count?: number | null
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string
          subject?: string
          target_preferences?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      poll_likes: {
        Row: {
          created_at: string
          fingerprint: string
          id: string
          poll_id: string
        }
        Insert: {
          created_at?: string
          fingerprint: string
          id?: string
          poll_id: string
        }
        Update: {
          created_at?: string
          fingerprint?: string
          id?: string
          poll_id?: string
        }
        Relationships: []
      }
      poll_options: {
        Row: {
          id: string
          label: string
          poll_id: string
          sort_order: number | null
        }
        Insert: {
          id?: string
          label: string
          poll_id: string
          sort_order?: number | null
        }
        Update: {
          id?: string
          label?: string
          poll_id?: string
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "poll_options_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "polls"
            referencedColumns: ["id"]
          },
        ]
      }
      poll_votes: {
        Row: {
          created_at: string
          id: string
          option_id: string
          poll_id: string
          voter_fingerprint: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          option_id: string
          poll_id: string
          voter_fingerprint?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          option_id?: string
          poll_id?: string
          voter_fingerprint?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "poll_votes_option_id_fkey"
            columns: ["option_id"]
            isOneToOne: false
            referencedRelation: "poll_options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "poll_votes_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "polls"
            referencedColumns: ["id"]
          },
        ]
      }
      polls: {
        Row: {
          category: string
          created_at: string
          created_by: string | null
          ends_at: string | null
          id: string
          question: string
          status: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          created_by?: string | null
          ends_at?: string | null
          id?: string
          question: string
          status?: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string | null
          ends_at?: string | null
          id?: string
          question?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      press_items: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          is_featured: boolean | null
          link: string | null
          medium: string
          published_at: string | null
          source: string
          status: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          is_featured?: boolean | null
          link?: string | null
          medium?: string
          published_at?: string | null
          source: string
          status?: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          is_featured?: boolean | null
          link?: string | null
          medium?: string
          published_at?: string | null
          source?: string
          status?: Database["public"]["Enums"]["content_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          file_url: string | null
          id: string
          pages: number | null
          published_at: string | null
          report_type: string
          status: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          file_url?: string | null
          id?: string
          pages?: number | null
          published_at?: string | null
          report_type: string
          status?: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          file_url?: string | null
          id?: string
          pages?: number | null
          published_at?: string | null
          report_type?: string
          status?: Database["public"]["Enums"]["content_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          approved_by: string | null
          city: string | null
          country: string | null
          created_at: string
          has_video: boolean | null
          id: string
          is_featured: boolean | null
          name: string
          occupation: string | null
          published_at: string | null
          rating: number
          review: string
          review_type: string | null
          source: string | null
          status: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          approved_by?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          has_video?: boolean | null
          id?: string
          is_featured?: boolean | null
          name: string
          occupation?: string | null
          published_at?: string | null
          rating: number
          review: string
          review_type?: string | null
          source?: string | null
          status?: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          approved_by?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          has_video?: boolean | null
          id?: string
          is_featured?: boolean | null
          name?: string
          occupation?: string | null
          published_at?: string | null
          rating?: number
          review?: string
          review_type?: string | null
          source?: string | null
          status?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      site_pages: {
        Row: {
          created_at: string
          description: string | null
          id: string
          maintenance_mode: boolean
          meta_description: string | null
          meta_title: string | null
          path: string
          section: string
          sort_order: number | null
          status: string
          tab_name: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          maintenance_mode?: boolean
          meta_description?: string | null
          meta_title?: string | null
          path: string
          section?: string
          sort_order?: number | null
          status?: string
          tab_name?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          maintenance_mode?: boolean
          meta_description?: string | null
          meta_title?: string | null
          path?: string
          section?: string
          sort_order?: number | null
          status?: string
          tab_name?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          id: string
          key: string
          updated_at: string
          updated_by: string | null
          value: Json
        }
        Insert: {
          id?: string
          key: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Update: {
          id?: string
          key?: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      survey_likes: {
        Row: {
          created_at: string
          fingerprint: string
          id: string
          survey_id: string
        }
        Insert: {
          created_at?: string
          fingerprint: string
          id?: string
          survey_id: string
        }
        Update: {
          created_at?: string
          fingerprint?: string
          id?: string
          survey_id?: string
        }
        Relationships: []
      }
      survey_questions: {
        Row: {
          id: string
          options: Json | null
          question: string
          question_type: string
          required: boolean | null
          sort_order: number | null
          survey_id: string
        }
        Insert: {
          id?: string
          options?: Json | null
          question: string
          question_type?: string
          required?: boolean | null
          sort_order?: number | null
          survey_id: string
        }
        Update: {
          id?: string
          options?: Json | null
          question?: string
          question_type?: string
          required?: boolean | null
          sort_order?: number | null
          survey_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "survey_questions_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "surveys"
            referencedColumns: ["id"]
          },
        ]
      }
      survey_responses: {
        Row: {
          answers: Json
          id: string
          respondent_email: string | null
          respondent_name: string | null
          submitted_at: string
          survey_id: string
        }
        Insert: {
          answers?: Json
          id?: string
          respondent_email?: string | null
          respondent_name?: string | null
          submitted_at?: string
          survey_id: string
        }
        Update: {
          answers?: Json
          id?: string
          respondent_email?: string | null
          respondent_name?: string | null
          submitted_at?: string
          survey_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "survey_responses_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "surveys"
            referencedColumns: ["id"]
          },
        ]
      }
      surveys: {
        Row: {
          category: string
          created_at: string
          created_by: string | null
          deadline_at: string | null
          description: string | null
          estimated_time: string | null
          id: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          created_by?: string | null
          deadline_at?: string | null
          description?: string | null
          estimated_time?: string | null
          id?: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string | null
          deadline_at?: string | null
          description?: string | null
          estimated_time?: string | null
          id?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          bio: string | null
          created_at: string
          department: string | null
          id: string
          is_active: boolean | null
          name: string
          photo_url: string | null
          position: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          department?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          photo_url?: string | null
          position: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          department?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          photo_url?: string | null
          position?: string
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: { _user_id: string }; Returns: boolean }
      is_super_admin: { Args: { _user_id: string }; Returns: boolean }
      search_content: {
        Args: { query_text: string; result_limit?: number }
        Returns: {
          category: string
          content_type: string
          excerpt: string
          id: string
          published_at: string
          rank: number
          title: string
          url: string
        }[]
      }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
    }
    Enums: {
      app_role: "super_admin" | "admin" | "editor"
      article_format: "Text" | "Image" | "Audio" | "Video"
      bulletin_priority: "info" | "important" | "warning" | "success"
      content_status: "draft" | "published" | "archived"
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
      app_role: ["super_admin", "admin", "editor"],
      article_format: ["Text", "Image", "Audio", "Video"],
      bulletin_priority: ["info", "important", "warning", "success"],
      content_status: ["draft", "published", "archived"],
    },
  },
} as const
