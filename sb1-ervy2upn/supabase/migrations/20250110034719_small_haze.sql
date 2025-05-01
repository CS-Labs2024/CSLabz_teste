-- Enable MFA
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS mfa_enabled BOOLEAN DEFAULT false;

-- Add rate limiting settings
CREATE TABLE IF NOT EXISTS auth_rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address text NOT NULL,
  attempt_count integer DEFAULT 0,
  last_attempt timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Function to check rate limits
CREATE OR REPLACE FUNCTION check_auth_rate_limit(ip text, max_attempts integer, window_minutes integer)
RETURNS boolean AS $$
DECLARE
  attempts integer;
BEGIN
  -- Clean up old entries
  DELETE FROM auth_rate_limits 
  WHERE last_attempt < now() - (window_minutes || ' minutes')::interval;
  
  -- Get attempt count
  SELECT attempt_count INTO attempts 
  FROM auth_rate_limits 
  WHERE ip_address = ip 
  AND last_attempt > now() - (window_minutes || ' minutes')::interval;
  
  IF attempts IS NULL THEN
    -- First attempt
    INSERT INTO auth_rate_limits (ip_address, attempt_count)
    VALUES (ip, 1);
    RETURN true;
  ELSIF attempts < max_attempts THEN
    -- Increment attempt count
    UPDATE auth_rate_limits 
    SET attempt_count = attempt_count + 1,
        last_attempt = now()
    WHERE ip_address = ip;
    RETURN true;
  ELSE
    RETURN false;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;