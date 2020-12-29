INSERT INTO department (dept_name)
VALUES ('Production'),	
	('Sales'),
       ('Accounting & Finance'),
       ('Tech and Engineering'),
       ('Human Resources'),
       ('Legal');
       
INSERT INTO employee_tracker_db.role (title, salary, department_id)
VALUES ('Project Manager', 87000, 1),
       ('Full-Stack Developer', 75000, 1),
       ('Front-end Developer', 70000, 1),
       ('Back-end', 72000, 1),
       ('Sales Manager', 80000, 2),
       ('Sales Consultant', 55000, 2),
       ('Junior Sales', 52000, 2),
       ('Sales Representative', 45000, 2),
       ('Sales Intern', 40000, 2),
       ('Financial Analyst', 47000, 3),
       ('Financial Advisor', 52000, 3),
       ('Financial Manager', 62000, 3),
       ('Lead Software Engineer', 83000, 4),
       ('Software Engineer', 55000, 4),
       ('Intern Engineer', 37000, 4),
       ('HR Manager', 62000, 5),
       ('HR Officer', 57000, 5),
       ('HR Consultant', 49000, 5),
       ('HR Adminstrator', 38000, 5),
       ('Legal Manager', 71000, 6),
       ('Legal Consultant', 53000, 6),
       ('Legal Intern', 43000, 6);
     
INSERT INTO employee(first_name, last_name, role_id)
VALUES('Okina', 'Shyachyou', 12),
	  ('Mister', 'Mxyzptlk', 13);

       