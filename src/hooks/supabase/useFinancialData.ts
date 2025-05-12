
import { useState, useEffect } from 'react';
import { PostgrestError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';

// Types
export interface FinancialStats {
  id: string;
  month: string;
  year: number;
  total_revenue: number;
  total_expenses: number;
  net_profit: number;
  active_memberships: number;
  previous_month_revenue: number | null;
  previous_month_expenses: number | null;
  previous_month_profit: number | null;
  previous_month_memberships: number | null;
}

export interface RevenueSource {
  id: string;
  name: string;
  amount: number;
  percentage: number;
  month: string;
  year: number;
}

export interface ExpenseBreakdown {
  id: string;
  category: string;
  amount: number;
  percentage: number;
  month: string;
  year: number;
}

export interface MembershipRevenue {
  id: string;
  plan_name: string;
  amount: number;
  active_members: number;
  month: string;
  year: number;
}

export interface FinancialTransaction {
  id: string;
  transaction_date: string;
  transaction_type: 'revenue' | 'expense';
  category: string;
  amount: number;
  description: string | null;
  payment_method: string | null;
}

// Hook to fetch financial statistics
export function useFinancialStats(month?: string, year?: number) {
  const [data, setData] = useState<FinancialStats | null>(null);
  const [error, setError] = useState<PostgrestError | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { session } = useAuth();

  const currentMonth = month || format(new Date(), 'MMMM');
  const currentYear = year || new Date().getFullYear();

  useEffect(() => {
    const fetchData = async () => {
      if (!session) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      
      try {
        const { data: result, error: queryError } = await supabase
          .from('financial_stats')
          .select('*')
          .eq('month', currentMonth)
          .eq('year', currentYear)
          .single();
        
        if (queryError) throw queryError;
        
        setData(result as FinancialStats);
      } catch (err) {
        console.error('Error fetching financial stats:', err);
        setError(err instanceof Error ? err as PostgrestError : new Error('Unknown error occurred') as PostgrestError);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [session, currentMonth, currentYear]);

  return { data, error, isLoading };
}

// Hook to fetch revenue sources
export function useRevenueSources(month?: string, year?: number) {
  const [data, setData] = useState<RevenueSource[] | null>(null);
  const [error, setError] = useState<PostgrestError | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { session } = useAuth();

  const currentMonth = month || format(new Date(), 'MMMM');
  const currentYear = year || new Date().getFullYear();

  useEffect(() => {
    const fetchData = async () => {
      if (!session) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      
      try {
        const { data: result, error: queryError } = await supabase
          .from('revenue_sources')
          .select('*')
          .eq('month', currentMonth)
          .eq('year', currentYear);
        
        if (queryError) throw queryError;
        
        setData(result as RevenueSource[]);
      } catch (err) {
        console.error('Error fetching revenue sources:', err);
        setError(err instanceof Error ? err as PostgrestError : new Error('Unknown error occurred') as PostgrestError);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [session, currentMonth, currentYear]);

  return { data, error, isLoading };
}

// Hook to fetch expense breakdown
export function useExpenseBreakdown(month?: string, year?: number) {
  const [data, setData] = useState<ExpenseBreakdown[] | null>(null);
  const [error, setError] = useState<PostgrestError | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { session } = useAuth();

  const currentMonth = month || format(new Date(), 'MMMM');
  const currentYear = year || new Date().getFullYear();

  useEffect(() => {
    const fetchData = async () => {
      if (!session) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      
      try {
        const { data: result, error: queryError } = await supabase
          .from('expense_breakdown')
          .select('*')
          .eq('month', currentMonth)
          .eq('year', currentYear);
        
        if (queryError) throw queryError;
        
        setData(result as ExpenseBreakdown[]);
      } catch (err) {
        console.error('Error fetching expense breakdown:', err);
        setError(err instanceof Error ? err as PostgrestError : new Error('Unknown error occurred') as PostgrestError);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [session, currentMonth, currentYear]);

  return { data, error, isLoading };
}

// Hook to fetch membership revenue
export function useMembershipRevenue(month?: string, year?: number) {
  const [data, setData] = useState<MembershipRevenue[] | null>(null);
  const [error, setError] = useState<PostgrestError | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { session } = useAuth();

  const currentMonth = month || format(new Date(), 'MMMM');
  const currentYear = year || new Date().getFullYear();

  useEffect(() => {
    const fetchData = async () => {
      if (!session) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      
      try {
        const { data: result, error: queryError } = await supabase
          .from('membership_revenue')
          .select('*')
          .eq('month', currentMonth)
          .eq('year', currentYear);
        
        if (queryError) throw queryError;
        
        setData(result as MembershipRevenue[]);
      } catch (err) {
        console.error('Error fetching membership revenue:', err);
        setError(err instanceof Error ? err as PostgrestError : new Error('Unknown error occurred') as PostgrestError);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [session, currentMonth, currentYear]);

  return { data, error, isLoading };
}

// Hook to fetch recent transactions
export function useRecentTransactions(limit = 4) {
  const [data, setData] = useState<FinancialTransaction[] | null>(null);
  const [error, setError] = useState<PostgrestError | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { session } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (!session) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      
      try {
        const { data: result, error: queryError } = await supabase
          .from('financial_transactions')
          .select('*')
          .order('transaction_date', { ascending: false })
          .limit(limit);
        
        if (queryError) throw queryError;
        
        setData(result as FinancialTransaction[]);
      } catch (err) {
        console.error('Error fetching recent transactions:', err);
        setError(err instanceof Error ? err as PostgrestError : new Error('Unknown error occurred') as PostgrestError);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [session, limit]);

  return { data, error, isLoading };
}
