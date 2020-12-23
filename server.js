const inquirer = require("inquirer");
const connection = require("./mysql-connection/connection");
const cTable = require("console.table");
const ascii = require("ascii-art");

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
        "Update Employee Role",
        "Update Employee Manager",
        "View All Employees By Department",
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

        case "Update Employee Role":
          updateEmployee();
          break;

        case "Update Employee Manager":
          updateManager();
          break;

        case "View All Employees By Manager":
          allEmployedManagers();
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
            connection.query(`SELECT * FROM department;`, (err, res) => {
              if (err) throw err;
              console.table(res);
              startInquire();
            });
          }
        }
      );
    });
}

function addRole() {
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
          connection.query(`SELECT * FROM role;`, (err, res) => {
            if (err) throw err;
            console.table(res);
            startInquire();
          });
        }
      );
    });
}

function addEmployee() {
  // connection.query("SELECT * FROM role;", (err, res) => {
  //   if (err) throw err;

  //   console.table(res);
  // });
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
      console.log(answer);

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
            console.log(err);
            console.log("There is no department or role for this employee. Create role or department, than try again.");
            startInquire();
          } else {
            connection.query(`SELECT * FROM employee;`, (err, res) => {
              if (err) throw err;
              console.table(res);
            });
            startInquire();
          }
        }
      );
    });
}

function allDept() {
  var query = "SELECT * FROM department";
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    startInquire();
  });
}

function allRoles() {
  var query = "SELECT * FROM role";
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    startInquire();
  });
}

function allEmployed() {
  let allEmployees = `SELECT employee.id, first_name, last_name, title, salary, dept_name
  FROM employee
  INNER JOIN role
  ON employee.role_id  = role.id
  INNER JOIN department
  ON role.department_id = department.id;`;
  connection.query(allEmployees, function (err, res) {
    if (err) throw err;
    console.table(res);
    startInquire();
  });
}

// function employeeByDept() {
//   let byDept = `SELECT  department.id, dept_name, first_name, last_name
// 	FROM department
//     LEFT JOIN employee
//     ON role_id = department.id;`;
//   connection.query(byDept, (err, res) => {
//     if (err) throw err;
//     console.table(res);
//     startInquire();
//   });
// }

startInquire();
