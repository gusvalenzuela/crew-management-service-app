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


