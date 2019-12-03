CREATE TABLE income(
    iid SERIAL PRIMARY KEY, 
    -- date_created TIMESTAMP DEFAULT now() NOT NULL,
    date_created DATE NOT NULL,
    type  TEXT NOT NULL,
    description TEXT NOT NULL,
    value DECIMAL(10,2) NOT NULL 
)

