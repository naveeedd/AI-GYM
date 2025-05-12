
import { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoadingScreen from '@/components/ui/LoadingScreen';
import { supabase } from '@/integrations/supabase/client';

interface SubscriptionCheckProps {
  children: ReactNode;
}

const SubscriptionCheck = ({ children }: SubscriptionCheckProps) => {
  const { user, isLoading, session, isAdmin } = useAuth();
  const [hasSubscription, setHasSubscription] = useState<boolean | null>(null);
  const [checkingSubscription, setCheckingSubscription] = useState(true);

  useEffect(() => {
    const checkSubscription = async () => {
      if (!user) {
        setCheckingSubscription(false);
        return;
      }

      // If user is an admin, bypass subscription check and redirect to admin dashboard
      if (isAdmin()) {
        setHasSubscription(true);
        setCheckingSubscription(false);
        return;
      }

      try {
        // Query the user_subscriptions table directly using RLS
        const { data, error } = await supabase
          .from('user_subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .gt('end_date', new Date().toISOString())
          .maybeSingle();
          
        if (error) {
          console.error('Error checking subscription:', error);
          setHasSubscription(false);
        } else {
          // Convert any value to boolean to ensure type safety
          setHasSubscription(Boolean(data));
        }
      } catch (error) {
        console.error('Subscription check error:', error);
        setHasSubscription(false);
      } finally {
        setCheckingSubscription(false);
      }
    };

    if (user) {
      checkSubscription();
    } else {
      setCheckingSubscription(false);
    }
  }, [user, isAdmin]);

  if (isLoading || checkingSubscription) {
    return <LoadingScreen />;
  }

  if (!session || !user) {
    return <Navigate to="/login" />;
  }

  if (isAdmin()) {
    // If the user is an admin, redirect them to the admin dashboard
    return <Navigate to="/admin" />;
  }

  if (hasSubscription === false) {
    return <Navigate to="/user/subscription" />;
  }

  return <>{children}</>;
};

export default SubscriptionCheck;
