-- Add permissions management
-- This will allow Owner to control which pages each role can access

-- Create permissions table
CREATE TABLE IF NOT EXISTS user_permissions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  permission VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, permission)
);

-- Available permissions:
-- - dashboard (always granted)
-- - transactions (view transactions)
-- - transaction_create (create new transaction)
-- - shifts (manage shifts)
-- - reports (view reports)
-- - customers (manage customers)
-- - kapsters (manage kapsters)
-- - services (manage services)
-- - products (manage products)
-- - users (manage users - owner only)
-- - discounts (manage discounts)

-- Grant all permissions to existing owner
INSERT INTO user_permissions (user_id, permission)
SELECT id, permission
FROM users, 
  (VALUES 
    ('dashboard'),
    ('transactions'),
    ('transaction_create'),
    ('shifts'),
    ('reports'),
    ('customers'),
    ('kapsters'),
    ('services'),
    ('products'),
    ('users'),
    ('discounts')
  ) AS perms(permission)
WHERE role = 'owner'
ON CONFLICT (user_id, permission) DO NOTHING;

-- Grant basic permissions to kasir
INSERT INTO user_permissions (user_id, permission)
SELECT id, permission
FROM users,
  (VALUES
    ('dashboard'),
    ('transactions'),
    ('transaction_create'),
    ('shifts')
  ) AS perms(permission)
WHERE role = 'kasir'
ON CONFLICT (user_id, permission) DO NOTHING;

-- Add comment
COMMENT ON TABLE user_permissions IS 'Stores granular permissions for each user';
