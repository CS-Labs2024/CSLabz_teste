/*
  # Add saved analyses support
  
  1. New Tables
    - `saved_analyses`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `description` (text, nullable)
      - `date_created` (timestamptz)
      - `filters` (jsonb)
      - `stats` (jsonb)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `saved_analyses` table
    - Add policies for users to manage their own analyses
*/

CREATE TABLE IF NOT EXISTS saved_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  name text NOT NULL,
  description text,
  date_created timestamptz NOT NULL,
  filters jsonb NOT NULL,
  stats jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE saved_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own analyses"
  ON saved_analyses
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);