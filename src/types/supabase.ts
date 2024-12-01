export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          created_at: string;
          avatar_url?: string;
        };
        Insert: {
          id: string;
          username: string;
          created_at?: string;
          avatar_url?: string;
        };
        Update: {
          id?: string;
          username?: string;
          created_at?: string;
          avatar_url?: string;
        };
      };
      visual_spaces: {
        Row: {
          id: string;
          created_at: string;
          title: string;
          last_modified: string;
          user_id: string;
          preview_url?: string | null;
          description?: string | null;
          metadata?: Json | null;
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          last_modified?: string
          user_id: string
          preview_url?: string | null
          description?: string | null
          metadata?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          last_modified?: string
          user_id?: string
          preview_url?: string | null
          description?: string | null
          metadata?: Json | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
