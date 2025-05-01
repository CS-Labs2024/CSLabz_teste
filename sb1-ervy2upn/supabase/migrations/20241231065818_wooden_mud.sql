/*
  # Authentication and User Data Setup

  1. New Tables
    - `user_settings`
      - `id` (uuid, primary key, references auth.users)
      - `created_at` (timestamp with timezone)
      - `theme` (text, default 'light')
      - `early_churn_months` (integer, default 3)

  2. Security
    - Enable RLS on `user_settings`
    - Add policies for authenticated users to manage their own settings
*/

-- Create user settings table
CREATE TABLE IF NOT EXISTS user_settings (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  theme text DEFAULT 'light',
  early_churn_months integer DEFAULT 3,
  CONSTRAINT valid_early_churn_months CHECK (early_churn_months > 0)
);

-- Enable RLS
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own settings"
  ON user_settings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own settings"
  ON user_settings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own settings"
  ON user_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_settings (id)
  VALUES (new.id);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();