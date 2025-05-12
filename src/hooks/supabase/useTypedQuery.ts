
import { TableOrViewName, TableOrViewRow } from './types';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';
import { PostgrestError } from '@supabase/supabase-js';

export function useTypedQuery<T extends TableOrViewName>(
  tableName: T,
  options: {
    columns?: string;
    filter?: { column: string; value: any }[];
    orderBy?: { column: string; ascending?: boolean };
    limit?: number;
  } = {}
) {
  const [data, setData] = useState<TableOrViewRow<T>[] | null>(null);
  const [error, setError] = useState<PostgrestError | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        // Use type assertion to ensure TypeScript knows this is a valid table/view name
        let query = supabase.from(tableName as any).select(options.columns || '*');

        // Apply filters
        if (options.filter && options.filter.length > 0) {
          options.filter.forEach(filter => {
            query = query.eq(filter.column, filter.value);
          });
        }

        // Apply ordering
        if (options.orderBy) {
          query = query.order(options.orderBy.column, {
            ascending: options.orderBy.ascending ?? true
          });
        }

        // Apply limit
        if (options.limit) {
          query = query.limit(options.limit);
        }

        const { data: result, error: queryError } = await query;

        if (queryError) throw queryError;
        // Use type assertion to ensure TypeScript knows the correct return type
        setData(result as unknown as TableOrViewRow<T>[]);
        
      } catch (err) {
        console.error(`Error fetching data from ${tableName}:`, err);
        setError(err instanceof Error ? err as PostgrestError : new Error('Unknown error occurred') as PostgrestError);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [tableName, options.columns, JSON.stringify(options.filter), 
      JSON.stringify(options.orderBy), options.limit]);

  return { data, error, isLoading };
}
