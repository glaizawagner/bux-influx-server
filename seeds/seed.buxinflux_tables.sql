BEGIN;

TRUNCATE
    income,
    expenses,
    users
    RESTART IDENTITY CASCADE;

-- users
INSERT INTO users(user_name, full_name, password, nickname)
VALUES
    ('test', 'User Test','$2a$12$xx86trAauA.stFsRGsFAV.3lHFJEmx1ytw3LM9fTA7l1yyMWcm/Ma', 'purple'),
    ('glaiza', 'Glaiza Wagner', '$2a$12$sF.6QmO4b66Rh1OLgTJiWOirmwxEJVPluvygG50DUbr/S5QgtedYG', 'glyz');

-- income
INSERT INTO income(date_created, type, description, value,user_id)
VALUES
    ('11/01/2019', 'inc', 'Salary', '3000.00', 1),
    ('11/15/2019', 'inc', 'Other Income', '1500.00', 1);

-- expenses
INSERT INTO expenses(date_created, type, description, value, percentage, user_id)
VALUES
    ('11/01/2019', 'exp', 'Groceries', '300','17.00', 1),
    ('11/15/2019', 'exp', 'Fix Car', '150', '12.75', 1);

COMMIT;