-- Setup cron job for cleaning up unconfirmed emails
-- This script can be run directly on the production database

-- Check if pg_cron extension exists and enable it if needed
SELECT CASE 
    WHEN EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') 
    THEN 'pg_cron extension already exists'
    ELSE 'pg_cron extension needs to be enabled'
END as cron_status;

-- Enable the pg_cron extension if not already enabled
-- This might require superuser privileges in production
-- In Supabase, this should already be available
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Drop existing cleanup job if it exists
SELECT cron.unschedule('cleanup-unconfirmed-emails');

-- Create app_settings table if it doesn't exist
CREATE TABLE IF NOT EXISTS app_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on app_settings if not already enabled
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE n.nspname = 'public' AND c.relname = 'app_settings' AND c.relrowsecurity = true
    ) THEN
        ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;
    END IF;
END
$$;

-- Create service role policy if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' AND tablename = 'app_settings' AND policyname = 'Service role can manage app settings'
    ) THEN
        CREATE POLICY "Service role can manage app settings" ON app_settings 
            FOR ALL USING (auth.role() = 'service_role');
    END IF;
END
$$;

-- Insert or update the cleanup secret setting
INSERT INTO app_settings (key, value, description) 
VALUES (
  'cleanup_secret', 
  'prod-cleanup-secret-' || extract(epoch from now())::text,
  'Secret key for authenticating cleanup Edge Function calls'
) ON CONFLICT (key) DO UPDATE SET 
    value = EXCLUDED.value,
    updated_at = NOW();

-- Create the helper function if it doesn't exist
CREATE OR REPLACE FUNCTION get_cleanup_secret() 
RETURNS TEXT 
LANGUAGE sql 
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT value FROM app_settings WHERE key = 'cleanup_secret';
$$;

-- Set the app.cleanup_secret setting from the database
SELECT set_config('app.cleanup_secret', get_cleanup_secret(), false);

-- Schedule cleanup job to run daily at 2:00 AM UTC
-- This will call the Edge Function to clean up unconfirmed emails older than 7 days
SELECT cron.schedule(
  'cleanup-unconfirmed-emails',     -- Job name
  '0 2 * * *',                     -- Cron expression: daily at 2:00 AM UTC
  $$
    SELECT net.http_post(
      url := 'https://hkghwdexiobvaoqkpxqj.supabase.co/functions/v1/cleanup-unconfirmed-emails',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'x-cleanup-secret', current_setting('app.cleanup_secret', true)
      ),
      body := jsonb_build_object(
        'scheduled', true,
        'timestamp', now()
      )
    );
  $$
);

-- Verify the job was created
SELECT jobname, schedule, command 
FROM cron.job 
WHERE jobname = 'cleanup-unconfirmed-emails';

-- Add comments for documentation
COMMENT ON FUNCTION get_cleanup_secret() IS 'Retrieves cleanup secret for Edge Function authentication from app_settings table';
COMMENT ON TABLE app_settings IS 'Stores application configuration settings including cleanup secrets for Edge Functions';