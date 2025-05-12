
import { PostgrestError } from '@supabase/supabase-js';
import { Database } from '@/integrations/supabase/types';

// Define tables types from the database type
export type Tables = Database['public']['Tables'];
export type Views = Database['public']['Views'];

// Define allowed table/view names
export type DatabaseTable = keyof Tables;
export type DatabaseView = keyof Views;
export type TableOrViewName = DatabaseTable | DatabaseView;

// Filter options type
export type FilterOption = {
  column: string;
  operator: 'eq' | 'neq' | 'gt' | 'lt' | 'gte' | 'lte' | 'like' | 'ilike';
  value: any;
};

// Base query options
export type QueryOptions<T extends TableOrViewName> = {
  table: T;
  columns?: string;
  filters?: FilterOption[];
  orderBy?: {
    column: string;
    ascending?: boolean;
  };
  limit?: number;
  single?: boolean;
};

// Query result type
export type QueryResult<TData> = {
  data: TData | null;
  error: PostgrestError | null;
  isLoading: boolean;
};

// Get row type from table name
export type TableRow<T extends DatabaseTable> = Tables[T]['Row'];
export type ViewRow<T extends DatabaseView> = Views[T]['Row'];
export type TableOrViewRow<T extends TableOrViewName> = 
  T extends DatabaseTable ? Tables[T]['Row'] : 
  T extends DatabaseView ? Views[T]['Row'] : 
  never;

// Get insert type from table name
export type TableInsert<T extends DatabaseTable> = Tables[T]['Insert'];

// Get update type from table name
export type TableUpdate<T extends DatabaseTable> = Tables[T]['Update'];

// Type assertion helpers for more precise typing
export function ensureTableName<T extends DatabaseTable>(name: T): T {
  return name;
}

export function ensureViewName<T extends DatabaseView>(name: T): T {
  return name;
}

// Type guard to check if a name is a table
export function isTable(name: TableOrViewName): name is DatabaseTable {
  return name === 'profiles';
}

// Type guard to check if a name is a view
export function isView(name: TableOrViewName): name is DatabaseView {
  return name === 'user_stats_view';
}
