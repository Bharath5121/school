-- Session Management Functions

-- 1. Function to cleanup expired sessions
CREATE OR REPLACE FUNCTION auth.cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
    -- Delete refresh tokens for expired sessions
    DELETE FROM auth.sessions WHERE expires_at < NOW();
    
    -- Optional: Delete refresh tokens that are no longer associated with a valid session
    -- (Depends on if you want session-less refresh tokens or not)
END;
$$ LANGUAGE plpgsql;

-- 2. Trigger to notify about new feed items for relevant roles
CREATE OR REPLACE FUNCTION notification.on_feed_item_published()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert notification for users with matching role
    -- For simplicity, just an insert, real app would use a queue
    INSERT INTO notification.user_notifications (user_id, title, body, type, metadata)
    SELECT id, 'New ' || NEW.content_type::text, NEW.title, 'NEW_FEED_ITEM', jsonb_build_object('item_id', NEW.id)
    FROM auth.users
    WHERE role = NEW.target_role::text;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_on_feed_item_published ON catalog.feed_items;
CREATE TRIGGER tr_on_feed_item_published
AFTER INSERT ON catalog.feed_items
FOR EACH ROW EXECUTE FUNCTION notification.on_feed_item_published();
