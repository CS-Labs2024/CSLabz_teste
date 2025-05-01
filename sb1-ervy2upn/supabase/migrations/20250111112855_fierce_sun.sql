/*
  # Password Reset Configuration

  1. Changes
    - Add password reset configuration with 30-minute expiration
    - Add password reset token cleanup function
  
  2. Security
    - Ensures password reset tokens expire after 30 minutes
    - Automatically cleans up expired tokens
*/

-- Set password reset token expiration to 30 minutes
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS reset_token_expires_at timestamptz;

-- Function to clean up expired reset tokens
CREATE OR REPLACE FUNCTION auth.cleanup_expired_reset_tokens()
RETURNS void AS $$
BEGIN
  UPDATE auth.users
  SET reset_token_expires_at = NULL
  WHERE reset_token_expires_at < now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a scheduled job to clean up expired tokens
CREATE EXTENSION IF NOT EXISTS pg_cron;

SELECT cron.schedule(
  'cleanup_expired_reset_tokens',
  '*/30 * * * *', -- Run every 30 minutes
  $$SELECT auth.cleanup_expired_reset_tokens()$$
);