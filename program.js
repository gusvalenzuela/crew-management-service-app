const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require(`console.table`)
const Workforce = require(`./develop/db/Workforce`)

const separator = `*`.repeat(69)
const workforce = new Workforce()
const employeesData = []
const departmentsData = []
const rolesData =[]

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "nala",
    database: "workforceDB"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    console.log(`\r\n\r\n${separator}\r\n${separator}\r\n\r\n\tC R E W\r\n\tM A N A G E M E N T\r\n\tS E R V I C E\r\n\r\n${separator}\r\n${separator}\r\n`)
    start()
});

// function which prompts the user for what action they should take
function start() {
    inquirer
        .prompt(
            {
                name: `selection`,
                type: `list`,
                message: `What would you like to do?`,
                choices: [
                    `View All Employees`,
                    `View Record(s) by table`,
                    `Add Record(s) to database`,
                    `Update Record(s) in database`,
                    `Delete Record(s) from database`,
                    `Exit`
                ],
            },
        ).then(function (answer) {
            // call function to view, add, update, or delete depending on user answer
            switch (answer.selection) {
                case `View All Employees`:
                    connection.query(workforce.allEmployeesQuery, function (err, res) {
                        if (err) throw err;
                        console.log(separator)
                        console.table(res)
                        console.log(separator)
                        // re-prompt the user 
                        start();
                    })
                    break
                case `View Record(s) by table`:
                    viewRecord()
                    break
                case `Add Record(s) to database`:
                    addRecord()
                    break
                case `Update Record(s) in database`:
                    updateRecord()
                    break
                case `Delete Record(s) from database`:
                    // deleteRecord()
                    break
                case `Exit`:
                    connection.end();
                    console.log(`\r\nGoodbye!\r\n\r\n\\^_^/`)
                    break
                default:
                    connection.end();
                    return `Goodbye!`
            }
        });
}

const viewRecord = () => {

    inquirer
        .prompt([
            {
                name: `table`,
                type: `list`,
                message: `Which records would you like to view?`,
                choices: [`Employees`, `Departments`, `Roles`]
            },
        ])
        .then(function (ans) {
            let queryStr

            switch (ans.table) {
                case `Employees`:
                    queryStr = `SELECT * FROM employees`
                    break
                case `Departments`:
                    queryStr = `SELECT * FROM departments`
                    break
                case `Roles`:
                    queryStr = `SELECT * FROM roles`
                    break
            }

            connection.query(queryStr, function (err, res) {
                if (err) throw err;
                console.log(separator)
                console.table(res)
                console.log(separator)
                // re-prompt the user 
                start();
            }
            );
        });

}
const addRecord = () => {
    // prompt for info about the record being altered
    connection.query(workforce.employeesAndRoles, function (err, results) {
        if (err) throw err;
        // console.log(results)

        inquirer
            .prompt([
                {
                    name: `table`,
                    type: `list`,
                    message: `What would you like to add?`,
                    choices: [`New Employee`, `New Department`, `New Role`]
                },
                {
                    name: `employeeName`,
                    type: `input`,
                    message: `What is the employee's name?`,
                    validate: async input => {
                        if (!input || input === ` `) {
                            return `Please enter a valid full name.`
                        } else if (!input.split(` `)[1]) {
                            return `Please enter a valid last name`
                        }
                        return true
                    },
                    when: input => input.table === `New Employee`
                },
                {
                    name: `employeeRole`,
                    type: `list`,
                    message: `What is their role?`,
                    choices: function () {
                        let choiceArray = [];
                        for (let i = 0; i < results.length; i++) {
                            if(results[i].Type === `Role`){
                                choiceArray.push(results[i].first_name);
                            }
                        }
                        return choiceArray;
                    },
                    when: input => input.table === `New Employee`
                },
                {
                    name: `employeeMgr`,
                    type: `list`,
                    message: `Who is their manager?`,
                    choices: function () {
                        let choiceArray = [];
                        for (let i = 0; i < results.length; i++) {
                            if(results[i].Type === `Employee`){
                                choiceArray.push(results[i].first_name+` `+results[i].last_name);
                            }
                        }
                        return choiceArray;
                    },
                    when: input => input.table === `New Employee`
                },
                {
                    name: `deptName`,
                    type: `input`,
                    message: `What is the new Department's name?`,
                    validate: async input => {
                        if (!input || input === ` `) {
                            return `A name is required.`
                        }
                        return true
                    },
                    when: input => input.table === `New Department`
                },
                {
                    name: `roleTitle`,
                    type: `input`,
                    message: `What is the new Role's title name?`,
                    validate: async input => {
                        if (!input || input === ` `) {
                            return `A role name is required.`
                        }
                        return true
                    },
                    when: input => input.table === `New Role`
                },
                {
                    name: `roleSalary`,
                    type: `input`,
                    message: input => {
                        return `What is the starting salary for "` + input.roleTitle + `"?`
                    },
                    validate: async input => {
                        if (!input || input === null) {
                            return `A valid number is required.`
                        } else if (isNaN(input) || input === NaN) {
                            return `Please enter a valid number.`
                        }
                        return true
                    },
                    when: input => input.table === `New Role`
                },
            ])
            .then(function (ans) {
                let queryStr

                switch (ans.table) {
                    case `New Employee`:
                        queryStr = `INSERT INTO employees SET first_name = "${ans.employeeName.split(` `)[0].trim()}", last_name = "${ans.employeeName.split(` `)[1].trim()}"`
                        break
                    case `New Department`:
                        queryStr = `INSERT INTO departments SET name = "${ans.deptName.trim()}"`
                        break
                    case `New Role`:
                        queryStr = `INSERT INTO roles SET title = "${ans.roleTitle.trim()}", salary = ${ans.roleSalary}`
                        break
                }

                connection.query(queryStr, function (err, res) {
                    if (err) throw err;
                    console.log(`${separator}\r\n\t${res.affectedRows} record(s) ADDED!\r\n${separator}`);
                    // re-prompt the user 
                    start()
                }
                )
            })
    })
}
const updateRecord = () => {
    // prompt for info about the record being altered
    connection.query(`SELECT * FROM employees`, function (err, results) {
        if (err) throw err;
        // once you have the employees data, prompt for what the user would like updated
        inquirer
            .prompt([
                {
                    name: `choice`,
                    type: `list`,
                    message: `Which employee would you like to update?`,
                    choices: function () {
                        let choiceArray = [];
                        for (let i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].id + `  ` + results[i].first_name + ` ` + results[i].last_name);
                        }
                        return choiceArray;
                    },
                    filter: async input => input.split(` `)[0],
                },
                {
                    name: `employeeUpdate`,
                    type: `rawlist`,
                    message: `Which record would you like to update?`,
                    choices: async input => {
                        let choiceArray = [];
                        for (let i = 0; i < results.length; i++) {
                            if (parseInt(input.choice) === results[i].id) {
                                choiceArray.push(`First Name: ` + results[i].first_name)
                                choiceArray.push(`Last Name: ` + results[i].last_name)
                            }
                        }
                        return choiceArray;
                    },
                },
                {
                    name: `updateFirstName`,
                    type: `input`,
                    message: input => {
                        return `What is the NEW first name for ` + input.employeeUpdate.split(` `)[2] + `?`
                    },
                    when: input => input.employeeUpdate.split(` `)[0] === `First`
                },
                {
                    name: `updateLastName`,
                    type: `input`,
                    message: input => {
                        return `What is the NEW last name for ` + input.employeeUpdate.split(` `)[2] + `?`
                    },
                    when: input => input.employeeUpdate.split(` `)[0] === `Last`
                },
            ])
            .then(function (answer) {
                // determine which record needs updating
                let updateThis
                if (answer.employeeUpdate.split(` `)[0] === `First`) {
                    updateThis = { first_name: answer.updateFirstName }
                } else if (answer.employeeUpdate.split(` `)[0] === `Last`) {
                    updateThis = { last_name: answer.updateLastName }
                }
                // else {
                connection.query(

                    `UPDATE employees SET ? WHERE ?`,
                    [updateThis,
                        {
                            id: parseInt(answer.choice)
                        }
                    ],
                    function (err, res) {
                        if (err) throw err;
                        console.log(`\t` + res.affectedRows + ` record(s) UPDATED!`);
                        start();
                    }
                );
            });
    });
}