-- Drop existing views
DROP VIEW IF EXISTS user_stats_view;
DROP VIEW IF EXISTS active_memberships;
DROP VIEW IF EXISTS monthly_revenue;
DROP VIEW IF EXISTS admin_attendance_view;

-- Create or replace the user_stats_view
CREATE OR REPLACE VIEW user_stats_view AS
SELECT 
    p.id as user_id,
    COALESCE(
        (SELECT COUNT(*) 
         FROM attendance_records ar 
         WHERE ar.user_id = p.id 
         AND ar.check_in_time >= NOW() - INTERVAL '7 days'
        ), 0
    ) as recent_visits,
    COALESCE(
        (SELECT COUNT(*) 
         FROM attendance_records ar 
         WHERE ar.user_id = p.id 
         AND ar.check_in_time >= date_trunc('month', CURRENT_DATE)
        ), 0
    ) as total_visits_month,
    CASE 
        WHEN EXISTS (
            SELECT 1 
            FROM user_subscriptions us 
            WHERE us.user_id = p.id 
            AND us.is_active = true 
            AND us.end_date > NOW()
        ) THEN 'Active'
        ELSE 'Inactive'
    END as membership_status,
    CASE 
        WHEN EXISTS (
            SELECT 1 
            FROM user_subscriptions us 
            WHERE us.user_id = p.id 
            AND us.is_active = true 
            AND us.end_date > NOW()
        ) THEN 
            EXTRACT(DAY FROM (
                (SELECT end_date 
                 FROM user_subscriptions 
                 WHERE user_id = p.id 
                 AND is_active = true 
                 AND end_date > NOW() 
                 ORDER BY end_date DESC 
                 LIMIT 1
                ) - NOW()
            ))
        ELSE NULL
    END as membership_days_left
FROM profiles p;

-- Create or replace the active_memberships view
CREATE OR REPLACE VIEW active_memberships AS
SELECT 
    us.id as subscription_id,
    us.user_id,
    p.full_name,
    au.email,
    mp.name as plan_name,
    mp.price,
    us.start_date,
    us.end_date,
    us.payment_status,
    us.is_active
FROM 
    user_subscriptions us
JOIN 
    profiles p ON us.user_id = p.id
JOIN 
    auth.users au ON us.user_id = au.id
JOIN 
    membership_plans mp ON us.plan_id = mp.id
WHERE 
    us.is_active = true 
    AND us.end_date > NOW();

-- Create or replace the monthly_revenue view
CREATE OR REPLACE VIEW monthly_revenue AS
SELECT 
    date_trunc('month', us.created_at) as month,
    mp.name as plan_name,
    COUNT(*) as active_members,
    SUM(mp.price) as amount
FROM 
    user_subscriptions us
JOIN 
    membership_plans mp ON us.plan_id = mp.id
WHERE 
    us.is_active = true 
    AND us.end_date > NOW()
GROUP BY 
    date_trunc('month', us.created_at),
    mp.name
ORDER BY 
    month DESC,
    mp.name;

-- Create or replace the admin_attendance_view
CREATE OR REPLACE VIEW admin_attendance_view AS
SELECT 
    ar.id as attendance_id,
    ar.user_id,
    p.full_name,
    au.email,
    mp.name as membership_plan,
    ar.check_in_time,
    ar.check_out_time,
    ar.location,
    CASE 
        WHEN ar.check_out_time IS NULL THEN 
            EXTRACT(EPOCH FROM (NOW() - ar.check_in_time))/60
        ELSE 
            EXTRACT(EPOCH FROM (ar.check_out_time - ar.check_in_time))/60
    END as duration_minutes,
    CASE 
        WHEN ar.check_out_time IS NULL THEN true
        ELSE false
    END as is_currently_checked_in
FROM 
    attendance_records ar
JOIN 
    profiles p ON ar.user_id = p.id
JOIN 
    auth.users au ON ar.user_id = au.id
LEFT JOIN 
    user_subscriptions us ON ar.user_id = us.user_id AND us.is_active = true
LEFT JOIN 
    membership_plans mp ON us.plan_id = mp.id
ORDER BY 
    ar.check_in_time DESC;

-- Create or replace the active_members_view
CREATE OR REPLACE VIEW active_members_view AS
SELECT 
    p.id as user_id,
    p.full_name,
    au.email,
    p.avatar_url,
    p.created_at as join_date,
    us.start_date as subscription_start,
    us.end_date as subscription_end,
    mp.name as plan_name,
    mp.price as plan_price,
    us.payment_status,
    us.auto_renew,
    CASE 
        WHEN us.end_date > NOW() THEN true
        ELSE false
    END as is_active,
    (
        SELECT check_in_time
        FROM attendance_records ar
        WHERE ar.user_id = p.id
        ORDER BY check_in_time DESC
        LIMIT 1
    ) as last_check_in,
    (
        SELECT COUNT(*)
        FROM attendance_records ar
        WHERE ar.user_id = p.id
        AND ar.check_in_time >= date_trunc('month', CURRENT_DATE)
    ) as visits_this_month
FROM 
    profiles p
JOIN 
    auth.users au ON p.id = au.id
LEFT JOIN 
    user_subscriptions us ON p.id = us.user_id AND us.is_active = true
LEFT JOIN 
    membership_plans mp ON us.plan_id = mp.id
WHERE 
    p.role = 'user'
    AND us.end_date > NOW()
ORDER BY 
    p.full_name; 