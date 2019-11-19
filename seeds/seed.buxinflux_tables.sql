-- BEGIN;

-- TRUNCATE
--     income,
--     RESTART IDENTITY CASCADE;

INSERT INTO income(date_created, type, description, value)
VALUES
('11/01/2019', '+', 'Salary', '3000.00'),
('11/15/2019', '+', 'Other Income', '1500.00');

INSERT INTO expenses(date_created, type, description, value, percentage)
VALUES
('11/01/2019', '-', 'Groceries', '300','17.00' ),
('11/15/2019', '-', 'Fix Car', '150', '12.75');

-- COMMIT;