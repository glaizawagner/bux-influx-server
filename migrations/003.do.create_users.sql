CREATE TABLE users (
    uid SERIAL PRIMARY KEY,
    user_name TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    password TEXT NOT NULL,
    nickname TEXT,
    date_created TIMESTAMP NOT NULL DEFAULT now(),
    date_modified TIMESTAMP
);

-- Altering Income table
ALTER TABLE income
    ADD COLUMN
        user_id INTEGER REFERENCES users(uid)
        ON DELETE SET NULL;

-- Altering Expenses table
ALTER TABLE expenses
    ADD COLUMN
        user_id INTEGER REFERENCES users(uid)
        ON DELETE SET NULL;
