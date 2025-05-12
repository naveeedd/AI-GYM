
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { MembershipPlan } from '@/types/supabase-extensions';

interface SubscriptionHookReturn {
  isLoading: boolean;
  purchaseSubscription: (planId: string) => Promise<boolean>;
  deactivateSubscription: (subscriptionId: string) => Promise<boolean>;
}

export const useSubscription = (): SubscriptionHookReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  /**
   * Purchase a subscription plan
   * @param planId The ID of the plan to purchase
   * @returns boolean indicating success
   */
  const purchaseSubscription = async (planId: string): Promise<boolean> => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to purchase a subscription",
      });
      return false;
    }
    
    setIsLoading(true);
    
    try {
      // Find the selected plan
      const { data: selectedPlan, error: planError } = await supabase
        .from('membership_plans')
        .select('*')
        .eq('id', planId)
        .maybeSingle();

      if (planError || !selectedPlan) {
        throw new Error(planError?.message || 'Plan not found');
      }
      
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + selectedPlan.duration_days);
      
      // Deactivate any existing subscription
      const { data: existingSubscription, error: fetchError } = await supabase
        .from('user_subscriptions')
        .select('id')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .maybeSingle();
        
      if (fetchError) throw fetchError;
      
      if (existingSubscription) {
        const { error: deactivateError } = await supabase
          .from('user_subscriptions')
          .update({ is_active: false })
          .eq('id', existingSubscription.id);
          
        if (deactivateError) throw deactivateError;
      }
      
      // Create new subscription
      const { data, error } = await supabase
        .from('user_subscriptions')
        .insert({
          user_id: user.id,
          plan_id: planId,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          payment_status: 'completed',
          payment_method: 'credit_card',
          is_active: true,
          auto_renew: false
        })
        .select()
        .single();
        
      if (error) throw error;
      
      toast({
        title: "Subscription Successful",
        description: `You have successfully subscribed to the ${selectedPlan.name} plan.`,
      });
      
      return true;
      
    } catch (error: any) {
      console.error('Error purchasing subscription:', error);
      toast({
        variant: "destructive",
        title: "Subscription Failed",
        description: error.message || "An error occurred while processing your subscription.",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Deactivate an existing subscription
   * @param subscriptionId The ID of the subscription to deactivate
   * @returns boolean indicating success
   */
  const deactivateSubscription = async (subscriptionId: string): Promise<boolean> => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to manage subscriptions",
      });
      return false;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('user_subscriptions')
        .update({ is_active: false })
        .eq('id', subscriptionId)
        .eq('user_id', user.id); // Ensure we only update user's own subscriptions
        
      if (error) throw error;
      
      toast({
        title: "Subscription Updated",
        description: "Your subscription has been deactivated.",
      });
      
      return true;
    } catch (error: any) {
      console.error('Error deactivating subscription:', error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error.message || "An error occurred while updating your subscription.",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    purchaseSubscription,
    deactivateSubscription
  };
};
