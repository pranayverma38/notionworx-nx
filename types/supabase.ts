export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  __InternalSupabase: { PostgrestVersion: "14.17" }
  public: {
    Tables: {
      addresses: {
        Row: {
          city: string; company: string | null; country: string; created_at: string
          email: string; id: string; is_default: boolean | null
          phone: string; state: string; street_address: string
          updated_at: string; user_id: string; zip: string
        }
        Insert: {
          city?: string; company?: string | null; country?: string; created_at?: string
          email?: string; id?: string; is_default?: boolean | null
          phone?: string; state?: string; street_address?: string
          updated_at?: string; user_id: string; zip?: string
        }
        Update: {
          city?: string; company?: string | null; country?: string; created_at?: string
          email?: string; id?: string; is_default?: boolean | null
          phone?: string; state?: string; street_address?: string
          updated_at?: string; user_id?: string; zip?: string
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          created_at: string; id: string; product_data: Json; product_id: string
          quantity: number; selected_color: string | null; selected_size: string | null
          updated_at: string; user_id: string
        }
        Insert: {
          created_at?: string; id?: string; product_data: Json; product_id: string
          quantity?: number; selected_color?: string | null; selected_size?: string | null
          updated_at?: string; user_id: string
        }
        Update: {
          created_at?: string; id?: string; product_data?: Json; product_id?: string
          quantity?: number; selected_color?: string | null; selected_size?: string | null
          updated_at?: string; user_id?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          created_at: string; id: string; items: Json; order_number: string
          status: string; total_price: number; updated_at: string; user_id: string
        }
        Insert: {
          created_at?: string; id?: string; items?: Json; order_number: string
          status?: string; total_price?: number; updated_at?: string; user_id: string
        }
        Update: {
          created_at?: string; id?: string; items?: Json; order_number?: string
          status?: string; total_price?: number; updated_at?: string; user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null; created_at: string; date_of_birth: string | null
          email: string | null; first_name: string | null; full_name: string | null
          gender: string | null; id: string; last_name: string | null
          phone_country_code: string | null; phone_number: string | null; updated_at: string
        }
        Insert: {
          avatar_url?: string | null; created_at?: string; date_of_birth?: string | null
          email?: string | null; first_name?: string | null; full_name?: string | null
          gender?: string | null; id: string; last_name?: string | null
          phone_country_code?: string | null; phone_number?: string | null; updated_at?: string
        }
        Update: {
          avatar_url?: string | null; created_at?: string; date_of_birth?: string | null
          email?: string | null; first_name?: string | null; full_name?: string | null
          gender?: string | null; id?: string; last_name?: string | null
          phone_country_code?: string | null; phone_number?: string | null; updated_at?: string
        }
        Relationships: []
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}

type DefaultSchema = Omit<Database, "__InternalSupabase">["public"]
export type Tables<T extends keyof DefaultSchema["Tables"]> = DefaultSchema["Tables"][T]["Row"]
export type TablesInsert<T extends keyof DefaultSchema["Tables"]> = DefaultSchema["Tables"][T]["Insert"]
export type TablesUpdate<T extends keyof DefaultSchema["Tables"]> = DefaultSchema["Tables"][T]["Update"]
