export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      api_rate_limits: {
        Row: {
          client_key: string
          hits: number
          scope: string
          window_started: string
        }
        Insert: {
          client_key: string
          hits?: number
          scope: string
          window_started?: string
        }
        Update: {
          client_key?: string
          hits?: number
          scope?: string
          window_started?: string
        }
        Relationships: []
      }
      app_config: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      license_devices: {
        Row: {
          device_id: string
          first_seen_at: string
          last_seen_at: string
          license_id: string
          revoked_at: string | null
        }
        Insert: {
          device_id: string
          first_seen_at?: string
          last_seen_at?: string
          license_id: string
          revoked_at?: string | null
        }
        Update: {
          device_id?: string
          first_seen_at?: string
          last_seen_at?: string
          license_id?: string
          revoked_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "license_devices_license_id_fkey"
            columns: ["license_id"]
            isOneToOne: false
            referencedRelation: "licenses"
            referencedColumns: ["id"]
          },
        ]
      }
      license_sessions: {
        Row: {
          created_at: string
          device_id: string
          last_seen_at: string
          license_id: string
          revoked_at: string | null
          session_id: string
        }
        Insert: {
          created_at?: string
          device_id: string
          last_seen_at?: string
          license_id: string
          revoked_at?: string | null
          session_id: string
        }
        Update: {
          created_at?: string
          device_id?: string
          last_seen_at?: string
          license_id?: string
          revoked_at?: string | null
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "license_sessions_license_id_fkey"
            columns: ["license_id"]
            isOneToOne: false
            referencedRelation: "licenses"
            referencedColumns: ["id"]
          },
        ]
      }
      licenses: {
        Row: {
          activated_at: string | null
          created_at: string | null
          device_fingerprint: string | null
          expires_at: string
          id: string
          is_active: boolean | null
          is_guest: boolean | null
          key: string
          lovable_email: string | null
          lovable_project_id: string | null
          max_devices: number | null
          notes: string | null
          plan: string | null
          referral_balance: number | null
          referral_code: string | null
          referred_by: string | null
          synced_sessions: Json | null
          user_email: string | null
          user_name: string
          withdrawal_paid: number | null
          withdrawal_pending: number | null
          withdrawal_telegram: string | null
          withdrawal_type: string | null
        }
        Insert: {
          activated_at?: string | null
          created_at?: string | null
          device_fingerprint?: string | null
          expires_at: string
          id?: string
          is_active?: boolean | null
          is_guest?: boolean | null
          key: string
          lovable_email?: string | null
          lovable_project_id?: string | null
          max_devices?: number | null
          notes?: string | null
          plan?: string | null
          referral_balance?: number | null
          referral_code?: string | null
          referred_by?: string | null
          synced_sessions?: Json | null
          user_email?: string | null
          user_name: string
          withdrawal_paid?: number | null
          withdrawal_pending?: number | null
          withdrawal_telegram?: string | null
          withdrawal_type?: string | null
        }
        Update: {
          activated_at?: string | null
          created_at?: string | null
          device_fingerprint?: string | null
          expires_at?: string
          id?: string
          is_active?: boolean | null
          is_guest?: boolean | null
          key?: string
          lovable_email?: string | null
          lovable_project_id?: string | null
          max_devices?: number | null
          notes?: string | null
          plan?: string | null
          referral_balance?: number | null
          referral_code?: string | null
          referred_by?: string | null
          synced_sessions?: Json | null
          user_email?: string | null
          user_name?: string
          withdrawal_paid?: number | null
          withdrawal_pending?: number | null
          withdrawal_telegram?: string | null
          withdrawal_type?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          duration_minutes: number | null
          id: string
          link: string | null
          message: string
          title: string
        }
        Insert: {
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          link?: string | null
          message: string
          title: string
        }
        Update: {
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          link?: string | null
          message?: string
          title?: string
        }
        Relationships: []
      }
      purchase_history: {
        Row: {
          action: string
          created_at: string
          duration_hours: number
          id: string
          license_key: string
          new_key: string | null
          price: number
        }
        Insert: {
          action: string
          created_at?: string
          duration_hours: number
          id?: string
          license_key: string
          new_key?: string | null
          price: number
        }
        Update: {
          action?: string
          created_at?: string
          duration_hours?: number
          id?: string
          license_key?: string
          new_key?: string | null
          price?: number
        }
        Relationships: []
      }
      resellers: {
        Row: {
          api_key: string | null
          balance: number | null
          created_at: string | null
          display_name: string | null
          id: string
          is_active: boolean | null
          password_hash: string | null
          tag: string
          total_spent: number | null
          updated_at: string | null
          username: string
        }
        Insert: {
          api_key?: string | null
          balance?: number | null
          created_at?: string | null
          display_name?: string | null
          id?: string
          is_active?: boolean | null
          password_hash?: string | null
          tag: string
          total_spent?: number | null
          updated_at?: string | null
          username: string
        }
        Update: {
          api_key?: string | null
          balance?: number | null
          created_at?: string | null
          display_name?: string | null
          id?: string
          is_active?: boolean | null
          password_hash?: string | null
          tag?: string
          total_spent?: number | null
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      settings: {
        Row: {
          key: string
          updated_at: string | null
          value: string
        }
        Insert: {
          key: string
          updated_at?: string | null
          value: string
        }
        Update: {
          key?: string
          updated_at?: string | null
          value?: string
        }
        Relationships: []
      }
      withdrawal_requests: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          license_id: string | null
          license_key: string
          status: string | null
          updated_at: string | null
          withdrawal_telegram: string | null
          withdrawal_type: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          license_id?: string | null
          license_key: string
          status?: string | null
          updated_at?: string | null
          withdrawal_telegram?: string | null
          withdrawal_type: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          license_id?: string | null
          license_key?: string
          status?: string | null
          updated_at?: string | null
          withdrawal_telegram?: string | null
          withdrawal_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "withdrawal_requests_license_id_fkey"
            columns: ["license_id"]
            isOneToOne: false
            referencedRelation: "licenses"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      claim_referral: {
        Args: { ref_code: string; user_key: string }
        Returns: Json
      }
      consume_api_rate_limit: {
        Args: {
          p_client_key: string
          p_limit: number
          p_scope: string
          p_window_seconds: number
        }
        Returns: boolean
      }
      logout_license_session: {
        Args: {
          p_device_id: string
          p_license_key: string
          p_session_id: string
        }
        Returns: boolean
      }
      request_withdrawal: {
        Args: { user_key: string; w_telegram: string; w_type: string }
        Returns: Json
      }
      reseller_api_generate_key: {
        Args: {
          p_api_key: string
          p_customer_name: string
          p_customer_ref?: string
          p_devices: number
          p_type: string
        }
        Returns: Json
      }
      reseller_change_password: {
        Args: { p_new_hash: string; p_tag: string }
        Returns: Json
      }
      reseller_create_key_secure: {
        Args: {
          p_key: string
          p_max_devices: number
          p_tag: string
          p_type: string
          p_user_name: string
        }
        Returns: Json
      }
      reseller_create_license: {
        Args: {
          p_expires_at: string
          p_key: string
          p_max_devices: number
          p_notes: string
          p_user_name: string
        }
        Returns: Json
      }
      reseller_deduct_balance: {
        Args: { p_amount: number; p_tag: string }
        Returns: Json
      }
      reseller_get_api_key: { Args: { p_tag: string }; Returns: string }
      reseller_login: {
        Args: { p_password_hash: string; p_username: string }
        Returns: Json
      }
      reseller_rotate_api_key: { Args: { p_tag: string }; Returns: string }
      reseller_toggle_license: {
        Args: { p_id: string; p_is_active: boolean }
        Returns: Json
      }
      validate_license_session: {
        Args: {
          p_allow_new_device?: boolean
          p_device_id: string
          p_license_key: string
          p_session_id: string
        }
        Returns: {
          activated_at: string
          expires_at: string
          license_id: string
          ok: boolean
          plan: string
          reason: string
          synced_sessions: Json
          user_email: string
          user_name: string
        }[]
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
