const inquirer = require("inquirer");
const connection = require("./mysql-connection/connection");
const cTable = require("console.table");
const logo = require("asciiart-logo");
const config = require("./package.json");

function init() {
  console.log(
    logo({
      name: "Employee Management System",
      font: "Larry 3D",
      lineChars: 1,
      padding: 2,
      margin: 1,
      borderColor: "magenta",
      logoColor: "yellow",
      textColor: "green",
      version: "1.0.0",
      description: '"mySQL Database and nodeJs"',
    }).render()
  );
  setTimeout(() => {
    startInquire();
  }, 2000);
}

function startInquire() {
  inquirer
    .prompt({
      name: "choice",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "Add Department",
        "Add Role",
        "Add Employee",
        "View All Departments",
        "View All Roles",
        "View all Employees",
        "Remove Employee",
        "Remove Role",
        "Remove Department",
        "Update Employee's Role",
        "Update Employee's Manager",
        "View All Employees By Manager",
        "View Total Utilized Budget By Department",
        "Exit",
      ],
    })
    .then(function (answer) {
      switch (answer.choice) {
        case "Add Department":
          addDept();
          break;

        case "Add Role":
          addRole();
          break;

        case "Add Employee":
          addEmployee();
          break;

        case "View All Departments":
          allDept();
          break;

        case "View All Roles":
          allRoles();
          break;

        case "View all Employees":
          allEmployed();
          break;

        case "Remove Employee":
          removeEmployee();
          break;

        case "Remove Role":
          removeRole();
          break;

        case "Remove Department":
          removeDept();
          break;

        case "Update Employee's Role":
          updateEmployee();
          break;

        case "Update Employee's Manager":
          updateManager();
          break;

        case "View All Employees By Manager":
          viewByManagers();
          break;

        case "View Total Utilized Budget By Department":
          budgetByDept();
          break;

        case "Exit":
          connection.end();
          break;
      }
    });
}

function addDept() {
  connection.query(`SELECT department.id, department.dept_name AS Departments FROM department;`, (err, res) => {
    if (err) throw err;
    console.log("----------------------");
    console.log("** REFERENCE TABLE! **");
    console.log("----------------------");
    console.table(res);
  });

  setTimeout(() => {
    inquirer
      .prompt([
        {
          name: "deptName",
          type: "input",
          message: "What is the name of the Department being added?",
        },
      ])
      .then((answer) => {
        connection.query(
          "INSERT INTO department SET ?",
          {
            dept_name: answer.deptName,
          },
          function (err) {
            if (err) {
              console.log(err);
            } else {
              connection.query(
                `SELECT department.id, department.dept_name AS Department FROM department;`,
                (err, res) => {
                  if (err) throw err;
                  console.log("--------------------");
                  console.log("** DEPT WAS ADDED **");
                  console.log("--------------------");
                  console.table(res);
                  startInquire();
                }
              );
            }
          }
        );
      });
  }, 1000);
}

function addRole() {
  connection.query(
    `SELECT  title AS Title, salary AS Salary, dept_name AS Department, department.id AS 'Dept ID#' 
                    FROM role
                    INNER JOIN department
                    ON department.id = department_id
                    ORDER BY dept_name;`,
    (err, res) => {
      if (err) throw err;
      console.log("--------------------------------------------------------------");
      console.log("      ********** USE THIS TABLE AS A REFERENCE **********      ");
      console.log("--------------------------------------------------------------");
      console.table(res);
    }
  ),
    setTimeout(() => {
      inquirer
        .prompt([
          {
            type: "input",
            name: "addedRole",
            message: "What is the name of the role you would like to add?",
          },
          {
            type: "number",
            name: "salary",
            message: "How much is the yearly salary for this new role?",
          },
          {
            type: "number",
            name: "roleDeptID",
            message: "What is the department id number for this new role?",
          },
        ])
        .then((answer) => {
          console.log(answer);
          connection.query(
            "INSERT INTO role SET ?",
            {
              title: answer.addedRole,
              salary: answer.salary,
              department_id: answer.roleDeptID,
            },
            function (err) {
              if (err) {
                console.log("You must create a New Department before you create a New Role!");
                startInquire();
              }
              connection.query(
                `SELECT  title AS Title, salary AS Salary, dept_name AS Department 
                                FROM role
                                INNER JOIN department
                                ON department.id = department_id;`,
                (err, res) => {
                  if (err) throw err;
                  console.log("--------------------------------------------------------------");
                  console.log("      ********** DATA WAS ADDED TO THE TABLE! **********      ");
                  console.log("--------------------------------------------------------------");
                  console.table(res);
                  console.log("\n");
                  startInquire();
                }
              );
            }
          );
        });
    }, 1000);
}

function addEmployee() {
  const query = `SELECT employee.id AS 'ID#', CONCAT(employee.first_name, " ", employee.last_name) AS 'Employees',
	role.id AS 'Role ID#', role.title AS 'Title', role.salary AS 'Salary', 
    department_id AS 'Dept ID#', department.dept_name AS 'Department',
    CONCAT(e.first_name, ' ', e.last_name) AS 'Manager' 
    FROM role LEFT JOIN employee ON employee.role_id = role.id 
    INNER JOIN department ON department.id = role.department_id 
    LEFT JOIN employee e ON employee.manager_id = e.id;`;
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.log(
      "----------------------------------------------------------------------------------------------------------------"
    );
    console.log(
      "************************************     USE THIS TABLE AS A REFERENCE!     ************************************"
    );
    console.log(
      "----------------------------------------------------------------------------------------------------------------"
    );
    console.table(res);
  });
  setTimeout(() => {
    inquirer
      .prompt([
        {
          type: "list",
          message: "Will this Employee be filling a Manager role?",
          name: "manager",
          choices: ["Yes", "No"],
        },
        {
          name: "firstName",
          type: "input",
          message: "What is the Employees First Name?",
        },

        {
          name: "lastName",
          type: "input",
          message: "What is the employees Last Name?",
        },
        {
          name: "roleId",
          type: "number",
          message: "What is the role id number for this Employee?",
        },
        {
          name: "managerId",
          type: "number",
          message: "What is the Manager's ID number?",
          when: (answer) => {
            return answer.manager === "No";
          },
        },
      ])
      .then((answer) => {
        connection.query(
          "INSERT INTO employee SET ?",
          {
            first_name: answer.firstName,
            last_name: answer.lastName,
            role_id: answer.roleId,
            manager_id: answer.managerId,
          },
          function (err) {
            if (err) {
              console.log("You must create a New Department before you create a New Role!");
              startInquire();
            } else {
              connection.query(
                `SELECT employee.id AS 'ID#', CONCAT(first_name, " ", last_name) AS Employee, role_id AS 'Role ID#',
              manager_id AS Manager
              FROM employee;`,
                (err, res) => {
                  if (err) throw err;
                  console.log("---------------------------------------");
                  console.log("***** DATA WAS ADDED TO THE TABLE *****");
                  console.log("---------------------------------------");
                  console.table(res);
                  startInquire();
                }
              );
            }
          }
        );
      });
  }, 1000);
}

function allDept() {
  var query = `SELECT department.id AS 'ID#', dept_name AS Departments
              FROM department;`;
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.log("---------------------------");
    console.log("* VIEW OF ALL DEPARTMENTS *");
    console.log("---------------------------");
    console.table(res);
    startInquire();
  });
}

function allRoles() {
  var query = `SELECT  title AS Title, salary AS Salary, dept_name AS Department, department.id AS 'Dept ID#' 
  FROM role
  INNER JOIN department
  ON department.id = department_id
  ORDER BY dept_name;`;
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.log("--------------------------------------------------------------");
    console.log("          ********** A VIEW OF ALL ROLES! **********          ");
    console.log("--------------------------------------------------------------");
    console.table(res);
    startInquire();
  });
}

function allEmployed() {
  let query = `SELECT employee.id AS 'ID#', CONCAT(employee.first_name, " ", employee.last_name) AS 'Employees',
	role.id AS 'Role ID#', role.title AS 'Title', role.salary AS 'Salary', 
    department_id AS 'Dept ID#', department.dept_name AS 'Department',
    CONCAT(e.first_name, ' ', e.last_name) AS 'Manager' 
    FROM role LEFT JOIN employee ON employee.role_id = role.id 
    INNER JOIN department ON department.id = role.department_id 
    LEFT JOIN employee e ON employee.manager_id = e.id
    WHERE employee.id IS NOT NULL;`;
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.log(
      "------------------------------------------------------------------------------------------------------------------"
    );
    console.log(
      "                  ******************     THIS IS A VIEW OF ALL EMPLOYEES!     ******************                  "
    );
    console.log(
      "------------------------------------------------------------------------------------------------------------------"
    );
    console.table(res);
    startInquire();
  });
}

function updateEmployee() {
  let query = `SELECT employee.id AS 'ID#', CONCAT(employee.first_name, " ", employee.last_name) AS 'Employees',
	  role.id AS 'Role ID#', role.title AS 'Title', role.salary AS 'Salary', 
    department_id AS 'Dept ID#', department.dept_name AS 'Department',
    CONCAT(e.first_name, ' ', e.last_name) AS 'Manager' 
    FROM role LEFT JOIN employee ON employee.role_id = role.id 
    INNER JOIN department ON department.id = role.department_id 
    LEFT JOIN employee e ON employee.manager_id = e.id;`;
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.log(
      "----------------------------------------------------------------------------------------------------------------"
    );
    console.log(
      "                  ******************     USE THIS TABLE AS A REFERENCE!     ******************                  "
    );
    console.log(
      "----------------------------------------------------------------------------------------------------------------"
    );
    console.table(res);
  });

  setTimeout(() => {
    inquirer
      .prompt([
        {
          type: "list",
          name: "toManager",
          message: "Will Employee be upgraded to a Manager Position?",
          choices: ["Yes", "No"],
        },
        {
          type: "number",
          name: "id",
          message: "What is the ID# of the employee you wish to update?",
        },
        {
          type: "input",
          name: "roleID",
          message: "Please enter the new Role ID Number for this Employee",
        },
        {
          type: "number",
          name: "addNull",
          message: "What is the Manager's ID Number?",
          when: (answer) => {
            return answer.toManager === "No";
          },
        },
        {
          type: "input",
          name: "addNull",
          message: "Please type 'null' as written!",
          when: (answer) => {
            return answer.toManager === "Yes";
          },
        },
      ])
      .then((answer) => {
        let query = `UPDATE employee SET role_id = ${answer.roleID},
                     manager_id = ${answer.addNull}
                     WHERE id = ${answer.id};`;
        connection.query(query, (err) => {
          if (err) throw err;
          connection.query(
            `SELECT employee.id AS 'ID#', CONCAT(employee.first_name, " ", employee.last_name) AS 'Employees',
              role.id AS 'Role ID#', role.title AS 'Title', role.salary AS 'Salary', department.dept_name AS 'Department',
              CONCAT(e.first_name, ' ', e.last_name) AS 'Manager' 
              FROM employee 
              LEFT JOIN role ON role.id = employee.role_id 
              INNER JOIN department ON department.id = role.department_id
              LEFT JOIN employee e ON employee.manager_id = e.id;`,
            (err, res) => {
              if (err) throw err;
              console.log(
                "-----------------------------------------------------------------------------------------------------"
              );
              console.log(
                "    ******************     THE FOLLOWING EMPLOYEE'S ROLE HAS BEEN CHANGED!     ******************    "
              );
              console.log(
                "-----------------------------------------------------------------------------------------------------"
              );
              console.table(res);
            }
          );
        });
        setTimeout(() => {
          startInquire();
        }, 1000);
      });
  }, 1000);
}

function updateManager() {
  connection.query(
    `SELECT employee.id AS 'ID#', CONCAT(employee.first_name, " ", employee.last_name) AS 'Employees',
  role.id AS 'Role ID#', role.title AS 'Title', role.salary AS 'Salary', 
  department_id AS 'Dept ID#', department.dept_name AS 'Department',
  CONCAT(e.first_name, ' ', e.last_name) AS 'Manager' 
  FROM role LEFT JOIN employee ON employee.role_id = role.id 
  INNER JOIN department ON department.id = role.department_id 
  LEFT JOIN employee e ON employee.manager_id = e.id;`,
    (err, res) => {
      if (err) throw err;
      console.log(
        "----------------------------------------------------------------------------------------------------------------"
      );
      console.log(
        "                  ******************     USE THIS TABLE AS A REFERENCE!     ******************                  "
      );
      console.log(
        "----------------------------------------------------------------------------------------------------------------"
      );
      console.table(res);
    }
  ),
    connection.query(
      `SELECT employee.id AS 'ID#', CONCAT(first_name, " ", last_name) AS Managers, title AS Title, role.id AS 'Title ID#', salary AS Salary
                    FROM employee
                    INNER JOIN role
                    ON role.id = role_id
                    WHERE manager_id IS null;`,
      (err, res) => {
        if (err) throw err;
        console.log("----------------------------------------------------------");
        console.log("        ********** VIEW OF ALL MANAGERS **********        ");
        console.log("----------------------------------------------------------");
        console.table(res);
      }
    ),
    setTimeout(() => {
      inquirer
        .prompt([
          {
            type: "confirm",
            name: "managerRole",
            message: "Will you be updating the Manager's role?",
          },
          {
            type: "input",
            name: "name",
            message: "Enter the name of the Manager that you would like to update?",
            when: (answer) => {
              return answer.managerRole === true;
            },
          },
          {
            type: "number",
            name: "roleID",
            message: "What is the role ID number of the Title that the Manager will transfer to?",
            when: (answer) => {
              return answer.managerRole === true;
            },
          },
          {
            type: "confirm",
            name: "updateManager",
            message: "Do you need to update another Manager to fill the position of the last Manager?",
            when: (answer) => {
              return answer.managerRole === true;
            },
          },
        ])
        .then((answer) => {
          if (answer.managerRole === false) {
            matchEmpToNewManager();
          } else {
            let query = `UPDATE employee
              SET role_id = ${answer.roleID}
              WHERE concat(employee.first_name, " ", employee.last_name) = '${answer.name}';`;
            connection.query(query, (err) => {
              if (err) throw err;
            });
          }
          if (answer.updateManager) {
            updateManager();
          } else {
            connection.query(
              `SELECT employee.id AS 'ID#', CONCAT(employee.first_name, " ", employee.last_name) AS 'Employees',
            role.id AS 'Role ID#', role.title AS 'Title', role.salary AS 'Salary', 
            department_id AS 'Dept ID#', department.dept_name AS 'Department',
            CONCAT(e.first_name, ' ', e.last_name) AS 'Manager' 
            FROM role LEFT JOIN employee ON employee.role_id = role.id 
            INNER JOIN department ON department.id = role.department_id 
            LEFT JOIN employee e ON employee.manager_id = e.id;`,
              (err, res) => {
                if (err) throw err;
                console.log(
                  "-----------------------------------------------------------------------------------------------------------------"
                );
                console.log(
                  "                  ******************     MANAGERS ROLE HAS BEEN UPDATED!     ******************                  "
                );
                console.log(
                  "-----------------------------------------------------------------------------------------------------------------"
                );
                console.table(res);
                matchEmpToNewManager();
              }
            );
          }
        });
    }, 1000);
}

function removeEmployee() {
  connection.query(
    `SELECT employee.id AS 'ID#', CONCAT(first_name, " ", last_name) AS Employees,
                   role_id AS 'Role ID#', manager_id AS 'Manager ID#'
                   FROM employee`,
    (err, res) => {
      if (err) throw err;
      console.log("---------------------------------------------");
      console.log(" ****** USE THIS TABLE AS A REFERENCE ****** ");
      console.log("---------------------------------------------");
      console.table(res);
    }
  );
  setTimeout(() => {
    inquirer
      .prompt([
        {
          type: "number",
          name: "empID",
          message:
            "What is the ID Number of the employee that you would like to remove? (Deleting a Manager will delete employees under that Manager)",
        },
      ])
      .then((answer) => {
        let query = `DELETE FROM employee WHERE employee.id = ${answer.empID};`;
        connection.query(query, (err) => {
          if (err) throw err;
          connection.query(
            `SELECT employee.id AS 'ID#', CONCAT(first_name, " ", last_name) AS Employees,
                           role_id AS 'Role ID#', manager_id AS 'Manager ID#'
                           FROM employee`,
            (err, res) => {
              if (err) throw err;
              console.log("---------------------------------------------");
              console.log(" ******* EMPLOYEE HAS BEEN DELETED!  ******* ");
              console.log("---------------------------------------------");
              console.table(res);
            }
          );
        });
        setTimeout(() => {
          startInquire();
        }, 1500);
      });
  }, 1000);
}

function removeRole() {
  connection.query(
    `SELECT role.id AS 'ID#', title AS Title, salary AS Salary, dept_name AS Department, department.id AS 'Dept ID#' 
                    FROM role
                    INNER JOIN department
                    ON department.id = department_id
                    ORDER BY dept_name;`,
    (err, res) => {
      if (err) throw err;
      console.log("-------------------------------------------------------------------");
      console.log("      ************ USE THIS TABLE AS A REFERENCE ************      ");
      console.log("-------------------------------------------------------------------");
      console.table(res);
    }
  ),
    setTimeout(() => {
      inquirer
        .prompt([
          {
            type: "number",
            name: "roleID",
            message: "What is the id number of the role you would like to delete?",
          },
        ])
        .then((answer) => {
          let query = `DELETE FROM role WHERE role.id = ${answer.roleID};`;
          connection.query(query, (err) => {
            if (err) throw err;
            connection.query(
              `SELECT  role.id AS 'ID#', title AS Title, salary AS Salary, dept_name AS Department, department.id AS 'Dept ID#' 
                FROM role
                INNER JOIN department
                ON department.id = department_id
                ORDER BY dept_name;`,
              (err, res) => {
                if (err) throw err;
                console.log("-------------------------------------------------------------------");
                console.log("      ************ ROLE WAS DELETED SUCCESSFULLY ************      ");
                console.log("-------------------------------------------------------------------");
                console.table(res);
              }
            );
          });
          setTimeout(() => {
            startInquire();
          }, 1000);
        });
    }, 1000);
}

function removeDept() {
  connection.query(
    `SELECT department.id AS 'ID#', department.dept_name AS Departments
      FROM department;`,
    (err, res) => {
      if (err) throw err;
      console.log("-------------------------");
      console.log(" *** REFERENCE TABLE *** ");
      console.log("-------------------------");
      console.table(res);
    }
  );
  setTimeout(() => {
    inquirer
      .prompt([
        {
          type: "number",
          name: "deptID",
          message: "What is the id number of the department that you would like to remove?",
        },
      ])
      .then((answer) => {
        let query = `DELETE FROM department WHERE department.id = ${answer.deptID};`;
        connection.query(query, (err) => {
          if (err) throw err;
          connection.query(
            `SELECT department.id AS 'ID#', department.dept_name AS Departments
              FROM department;`,
            (err, res) => {
              if (err) throw err;
              console.log("--------------------------");
              console.log(" *** DEPT WAS DELETED *** ");
              console.log("--------------------------");
              console.table(res);
            }
          );
        });
        setTimeout(() => {
          startInquire();
        }, 1000);
      });
  }, 1000);
}

function viewByManagers() {
  connection.query(
    `SELECT employee.id AS 'ID#', CONCAT(first_name, " ", last_name) AS Managers, title AS Title, role.id AS 'Title ID#', salary AS Salary
                    FROM employee
                    INNER JOIN role
                    ON role.id = role_id
                    WHERE manager_id IS null;`,
    function (err, res) {
      if (err) throw err;
      console.log("----------------------------------------------------------");
      console.log("        ********** VIEW OF ALL MANAGERS **********        ");
      console.log("----------------------------------------------------------");
      console.table(res);
    }
  );
  setTimeout(() => {
    inquirer
      .prompt([
        {
          type: "number",
          name: "managerId",
          message: "Input the Manager's Id to view the employees under that Manager.",
        },
      ])
      .then((answer) => {
        const query = `SELECT employee.id AS 'ID#', CONCAT(employee.first_name, " ", employee.last_name) AS 'Employee', 
      role.title AS 'Title', CONCAT(manager.first_name, ' ', manager.last_name) AS Manager, dept_name AS Department
      FROM employee
      LEFT JOIN employee manager on manager.id = employee.manager_id
      INNER JOIN role ON (role.id = employee.role_id && employee.manager_id != 'NULL')
      INNER JOIN department ON (department.id = role.department_id)
      WHERE employee.manager_id = ${answer.managerId};`;
        connection.query(query, (err, res) => {
          if (err) throw err;
          console.log("-----------------------------------------------------------");
          console.log("     ********** VIEW OF EMPLOYEE BY MANAGER **********     ");
          console.log("-----------------------------------------------------------");
          console.table(res);
          startInquire();
        });
      });
  }, 1000);
}

function budgetByDept() {
  connection.query(
    `SELECT salary AS 'Salary', dept_name AS Department
    FROM role
    INNER JOIN department
    ON department_id =department.id
    `,
    (err, res) => {
      if (err) throw err;
      console.log("--------------------");
      console.log("REFERENCE TABLE");
      console.log("--------------------");
      console.table(res);
    }
  ),
    setTimeout(() => {
      inquirer
        .prompt([
          {
            type: "input",
            name: "deptName",
            message: "Type in the Department to see its Total Utilized Budget.",
          },
        ])
        .then((answer) => {
          const query = `SELECT  COUNT(last_name) AS '# of employees', SUM(salary) AS 'Utilized Budget', dept_name AS Department
        FROM role
        INNER JOIN department
        ON department_id =department.id
        INNER JOIN employee
        ON employee.role_id = role.id
        WHERE department.dept_name LIKE '%${answer.deptName}%';`;
          connection.query(query, (err, res) => {
            if (err) throw err;
            console.log("---------------------------------------------");
            console.log(`Total Utilized Budget of ${answer.deptName} department`);
            console.log("---------------------------------------------");
            console.table(res);
            startInquire();
          });
        });
    }, 1000);
}

function matchEmpToNewManager() {
  inquirer
    .prompt([
      {
        type: "confirm",
        name: "empUpdate",
        message: "Are there employees under the new manager that needs their manager id updated?",
      },
      {
        type: "number",
        name: "managerID",
        message: "What is the ID number of the new Manager?",
        when: (answer) => {
          return answer.empUpdate === true;
        },
      },
      {
        type: "number",
        name: "empID",
        message: "What is the employee's ID# of the employee that needs their Manager ID# updated?",
        when: (answer) => {
          return answer.empUpdate === true;
        },
      },
      {
        type: "confirm",
        name: "moreEmps",
        message: "Are there any more employees that needs their Manager ID# updated?",
        when: (answer) => {
          return answer.empUpdate === true;
        },
      },
    ])
    .then((answer) => {
      if (answer.empUpdate === false) {
        startInquire();
      } else {
        const query = `UPDATE employee
                  SET manager_id = ${answer.managerID}
                  WHERE employee.id IN (${answer.empID})`;
        connection.query(query, (err) => {
          if (err) {
            throw (err, startInquire());
          } else {
            connection.query(
              `SELECT employee.id AS 'ID#', CONCAT(employee.first_name, " ", employee.last_name) AS 'Employees',
                      role.id AS 'Role ID#', role.title AS 'Title', role.salary AS 'Salary',
                      department_id AS 'Dept ID#', department.dept_name AS 'Department',
                      CONCAT(e.first_name, ' ', e.last_name) AS 'Manager'
                      FROM role LEFT JOIN employee ON employee.role_id = role.id
                      INNER JOIN department ON department.id = role.department_id
                      LEFT JOIN employee e ON employee.manager_id = e.id;`,
              (err, res) => {
                if (err) throw err;
                console.log(
                  "----------------------------------------------------------------------------------------------------------------"
                );
                console.log(
                  "                  ******************     USE THIS TABLE AS A REFERENCE!     ******************                  "
                );
                console.log(
                  "----------------------------------------------------------------------------------------------------------------"
                );
                console.table(res);

                if (answer.moreEmps === true) {
                  matchEmpToNewManager();
                } else {
                  startInquire();
                }
              }
            );
          }
        });
      }
    });
}

init();
