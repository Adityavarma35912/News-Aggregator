export interface User {
  userId: number;
  username: string;
  role: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, password: string) => Promise<void>;
  logout: () => void;
} 