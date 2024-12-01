export interface UserProfile {
  id: string;
  username: string;
  email?: string;
  created_at?: string;
  auth_provider?: string;
}

export interface PasswordRequirements {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  special: boolean;
}
