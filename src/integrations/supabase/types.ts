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
      agreements: {
        Row: {
          agreement_type: string
          auto_renew: boolean | null
          contact_id: string | null
          created_at: string
          created_by: string | null
          document_url: string | null
          end_date: string | null
          id: string
          start_date: string | null
          status: string
          terms_summary: string | null
          title: string
          updated_at: string
        }
        Insert: {
          agreement_type?: string
          auto_renew?: boolean | null
          contact_id?: string | null
          created_at?: string
          created_by?: string | null
          document_url?: string | null
          end_date?: string | null
          id?: string
          start_date?: string | null
          status?: string
          terms_summary?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          agreement_type?: string
          auto_renew?: boolean | null
          contact_id?: string | null
          created_at?: string
          created_by?: string | null
          document_url?: string | null
          end_date?: string | null
          id?: string
          start_date?: string | null
          status?: string
          terms_summary?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "agreements_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
        ]
      }
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
          read_time: string | null
          source_url: string | null
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
          read_time?: string | null
          source_url?: string | null
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
          read_time?: string | null
          source_url?: string | null
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
          meta_description: string | null
          meta_title: string | null
          published_at: string | null
          read_time: string | null
          source_url: string | null
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
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          read_time?: string | null
          source_url?: string | null
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
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          read_time?: string | null
          source_url?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      attendance_logs: {
        Row: {
          check_in: string | null
          check_out: string | null
          created_at: string
          employee_id: string
          id: string
          log_date: string
          notes: string | null
          status: string
        }
        Insert: {
          check_in?: string | null
          check_out?: string | null
          created_at?: string
          employee_id: string
          id?: string
          log_date: string
          notes?: string | null
          status?: string
        }
        Update: {
          check_in?: string | null
          check_out?: string | null
          created_at?: string
          employee_id?: string
          id?: string
          log_date?: string
          notes?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_logs_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: string | null
          source: string
          user_agent: string | null
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: string | null
          source?: string
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: string | null
          source?: string
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      awareness: {
        Row: {
          author: string
          body: string | null
          category: string
          created_at: string
          created_by: string | null
          excerpt: string | null
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
      bank_accounts: {
        Row: {
          account_name: string
          account_number: string
          account_type: string
          bank_name: string
          branch: string | null
          created_at: string
          id: string
          ifsc_code: string
          is_active: boolean
          is_primary: boolean
          updated_at: string
        }
        Insert: {
          account_name: string
          account_number: string
          account_type?: string
          bank_name: string
          branch?: string | null
          created_at?: string
          id?: string
          ifsc_code?: string
          is_active?: boolean
          is_primary?: boolean
          updated_at?: string
        }
        Update: {
          account_name?: string
          account_number?: string
          account_type?: string
          bank_name?: string
          branch?: string | null
          created_at?: string
          id?: string
          ifsc_code?: string
          is_active?: boolean
          is_primary?: boolean
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
      canned_responses: {
        Row: {
          body: string
          category: string | null
          created_at: string
          created_by: string | null
          id: string
          is_active: boolean | null
          shortcode: string
          title: string
          updated_at: string
          usage_count: number | null
        }
        Insert: {
          body: string
          category?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          shortcode: string
          title: string
          updated_at?: string
          usage_count?: number | null
        }
        Update: {
          body?: string
          category?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          shortcode?: string
          title?: string
          updated_at?: string
          usage_count?: number | null
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
      commission_claims: {
        Row: {
          claim_amount: number
          claim_period: string
          commission_rate: number | null
          created_at: string
          created_by: string | null
          gross_aum: number | null
          id: string
          notes: string | null
          principal_contact_id: string
          product_category: string | null
          received_date: string | null
          reference_number: string | null
          status: string
          updated_at: string
        }
        Insert: {
          claim_amount?: number
          claim_period: string
          commission_rate?: number | null
          created_at?: string
          created_by?: string | null
          gross_aum?: number | null
          id?: string
          notes?: string | null
          principal_contact_id: string
          product_category?: string | null
          received_date?: string | null
          reference_number?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          claim_amount?: number
          claim_period?: string
          commission_rate?: number | null
          created_at?: string
          created_by?: string | null
          gross_aum?: number | null
          id?: string
          notes?: string | null
          principal_contact_id?: string
          product_category?: string | null
          received_date?: string | null
          reference_number?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "commission_claims_principal_contact_id_fkey"
            columns: ["principal_contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_branches: {
        Row: {
          address_line1: string | null
          address_line2: string | null
          address_line3: string | null
          address_type: string | null
          branch_city: string
          contact_id: string
          created_at: string
          id: string
          is_head_office: boolean | null
          office_type: string | null
          ownership: string | null
          phone: string | null
          pincode: string | null
        }
        Insert: {
          address_line1?: string | null
          address_line2?: string | null
          address_line3?: string | null
          address_type?: string | null
          branch_city: string
          contact_id: string
          created_at?: string
          id?: string
          is_head_office?: boolean | null
          office_type?: string | null
          ownership?: string | null
          phone?: string | null
          pincode?: string | null
        }
        Update: {
          address_line1?: string | null
          address_line2?: string | null
          address_line3?: string | null
          address_type?: string | null
          branch_city?: string
          contact_id?: string
          created_at?: string
          id?: string
          is_head_office?: boolean | null
          office_type?: string | null
          ownership?: string | null
          phone?: string | null
          pincode?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contact_branches_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_kmp: {
        Row: {
          contact_id: string
          created_at: string | null
          department: string | null
          designation: string
          email: string | null
          escalation_level: number | null
          full_name: string
          id: string
          is_escalation: boolean | null
          phone: string | null
          sort_order: number | null
        }
        Insert: {
          contact_id: string
          created_at?: string | null
          department?: string | null
          designation?: string
          email?: string | null
          escalation_level?: number | null
          full_name: string
          id?: string
          is_escalation?: boolean | null
          phone?: string | null
          sort_order?: number | null
        }
        Update: {
          contact_id?: string
          created_at?: string | null
          department?: string | null
          designation?: string
          email?: string | null
          escalation_level?: number | null
          full_name?: string
          id?: string
          is_escalation?: boolean | null
          phone?: string | null
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "contact_kmp_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
        ]
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
      crm_activities: {
        Row: {
          activity_type: Database["public"]["Enums"]["crm_activity_type"]
          completed_at: string | null
          contact_id: string | null
          created_at: string
          created_by: string | null
          deal_id: string | null
          description: string | null
          due_date: string | null
          duration_minutes: number | null
          id: string
          is_completed: boolean
          outcome: string | null
          subject: string
          updated_at: string
        }
        Insert: {
          activity_type?: Database["public"]["Enums"]["crm_activity_type"]
          completed_at?: string | null
          contact_id?: string | null
          created_at?: string
          created_by?: string | null
          deal_id?: string | null
          description?: string | null
          due_date?: string | null
          duration_minutes?: number | null
          id?: string
          is_completed?: boolean
          outcome?: string | null
          subject: string
          updated_at?: string
        }
        Update: {
          activity_type?: Database["public"]["Enums"]["crm_activity_type"]
          completed_at?: string | null
          contact_id?: string | null
          created_at?: string
          created_by?: string | null
          deal_id?: string | null
          description?: string | null
          due_date?: string | null
          duration_minutes?: number | null
          id?: string
          is_completed?: boolean
          outcome?: string | null
          subject?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_activities_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_activities_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "crm_deals"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_contacts: {
        Row: {
          alternate_phone: string | null
          assigned_to: string | null
          city: string | null
          company_name: string | null
          contact_type: string
          created_at: string
          created_by: string | null
          email: string | null
          full_name: string
          id: string
          notes: string | null
          pan: string | null
          phone: string | null
          relationship_meta: Json | null
          relationship_type: Database["public"]["Enums"]["contact_relationship"]
          source: string | null
          state: string | null
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          alternate_phone?: string | null
          assigned_to?: string | null
          city?: string | null
          company_name?: string | null
          contact_type?: string
          created_at?: string
          created_by?: string | null
          email?: string | null
          full_name: string
          id?: string
          notes?: string | null
          pan?: string | null
          phone?: string | null
          relationship_meta?: Json | null
          relationship_type?: Database["public"]["Enums"]["contact_relationship"]
          source?: string | null
          state?: string | null
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          alternate_phone?: string | null
          assigned_to?: string | null
          city?: string | null
          company_name?: string | null
          contact_type?: string
          created_at?: string
          created_by?: string | null
          email?: string | null
          full_name?: string
          id?: string
          notes?: string | null
          pan?: string | null
          phone?: string | null
          relationship_meta?: Json | null
          relationship_type?: Database["public"]["Enums"]["contact_relationship"]
          source?: string | null
          state?: string | null
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      crm_deals: {
        Row: {
          assigned_to: string | null
          contact_id: string | null
          created_at: string
          created_by: string | null
          deal_value: number | null
          expected_close_date: string | null
          id: string
          lead_id: string | null
          lost_reason: string | null
          probability: number | null
          product_interest: string | null
          stage: Database["public"]["Enums"]["crm_stage"]
          sub_status: Database["public"]["Enums"]["crm_sub_status"]
          title: string
          updated_at: string
          won_date: string | null
        }
        Insert: {
          assigned_to?: string | null
          contact_id?: string | null
          created_at?: string
          created_by?: string | null
          deal_value?: number | null
          expected_close_date?: string | null
          id?: string
          lead_id?: string | null
          lost_reason?: string | null
          probability?: number | null
          product_interest?: string | null
          stage?: Database["public"]["Enums"]["crm_stage"]
          sub_status?: Database["public"]["Enums"]["crm_sub_status"]
          title: string
          updated_at?: string
          won_date?: string | null
        }
        Update: {
          assigned_to?: string | null
          contact_id?: string | null
          created_at?: string
          created_by?: string | null
          deal_value?: number | null
          expected_close_date?: string | null
          id?: string
          lead_id?: string | null
          lost_reason?: string | null
          probability?: number | null
          product_interest?: string | null
          stage?: Database["public"]["Enums"]["crm_stage"]
          sub_status?: Database["public"]["Enums"]["crm_sub_status"]
          title?: string
          updated_at?: string
          won_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_deals_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_stage_history: {
        Row: {
          changed_by: string | null
          created_at: string
          deal_id: string
          from_stage: Database["public"]["Enums"]["crm_stage"] | null
          from_sub_status: Database["public"]["Enums"]["crm_sub_status"] | null
          id: string
          notes: string | null
          to_stage: Database["public"]["Enums"]["crm_stage"]
          to_sub_status: Database["public"]["Enums"]["crm_sub_status"]
        }
        Insert: {
          changed_by?: string | null
          created_at?: string
          deal_id: string
          from_stage?: Database["public"]["Enums"]["crm_stage"] | null
          from_sub_status?: Database["public"]["Enums"]["crm_sub_status"] | null
          id?: string
          notes?: string | null
          to_stage: Database["public"]["Enums"]["crm_stage"]
          to_sub_status: Database["public"]["Enums"]["crm_sub_status"]
        }
        Update: {
          changed_by?: string | null
          created_at?: string
          deal_id?: string
          from_stage?: Database["public"]["Enums"]["crm_stage"] | null
          from_sub_status?: Database["public"]["Enums"]["crm_sub_status"] | null
          id?: string
          notes?: string | null
          to_stage?: Database["public"]["Enums"]["crm_stage"]
          to_sub_status?: Database["public"]["Enums"]["crm_sub_status"]
        }
        Relationships: [
          {
            foreignKeyName: "crm_stage_history_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "crm_deals"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_stage_requirements: {
        Row: {
          created_at: string
          field_label: string
          id: string
          is_active: boolean
          required_field: string
          stage: Database["public"]["Enums"]["crm_stage"]
          sub_status: Database["public"]["Enums"]["crm_sub_status"] | null
        }
        Insert: {
          created_at?: string
          field_label: string
          id?: string
          is_active?: boolean
          required_field: string
          stage: Database["public"]["Enums"]["crm_stage"]
          sub_status?: Database["public"]["Enums"]["crm_sub_status"] | null
        }
        Update: {
          created_at?: string
          field_label?: string
          id?: string
          is_active?: boolean
          required_field?: string
          stage?: Database["public"]["Enums"]["crm_stage"]
          sub_status?: Database["public"]["Enums"]["crm_sub_status"] | null
        }
        Relationships: []
      }
      crm_transition_rules: {
        Row: {
          created_at: string
          from_stage: Database["public"]["Enums"]["crm_stage"]
          from_sub_status: Database["public"]["Enums"]["crm_sub_status"] | null
          id: string
          is_active: boolean
          requires_approval: boolean
          to_stage: Database["public"]["Enums"]["crm_stage"]
          to_sub_status: Database["public"]["Enums"]["crm_sub_status"]
        }
        Insert: {
          created_at?: string
          from_stage: Database["public"]["Enums"]["crm_stage"]
          from_sub_status?: Database["public"]["Enums"]["crm_sub_status"] | null
          id?: string
          is_active?: boolean
          requires_approval?: boolean
          to_stage: Database["public"]["Enums"]["crm_stage"]
          to_sub_status: Database["public"]["Enums"]["crm_sub_status"]
        }
        Update: {
          created_at?: string
          from_stage?: Database["public"]["Enums"]["crm_stage"]
          from_sub_status?: Database["public"]["Enums"]["crm_sub_status"] | null
          id?: string
          is_active?: boolean
          requires_approval?: boolean
          to_stage?: Database["public"]["Enums"]["crm_stage"]
          to_sub_status?: Database["public"]["Enums"]["crm_sub_status"]
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
      employees: {
        Row: {
          bio: string | null
          created_at: string
          date_of_joining: string | null
          date_of_leaving: string | null
          department: string
          designation: string
          email: string | null
          employee_code: string | null
          employment_type: string
          full_name: string
          id: string
          is_public: boolean | null
          phone: string | null
          photo_url: string | null
          reporting_to: string | null
          sort_order: number | null
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string
          date_of_joining?: string | null
          date_of_leaving?: string | null
          department?: string
          designation?: string
          email?: string | null
          employee_code?: string | null
          employment_type?: string
          full_name: string
          id?: string
          is_public?: boolean | null
          phone?: string | null
          photo_url?: string | null
          reporting_to?: string | null
          sort_order?: number | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string
          date_of_joining?: string | null
          date_of_leaving?: string | null
          department?: string
          designation?: string
          email?: string | null
          employee_code?: string | null
          employment_type?: string
          full_name?: string
          id?: string
          is_public?: boolean | null
          phone?: string | null
          photo_url?: string | null
          reporting_to?: string | null
          sort_order?: number | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employees_reporting_to_fkey"
            columns: ["reporting_to"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      firm_profile: {
        Row: {
          amfi_registration: string | null
          arn_number: string | null
          bank_details: Json | null
          cin: string | null
          city: string | null
          created_at: string
          email: string | null
          gstin: string | null
          id: string
          legal_name: string
          logo_url: string | null
          pan: string | null
          phone: string | null
          pincode: string | null
          registered_address: string | null
          state: string | null
          trade_name: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          amfi_registration?: string | null
          arn_number?: string | null
          bank_details?: Json | null
          cin?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          gstin?: string | null
          id?: string
          legal_name?: string
          logo_url?: string | null
          pan?: string | null
          phone?: string | null
          pincode?: string | null
          registered_address?: string | null
          state?: string | null
          trade_name?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          amfi_registration?: string | null
          arn_number?: string | null
          bank_details?: Json | null
          cin?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          gstin?: string | null
          id?: string
          legal_name?: string
          logo_url?: string | null
          pan?: string | null
          phone?: string | null
          pincode?: string | null
          registered_address?: string | null
          state?: string | null
          trade_name?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      invoice_items: {
        Row: {
          amount: number
          description: string
          id: string
          invoice_id: string
          quantity: number
          sort_order: number | null
          unit_price: number
        }
        Insert: {
          amount?: number
          description: string
          id?: string
          invoice_id: string
          quantity?: number
          sort_order?: number | null
          unit_price?: number
        }
        Update: {
          amount?: number
          description?: string
          id?: string
          invoice_id?: string
          quantity?: number
          sort_order?: number | null
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          contact_id: string | null
          created_at: string
          created_by: string | null
          due_date: string | null
          id: string
          invoice_date: string
          invoice_number: string
          notes: string | null
          status: string
          subtotal: number
          tax_amount: number
          total: number
          updated_at: string
        }
        Insert: {
          contact_id?: string | null
          created_at?: string
          created_by?: string | null
          due_date?: string | null
          id?: string
          invoice_date?: string
          invoice_number: string
          notes?: string | null
          status?: string
          subtotal?: number
          tax_amount?: number
          total?: number
          updated_at?: string
        }
        Update: {
          contact_id?: string | null
          created_at?: string
          created_by?: string | null
          due_date?: string | null
          id?: string
          invoice_date?: string
          invoice_number?: string
          notes?: string | null
          status?: string
          subtotal?: number
          tax_amount?: number
          total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
        ]
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
      kb_articles: {
        Row: {
          body: string | null
          category: string
          category_code: string | null
          created_at: string
          created_by: string | null
          documents_required: string[] | null
          escalation_level: number | null
          helpful_count: number | null
          id: string
          impact_type: string | null
          internal_escalation_note: string | null
          is_featured: boolean | null
          issue_code: string | null
          issue_short_description: string | null
          issue_type: string | null
          owner_team: string | null
          possible_reasons: string | null
          priority: string | null
          product: string | null
          published_at: string | null
          question_variants: string[] | null
          regulatory_tag: string | null
          resolution_steps: string | null
          resolution_timeline: string | null
          search_keywords: string[] | null
          short_summary: string | null
          slug: string
          status: Database["public"]["Enums"]["content_status"]
          sub_product: string | null
          suggested_article_group: string | null
          tags: string[] | null
          title: string
          updated_at: string
          view_count: number | null
          visibility: string | null
          what_to_check: string | null
          when_to_raise_ticket: string | null
        }
        Insert: {
          body?: string | null
          category?: string
          category_code?: string | null
          created_at?: string
          created_by?: string | null
          documents_required?: string[] | null
          escalation_level?: number | null
          helpful_count?: number | null
          id?: string
          impact_type?: string | null
          internal_escalation_note?: string | null
          is_featured?: boolean | null
          issue_code?: string | null
          issue_short_description?: string | null
          issue_type?: string | null
          owner_team?: string | null
          possible_reasons?: string | null
          priority?: string | null
          product?: string | null
          published_at?: string | null
          question_variants?: string[] | null
          regulatory_tag?: string | null
          resolution_steps?: string | null
          resolution_timeline?: string | null
          search_keywords?: string[] | null
          short_summary?: string | null
          slug: string
          status?: Database["public"]["Enums"]["content_status"]
          sub_product?: string | null
          suggested_article_group?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          view_count?: number | null
          visibility?: string | null
          what_to_check?: string | null
          when_to_raise_ticket?: string | null
        }
        Update: {
          body?: string | null
          category?: string
          category_code?: string | null
          created_at?: string
          created_by?: string | null
          documents_required?: string[] | null
          escalation_level?: number | null
          helpful_count?: number | null
          id?: string
          impact_type?: string | null
          internal_escalation_note?: string | null
          is_featured?: boolean | null
          issue_code?: string | null
          issue_short_description?: string | null
          issue_type?: string | null
          owner_team?: string | null
          possible_reasons?: string | null
          priority?: string | null
          product?: string | null
          published_at?: string | null
          question_variants?: string[] | null
          regulatory_tag?: string | null
          resolution_steps?: string | null
          resolution_timeline?: string | null
          search_keywords?: string[] | null
          short_summary?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["content_status"]
          sub_product?: string | null
          suggested_article_group?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          view_count?: number | null
          visibility?: string | null
          what_to_check?: string | null
          when_to_raise_ticket?: string | null
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
      leave_requests: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string
          days_count: number
          employee_id: string
          end_date: string
          id: string
          leave_type_id: string
          reason: string | null
          start_date: string
          status: string
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          days_count?: number
          employee_id: string
          end_date: string
          id?: string
          leave_type_id: string
          reason?: string | null
          start_date: string
          status?: string
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          days_count?: number
          employee_id?: string
          end_date?: string
          id?: string
          leave_type_id?: string
          reason?: string | null
          start_date?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leave_requests_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_requests_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_requests_leave_type_id_fkey"
            columns: ["leave_type_id"]
            isOneToOne: false
            referencedRelation: "leave_types"
            referencedColumns: ["id"]
          },
        ]
      }
      leave_types: {
        Row: {
          code: string
          created_at: string
          default_days: number
          id: string
          is_active: boolean
          is_paid: boolean
          name: string
        }
        Insert: {
          code: string
          created_at?: string
          default_days?: number
          id?: string
          is_active?: boolean
          is_paid?: boolean
          name: string
        }
        Update: {
          code?: string
          created_at?: string
          default_days?: number
          id?: string
          is_active?: boolean
          is_paid?: boolean
          name?: string
        }
        Relationships: []
      }
      legal_pages: {
        Row: {
          body: string | null
          id: string
          published_at: string | null
          slug: string
          title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          body?: string | null
          id?: string
          published_at?: string | null
          slug: string
          title: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          body?: string | null
          id?: string
          published_at?: string | null
          slug?: string
          title?: string
          updated_at?: string
          updated_by?: string | null
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
      partner_payouts: {
        Row: {
          created_at: string
          created_by: string | null
          gross_revenue: number
          id: string
          notes: string | null
          paid_date: string | null
          partner_contact_id: string
          payout_amount: number
          payout_period: string
          reference_number: string | null
          share_pct: number
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          gross_revenue?: number
          id?: string
          notes?: string | null
          paid_date?: string | null
          partner_contact_id: string
          payout_amount?: number
          payout_period: string
          reference_number?: string | null
          share_pct?: number
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          gross_revenue?: number
          id?: string
          notes?: string | null
          paid_date?: string | null
          partner_contact_id?: string
          payout_amount?: number
          payout_period?: string
          reference_number?: string | null
          share_pct?: number
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_payouts_partner_contact_id_fkey"
            columns: ["partner_contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_terms: {
        Row: {
          created_at: string
          days: number
          description: string | null
          id: string
          is_active: boolean
          is_default: boolean
          name: string
        }
        Insert: {
          created_at?: string
          days?: number
          description?: string | null
          id?: string
          is_active?: boolean
          is_default?: boolean
          name: string
        }
        Update: {
          created_at?: string
          days?: number
          description?: string | null
          id?: string
          is_active?: boolean
          is_default?: boolean
          name?: string
        }
        Relationships: []
      }
      payroll_records: {
        Row: {
          allowances: number
          basic_salary: number
          created_at: string
          created_by: string | null
          deductions: number
          employee_id: string
          id: string
          net_pay: number
          notes: string | null
          pay_date: string
          pay_period: string
          status: string
          updated_at: string
        }
        Insert: {
          allowances?: number
          basic_salary?: number
          created_at?: string
          created_by?: string | null
          deductions?: number
          employee_id: string
          id?: string
          net_pay?: number
          notes?: string | null
          pay_date: string
          pay_period: string
          status?: string
          updated_at?: string
        }
        Update: {
          allowances?: number
          basic_salary?: number
          created_at?: string
          created_by?: string | null
          deductions?: number
          employee_id?: string
          id?: string
          net_pay?: number
          notes?: string | null
          pay_date?: string
          pay_period?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payroll_records_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      pipeline_stages: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          pipeline_key: string
          sort_order: number
          stage_color: string
          stage_key: string
          stage_label: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          pipeline_key?: string
          sort_order?: number
          stage_color?: string
          stage_key: string
          stage_label: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          pipeline_key?: string
          sort_order?: number
          stage_color?: string
          stage_key?: string
          stage_label?: string
          updated_at?: string
        }
        Relationships: []
      }
      pipeline_sub_statuses: {
        Row: {
          color_class: string
          created_at: string
          id: string
          is_active: boolean
          sort_order: number
          stage_id: string
          sub_status_key: string
          sub_status_label: string
        }
        Insert: {
          color_class?: string
          created_at?: string
          id?: string
          is_active?: boolean
          sort_order?: number
          stage_id: string
          sub_status_key: string
          sub_status_label: string
        }
        Update: {
          color_class?: string
          created_at?: string
          id?: string
          is_active?: boolean
          sort_order?: number
          stage_id?: string
          sub_status_key?: string
          sub_status_label?: string
        }
        Relationships: [
          {
            foreignKeyName: "pipeline_sub_statuses_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "pipeline_stages"
            referencedColumns: ["id"]
          },
        ]
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
      salary_components: {
        Row: {
          calculation_type: string
          code: string
          component_type: string
          created_at: string
          default_value: number
          id: string
          is_active: boolean
          is_taxable: boolean
          name: string
          sort_order: number
        }
        Insert: {
          calculation_type?: string
          code: string
          component_type?: string
          created_at?: string
          default_value?: number
          id?: string
          is_active?: boolean
          is_taxable?: boolean
          name: string
          sort_order?: number
        }
        Update: {
          calculation_type?: string
          code?: string
          component_type?: string
          created_at?: string
          default_value?: number
          id?: string
          is_active?: boolean
          is_taxable?: boolean
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      service_catalog: {
        Row: {
          created_at: string
          default_rate: number
          description: string | null
          id: string
          is_active: boolean
          name: string
          sac_code: string | null
          tax_rate_id: string | null
          unit: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          default_rate?: number
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          sac_code?: string | null
          tax_rate_id?: string | null
          unit?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          default_rate?: number
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          sac_code?: string | null
          tax_rate_id?: string | null
          unit?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_catalog_tax_rate_id_fkey"
            columns: ["tax_rate_id"]
            isOneToOne: false
            referencedRelation: "tax_rates"
            referencedColumns: ["id"]
          },
        ]
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
      support_automation_rules: {
        Row: {
          actions: Json
          conditions: Json
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          sort_order: number | null
          trigger_type: string
          updated_at: string
        }
        Insert: {
          actions?: Json
          conditions?: Json
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          sort_order?: number | null
          trigger_type?: string
          updated_at?: string
        }
        Update: {
          actions?: Json
          conditions?: Json
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          sort_order?: number | null
          trigger_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      support_documents: {
        Row: {
          category: string
          created_at: string
          created_by: string | null
          description: string | null
          file_name: string
          file_size_kb: number | null
          file_type: string
          file_url: string
          id: string
          sort_order: number | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          file_name: string
          file_size_kb?: number | null
          file_type?: string
          file_url: string
          id?: string
          sort_order?: number | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          file_name?: string
          file_size_kb?: number | null
          file_type?: string
          file_url?: string
          id?: string
          sort_order?: number | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      support_escalation_matrix: {
        Row: {
          assigned_user_id: string | null
          created_at: string
          department: string
          id: string
          is_active: boolean | null
          level: number
          notification_channels: string[] | null
          product: string | null
          role_title: string
          tat_breach_hours: number
        }
        Insert: {
          assigned_user_id?: string | null
          created_at?: string
          department?: string
          id?: string
          is_active?: boolean | null
          level?: number
          notification_channels?: string[] | null
          product?: string | null
          role_title: string
          tat_breach_hours?: number
        }
        Update: {
          assigned_user_id?: string | null
          created_at?: string
          department?: string
          id?: string
          is_active?: boolean | null
          level?: number
          notification_channels?: string[] | null
          product?: string | null
          role_title?: string
          tat_breach_hours?: number
        }
        Relationships: []
      }
      support_issue_categories: {
        Row: {
          created_at: string
          description: string | null
          icon_name: string | null
          id: string
          is_active: boolean | null
          name: string
          slug: string
          sort_order: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          slug: string
          sort_order?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          slug?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      support_issue_types: {
        Row: {
          auto_assign_team: string | null
          category_id: string
          created_at: string
          description: string | null
          escalation_path: Json | null
          id: string
          is_active: boolean | null
          issue_code: string
          keyword_triggers: string[] | null
          priority: string
          product: string
          regulator: string | null
          required_documents: string[] | null
          risk_tag: string | null
          sort_order: number | null
          tat_hours: number
          title: string
          updated_at: string
        }
        Insert: {
          auto_assign_team?: string | null
          category_id: string
          created_at?: string
          description?: string | null
          escalation_path?: Json | null
          id?: string
          is_active?: boolean | null
          issue_code: string
          keyword_triggers?: string[] | null
          priority?: string
          product?: string
          regulator?: string | null
          required_documents?: string[] | null
          risk_tag?: string | null
          sort_order?: number | null
          tat_hours?: number
          title: string
          updated_at?: string
        }
        Update: {
          auto_assign_team?: string | null
          category_id?: string
          created_at?: string
          description?: string | null
          escalation_path?: Json | null
          id?: string
          is_active?: boolean | null
          issue_code?: string
          keyword_triggers?: string[] | null
          priority?: string
          product?: string
          regulator?: string | null
          required_documents?: string[] | null
          risk_tag?: string | null
          sort_order?: number | null
          tat_hours?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_issue_types_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "support_issue_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          assigned_to: string | null
          auto_assigned: boolean | null
          channel: Database["public"]["Enums"]["ticket_channel"]
          closed_at: string | null
          contact_email: string | null
          contact_id: string | null
          contact_name: string | null
          contact_phone: string | null
          created_at: string
          created_by: string | null
          department: string | null
          description: string | null
          documents_required: string[] | null
          documents_submitted: string[] | null
          due_date: string | null
          escalation_level: number | null
          first_response_at: string | null
          id: string
          issue_category_id: string | null
          issue_code: string | null
          issue_type_id: string | null
          priority: Database["public"]["Enums"]["ticket_priority"]
          product: string | null
          regulator: string | null
          resolved_at: string | null
          risk_tag: string | null
          status: Database["public"]["Enums"]["ticket_status"]
          subject: string
          tags: string[] | null
          tat_deadline: string | null
          tat_hours: number | null
          ticket_number: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          auto_assigned?: boolean | null
          channel?: Database["public"]["Enums"]["ticket_channel"]
          closed_at?: string | null
          contact_email?: string | null
          contact_id?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          created_by?: string | null
          department?: string | null
          description?: string | null
          documents_required?: string[] | null
          documents_submitted?: string[] | null
          due_date?: string | null
          escalation_level?: number | null
          first_response_at?: string | null
          id?: string
          issue_category_id?: string | null
          issue_code?: string | null
          issue_type_id?: string | null
          priority?: Database["public"]["Enums"]["ticket_priority"]
          product?: string | null
          regulator?: string | null
          resolved_at?: string | null
          risk_tag?: string | null
          status?: Database["public"]["Enums"]["ticket_status"]
          subject: string
          tags?: string[] | null
          tat_deadline?: string | null
          tat_hours?: number | null
          ticket_number?: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          auto_assigned?: boolean | null
          channel?: Database["public"]["Enums"]["ticket_channel"]
          closed_at?: string | null
          contact_email?: string | null
          contact_id?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          created_by?: string | null
          department?: string | null
          description?: string | null
          documents_required?: string[] | null
          documents_submitted?: string[] | null
          due_date?: string | null
          escalation_level?: number | null
          first_response_at?: string | null
          id?: string
          issue_category_id?: string | null
          issue_code?: string | null
          issue_type_id?: string | null
          priority?: Database["public"]["Enums"]["ticket_priority"]
          product?: string | null
          regulator?: string | null
          resolved_at?: string | null
          risk_tag?: string | null
          status?: Database["public"]["Enums"]["ticket_status"]
          subject?: string
          tags?: string[] | null
          tat_deadline?: string | null
          tat_hours?: number | null
          ticket_number?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_tickets_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_tickets_issue_category_id_fkey"
            columns: ["issue_category_id"]
            isOneToOne: false
            referencedRelation: "support_issue_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_tickets_issue_type_id_fkey"
            columns: ["issue_type_id"]
            isOneToOne: false
            referencedRelation: "support_issue_types"
            referencedColumns: ["id"]
          },
        ]
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
      tax_rates: {
        Row: {
          created_at: string
          description: string | null
          hsn_sac_code: string | null
          id: string
          is_active: boolean
          name: string
          rate: number
          tax_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          hsn_sac_code?: string | null
          id?: string
          is_active?: boolean
          name: string
          rate?: number
          tax_type?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          hsn_sac_code?: string | null
          id?: string
          is_active?: boolean
          name?: string
          rate?: number
          tax_type?: string
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
      ticket_escalation_log: {
        Row: {
          created_at: string
          escalated_to_name: string | null
          escalated_to_user_id: string | null
          from_level: number | null
          id: string
          reason: string
          ticket_id: string
          to_level: number
        }
        Insert: {
          created_at?: string
          escalated_to_name?: string | null
          escalated_to_user_id?: string | null
          from_level?: number | null
          id?: string
          reason?: string
          ticket_id: string
          to_level: number
        }
        Update: {
          created_at?: string
          escalated_to_name?: string | null
          escalated_to_user_id?: string | null
          from_level?: number | null
          id?: string
          reason?: string
          ticket_id?: string
          to_level?: number
        }
        Relationships: [
          {
            foreignKeyName: "ticket_escalation_log_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_replies: {
        Row: {
          body: string
          created_at: string
          id: string
          is_internal: boolean
          reply_by_email: string | null
          reply_by_name: string | null
          reply_by_user_id: string | null
          ticket_id: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          is_internal?: boolean
          reply_by_email?: string | null
          reply_by_name?: string | null
          reply_by_user_id?: string | null
          ticket_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          is_internal?: boolean
          reply_by_email?: string | null
          reply_by_name?: string | null
          reply_by_user_id?: string | null
          ticket_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_replies_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          department: Database["public"]["Enums"]["department"] | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          department?: Database["public"]["Enums"]["department"] | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          department?: Database["public"]["Enums"]["department"] | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      workflow_logs: {
        Row: {
          actions_executed: Json
          created_at: string
          entity_id: string
          entity_type: string
          error_message: string | null
          execution_time_ms: number | null
          id: string
          rule_id: string
          status: string
          trigger_event: string
        }
        Insert: {
          actions_executed?: Json
          created_at?: string
          entity_id: string
          entity_type: string
          error_message?: string | null
          execution_time_ms?: number | null
          id?: string
          rule_id: string
          status?: string
          trigger_event: string
        }
        Update: {
          actions_executed?: Json
          created_at?: string
          entity_id?: string
          entity_type?: string
          error_message?: string | null
          execution_time_ms?: number | null
          id?: string
          rule_id?: string
          status?: string
          trigger_event?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_logs_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "workflow_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_rules: {
        Row: {
          actions: Json
          conditions: Json
          created_at: string
          created_by: string | null
          description: string | null
          entity_type: string
          id: string
          is_active: boolean
          name: string
          priority: number
          trigger_event: string
          trigger_field: string | null
          trigger_value: string | null
          updated_at: string
        }
        Insert: {
          actions?: Json
          conditions?: Json
          created_at?: string
          created_by?: string | null
          description?: string | null
          entity_type?: string
          id?: string
          is_active?: boolean
          name: string
          priority?: number
          trigger_event?: string
          trigger_field?: string | null
          trigger_value?: string | null
          updated_at?: string
        }
        Update: {
          actions?: Json
          conditions?: Json
          created_at?: string
          created_by?: string | null
          description?: string | null
          entity_type?: string
          id?: string
          is_active?: boolean
          name?: string
          priority?: number
          trigger_event?: string
          trigger_field?: string | null
          trigger_value?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_department_access: {
        Args: {
          _dept: Database["public"]["Enums"]["department"]
          _user_id: string
        }
        Returns: boolean
      }
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
      validate_deal_transition: {
        Args: {
          _deal_id: string
          _to_stage: Database["public"]["Enums"]["crm_stage"]
          _to_sub_status: Database["public"]["Enums"]["crm_sub_status"]
        }
        Returns: Json
      }
    }
    Enums: {
      app_role: "super_admin" | "admin" | "editor"
      article_format: "Text" | "Image" | "Audio" | "Video"
      bulletin_priority: "info" | "important" | "warning" | "success"
      contact_relationship: "client" | "partner" | "principal"
      content_status: "draft" | "published" | "archived"
      crm_activity_type:
        | "call"
        | "email"
        | "meeting"
        | "note"
        | "task"
        | "follow_up"
      crm_stage: "enquiry" | "qualified" | "account" | "status"
      crm_sub_status:
        | "contacted"
        | "not_reachable"
        | "not_interested"
        | "dnd"
        | "cold"
        | "warm"
        | "hot"
        | "documentation"
        | "kyc"
        | "profile"
        | "mandate"
        | "active"
        | "dormant"
      department:
        | "marketing"
        | "sales"
        | "hr"
        | "accounts"
        | "support"
        | "legal"
      ticket_channel: "phone" | "walk_in" | "website" | "email" | "portal"
      ticket_priority: "low" | "medium" | "high" | "urgent"
      ticket_status:
        | "open"
        | "in_progress"
        | "waiting_on_customer"
        | "resolved"
        | "closed"
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
      contact_relationship: ["client", "partner", "principal"],
      content_status: ["draft", "published", "archived"],
      crm_activity_type: [
        "call",
        "email",
        "meeting",
        "note",
        "task",
        "follow_up",
      ],
      crm_stage: ["enquiry", "qualified", "account", "status"],
      crm_sub_status: [
        "contacted",
        "not_reachable",
        "not_interested",
        "dnd",
        "cold",
        "warm",
        "hot",
        "documentation",
        "kyc",
        "profile",
        "mandate",
        "active",
        "dormant",
      ],
      department: ["marketing", "sales", "hr", "accounts", "support", "legal"],
      ticket_channel: ["phone", "walk_in", "website", "email", "portal"],
      ticket_priority: ["low", "medium", "high", "urgent"],
      ticket_status: [
        "open",
        "in_progress",
        "waiting_on_customer",
        "resolved",
        "closed",
      ],
    },
  },
} as const
