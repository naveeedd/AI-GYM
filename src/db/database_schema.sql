-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Database Schema for FitLife Gym Management System

-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    full_name TEXT NOT NULL,
    phone_number TEXT,
    address TEXT,
    date_of_birth DATE,
    gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
    profile_image_url TEXT,
    role TEXT NOT NULL CHECK (role IN ('user', 'admin', 'trainer')) DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for faster lookups during login
CREATE INDEX idx_users_email ON users(email);

-- Membership Plans Table
CREATE TABLE membership_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    duration_days INTEGER NOT NULL,
    features JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User Subscriptions Table
CREATE TABLE user_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES membership_plans(id) ON DELETE RESTRICT,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    payment_status TEXT CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')) DEFAULT 'pending',
    payment_method TEXT,
    auto_renew BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on user_id for faster subscription lookups per user
CREATE INDEX idx_user_subscriptions_user_id ON user_subscriptions(user_id);
-- Create index on plan_id for analytics queries
CREATE INDEX idx_user_subscriptions_plan_id ON user_subscriptions(plan_id);

-- Attendance Records Table
CREATE TABLE attendance_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    check_in_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    check_out_time TIMESTAMP WITH TIME ZONE,
    location TEXT,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on user_id for faster attendance lookups per user
CREATE INDEX idx_attendance_records_user_id ON attendance_records(user_id);
-- Create index on check_in_time for date-range queries
CREATE INDEX idx_attendance_records_check_in_time ON attendance_records(check_in_time);

-- Enable Row Level Security for attendance_records
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own attendance records
CREATE POLICY attendance_select_policy ON attendance_records
    FOR SELECT
    USING (user_id = auth.uid() OR auth.jwt() ->> 'role' = 'admin');

-- Policy for users to insert their own attendance records
CREATE POLICY attendance_insert_policy ON attendance_records
    FOR INSERT
    WITH CHECK (user_id = auth.uid());

-- Policy for users to update their own attendance records
CREATE POLICY attendance_update_policy ON attendance_records
    FOR UPDATE
    USING (user_id = auth.uid() OR auth.jwt() ->> 'role' = 'admin');

-- Product Categories Table
CREATE TABLE product_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Products Table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES product_categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    cost_price DECIMAL(10, 2) NOT NULL,
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on category_id for category-specific product queries
CREATE INDEX idx_products_category_id ON products(category_id);

-- Orders Table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status TEXT CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')) DEFAULT 'pending',
    payment_method TEXT,
    payment_status TEXT CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')) DEFAULT 'pending',
    delivery_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on user_id for user-specific order lookups
CREATE INDEX idx_orders_user_id ON orders(user_id);
-- Create index on status for order filtering
CREATE INDEX idx_orders_status ON orders(status);

-- Order Items Table
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for join optimizations
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

-- Diet Goals Table
CREATE TABLE diet_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User Diet Plans Table
CREATE TABLE user_diet_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    goal_id UUID REFERENCES diet_goals(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    daily_calories INTEGER,
    protein_grams INTEGER,
    carbs_grams INTEGER,
    fat_grams INTEGER,
    meal_plan JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on user_id for user-specific diet plan lookups
CREATE INDEX idx_user_diet_plans_user_id ON user_diet_plans(user_id);
-- Create index on goal_id for goal-based diet plan queries
CREATE INDEX idx_user_diet_plans_goal_id ON user_diet_plans(goal_id);

-- Workout Exercises Table
DROP TABLE IF EXISTS exercise_logs;
DROP TABLE IF EXISTS workout_progress;
DROP TABLE IF EXISTS workout_plan_exercises;
DROP TABLE IF EXISTS workout_plans;
DROP TABLE IF EXISTS exercises;

-- Profiles Table (for Supabase Auth)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELEE CASCADE,
    full_name TEXT,
    avatar_url TEXT,
    phone_number TEXT,
    address TEXT,
    date_of_birth DATE,
    gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
    emergency_contact TEXT,
    medical_conditions TEXT,
    fitness_goals TEXT,
    role TEXT NOT NULL CHECK (role IN ('user', 'admin', 'trainer')) DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own profile
CREATE POLICY profiles_select_policy ON profiles
    FOR SELECT
    USING (id = auth.uid() OR auth.jwt() ->> 'role' = 'admin');

-- Policy for users to update their own profile
CREATE POLICY profiles_update_policy ON profiles
    FOR UPDATE
    USING (id = auth.uid() OR auth.jwt() ->> 'role' = 'admin');

-- Create index on role for role-based queries
CREATE INDEX idx_profiles_role ON profiles(role);

-- Expense Categories Table
CREATE TABLE expense_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Expenses Table
CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES expense_categories(id) ON DELETE SET NULL,
    amount DECIMAL(10, 2) NOT NULL,
    description TEXT NOT NULL,
    expense_date DATE NOT NULL,
    receipt_image_url TEXT,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on category_id for category-specific expense queries
CREATE INDEX idx_expenses_category_id ON expenses(category_id);
-- Create index on expense_date for date-range queries
CREATE INDEX idx_expenses_expense_date ON expenses(expense_date);

-- User Metrics Table (for tracking body measurements, weight, etc.)
CREATE TABLE user_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    height_cm DECIMAL(5, 2),
    weight_kg DECIMAL(5, 2),
    body_fat_percentage DECIMAL(5, 2),
    chest_cm DECIMAL(5, 2),
    waist_cm DECIMAL(5, 2),
    hip_cm DECIMAL(5, 2),
    arm_cm DECIMAL(5, 2),
    thigh_cm DECIMAL(5, 2),
    measurement_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on user_id for user-specific metric lookups
CREATE INDEX idx_user_metrics_user_id ON user_metrics(user_id);
-- Create index on measurement_date for timeline queries
CREATE INDEX idx_user_metrics_measurement_date ON user_metrics(measurement_date);

-- Gym Locations Table
CREATE TABLE gym_locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip_code TEXT NOT NULL,
    country TEXT NOT NULL,
    phone_number TEXT,
    email TEXT,
    operating_hours JSONB,
    amenities JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    latitude DECIMAL(9, 6),
    longitude DECIMAL(9, 6),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create spatial index on lat/long coordinates if using PostGIS
-- CREATE INDEX idx_gym_locations_coordinates ON gym_locations USING GIST (ST_SetSRID(ST_MakePoint(longitude, latitude), 4326));

-- Reviews Table
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    location_id UUID REFERENCES gym_locations(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on location_id for location-specific review queries
CREATE INDEX idx_reviews_location_id ON reviews(location_id);
-- Create index on user_id for user-specific review lookups
CREATE INDEX idx_reviews_user_id ON reviews(user_id);

-- Row Level Security Policies
-- These ensure that users can only access their own data

-- Users can only see/update their own profiles (except admins who can see all)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY users_select_policy ON users 
    FOR SELECT 
    USING (id = auth.uid() OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY users_update_policy ON users 
    FOR UPDATE 
    USING (id = auth.uid() OR auth.jwt() ->> 'role' = 'admin');

-- Users can only see their own subscriptions (except admins)
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY subscriptions_select_policy ON user_subscriptions 
    FOR SELECT 
    USING (user_id = auth.uid() OR auth.jwt() ->> 'role' = 'admin');

-- Users can only see their own orders (except admins)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY orders_select_policy ON orders 
    FOR SELECT 
    USING (user_id = auth.uid() OR auth.jwt() ->> 'role' = 'admin');

-- Views for common queries

-- Active Memberships View
CREATE VIEW active_memberships AS
SELECT 
    u.id AS user_id,
    u.full_name,
    u.email,
    mp.name AS plan_name,
    us.start_date,
    us.end_date,
    mp.price
FROM 
    users u
JOIN 
    user_subscriptions us ON u.id = us.user_id
JOIN 
    membership_plans mp ON us.plan_id = mp.id
WHERE 
    us.is_active = TRUE AND
    us.end_date > CURRENT_TIMESTAMP;

-- Monthly Revenue View
CREATE VIEW monthly_revenue AS
SELECT 
    date_trunc('month', o.created_at) AS month,
    SUM(o.total_amount) AS total_revenue
FROM 
    orders o
WHERE 
    o.status = 'completed' AND
    o.payment_status = 'completed'
GROUP BY 
    date_trunc('month', o.created_at)
ORDER BY 
    month DESC;

-- Monthly Expenses View
CREATE VIEW monthly_expenses AS
SELECT 
    date_trunc('month', e.expense_date) AS month,
    SUM(e.amount) AS total_expenses,
    ec.name AS category
FROM 
    expenses e
JOIN 
    expense_categories ec ON e.category_id = ec.id
GROUP BY 
    date_trunc('month', e.expense_date),
    ec.name
ORDER BY 
    month DESC,
    category;

-- Monthly Profit View
CREATE VIEW monthly_profit AS
SELECT 
    r.month,
    r.total_revenue,
    COALESCE(e.total_expenses, 0) AS total_expenses,
    (r.total_revenue - COALESCE(e.total_expenses, 0)) AS profit
FROM 
    (SELECT 
        date_trunc('month', created_at) AS month,
        SUM(total_amount) AS total_revenue
    FROM 
        orders
    WHERE 
        status = 'completed' AND
        payment_status = 'completed'
    GROUP BY 
        date_trunc('month', created_at)) r
LEFT JOIN 
    (SELECT 
        date_trunc('month', expense_date) AS month,
        SUM(amount) AS total_expenses
    FROM 
        expenses
    GROUP BY 
        date_trunc('month', expense_date)) e
ON 
    r.month = e.month
ORDER BY 
    r.month DESC;

-- Top Selling Products View
CREATE VIEW top_selling_products AS
SELECT 
    p.id,
    p.name,
    p.price,
    COUNT(oi.id) AS order_count,
    SUM(oi.quantity) AS total_quantity,
    SUM(oi.quantity * oi.unit_price) AS total_revenue
FROM 
    products p
JOIN 
    order_items oi ON p.id = oi.product_id
JOIN 
    orders o ON oi.order_id = o.id
WHERE 
    o.status = 'completed'
GROUP BY 
    p.id,
    p.name,
    p.price
ORDER BY 
    total_revenue DESC;

-- Functions for common operations

-- Function to calculate BMR (Basal Metabolic Rate)
CREATE OR REPLACE FUNCTION calculate_bmr(
    weight_kg DECIMAL, 
    height_cm DECIMAL, 
    age INTEGER, 
    gender TEXT
) 
RETURNS DECIMAL
LANGUAGE plpgsql
AS $$
DECLARE
    bmr DECIMAL;
BEGIN
    IF gender = 'male' THEN
        bmr := 10 * weight_kg + 6.25 * height_cm - 5 * age + 5;
    ELSIF gender = 'female' THEN
        bmr := 10 * weight_kg + 6.25 * height_cm - 5 * age - 161;
    ELSE
        bmr := 10 * weight_kg + 6.25 * height_cm - 5 * age - 78; -- Average
    END IF;
    
    RETURN ROUND(bmr);
END;
$$;

-- Function to check if a user's subscription is active
CREATE OR REPLACE FUNCTION is_subscription_active(user_uuid UUID) 
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
    is_active BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1
        FROM user_subscriptions
        WHERE user_id = user_uuid
        AND is_active = TRUE
        AND end_date > CURRENT_TIMESTAMP
    ) INTO is_active;
    
    RETURN is_active;
END;
$$;

-- Function to automatically update stock when an order is completed
CREATE OR REPLACE FUNCTION update_stock_on_order_complete() 
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    -- Only proceed if the order status is being updated to 'completed'
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        UPDATE products p
        SET stock_quantity = p.stock_quantity - oi.quantity
        FROM order_items oi
        WHERE oi.product_id = p.id
        AND oi.order_id = NEW.id;
    END IF;
    
    RETURN NEW;
END;
$$;

-- Create the trigger for the function above
CREATE TRIGGER update_stock_trigger
AFTER UPDATE ON orders
FOR EACH ROW
WHEN (NEW.status = 'completed' AND OLD.status != 'completed')
EXECUTE FUNCTION update_stock_on_order_complete();

-- Function to calculate days since last gym visit
CREATE OR REPLACE FUNCTION days_since_last_visit(user_uuid UUID) 
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
    last_visit_date TIMESTAMP WITH TIME ZONE;
    days_since INTEGER;
BEGIN
    SELECT MAX(check_in_time)
    INTO last_visit_date
    FROM attendance_records
    WHERE user_id = user_uuid;
    
    IF last_visit_date IS NULL THEN
        RETURN NULL;
    END IF;
    
    days_since := EXTRACT(DAY FROM (CURRENT_TIMESTAMP - last_visit_date));
    
    RETURN days_since;
END;
$$;
