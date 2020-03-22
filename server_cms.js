const fs = require(`fs`)
const util = require("util")
const inquirer = require(`inquirer`)
const mysql = require(`mysql`)
const Employee = require(`./develop/db/Employee`)

// Various useful constants
const separator = `*`.repeat(69)
const readFile = util.promisify(fs.readFile)
const dbJSONLocation = `./develop/db/db.json`

// mySQL connection
// ***************************
const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "nJxMNT2wvAHA",
  database: "workforceDB"
});

connection.connect(function (err) {
  if (err) throw err;
  // console.log("connected as id " + connection.threadId);
});

const questions = [
  {
    name: `splash`,
    message: `\n${separator}\n${separator}\n\n\tC R E W\n\tM A N A G E M E N T\n\tS E R V I C E\n\n${separator}\n${separator}`,
  },
  {
    name: `selection`,
    type: `list`,
    message: `What would you like to do?`,
    choices: [
      `View All Employee Records`,
      `Add New Employee Record`,
      `Exit`
    ]
  }
]
const start = () => {
  inquirer.prompt(questions).then(processAnswer)
}
const processAnswer = a => {
  switch (a.selection) {
    case `View All Employee Records`:
      console.log(`V I E W I N G employee records`)
      viewEmployeeRecords(a)
      break
    case `Add New Employee Record`:
      break
    // enterEmployeeRecord(a)
    default:
      console.log(`Hi Wurl!`)
  }
}
const viewEmployeeRecords = a => {
  let querySearch = "SELECT * FROM employees ORDER BY first_name"
  let query = connection.query(querySearch, function (err, res) {
    if (err) throw err;
    console.log(res);
    connection.end();
  });

  console.log(query.sql)

}
// const enterEmployeeRecord = a => {

// }
start()