export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string
          email: string
          hashed_password: string
          id: string
          is_active: boolean
          last_login_at: string | null
          name: string | null
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          hashed_password: string
          id?: string
          is_active?: boolean
          last_login_at?: string | null
          name?: string | null
          role?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          hashed_password?: string
          id?: string
          is_active?: boolean
          last_login_at?: string | null
          name?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      draft_meal_plans: {
        Row: {
          admin_notes: string | null
          ai_validation_completed: boolean | null
          ai_validation_score: number | null
          assigned_to: string | null
          created_at: string
          created_by: string
          id: string
          menu_type: Database["public"]["Enums"]["menu_type_enum"]
          published_at: string | null
          published_by: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["draft_status_enum"]
          updated_at: string
          week_start_date: string
        }
        Insert: {
          admin_notes?: string | null
          ai_validation_completed?: boolean | null
          ai_validation_score?: number | null
          assigned_to?: string | null
          created_at?: string
          created_by: string
          id?: string
          menu_type: Database["public"]["Enums"]["menu_type_enum"]
          published_at?: string | null
          published_by?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["draft_status_enum"]
          updated_at?: string
          week_start_date: string
        }
        Update: {
          admin_notes?: string | null
          ai_validation_completed?: boolean | null
          ai_validation_score?: number | null
          assigned_to?: string | null
          created_at?: string
          created_by?: string
          id?: string
          menu_type?: Database["public"]["Enums"]["menu_type_enum"]
          published_at?: string | null
          published_by?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["draft_status_enum"]
          updated_at?: string
          week_start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "draft_meal_plans_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "draft_meal_plans_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "draft_meal_plans_published_by_fkey"
            columns: ["published_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "draft_meal_plans_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      draft_planned_meals: {
        Row: {
          created_at: string
          day_of_week: Database["public"]["Enums"]["day_of_week_enum"]
          draft_meal_plan_id: string
          id: string
          is_leftover_meal: boolean | null
          leftover_source_day:
            | Database["public"]["Enums"]["day_of_week_enum"]
            | null
          meal_type: Database["public"]["Enums"]["meal_type_enum"]
          notes: string | null
          recipe_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          day_of_week: Database["public"]["Enums"]["day_of_week_enum"]
          draft_meal_plan_id: string
          id?: string
          is_leftover_meal?: boolean | null
          leftover_source_day?:
            | Database["public"]["Enums"]["day_of_week_enum"]
            | null
          meal_type: Database["public"]["Enums"]["meal_type_enum"]
          notes?: string | null
          recipe_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          day_of_week?: Database["public"]["Enums"]["day_of_week_enum"]
          draft_meal_plan_id?: string
          id?: string
          is_leftover_meal?: boolean | null
          leftover_source_day?:
            | Database["public"]["Enums"]["day_of_week_enum"]
            | null
          meal_type?: Database["public"]["Enums"]["meal_type_enum"]
          notes?: string | null
          recipe_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "draft_planned_meals_draft_meal_plan_id_fkey"
            columns: ["draft_meal_plan_id"]
            isOneToOne: false
            referencedRelation: "draft_meal_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "draft_planned_meals_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "draft_planned_meals_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes_with_ingredients"
            referencedColumns: ["recipe_id"]
          },
        ]
      }
      ingredients: {
        Row: {
          barcode: string | null
          brand: string | null
          calories_per_100: number | null
          carbs_per_100: number | null
          category: string
          created_at: string
          fat_per_100: number | null
          fiber_per_100: number | null
          id: string
          is_seasonal: boolean | null
          name_en: string | null
          name_ro: string
          openfoodfacts_id: string | null
          protein_per_100: number | null
          season_months: number[] | null
          shopping_category: string | null
          typical_price: number | null
          unit: string
          updated_at: string
        }
        Insert: {
          barcode?: string | null
          brand?: string | null
          calories_per_100?: number | null
          carbs_per_100?: number | null
          category: string
          created_at?: string
          fat_per_100?: number | null
          fiber_per_100?: number | null
          id?: string
          is_seasonal?: boolean | null
          name_en?: string | null
          name_ro: string
          openfoodfacts_id?: string | null
          protein_per_100?: number | null
          season_months?: number[] | null
          shopping_category?: string | null
          typical_price?: number | null
          unit: string
          updated_at?: string
        }
        Update: {
          barcode?: string | null
          brand?: string | null
          calories_per_100?: number | null
          carbs_per_100?: number | null
          category?: string
          created_at?: string
          fat_per_100?: number | null
          fiber_per_100?: number | null
          id?: string
          is_seasonal?: boolean | null
          name_en?: string | null
          name_ro?: string
          openfoodfacts_id?: string | null
          protein_per_100?: number | null
          season_months?: number[] | null
          shopping_category?: string | null
          typical_price?: number | null
          unit?: string
          updated_at?: string
        }
        Relationships: []
      }
      leftover_connections: {
        Row: {
          created_at: string
          estimated_portion: number | null
          id: string
          leftover_ingredient: string
          leftover_type: string | null
          source_meal_id: string
          target_meal_id: string
        }
        Insert: {
          created_at?: string
          estimated_portion?: number | null
          id?: string
          leftover_ingredient: string
          leftover_type?: string | null
          source_meal_id: string
          target_meal_id: string
        }
        Update: {
          created_at?: string
          estimated_portion?: number | null
          id?: string
          leftover_ingredient?: string
          leftover_type?: string | null
          source_meal_id?: string
          target_meal_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "leftover_connections_source_meal_id_fkey"
            columns: ["source_meal_id"]
            isOneToOne: false
            referencedRelation: "planned_meals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leftover_connections_target_meal_id_fkey"
            columns: ["target_meal_id"]
            isOneToOne: false
            referencedRelation: "planned_meals"
            referencedColumns: ["id"]
          },
        ]
      }
      meal_plans: {
        Row: {
          created_at: string
          household_size: number
          id: string
          is_active: boolean | null
          is_published: boolean | null
          menu_type: Database["public"]["Enums"]["menu_type_enum"]
          updated_at: string
          user_id: string
          week_end_date: string | null
          week_start_date: string
        }
        Insert: {
          created_at?: string
          household_size: number
          id?: string
          is_active?: boolean | null
          is_published?: boolean | null
          menu_type: Database["public"]["Enums"]["menu_type_enum"]
          updated_at?: string
          user_id: string
          week_end_date?: string | null
          week_start_date: string
        }
        Update: {
          created_at?: string
          household_size?: number
          id?: string
          is_active?: boolean | null
          is_published?: boolean | null
          menu_type?: Database["public"]["Enums"]["menu_type_enum"]
          updated_at?: string
          user_id?: string
          week_end_date?: string | null
          week_start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "meal_plans_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      planned_meals: {
        Row: {
          cooked_at: string | null
          created_at: string
          day_of_week: Database["public"]["Enums"]["day_of_week_enum"]
          id: string
          is_cooked: boolean | null
          meal_plan_id: string
          meal_type: Database["public"]["Enums"]["meal_type_enum"]
          notes: string | null
          recipe_id: string
          servings_override: number | null
          updated_at: string
        }
        Insert: {
          cooked_at?: string | null
          created_at?: string
          day_of_week: Database["public"]["Enums"]["day_of_week_enum"]
          id?: string
          is_cooked?: boolean | null
          meal_plan_id: string
          meal_type: Database["public"]["Enums"]["meal_type_enum"]
          notes?: string | null
          recipe_id: string
          servings_override?: number | null
          updated_at?: string
        }
        Update: {
          cooked_at?: string | null
          created_at?: string
          day_of_week?: Database["public"]["Enums"]["day_of_week_enum"]
          id?: string
          is_cooked?: boolean | null
          meal_plan_id?: string
          meal_type?: Database["public"]["Enums"]["meal_type_enum"]
          notes?: string | null
          recipe_id?: string
          servings_override?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "planned_meals_meal_plan_id_fkey"
            columns: ["meal_plan_id"]
            isOneToOne: false
            referencedRelation: "meal_plan_overview"
            referencedColumns: ["meal_plan_id"]
          },
          {
            foreignKeyName: "planned_meals_meal_plan_id_fkey"
            columns: ["meal_plan_id"]
            isOneToOne: false
            referencedRelation: "meal_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "planned_meals_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "planned_meals_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes_with_ingredients"
            referencedColumns: ["recipe_id"]
          },
        ]
      }
      published_weeks: {
        Row: {
          active_users: number | null
          archived_at: string | null
          draft_meal_plan_id: string
          id: string
          is_current: boolean | null
          menu_type: Database["public"]["Enums"]["menu_type_enum"]
          published_at: string
          published_by: string
          total_subscribers: number | null
          week_start_date: string
        }
        Insert: {
          active_users?: number | null
          archived_at?: string | null
          draft_meal_plan_id: string
          id?: string
          is_current?: boolean | null
          menu_type: Database["public"]["Enums"]["menu_type_enum"]
          published_at?: string
          published_by: string
          total_subscribers?: number | null
          week_start_date: string
        }
        Update: {
          active_users?: number | null
          archived_at?: string | null
          draft_meal_plan_id?: string
          id?: string
          is_current?: boolean | null
          menu_type?: Database["public"]["Enums"]["menu_type_enum"]
          published_at?: string
          published_by?: string
          total_subscribers?: number | null
          week_start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "published_weeks_draft_meal_plan_id_fkey"
            columns: ["draft_meal_plan_id"]
            isOneToOne: false
            referencedRelation: "draft_meal_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "published_weeks_published_by_fkey"
            columns: ["published_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      recipe_feedback: {
        Row: {
          comment: string | null
          cooked_date: string | null
          created_at: string
          difficulty_rating: number | null
          id: string
          rating: string
          recipe_id: string
          servings_made: number | null
          time_accuracy: string | null
          updated_at: string
          user_id: string
          would_cook_again: boolean | null
        }
        Insert: {
          comment?: string | null
          cooked_date?: string | null
          created_at?: string
          difficulty_rating?: number | null
          id?: string
          rating: string
          recipe_id: string
          servings_made?: number | null
          time_accuracy?: string | null
          updated_at?: string
          user_id: string
          would_cook_again?: boolean | null
        }
        Update: {
          comment?: string | null
          cooked_date?: string | null
          created_at?: string
          difficulty_rating?: number | null
          id?: string
          rating?: string
          recipe_id?: string
          servings_made?: number | null
          time_accuracy?: string | null
          updated_at?: string
          user_id?: string
          would_cook_again?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "recipe_feedback_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipe_feedback_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes_with_ingredients"
            referencedColumns: ["recipe_id"]
          },
          {
            foreignKeyName: "recipe_feedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      recipe_imports: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          imported_by: string
          processed_at: string | null
          raw_data: Json | null
          recipe_id: string | null
          reviewed_by: string | null
          source_domain: string | null
          source_url: string
          status: Database["public"]["Enums"]["import_status_enum"]
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          imported_by: string
          processed_at?: string | null
          raw_data?: Json | null
          recipe_id?: string | null
          reviewed_by?: string | null
          source_domain?: string | null
          source_url: string
          status?: Database["public"]["Enums"]["import_status_enum"]
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          imported_by?: string
          processed_at?: string | null
          raw_data?: Json | null
          recipe_id?: string | null
          reviewed_by?: string | null
          source_domain?: string | null
          source_url?: string
          status?: Database["public"]["Enums"]["import_status_enum"]
        }
        Relationships: [
          {
            foreignKeyName: "recipe_imports_imported_by_fkey"
            columns: ["imported_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipe_imports_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipe_imports_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes_with_ingredients"
            referencedColumns: ["recipe_id"]
          },
          {
            foreignKeyName: "recipe_imports_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      recipe_ingredients: {
        Row: {
          created_at: string
          display_order: number | null
          id: string
          ingredient_group: string | null
          ingredient_id: string
          is_optional: boolean | null
          notes: string | null
          quantity: number
          recipe_id: string
          unit: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number | null
          id?: string
          ingredient_group?: string | null
          ingredient_id: string
          is_optional?: boolean | null
          notes?: string | null
          quantity: number
          recipe_id: string
          unit: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number | null
          id?: string
          ingredient_group?: string | null
          ingredient_id?: string
          is_optional?: boolean | null
          notes?: string | null
          quantity?: number
          recipe_id?: string
          unit?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "recipe_ingredients_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipe_ingredients_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipe_ingredients_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes_with_ingredients"
            referencedColumns: ["recipe_id"]
          },
        ]
      }
      recipes: {
        Row: {
          active_cooking_time: number
          approved_at: string | null
          approved_by: string | null
          average_rating: number | null
          calories_per_serving: number | null
          carbs_per_serving: number | null
          created_at: string
          created_by: string | null
          cuisine_type: string | null
          description_en: string | null
          description_ro: string | null
          dietary_tags: string[] | null
          difficulty_level: number | null
          fat_per_serving: number | null
          id: string
          image_url: string | null
          instructions_en: string | null
          instructions_ro: string
          is_seasonal: boolean | null
          meal_type: Database["public"]["Enums"]["meal_type_enum"]
          prep_time: number
          protein_per_serving: number | null
          published_at: string | null
          season_months: number[] | null
          servings: number
          source_attribution: string | null
          source_url: string | null
          status: Database["public"]["Enums"]["recipe_status_enum"]
          tags: string[] | null
          times_cooked: number | null
          title_en: string | null
          title_ro: string
          total_ratings: number | null
          total_time: number
          updated_at: string
          video_url: string | null
        }
        Insert: {
          active_cooking_time?: number
          approved_at?: string | null
          approved_by?: string | null
          average_rating?: number | null
          calories_per_serving?: number | null
          carbs_per_serving?: number | null
          created_at?: string
          created_by?: string | null
          cuisine_type?: string | null
          description_en?: string | null
          description_ro?: string | null
          dietary_tags?: string[] | null
          difficulty_level?: number | null
          fat_per_serving?: number | null
          id?: string
          image_url?: string | null
          instructions_en?: string | null
          instructions_ro: string
          is_seasonal?: boolean | null
          meal_type: Database["public"]["Enums"]["meal_type_enum"]
          prep_time?: number
          protein_per_serving?: number | null
          published_at?: string | null
          season_months?: number[] | null
          servings?: number
          source_attribution?: string | null
          source_url?: string | null
          status?: Database["public"]["Enums"]["recipe_status_enum"]
          tags?: string[] | null
          times_cooked?: number | null
          title_en?: string | null
          title_ro: string
          total_ratings?: number | null
          total_time?: number
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          active_cooking_time?: number
          approved_at?: string | null
          approved_by?: string | null
          average_rating?: number | null
          calories_per_serving?: number | null
          carbs_per_serving?: number | null
          created_at?: string
          created_by?: string | null
          cuisine_type?: string | null
          description_en?: string | null
          description_ro?: string | null
          dietary_tags?: string[] | null
          difficulty_level?: number | null
          fat_per_serving?: number | null
          id?: string
          image_url?: string | null
          instructions_en?: string | null
          instructions_ro?: string
          is_seasonal?: boolean | null
          meal_type?: Database["public"]["Enums"]["meal_type_enum"]
          prep_time?: number
          protein_per_serving?: number | null
          published_at?: string | null
          season_months?: number[] | null
          servings?: number
          source_attribution?: string | null
          source_url?: string | null
          status?: Database["public"]["Enums"]["recipe_status_enum"]
          tags?: string[] | null
          times_cooked?: number | null
          title_en?: string | null
          title_ro?: string
          total_ratings?: number | null
          total_time?: number
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recipes_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      shopping_list_items: {
        Row: {
          category: string | null
          checked_at: string | null
          created_at: string
          display_order: number | null
          id: string
          ingredient_id: string | null
          is_checked: boolean | null
          is_custom_item: boolean | null
          name: string
          notes: string | null
          quantity: number | null
          shopping_list_id: string
          source_recipe_id: string | null
          unit: string | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          checked_at?: string | null
          created_at?: string
          display_order?: number | null
          id?: string
          ingredient_id?: string | null
          is_checked?: boolean | null
          is_custom_item?: boolean | null
          name: string
          notes?: string | null
          quantity?: number | null
          shopping_list_id: string
          source_recipe_id?: string | null
          unit?: string | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          checked_at?: string | null
          created_at?: string
          display_order?: number | null
          id?: string
          ingredient_id?: string | null
          is_checked?: boolean | null
          is_custom_item?: boolean | null
          name?: string
          notes?: string | null
          quantity?: number | null
          shopping_list_id?: string
          source_recipe_id?: string | null
          unit?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "shopping_list_items_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shopping_list_items_shopping_list_id_fkey"
            columns: ["shopping_list_id"]
            isOneToOne: false
            referencedRelation: "shopping_lists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shopping_list_items_source_recipe_id_fkey"
            columns: ["source_recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shopping_list_items_source_recipe_id_fkey"
            columns: ["source_recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes_with_ingredients"
            referencedColumns: ["recipe_id"]
          },
        ]
      }
      shopping_lists: {
        Row: {
          completed_at: string | null
          created_at: string
          guest_session_id: string | null
          id: string
          is_active: boolean | null
          is_guest_list: boolean | null
          meal_plan_id: string | null
          name: string | null
          updated_at: string
          user_id: string | null
          week_start_date: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          guest_session_id?: string | null
          id?: string
          is_active?: boolean | null
          is_guest_list?: boolean | null
          meal_plan_id?: string | null
          name?: string | null
          updated_at?: string
          user_id?: string | null
          week_start_date?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          guest_session_id?: string | null
          id?: string
          is_active?: boolean | null
          is_guest_list?: boolean | null
          meal_plan_id?: string | null
          name?: string | null
          updated_at?: string
          user_id?: string | null
          week_start_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shopping_lists_meal_plan_id_fkey"
            columns: ["meal_plan_id"]
            isOneToOne: false
            referencedRelation: "meal_plan_overview"
            referencedColumns: ["meal_plan_id"]
          },
          {
            foreignKeyName: "shopping_lists_meal_plan_id_fkey"
            columns: ["meal_plan_id"]
            isOneToOne: false
            referencedRelation: "meal_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shopping_lists_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          cancelled_at: string | null
          created_at: string
          current_period_end: string
          current_period_start: string
          id: string
          plan_type: string
          started_at: string
          status: Database["public"]["Enums"]["subscription_status_enum"]
          stripe_price_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          cancelled_at?: string | null
          created_at?: string
          current_period_end: string
          current_period_start: string
          id?: string
          plan_type: string
          started_at: string
          status: Database["public"]["Enums"]["subscription_status_enum"]
          stripe_price_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          cancelled_at?: string | null
          created_at?: string
          current_period_end?: string
          current_period_start?: string
          id?: string
          plan_type?: string
          started_at?: string
          status?: Database["public"]["Enums"]["subscription_status_enum"]
          stripe_price_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      trial_menu_recipes: {
        Row: {
          created_at: string
          day_number: number
          display_order: number | null
          id: string
          meal_type: Database["public"]["Enums"]["meal_type_enum"]
          recipe_id: string
          trial_menu_id: string
        }
        Insert: {
          created_at?: string
          day_number: number
          display_order?: number | null
          id?: string
          meal_type: Database["public"]["Enums"]["meal_type_enum"]
          recipe_id: string
          trial_menu_id: string
        }
        Update: {
          created_at?: string
          day_number?: number
          display_order?: number | null
          id?: string
          meal_type?: Database["public"]["Enums"]["meal_type_enum"]
          recipe_id?: string
          trial_menu_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trial_menu_recipes_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trial_menu_recipes_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes_with_ingredients"
            referencedColumns: ["recipe_id"]
          },
          {
            foreignKeyName: "trial_menu_recipes_trial_menu_id_fkey"
            columns: ["trial_menu_id"]
            isOneToOne: false
            referencedRelation: "trial_menus"
            referencedColumns: ["id"]
          },
        ]
      }
      trial_menus: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          is_active: boolean | null
          menu_type: Database["public"]["Enums"]["menu_type_enum"]
          updated_at: string
          week_number: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          menu_type: Database["public"]["Enums"]["menu_type_enum"]
          updated_at?: string
          week_number: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          menu_type?: Database["public"]["Enums"]["menu_type_enum"]
          updated_at?: string
          week_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "trial_menus_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          custom_shopping_categories: Json | null
          default_view_preference: Database["public"]["Enums"]["view_preference_enum"]
          email: string
          guest_mode_enabled: boolean
          has_active_trial: boolean
          has_trial_gift_access: boolean
          hashed_password: string
          household_size: number
          id: string
          last_login_at: string | null
          menu_type: Database["public"]["Enums"]["menu_type_enum"]
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_status: Database["public"]["Enums"]["subscription_status_enum"]
          trial_ends_at: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          custom_shopping_categories?: Json | null
          default_view_preference?: Database["public"]["Enums"]["view_preference_enum"]
          email: string
          guest_mode_enabled?: boolean
          has_active_trial?: boolean
          has_trial_gift_access?: boolean
          hashed_password: string
          household_size?: number
          id?: string
          last_login_at?: string | null
          menu_type?: Database["public"]["Enums"]["menu_type_enum"]
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_status?: Database["public"]["Enums"]["subscription_status_enum"]
          trial_ends_at?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          custom_shopping_categories?: Json | null
          default_view_preference?: Database["public"]["Enums"]["view_preference_enum"]
          email?: string
          guest_mode_enabled?: boolean
          has_active_trial?: boolean
          has_trial_gift_access?: boolean
          hashed_password?: string
          household_size?: number
          id?: string
          last_login_at?: string | null
          menu_type?: Database["public"]["Enums"]["menu_type_enum"]
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_status?: Database["public"]["Enums"]["subscription_status_enum"]
          trial_ends_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      validation_results: {
        Row: {
          created_at: string
          draft_meal_plan_id: string
          id: string
          issues_found: Json | null
          leftover_optimization_check: boolean | null
          nutrition_score: number | null
          nutritional_balance_check: boolean | null
          overall_score: number | null
          practicality_score: number | null
          seasonal_check: boolean | null
          shopping_efficiency_check: boolean | null
          suggestions: Json | null
          validated_at: string | null
          validated_by: string | null
          validation_status: Database["public"]["Enums"]["validation_status_enum"]
          validation_type: Database["public"]["Enums"]["validation_type_enum"]
          validator_notes: string | null
          variety_check: boolean | null
          variety_score: number | null
        }
        Insert: {
          created_at?: string
          draft_meal_plan_id: string
          id?: string
          issues_found?: Json | null
          leftover_optimization_check?: boolean | null
          nutrition_score?: number | null
          nutritional_balance_check?: boolean | null
          overall_score?: number | null
          practicality_score?: number | null
          seasonal_check?: boolean | null
          shopping_efficiency_check?: boolean | null
          suggestions?: Json | null
          validated_at?: string | null
          validated_by?: string | null
          validation_status?: Database["public"]["Enums"]["validation_status_enum"]
          validation_type: Database["public"]["Enums"]["validation_type_enum"]
          validator_notes?: string | null
          variety_check?: boolean | null
          variety_score?: number | null
        }
        Update: {
          created_at?: string
          draft_meal_plan_id?: string
          id?: string
          issues_found?: Json | null
          leftover_optimization_check?: boolean | null
          nutrition_score?: number | null
          nutritional_balance_check?: boolean | null
          overall_score?: number | null
          practicality_score?: number | null
          seasonal_check?: boolean | null
          shopping_efficiency_check?: boolean | null
          suggestions?: Json | null
          validated_at?: string | null
          validated_by?: string | null
          validation_status?: Database["public"]["Enums"]["validation_status_enum"]
          validation_type?: Database["public"]["Enums"]["validation_type_enum"]
          validator_notes?: string | null
          variety_check?: boolean | null
          variety_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "validation_results_draft_meal_plan_id_fkey"
            columns: ["draft_meal_plan_id"]
            isOneToOne: false
            referencedRelation: "draft_meal_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "validation_results_validated_by_fkey"
            columns: ["validated_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      meal_plan_overview: {
        Row: {
          household_size: number | null
          is_active: boolean | null
          meal_plan_id: string | null
          meals: Json | null
          menu_type: Database["public"]["Enums"]["menu_type_enum"] | null
          user_id: string | null
          week_end_date: string | null
          week_start_date: string | null
        }
        Relationships: [
          {
            foreignKeyName: "meal_plans_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      recipes_with_ingredients: {
        Row: {
          active_cooking_time: number | null
          ingredients: Json | null
          meal_type: Database["public"]["Enums"]["meal_type_enum"] | null
          prep_time: number | null
          recipe_id: string | null
          servings: number | null
          status: Database["public"]["Enums"]["recipe_status_enum"] | null
          title_en: string | null
          title_ro: string | null
          total_time: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      day_of_week_enum:
        | "monday"
        | "tuesday"
        | "wednesday"
        | "thursday"
        | "friday"
        | "saturday"
        | "sunday"
      draft_status_enum: "draft" | "ready" | "published"
      import_status_enum: "pending" | "processing" | "completed" | "failed"
      meal_type_enum: "breakfast" | "lunch" | "dinner" | "snack"
      menu_type_enum: "omnivore" | "vegetarian"
      recipe_status_enum: "draft" | "published" | "archived"
      subscription_status_enum: "trial" | "active" | "expired" | "cancelled"
      validation_status_enum: "pending" | "approved" | "rejected"
      validation_type_enum: "ai" | "manual"
      view_preference_enum: "RO" | "EN"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
        Database["public"]["Views"])
    ? (Database["public"]["Tables"] &
        Database["public"]["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
    ? Database["public"]["Enums"][PublicEnumNameOrOptions]
    : never