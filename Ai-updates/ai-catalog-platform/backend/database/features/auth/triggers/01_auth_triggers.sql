-- Auth Triggers and Logic

-- 1. Function to auto-create profile and initial roles
CREATE OR REPLACE FUNCTION auth.on_user_created()
RETURNS TRIGGER AS $$
BEGIN
    -- Create default notification preferences
    INSERT INTO notification.preferences (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
    
    -- Log the registration event
    INSERT INTO auth.auth_events (user_id, event_type, status, metadata)
    VALUES (NEW.id, 'REGISTER', 'SUCCESS', jsonb_build_object('email', NEW.email));
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Trigger for user creation
DROP TRIGGER IF EXISTS tr_on_user_created ON auth.users;
CREATE TRIGGER tr_on_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION auth.on_user_created();

-- 3. Updated At Triggers for all tables
CREATE TRIGGER tr_auth_users_updated_at BEFORE UPDATE ON auth.users FOR EACH ROW EXECUTE FUNCTION global.update_updated_at_column();
CREATE TRIGGER tr_users_profiles_updated_at BEFORE UPDATE ON users.profiles FOR EACH ROW EXECUTE FUNCTION global.update_updated_at_column();
CREATE TRIGGER tr_catalog_tools_updated_at BEFORE UPDATE ON catalog.tools FOR EACH ROW EXECUTE FUNCTION global.update_updated_at_column();
