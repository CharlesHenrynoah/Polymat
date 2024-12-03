export interface VisualSpaceData {
  id: string;
  title: string;
  description: string;
  user_id: string;
  created_at: string;
  last_modified: string;
  last_accessed: string;
}

export interface UserData {
  id: string;
  username: string;
  email: string;
  profile_image: string | null;
  first_name?: string;
  last_name?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
  last_login?: string;
  is_active?: boolean;
  role?: string;
  preferences?: Record<string, any>;
}
