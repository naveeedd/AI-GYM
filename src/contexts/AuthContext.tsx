
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Database } from '@/integrations/supabase/types';
import { useNavigate } from 'react-router-dom';

// Define types for user profile
type Profile = Database['public']['Tables']['profiles']['Row'];

type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: () => boolean;
  hasActiveSubscription: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state changed:', event);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          // Use setTimeout to avoid recursive call issues
          setTimeout(async () => {
            await fetchUserProfile(currentSession.user.id);
          }, 0);
          
          // Redirect to appropriate dashboard based on role
          if (event === 'SIGNED_IN') {
            // Delay redirect to give time for profile to load
            setTimeout(() => {
              redirectBasedOnRole();
            }, 500);
          }
        } else {
          setProfile(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        fetchUserProfile(currentSession.user.id);
      }
    }).finally(() => {
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }
      
      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Profile fetch error:', error);
    }
  };
  
  const redirectBasedOnRole = () => {
    if (profile?.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/user');
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
      }
    } catch (error) {
      const authError = error as AuthError;
      console.error('Login error:', authError);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: authError.message || "Invalid email or password.",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        toast({
          title: "Account created",
          description: "Welcome to FitLife Gym!",
        });
      }
    } catch (error) {
      const authError = error as AuthError;
      console.error('Signup error:', authError);
      toast({
        variant: "destructive",
        title: "Signup failed",
        description: authError.message || "An error occurred during signup.",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      navigate('/login');
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: "An error occurred during logout.",
      });
    }
  };

  const isAdmin = () => {
    return profile?.role === 'admin';
  };
  
  const hasActiveSubscription = async () => {
    if (!user) return false;
    
    try {
      // Updated to match the SubscriptionCheck component method
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .gt('end_date', new Date().toISOString())
        .maybeSingle();
        
      if (error) {
        console.error('Error checking subscription:', error);
        return false;
      }
      
      return Boolean(data);
    } catch (error) {
      console.error('Subscription check error:', error);
      return false;
    }
  };

  const value = {
    user,
    profile,
    session,
    isLoading,
    login,
    signup,
    logout,
    isAdmin,
    hasActiveSubscription,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
