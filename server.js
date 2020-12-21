const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require("console.table");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "mysql",
  database: "employee_tracker_db",
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected at " + connection.threadId + "\n");
  startInquire();
});

function startInquire() {
  inquirer
    .prompt({
      name: "choice",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View all Employees",
        "View All Employees By Department",
        "View All Employees By Manager",
        "Add Employees",
        "Remove Employee",
        "Update Employee Role",
        "Update Employee Manager",
        "View All Roles",
        "Add Role",
        "Remove Role",
        "View All Departments",
        "Add Department",
        "Remove Department",
        "View Total Utilized Budget By Department",
        "Exit",
      ],
    })
    .then(function (answer) {
      console.log(answer);
      switch (answer.choice) {
        case "View all Employees":
          allEmployed();
          break;

        case "View All Employees By Department":
          allEmployedByDept();
          break;

        case "View All Employees By Manager":
          allEmployedManagers();
          break;

        case "Add Employees":
          addEmployees();
          break;

        case "Remove Employee":
          removeEmployees();
          break;

        case "Update Employee Role":
          updateEmployees();
          break;

        case "Update Employee Manager":
          updateManager();
          break;

        case "View All Roles":
          allRoles();
          break;

        case "Add Role":
          addRole();
          break;

        case "Remove Role":
          removeRole();
          break;

        case "View All Departments":
          allDept();
          break;

        case "Add Department":
          addDept();
          break;

        case "Remove Department":
          removeDept();
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

function allEmployed() {
  let allEmployees = `SELECT employee.id, first_name, last_name, title, salary, dept_name
  FROM employee
  INNER JOIN role
  ON employee.role_id  = role.id
  INNER JOIN department
  ON role.department_id = department.id;`;
  connection.query(allEmployees, function (err, res) {
    console.log(res);
    if (err) throw err;
    // for (var i = 0; i < res.length; i++) {
    //   console.table([res[i]]);
    // }
    console.log(res);
    startInquire();
  });
}

function allRoles() {
  var query = "SELECT * FROM role";
  connection.query(query, function (err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      console.table([res[i]]);
    }
    startInquire();
  });
}

function allDept() {
  var query = "SELECT * FROM department";
  connection.query(query, function (err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      console.table([res[i]]);
    }
    startInquire();
  });
}

function addEmployees() {
  inquirer
    .prompt([
      {
        name: "firstName",
        type: "input",
        message: "What is the employees first name?",
      },

      {
        name: "lastName",
        type: "input",
        message: "What is the employees last name?",
      },
    ])
    .then((answer) => {
      console.log(answer);

      connection.query(
        "INSERT INTO employee SET ?",
        {
          first_name: answer.firstName,
          last_name: answer.lastName,
          role_id: 1,
          manager_id: 0,
        },
        function (err) {
          if (err) throw err;
          console.log("New employee has been added to the database!");
          runSearch();
        }
      );
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
      console.log(answer);
      connection.query(
        "INSERT INTO department SET ?",
        {
          dept_name: answer.deptName,
        },
        function (err) {
          if (err) throw err;
          console.log("New Department added Successfully!");
          startInquire();
        }
      );
    });
}
