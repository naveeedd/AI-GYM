-- Fix the typo in profiles table
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_pkey;
ALTER TABLE profiles ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
ALTER TABLE profiles ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Enable RLS for membership_plans and user_subscriptions if not already enabled
ALTER TABLE membership_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies for membership_plans
DROP POLICY IF EXISTS membership_plans_select_policy ON membership_plans;
DROP POLICY IF EXISTS membership_plans_insert_policy ON membership_plans;
DROP POLICY IF EXISTS membership_plans_update_policy ON membership_plans;

-- Add policies for membership_plans
CREATE POLICY membership_plans_select_policy ON membership_plans
    FOR SELECT
    USING (true);  -- Anyone can view membership plans

CREATE POLICY membership_plans_insert_policy ON membership_plans
    FOR INSERT
    WITH CHECK (auth.jwt() ->> 'role' = 'admin');  -- Only admins can create plans

CREATE POLICY membership_plans_update_policy ON membership_plans
    FOR UPDATE
    USING (auth.jwt() ->> 'role' = 'admin');  -- Only admins can update plans

-- Drop existing policies for user_subscriptions
DROP POLICY IF EXISTS subscriptions_select_policy ON user_subscriptions;
DROP POLICY IF EXISTS subscriptions_insert_policy ON user_subscriptions;
DROP POLICY IF EXISTS subscriptions_update_policy ON user_subscriptions;

-- Add policies for user_subscriptions
CREATE POLICY subscriptions_select_policy ON user_subscriptions
    FOR SELECT
    USING (user_id = auth.uid() OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY subscriptions_insert_policy ON user_subscriptions
    FOR INSERT
    WITH CHECK (user_id = auth.uid() OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY subscriptions_update_policy ON user_subscriptions
    FOR UPDATE
    USING (user_id = auth.uid() OR auth.jwt() ->> 'role' = 'admin');

-- Create or replace the is_subscription_active function
CREATE OR REPLACE FUNCTION is_subscription_active(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM user_subscriptions
        WHERE user_id = user_uuid
        AND is_active = true
        AND end_date > CURRENT_TIMESTAMP
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 