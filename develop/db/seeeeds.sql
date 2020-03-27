INSERT INTO
  departments (name)
VALUES
  ("Human Resources"),
  ("Management"),
  ("Accounting"),
  ("Quality"),
  ("Sales"),
  ("Executive");

INSERT INTO
  roles (title, salary, departments_id)
VALUES
  ("Manager", 150000.00, 2),
  ("Assistant Manager", 80000.00, 2),
  ("Accountant", 87500.00, 3),
  ("President", 325000.00, 6),
  ("Vice President", 275000.00, 6),
  ("Salesperson I", 55000.00, 5);

INSERT INTO
  employees (first_name, last_name, roles_id)
VALUES
  ("Frodo", "Baggins", 1),
  ("Mark", "Wahlberg", 4),
  ("Michael", "Myers", 5),
  ("Michael", "Jordan", 6),
  ("Michael", "Jackson", 6),
  ("Mike", "Tyson", 6),
  ("Jason", "Vorhees", 3),
  ("Frederick", "Kruger", 3);

UPDATE
  employees
SET
  managers_id = 2
WHERE
  id = 1;

UPDATE
  employees
SET
  managers_id = 2
WHERE
  id = 3;

UPDATE
  employees
SET
  managers_id = 1
WHERE
  id = 4;

UPDATE
  employees
SET
  managers_id = 1
WHERE
  id = 5;

UPDATE
  employees
SET
  managers_id = 1
WHERE
  id = 6;

UPDATE
  employees
SET
  managers_id = 3
WHERE
  id = 7;

UPDATE
  employees
SET
  managers_id = 3
WHERE
  id = 8;


INSERT INTO
  roles (title, salary, departments_id)
VALUES
  ("CEO", 1000000000, 6);

INSERT INTO
  departments (name)
VALUES
  ("Board of Directors");

INSERT INTO
  departments (name)
VALUES
  ("Support");