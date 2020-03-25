DROP DATABASE if exists workforceDB;
CREATE DATABASE workforceDB;
USE workforceDB;
CREATE TABLE departments (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(30) NULL
);
CREATE TABLE roles (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL(25, 2) NULL,
  departments_id INT NULL,
  FOREIGN KEY (departments_id) REFERENCES departments (id)
);
CREATE TABLE employees (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  roles_id int NULL,
  is_manager BOOLEAN DEFAULT 0,
  managers_id INT NULL,
  FOREIGN KEY (managers_id) REFERENCES employees (id),
  FOREIGN KEY (roles_id) REFERENCES roles (id)
);
INSERT INTO departments (name)
VALUES
  ("Human Resources"),
  ("Management"),
  ("Accounting"),
  ("Quality"),
  ("Sales"),
  ("Executive");
INSERT INTO roles (title, salary,departments_id)
VALUES
  ("Manager", 150000.00,2),
  ("Assistant Manager", 80000.00,2),
  ("Accountant", 87500.00,3),
  ("President", 325000.00,6),
  ("Vice President", 275000.00,6),
  ("Salesperson I", 55000.00,5);
INSERT INTO employees (first_name, last_name,roles_id)
VALUES
  ("Kat", "Valenzia",1),
  ("Mark", "Watney",4),
  ("Michael", "Myers",5),
  ("Michael", "Jordan",6),
  ("Michael", "Jackson",6),
  ("Mike", "Tyson",6),
  ("Jason", "Vorhees",3),
  ("Frederick", "Kruger",3);
  
UPDATE employees SET managers_id = 2 WHERE id = 1;
UPDATE employees SET managers_id = 2 WHERE id = 3;
UPDATE employees SET managers_id = 1 WHERE id = 4;
UPDATE employees SET managers_id = 1 WHERE id = 5;
UPDATE employees SET managers_id = 1 WHERE id = 6;
UPDATE employees SET managers_id = 3 WHERE id = 7;
UPDATE employees SET managers_id = 3 WHERE id = 8;
  
  SELECT * FROM employees;
  SELECT * FROM departments;
  SELECT * FROM roles LEFT JOIN employees on roles.id=employees.id;
  
  INSERT INTO roles (title, salary) VALUES ("CEO",1000000000);
  INSERT INTO departments (name) VALUES ("Board of Directors");
  INSERT INTO departments (name) VALUES ("Support");
  
SELECT first_name as "First Name", last_name as "Last Name", title as "Title", salary as "Annual Salary",departments.name as "Department", managers_id as "Manager"
    FROM (employees 
    LEFT JOIN roles 
    ON (employees.roles_id = roles.id )) 
    LEFT JOIN departments 
    ON (roles.departments_id = departments.id);
  
SELECT first_name, last_name, title, salary, departments.name
    FROM (departments RIGHT JOIN roles ON (departments.id = roles.id))
    RIGHT JOIN employees ON (roles.id = employees.id);
    
SELECT 'Employee' As Type, first_name, last_name
FROM employees
UNION ALL
SELECT 'Role', title, title
FROM roles;
    
    SELECT * FROM roles FULL JOIN employees GROUP BY employees.roles_id;