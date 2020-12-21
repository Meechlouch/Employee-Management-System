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
      switch (answer.choices) {
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
