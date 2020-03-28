INSERT INTO
  departments (name)
VALUES
  ("Human Resources"),
  ("Billing"),
  ("Accounting"),
  ("Quality"),
  ("Sales"),
  ("Executive")
  ("Shipping")
  ("Support Services");

INSERT INTO
  roles (title, salary, departments_id)
VALUES
  ("Manager", 150000.00, 2),
  ("Assistant Manager", 80000.00, 2),
  ("Accountant", 87500.00, 3),
  ("President", 325000.00, 6),
  ("Vice President", 275000.00, 6),
  ("Salesperson I", 55000.00, 5),
  ("CEO", 1000000000, 6);

INSERT INTO
  employees (first_name, last_name, roles_id)
VALUES
  ("Frodo", "Baggins", 1,2),
  ("Mark", "Wahlberg", 4),
  ("Michael", "Myers", 5,2),
  ("Michael", "Jordan", 6, 1),
  ("Michael", "Jackson", 6, 1),
  ("Mike", "Tyson", 6, 1),
  ("Jason", "Vorhees", 3,3),
  ("Frederick", "Kruger", 3,3);