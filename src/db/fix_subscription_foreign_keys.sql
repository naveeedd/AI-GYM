-- Drop existing foreign key constraints
ALTER TABLE user_subscriptions DROP CONSTRAINT IF EXISTS user_subscriptions_user_id_fkey;

-- Update the foreign key to reference auth.users instead of users table
ALTER TABLE user_subscriptions 
ADD CONSTRAINT user_subscriptions_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES auth.users(id) 
ON DELETE CASCADE;

-- Drop the users table if it exists since we're using auth.users
DROP TABLE IF EXISTS users CASCADE; 