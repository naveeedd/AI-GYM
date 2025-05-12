import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, AlertTriangle, Loader } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { MembershipPlan } from "@/types/supabase-extensions";
import { Json } from "@/integrations/supabase/types";
import { useSubscription } from "@/hooks/supabase/useSubscription";

interface UserSubscription {
  id: string;
  plan_id: string;
  start_date: string;
  end_date: string;
  payment_status: string;
  is_active: boolean;
}

const UserSubscription = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { isLoading: purchaseLoading, purchaseSubscription } = useSubscription();
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<UserSubscription | null>(null);
  const [currentPlan, setCurrentPlan] = useState<MembershipPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const { data, error } = await supabase
          .from('membership_plans')
          .select('*')
          .eq('is_active', true);
          
        if (error) throw error;
        
        // Convert Json features to proper Record<string, boolean>
        const parsedPlans = (data || []).map(plan => ({
          ...plan,
          features: parseFeatures(plan.features)
        })) as MembershipPlan[];

        setPlans(parsedPlans);
      } catch (error) {
        console.error('Error fetching plans:', error);
      }
    };
    
    const fetchUserSubscription = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('user_subscriptions')
          .select('*, membership_plans(*)')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .maybeSingle();
          
        if (error) throw error;
        
        if (data) {
          setCurrentSubscription(data);
          // Parse the features to ensure they're properly typed
          if (data.membership_plans) {
            setCurrentPlan({
              ...data.membership_plans,
              features: parseFeatures(data.membership_plans.features)
            });
          }
        }
        
        // Fetch payment history
        const { data: paymentData, error: paymentError } = await supabase
          .from('user_subscriptions')
          .select('*, membership_plans(name, price)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);
          
        if (paymentError) throw paymentError;
        
        setPaymentHistory(paymentData || []);
        
      } catch (error) {
        console.error('Error fetching subscription:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPlans();
    fetchUserSubscription();
  }, [user]);

  // Helper to parse features from JSON
  const parseFeatures = (features: Json): Record<string, boolean> => {
    if (!features) return {};
    
    // If it's already an object, try to use it directly
    if (typeof features === 'object' && features !== null && !Array.isArray(features)) {
      return features as Record<string, boolean>;
    }
    
    // Otherwise, parse from string if needed
    try {
      if (typeof features === 'string') {
        return JSON.parse(features) as Record<string, boolean>;
      }
      return {};
    } catch (e) {
      console.error('Error parsing features:', e);
      return {};
    }
  };
  
  const handlePurchaseSubscription = async (planId: string) => {
    const success = await purchaseSubscription(planId);
    
    if (success) {
      // Refresh subscription data
      const { data } = await supabase
        .from('user_subscriptions')
        .select('*, membership_plans(*)')
        .eq('user_id', user?.id)
        .eq('is_active', true)
        .maybeSingle();
      
      if (data) {
        setCurrentSubscription(data);
        setCurrentPlan({
          ...data.membership_plans,
          features: parseFeatures(data.membership_plans.features)
        });
        
        // Refresh payment history
        const { data: historyData } = await supabase
          .from('user_subscriptions')
          .select('*, membership_plans(name, price)')
          .eq('user_id', user?.id)
          .order('created_at', { ascending: false })
          .limit(10);
        
        if (historyData) {
          setPaymentHistory(historyData);
        }
      }
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="h-8 w-8 animate-spin text-gym-secondary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Your Subscription</h1>
      
      {!currentSubscription && (
        <div className="mb-6">
          <Card className="border-2 border-orange-400 bg-orange-50">
            <CardContent className="pt-6">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 mr-2 text-orange-500 mt-0.5" />
                <div>
                  <h3 className="font-medium">No Active Subscription</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    You don't have an active subscription. Please choose a plan below to access all features.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {currentSubscription && currentPlan && (
          <Card className="border-2 border-gym-secondary">
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>{currentPlan.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <p className="text-2xl font-bold">${currentPlan.price}<span className="text-sm font-normal text-gray-500">/month</span></p>
                <p className="text-sm text-gray-500">Next billing date: {formatDate(currentSubscription.end_date)}</p>
              </div>
              <ul className="space-y-2 mb-4">
                {Object.entries(currentPlan.features || {}).map(([feature, enabled]) => (
                  <li key={feature} className="flex items-center text-sm">
                    <Check className={`h-4 w-4 mr-2 ${enabled ? 'text-green-500' : 'text-gray-400'}`} />
                    {feature.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full">Manage Plan</Button>
            </CardContent>
          </Card>
        )}
        
        {plans.map((plan) => (
          <Card 
            key={plan.id} 
            className={currentPlan?.id === plan.id ? 'opacity-60' : ''}
          >
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <p className="text-2xl font-bold">${plan.price}<span className="text-sm font-normal text-gray-500">/month</span></p>
              </div>
              <ul className="space-y-2 mb-4">
                {Object.entries(plan.features || {}).map(([feature, enabled]) => (
                  <li key={feature} className="flex items-center text-sm">
                    <Check className={`h-4 w-4 mr-2 ${enabled ? 'text-green-500' : 'text-gray-400'}`} />
                    {feature.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </li>
                ))}
              </ul>
              <Button 
                variant={currentPlan?.id === plan.id ? 'outline' : currentPlan && plan.price < currentPlan.price ? 'outline' : 'default'}
                className="w-full"
                disabled={purchaseLoading || currentPlan?.id === plan.id}
                onClick={() => handlePurchaseSubscription(plan.id)}
              >
                {purchaseLoading ? (
                  <><Loader className="h-4 w-4 mr-2 animate-spin" /> Processing...</>
                ) : currentPlan?.id === plan.id ? (
                  'Current Plan'
                ) : currentPlan && plan.price < currentPlan.price ? (
                  'Downgrade'
                ) : currentPlan ? (
                  'Upgrade'
                ) : (
                  'Subscribe'
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          {paymentHistory.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No payment history found</p>
          ) : (
            <div className="space-y-4">
              {paymentHistory.map((payment) => (
                <div key={payment.id} className="flex justify-between items-center pb-2 border-b">
                  <div>
                    <p className="font-medium">{payment.membership_plans?.name} Membership</p>
                    <p className="text-sm text-gray-500">{formatDate(payment.created_at)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${payment.membership_plans?.price}</p>
                    <p className="text-xs text-green-600">{payment.payment_status === 'completed' ? 'Paid' : payment.payment_status}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserSubscription;
