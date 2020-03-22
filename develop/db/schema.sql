DROP DATABASE if exists workforceDB;

CREATE DATABASE workforceDB;

USE workforceDB;

CREATE TABLE department (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(30) NULL
);
CREATE TABLE role (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL, 
    salary DECIMAL(10,2) NULL,
    department_id INT NULL,
    
    FOREIGN KEY (department_id) REFERENCES department (id)
);
CREATE TABLE employee (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NULL,
    manager_id INT NULL,

    FOREIGN KEY (role_id) REFERENCES role (id)
    -- FOREIGN KEY (manager_id) REFERENCES manager (id)
);
