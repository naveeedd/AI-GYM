
import { Json } from '@/integrations/supabase/types';

// Extend the existing RPC functions
declare module '@supabase/supabase-js' {
  interface SupabaseClient {
    rpc<T = any>(
      fn: 'calculate_bmr' | 'days_since_last_visit' | 'is_admin' | 'is_subscription_active' | 'has_active_subscription' | 'record_attendance',
      params?: object,
    ): { data: T; error: PostgrestError };
  }
}

// Define the types for our admin dashboard stats
export interface DashboardStats {
  total_users: number;
  total_admins: number;
  total_regular_users: number;
  active_subscriptions: number;
  today_attendance: number;
  today_orders: number;
  today_revenue: number;
  low_stock_items: number;
}

// Define the MembershipPlan type to handle JSON features
export interface MembershipPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  duration_days: number;
  features: Record<string, boolean>;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

// Define the proper Order type with more specific status types
export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_method: string;
  delivery_address: string;
  created_at: string;
  updated_at?: string;
  items?: OrderItem[];
}
