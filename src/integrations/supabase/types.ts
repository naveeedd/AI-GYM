export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      attendance_records: {
        Row: {
          check_in_time: string
          check_out_time: string | null
          created_at: string | null
          created_by: string | null
          id: string
          location: string | null
          user_id: string | null
        }
        Insert: {
          check_in_time?: string
          check_out_time?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          location?: string | null
          user_id?: string | null
        }
        Update: {
          check_in_time?: string
          check_out_time?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          location?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attendance_records_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_records_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_stats_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "attendance_records_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_records_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_stats_view"
            referencedColumns: ["user_id"]
          },
        ]
      }
      diet_goals: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      expense_breakdown: {
        Row: {
          amount: number
          category: string
          created_at: string | null
          id: string
          month: string
          percentage: number
          year: number
        }
        Insert: {
          amount: number
          category: string
          created_at?: string | null
          id?: string
          month: string
          percentage: number
          year: number
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string | null
          id?: string
          month?: string
          percentage?: number
          year?: number
        }
        Relationships: []
      }
      expense_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          category_id: string | null
          created_at: string | null
          created_by: string | null
          description: string
          expense_date: string
          id: string
          receipt_image_url: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          category_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description: string
          expense_date: string
          id?: string
          receipt_image_url?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          category_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string
          expense_date?: string
          id?: string
          receipt_image_url?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expenses_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "expense_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_stats_view"
            referencedColumns: ["user_id"]
          },
        ]
      }
      financial_stats: {
        Row: {
          active_memberships: number
          created_at: string | null
          id: string
          month: string
          net_profit: number
          previous_month_expenses: number | null
          previous_month_memberships: number | null
          previous_month_profit: number | null
          previous_month_revenue: number | null
          total_expenses: number
          total_revenue: number
          updated_at: string | null
          year: number
        }
        Insert: {
          active_memberships: number
          created_at?: string | null
          id?: string
          month: string
          net_profit: number
          previous_month_expenses?: number | null
          previous_month_memberships?: number | null
          previous_month_profit?: number | null
          previous_month_revenue?: number | null
          total_expenses: number
          total_revenue: number
          updated_at?: string | null
          year: number
        }
        Update: {
          active_memberships?: number
          created_at?: string | null
          id?: string
          month?: string
          net_profit?: number
          previous_month_expenses?: number | null
          previous_month_memberships?: number | null
          previous_month_profit?: number | null
          previous_month_revenue?: number | null
          total_expenses?: number
          total_revenue?: number
          updated_at?: string | null
          year?: number
        }
        Relationships: []
      }
      financial_transactions: {
        Row: {
          amount: number
          category: string
          created_at: string | null
          description: string | null
          id: string
          payment_method: string | null
          transaction_date: string
          transaction_type: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          payment_method?: string | null
          transaction_date?: string
          transaction_type: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          payment_method?: string | null
          transaction_date?: string
          transaction_type?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      gym_locations: {
        Row: {
          address: string
          amenities: Json | null
          city: string
          country: string
          created_at: string | null
          email: string | null
          id: string
          is_active: boolean | null
          latitude: number | null
          longitude: number | null
          name: string
          operating_hours: Json | null
          phone_number: string | null
          state: string
          updated_at: string | null
          zip_code: string
        }
        Insert: {
          address: string
          amenities?: Json | null
          city: string
          country: string
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name: string
          operating_hours?: Json | null
          phone_number?: string | null
          state: string
          updated_at?: string | null
          zip_code: string
        }
        Update: {
          address?: string
          amenities?: Json | null
          city?: string
          country?: string
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          operating_hours?: Json | null
          phone_number?: string | null
          state?: string
          updated_at?: string | null
          zip_code?: string
        }
        Relationships: []
      }
      membership_plans: {
        Row: {
          created_at: string | null
          description: string | null
          duration_days: number
          features: Json | null
          id: string
          is_active: boolean | null
          name: string
          price: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          duration_days: number
          features?: Json | null
          id?: string
          is_active?: boolean | null
          name: string
          price: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          duration_days?: number
          features?: Json | null
          id?: string
          is_active?: boolean | null
          name?: string
          price?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      membership_revenue: {
        Row: {
          active_members: number
          amount: number
          created_at: string | null
          id: string
          month: string
          plan_name: string
          year: number
        }
        Insert: {
          active_members: number
          amount: number
          created_at?: string | null
          id?: string
          month: string
          plan_name: string
          year: number
        }
        Update: {
          active_members?: number
          amount?: number
          created_at?: string | null
          id?: string
          month?: string
          plan_name?: string
          year?: number
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string | null
          id: string
          order_id: string | null
          product_id: string | null
          quantity: number
          unit_price: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          order_id?: string | null
          product_id?: string | null
          quantity: number
          unit_price: number
        }
        Update: {
          created_at?: string | null
          id?: string
          order_id?: string | null
          product_id?: string | null
          quantity?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string | null
          delivery_address: string | null
          id: string
          payment_method: string | null
          payment_status: string | null
          status: string | null
          total_amount: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          delivery_address?: string | null
          id?: string
          payment_method?: string | null
          payment_status?: string | null
          status?: string | null
          total_amount: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          delivery_address?: string | null
          id?: string
          payment_method?: string | null
          payment_status?: string | null
          status?: string | null
          total_amount?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_stats_view"
            referencedColumns: ["user_id"]
          },
        ]
      }
      product_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          category_id: string | null
          cost_price: number
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          price: number
          stock_quantity: number
          updated_at: string | null
        }
        Insert: {
          category_id?: string | null
          cost_price: number
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          price: number
          stock_quantity?: number
          updated_at?: string | null
        }
        Update: {
          category_id?: string | null
          cost_price?: number
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          price?: number
          stock_quantity?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          role: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          role?: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      revenue_sources: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          month: string
          name: string
          percentage: number
          year: number
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          month: string
          name: string
          percentage: number
          year: number
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          month?: string
          name?: string
          percentage?: number
          year?: number
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          id: string
          is_approved: boolean | null
          location_id: string | null
          rating: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: string
          is_approved?: boolean | null
          location_id?: string | null
          rating?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: string
          is_approved?: boolean | null
          location_id?: string | null
          rating?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "gym_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_stats_view"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_diet_plans: {
        Row: {
          carbs_grams: number | null
          created_at: string | null
          daily_calories: number | null
          description: string | null
          fat_grams: number | null
          goal_id: string | null
          id: string
          meal_plan: Json | null
          name: string
          protein_grams: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          carbs_grams?: number | null
          created_at?: string | null
          daily_calories?: number | null
          description?: string | null
          fat_grams?: number | null
          goal_id?: string | null
          id?: string
          meal_plan?: Json | null
          name: string
          protein_grams?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          carbs_grams?: number | null
          created_at?: string | null
          daily_calories?: number | null
          description?: string | null
          fat_grams?: number | null
          goal_id?: string | null
          id?: string
          meal_plan?: Json | null
          name?: string
          protein_grams?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_diet_plans_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "diet_goals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_diet_plans_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_diet_plans_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_stats_view"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_metrics: {
        Row: {
          arm_cm: number | null
          body_fat_percentage: number | null
          chest_cm: number | null
          created_at: string | null
          height_cm: number | null
          hip_cm: number | null
          id: string
          measurement_date: string
          thigh_cm: number | null
          user_id: string | null
          waist_cm: number | null
          weight_kg: number | null
        }
        Insert: {
          arm_cm?: number | null
          body_fat_percentage?: number | null
          chest_cm?: number | null
          created_at?: string | null
          height_cm?: number | null
          hip_cm?: number | null
          id?: string
          measurement_date: string
          thigh_cm?: number | null
          user_id?: string | null
          waist_cm?: number | null
          weight_kg?: number | null
        }
        Update: {
          arm_cm?: number | null
          body_fat_percentage?: number | null
          chest_cm?: number | null
          created_at?: string | null
          height_cm?: number | null
          hip_cm?: number | null
          id?: string
          measurement_date?: string
          thigh_cm?: number | null
          user_id?: string | null
          waist_cm?: number | null
          weight_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_metrics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_metrics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_stats_view"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_subscriptions: {
        Row: {
          auto_renew: boolean | null
          created_at: string | null
          end_date: string
          id: string
          is_active: boolean | null
          payment_method: string | null
          payment_status: string | null
          plan_id: string | null
          start_date: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          auto_renew?: boolean | null
          created_at?: string | null
          end_date: string
          id?: string
          is_active?: boolean | null
          payment_method?: string | null
          payment_status?: string | null
          plan_id?: string | null
          start_date?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          auto_renew?: boolean | null
          created_at?: string | null
          end_date?: string
          id?: string
          is_active?: boolean | null
          payment_method?: string | null
          payment_status?: string | null
          plan_id?: string | null
          start_date?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "membership_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_stats_view"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Views: {
      user_stats_view: {
        Row: {
          user_id: string
          recent_visits: number
          total_visits_month: number
          membership_status: string
          membership_days_left: number
        }
      }
      admin_attendance_view: {
        Row: {
          attendance_id: string
          user_id: string
          full_name: string
          email: string
          membership_plan: string
          check_in_time: string
          check_out_time: string | null
          location: string
          duration_minutes: number | null
          is_currently_checked_in: boolean
        }
      }
      active_members_view: {
        Row: {
          user_id: string
          full_name: string
          email: string
          avatar_url: string | null
          join_date: string
          subscription_start: string
          subscription_end: string
          plan_name: string | null
          plan_price: number | null
          payment_status: string
          auto_renew: boolean
          is_active: boolean
          last_check_in: string | null
          visits_this_month: number
        }
      }
    }
    Functions: {
      calculate_bmr: {
        Args: {
          weight_kg: number
          height_cm: number
          age: number
          gender: string
        }
        Returns: number
      }
      days_since_last_visit: {
        Args: { user_uuid: string }
        Returns: number
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      is_subscription_active: {
        Args: { user_uuid: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
