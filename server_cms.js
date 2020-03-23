const Employee = require(`./develop/db/Employee`)

const inquirer = require(`inquirer`)
const mysql = require(`mysql`)
const cTable = require(`console.table`)

// Various useful constants
//
const separator = `*`.repeat(69)
const employee = new Employee()

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
    // type: `confirm`,
    message: `\n\n${separator}\n${separator}\n\n\tC R E W\n\tM A N A G E M E N T\n\tS E R V I C E\n\n${separator}\n${separator}\n\n`,
  },
  {
    name: `selection`,
    type: `list`,
    message: `What would you like to do?`,
    choices: [
      `View Record(s)`,
      `Add Record(s)`,
      `Update Record(s)`,
      `Delete Record(s)`,
      `Exit`
    ]
  }
]
const start = () => {
  inquirer.prompt(questions).then(a => {
    console.log(`WTF`)
    processAnswer(a)
  })
}

const processAnswer = a => {
  console.log(``)
  switch (a.selection) {
    case `View Record(s)`:
      // console.log(`V I E W I N G employee records`)
      viewEmployeeRecords(a)
      break
    case `Add Record(s)`:
      break
    // enterEmployeeRecord(a)
    case `Update Record(s)`:
      viewEmployeeRecords(a)
      break
    case `Delete Record(s)`:
      console.log(`V I E W I N G employee records`)
      viewEmployeeRecords(a)
      break
    // case `[Op] Record(s)`:
    //   console.log(`V I E W I N G employee records`)
    //   viewEmployeeRecords(a)
    //   break
    default:
      console.log(`Goodbye!`)
  }
}
const viewEmployeeRecords = a => {

  connection.query(employee.displayAll, function (err, res) {
    if (err) throw err;
    console.table(res)
    connection.end();
  });

}
// const enterEmployeeRecord = a => {

// }
start()