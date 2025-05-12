
import { useState, useEffect } from 'react';
import { PostgrestError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { 
  QueryOptions, 
  QueryResult, 
  TableOrViewName, 
  TableOrViewRow,
  isTable,
  isView
} from './types';

/**
 * Hook for executing read operations against Supabase tables/views
 * @param options Query configuration options
 * @returns Query result with data, error and loading state
 */
export function useSupabaseQuery<
  TName extends TableOrViewName,
  TRecord = TableOrViewRow<TName>
>(options: QueryOptions<TName>): QueryResult<TRecord> {
  const { table, columns = '*', filters = [], orderBy, limit, single = false } = options;
  const [data, setData] = useState<TRecord | null>(null);
  const [error, setError] = useState<PostgrestError | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { session } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Initialize query based on whether we're accessing a table or view
        let query;
        
        if (table === 'profiles') {
          query = supabase.from('profiles').select(columns);
        } else if (table === 'user_stats_view') {
          query = supabase.from('user_stats_view').select(columns);
        } else {
          throw new Error(`Unknown table or view: ${String(table)}`);
        }
        
        // Apply filters
        filters.forEach(filter => {
          const { column, operator, value } = filter;
          
          switch (operator) {
            case 'eq':
              query = query.eq(column, value);
              break;
            case 'neq':
              query = query.neq(column, value);
              break;
            case 'gt':
              query = query.gt(column, value);
              break;
            case 'lt':
              query = query.lt(column, value);
              break;
            case 'gte':
              query = query.gte(column, value);
              break;
            case 'lte':
              query = query.lte(column, value);
              break;
            case 'like':
              query = query.like(column, value);
              break;
            case 'ilike':
              query = query.ilike(column, value);
              break;
            default:
              break;
          }
        });
        
        // Apply ordering
        if (orderBy) {
          query = query.order(orderBy.column, { ascending: orderBy.ascending ?? true });
        }
        
        // Apply limit
        if (limit) {
          query = query.limit(limit);
        }
        
        // Execute query and handle response
        const { data: result, error: queryError } = single 
          ? await query.maybeSingle() 
          : await query;
        
        if (queryError) {
          throw queryError;
        }
        
        setData(result as TRecord);
        setError(null);
      } catch (err) {
        console.error(`Error fetching data from ${String(table)}:`, err);
        setError(err as PostgrestError);
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (session) {
      fetchData();
    } else {
      setIsLoading(false);
    }
  }, [table, columns, JSON.stringify(filters), orderBy, limit, single, session]);
  
  return { data, error, isLoading };
}
