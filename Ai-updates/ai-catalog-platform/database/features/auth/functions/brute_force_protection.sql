-- Security and Edge Case Logic

-- Function to handle failed login attempts and lock account
CREATE OR REPLACE FUNCTION auth.handle_failed_login()
RETURNS TRIGGER AS $$
DECLARE
    failure_count INTEGER;
BEGIN
    IF NEW.event_type = 'LOGIN' AND NEW.status = 'FAILURE' THEN
        SELECT COUNT(*) INTO failure_count
        FROM auth.auth_events
        WHERE user_id = NEW.user_id
          AND event_type = 'LOGIN'
          AND status = 'FAILURE'
          AND created_at > NOW() - INTERVAL '15 minutes';

        IF failure_count >= 5 THEN
            UPDATE auth.users 
            SET status = 'SUSPENDED',
                failed_login_attempts = failure_count,
                locked_until = NOW() + INTERVAL '30 minutes'
            WHERE id = NEW.user_id;
            
            INSERT INTO auth.auth_events (user_id, event_type, status, metadata)
            VALUES (NEW.user_id, 'ACCOUNT_LOCK', 'SUCCESS', jsonb_build_object('reason', 'brute_force_detected', 'failure_count', failure_count));
        ELSE
            UPDATE auth.users
            SET failed_login_attempts = failure_count
            WHERE id = NEW.user_id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for brute force check
DROP TRIGGER IF EXISTS tr_on_login_failure ON auth.auth_events;
CREATE TRIGGER tr_on_login_failure
AFTER INSERT ON auth.auth_events
FOR EACH ROW EXECUTE FUNCTION auth.handle_failed_login();
