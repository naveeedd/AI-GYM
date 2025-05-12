
import { useState } from 'react';
import { PostgrestError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { 
  DatabaseTable, 
  TableInsert, 
  TableRow, 
  TableUpdate
} from './types';

/**
 * Hook for executing write operations (insert, update, delete) against Supabase tables
 * @returns Object containing mutation methods and state
 */
export function useSupabaseMutation<
  TName extends DatabaseTable,
  TRecord = TableRow<TName>,
  TInsert extends TableInsert<TName> = TableInsert<TName>,
  TUpdate extends TableUpdate<TName> = TableUpdate<TName>
>() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<PostgrestError | null>(null);
  const { session } = useAuth();
  
  /**
   * Insert new data into a table
   * @param table The table name
   * @param data The data to insert (single object or array of objects)
   * @returns The inserted data
   */
  const insert = async (table: TName, data: TInsert | TInsert[]) => {
    if (!session) {
      throw new Error('Authentication required');
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const query = supabase
        .from(table)
        .insert(data as any) // Type assertion needed due to Supabase's complex typing
        .select();
        
      const { data: result, error: insertError } = await query;
        
      if (insertError) throw insertError;
      
      return result;
    } catch (err) {
      const postgrestError = err as PostgrestError;
      setError(postgrestError);
      throw postgrestError;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Update existing data in a table
   * @param table The table name
   * @param id The id of the record to update
   * @param data The data to update
   * @returns The updated data
   */
  const update = async (table: TName, id: string, data: TUpdate) => {
    if (!session) {
      throw new Error('Authentication required');
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const query = supabase
        .from(table)
        .update(data as any) // Type assertion needed due to Supabase's complex typing
        .eq('id' as any, id)
        .select();
        
      const { data: result, error: updateError } = await query;
        
      if (updateError) throw updateError;
      
      return result;
    } catch (err) {
      const postgrestError = err as PostgrestError;
      setError(postgrestError);
      throw postgrestError;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Delete data from a table
   * @param table The table name
   * @param id The id of the record to delete
   * @returns true if successful
   */
  const remove = async (table: TName, id: string) => {
    if (!session) {
      throw new Error('Authentication required');
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { error: deleteError } = await supabase
        .from(table)
        .delete()
        .eq('id' as any, id);
        
      if (deleteError) throw deleteError;
      
      return true;
    } catch (err) {
      const postgrestError = err as PostgrestError;
      setError(postgrestError);
      throw postgrestError;
    } finally {
      setIsLoading(false);
    }
  };
  
  return { insert, update, remove, isLoading, error };
}
