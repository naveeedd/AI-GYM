-- Insert default membership plans
INSERT INTO membership_plans (name, description, price, duration_days, features, is_active)
VALUES 
(
    'Basic Plan',
    'Perfect for beginners and casual gym-goers',
    29.99,
    30,
    '{
        "access_to_gym_equipment": true,
        "basic_fitness_assessment": true,
        "group_classes": true,
        "locker_room_access": true,
        "personal_trainer_sessions": false,
        "nutrition_consultation": false,
        "premium_facilities": false,
        "priority_booking": false
    }'::jsonb,
    true
),
(
    'Premium Plan',
    'Ideal for dedicated fitness enthusiasts',
    49.99,
    30,
    '{
        "access_to_gym_equipment": true,
        "basic_fitness_assessment": true,
        "group_classes": true,
        "locker_room_access": true,
        "personal_trainer_sessions": true,
        "nutrition_consultation": true,
        "premium_facilities": false,
        "priority_booking": false
    }'::jsonb,
    true
),
(
    'Elite Plan',
    'Our most comprehensive plan for serious athletes',
    79.99,
    30,
    '{
        "access_to_gym_equipment": true,
        "basic_fitness_assessment": true,
        "group_classes": true,
        "locker_room_access": true,
        "personal_trainer_sessions": true,
        "nutrition_consultation": true,
        "premium_facilities": true,
        "priority_booking": true
    }'::jsonb,
    true
); 