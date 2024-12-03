export type Database = {
  public: {
    Tables: {
      messages: {
        Row: {
          id: string
          created_at: string
          content: string
          role: string
          conversation_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          content: string
          role: string
          conversation_id: string
        }
        Update: {
          id?: string
          created_at?: string
          content?: string
          role?: string
          conversation_id?: string
        }
      }
      conversations: {
        Row: {
          id: string
          created_at: string
          title: string
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          user_id?: string
        }
      }
      visual_spaces: {
        Row: {
          id: string
          title: string
          description: string
          user_id: string
          created_at: string
          last_modified: string
          last_accessed: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          user_id: string
          created_at?: string
          last_modified?: string
          last_accessed?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          user_id?: string
          created_at?: string
          last_modified?: string
          last_accessed?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          username: string
          first_name: string
          last_name: string
          description: string
          profile_image: string | null
          created_at: string
          updated_at: string
          last_login: string
          is_active: boolean
          role: string
          preferences: string
        }
        Insert: {
          id?: string
          email: string
          username: string
          first_name: string
          last_name: string
          description: string
          profile_image?: string | null
          created_at?: string
          updated_at?: string
          last_login?: string
          is_active?: boolean
          role?: string
          preferences?: string
        }
        Update: {
          id?: string
          email?: string
          username?: string
          first_name?: string
          last_name?: string
          description?: string
          profile_image?: string | null
          created_at?: string
          updated_at?: string
          last_login?: string
          is_active?: boolean
          role?: string
          preferences?: string
        }
      }
    }
  }
}