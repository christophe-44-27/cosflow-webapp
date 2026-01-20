export interface AuthUser {
  id: number;
  email: string;
  is_admin: boolean;
  is_premium: boolean;
  is_verified: boolean;
  account_status: string;
  subscription_status: string;
  profile: {
    id: number;
    user_id: number;
    name: string;
    slug: string;
    description: string | null;
    locale: string;
    avatar: string;
    cover: string;
    has_avatar: boolean;
    has_cover: boolean;
    is_complete: boolean;
    completion_percentage: number;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  handleLoginRequired: () => void;
}
