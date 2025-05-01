/*
  # Add saved cohorts functionality
  
  1. New Tables
    - `saved_cohorts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `description` (text, nullable)
      - `date_created` (timestamptz)
      - `filters` (jsonb)
      - `stats` (jsonb)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `saved_cohorts` table
    - Add policies for users to manage their own cohorts
*/

CREATE TABLE IF NOT EXISTS saved_cohorts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  name text NOT NULL,
  description text,
  date_created timestamptz NOT NULL,
  filters jsonb NOT NULL,
  stats jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE saved_cohorts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own cohorts"
  ON saved_cohorts
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);