-- income
ALTER TABLE income
    DROP COLUMN IF EXISTS user_id;

-- expenses
ALTER TABLE expenses
    DROP COLUMN IF EXISTS user_id;

-- users
DROP TABLE IF EXISTS users;
