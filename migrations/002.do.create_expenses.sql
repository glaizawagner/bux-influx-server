CREATE TABLE expenses(
    eid SERIAL PRIMARY KEY, 
    date_created TIMESTAMP DEFAULT now() NOT NULL,
    type  TEXT NOT NULL,
    description TEXT NOT NULL,
    value DECIMAL(10,2) NOT NULL,
    percentage DECIMAL(5,2)
)

