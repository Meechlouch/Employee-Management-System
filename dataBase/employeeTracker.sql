DROP DATABASE IF EXISTS employee_tracker_db;
CREATE DATABASE employee_tracker_db;
USE employee_tracker_db;

CREATE TABLE department (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,  
    dept_name VARCHAR(30) 
    );
    
CREATE TABLE role (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,     
    title VARCHAR(30),     
    salary DECIMAL,     
    department_id INT,     
    FOREIGN KEY(department_id) 
    REFERENCES department(id) 
    ON DELETE CASCADE 
    );
    
CREATE TABLE employee ( 
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
    first_name VARCHAR(30) NOT NULL, 
    last_name VARCHAR(30) NOT NULL, 
    role_id INT NOT NULL, 
    manager_id INT, 
    FOREIGN KEY(role_id) 
    REFERENCES role(id) 
    ON DELETE CASCADE, 
    FOREIGN KEY(manager_id) 
    REFERENCES employee(id) 
    ON DELETE CASCADE 
    );
    
INSERT INTO department(dept_name) VALUE ("Sales");
INSERT INTO department(dept_name) VALUE ("Engineering");
INSERT INTO department(dept_name) VALUE ("Financing");
INSERT INTO department(dept_name) VALUE ("Legal");

INSERT INTO role (title, salary, department_id) 
VALUES ("Sales Manager", 150000, 1);

INSERT INTO role (title, salary, department_id) VALUES 
("Engineer", 175000, 2);

INSERT INTO role (title, salary, department_id) 
VALUES ("Accountant", 200000, 3);

INSERT INTO role (title, salary, department_id) 
VALUES ("Lawyer", 250000, 4);

SELECT * FROM employee;
SELECT * FROM role;
SELECT * FROM department;

