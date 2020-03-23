DROP DATABASE if exists workforceDB;
CREATE DATABASE workforceDB;
USE workforceDB;
CREATE TABLE department (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(30) NULL
);
CREATE TABLE `role` (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL(10, 2) NULL,
  department_id INT NULL,
  FOREIGN KEY (department_id) REFERENCES department (id)
);
CREATE TABLE employees (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NULL,
  manager_id INT NULL,
  -- FOREIGN KEY (manager_id) REFERENCES manager (id),
  FOREIGN KEY (role_id) REFERENCES role (id)
);
INSERT INTO department (name)
VALUES
  ("Human Resources"),
  ("Management"),
  ("Accounting"),
  ("Quality"),
  ("Sales"),
  ("Executive");
INSERT INTO `role` (title, salary)
VALUES
  ("Manager", 150000.00),
  ("Assistant Manager", 80000.00),
  ("Accountant", 87500.00),
  ("President", 325000.00),
  ("Vice President", 275000.00),
  ("Salesperson I", 55000.00);
INSERT INTO employees (first_name, last_name)
VALUES
  ("Kat", "Valenzia"),
  ("Mark", "Watney"),
  ("Michael", "Myers"),
  ("Michael", "Jordan"),
  ("Michael", "Jackson"),
  ("Mike", "Tyson"),
  ("Jason", "Vorhees"),
  ("Frederick", "Kruger");