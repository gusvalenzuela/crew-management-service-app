const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require(`console.table`)
const Workforce = require(`./develop/db/Workforce`)
const Questions = require(`./develop/db/Questions`)

const separator = `*`.repeat(69)
const miniSeparator = `*`.repeat(21)
const workforce = new Workforce()


// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password:
        // "nala",
        "nJxMNT2wvAHA",
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
                    updateRecord(`delete`)
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

// const employeeUpdateQs = [
//     {
//         name: `choice`,
//         type: `list`,
//         message: `Which employee would you like to ${activeWord}?`,
//         choices: function () {
//             let choiceArray = [];
//             for (let i = 0; i < results.length; i++) {
//                 choiceArray.push(results[i].id + `  ` + results[i].first_name + ` ` + results[i].last_name);
//             }
//             return choiceArray;
//         },
//         // filtering out only the "id" portion of input to use in promise later
//         filter: input => input.split(` `)[0],
//     },
//     {
//         name: `employeeUpdate`,
//         type: `rawlist`,
//         message: `Which record would you like to update?`,
//         choices: input => {
//             let choiceArray = [];
//             for (let i = 0; i < results.length; i++) {
//                 // find selected "employee" from the query results to display to user
//                 if (parseInt(input.choice) === results[i].id) {
//                     choiceArray.push(`First Name: ` + results[i].first_name)
//                     choiceArray.push(`Last Name: ` + results[i].last_name)
//                 }
//             }
//             choiceArray.push(`<< START OVER`)           // pushing one last option to array for allowing to exit to start screen
//             return choiceArray;
//         },
//         when: input => activeWord !== `delete`          // this prompt question is only available when in "update" mode
//     },
//     {
//         name: `updateFirstName`,
//         type: `input`,
//         message: input => {
//             return `What is the NEW first name for ` + input.employeeUpdate.split(` `)[2] + `?`
//         },
//         // this prompt question is only available when in "update" mode and user wants to change First name
//         when: input => activeWord !== `delete` && input.employeeUpdate.split(` `)[0] === `First`
//     },
//     {
//         name: `updateLastName`,
//         type: `input`,
//         message: input => {
//             return `What is the NEW last name for ` + input.employeeUpdate.split(` `)[2] + `?`
//         },
//         // this prompt question is only available when in "update" mode and user wants to change Last name
//         when: input => activeWord !== `delete` && input.employeeUpdate.split(` `)[0] === `Last`
//     },
// ]
// const employeeAddQs = 

const viewRecord = () => {

    inquirer
        .prompt([
            {
                name: `table`,
                type: `list`,
                message: `Which records would you like to view?`,
                choices: [`Employees`, `Departments`, `Roles`, `<< Start Over`]
            },
        ])
        .then(function (ans) {
            let queryStr

            switch (ans.table) {
                case `Employees`:
                    queryStr = workforce.employees
                    break
                case `Departments`:
                    queryStr = workforce.departments
                    break
                case `Roles`:
                    queryStr = workforce.roles
                    break
                case `<< Start Over`:
                    queryStr = `SELECT id FROM employees`
                    break
            }

            connection.query(queryStr, function (err, res) {
                if (err) throw err;
                if (ans.table !== `<< Start Over`) {

                    console.log(separator)
                    console.table(res)
                    console.log(separator)
                }
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
            .prompt(Questions.forAddingRecord)
            .then(function (ans) {
                let queryStr, addingItem, addingTable

                switch (ans.table) {
                    case `New Employee`:
                        queryStr = `INSERT INTO employees SET first_name = "${ans.employeeName.split(` `)[0].trim()}", last_name = "${ans.employeeName.split(` `)[1].trim()}", roles_id = ${ans.employeeRole}, managers_id = ${ans.employeeMgr}`
                        addingItem = ans.employeeName
                        addingTable = `employees`
                        break
                    case `New Department`:
                        queryStr = `INSERT INTO departments SET name = "${ans.deptName.trim()}"`
                        addingItem = ans.deptName
                        addingTable = `departments`
                        break
                    case `New Role`:
                        queryStr = `INSERT INTO roles SET title = "${ans.roleTitle.trim()}", salary = ${ans.roleSalary}`
                        addingItem = ans.roleTitle
                        addingTable = `roles`
                        break
                    case `<< GO BACK`:
                        queryStr = `SELECT id FROM employees`
                        break
                }


                connection.query(queryStr, err => {
                    if (err) throw err;
                    if (ans.table !== `<< GO BACK`) {
                        console.log(`\r\n${miniSeparator}\t${addingItem} has been ADDED into ${addingTable}!   ${miniSeparator}\r\n`)
                    }
                    // re-prompt the user 
                    start()
                }
                )
            })
    })
}
const updateRecord = val => {

    inquirer.prompt([{
        name: `table`,
        type: `list`,
        message: `What?`,
        choices: [`Employee Records`, `Department Records`, `Role Records`, `<< Go Back`],
    }]).then(answers => {
        // `delete`
        switch (answers.table) {
            case `Employee Records`:
                updateEmployeeRecord(val)
                break;
            case `Department Records`:
                updateDepartmentRecord(val)
                break;
            case `Role Records`:
                updateRolesRecord(val)
                break;
            case `<< Go Back`:
                start()
                break;

            default:
                break;
        }

    })
    // prompt for info about the record being altered

}
const updateEmployeeRecord = (val) => {
    // reusing my update function with optional argument
    // when passed with "delete" argument, the function deletes instead of update a record
    let activeWord = `update`
    let queryStr = `UPDATE employees SET ? WHERE ?`
    let employeeID

    // if delete arg is passed, messages will read "delete" instead of "update" 
    // and the query string used after prompts is changed appropriately
    if (val === `delete`) {
        activeWord = val
        queryStr = `DELETE FROM employees WHERE ?`
    }
    connection.query(`SELECT * FROM employees`, function (err, results) {
        if (err) throw err;
        // once you have the employees data, prompt for what the user would like updated
        inquirer
            .prompt([
                {
                    name: `choice`,
                    type: `list`,
                    message: `Which employee would you like to ${activeWord}?`,
                    choices: function () {
                        let choiceArray = [];
                        for (let i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].id + `  ` + results[i].first_name + ` ` + results[i].last_name);
                        }
                        return choiceArray;
                    },
                    // filtering out only the "id" portion of input to use in promise later
                    filter: input => {
                        for (let i = 0; i < results.length; i++) {
                            if (results[i].id === parseInt(input.split(` `)[0])) {
                                employeeID = results[i].id
                                input = results[i].first_name + ` ` + results[i].last_name
                            }
                        }
                        return input
                    },
                },
                {
                    name: `employeeUpdate`,
                    type: `list`,
                    message: `Which record would you like to update?`,
                    choices: input => {
                        let choiceArray = [];
                        for (let i = 0; i < results.length; i++) {
                            // find selected "employee" from the query results to display to user
                            if (parseInt(input.choice) === results[i].id) {
                                choiceArray.push(`First Name: ` + results[i].first_name)
                                choiceArray.push(`Last Name: ` + results[i].last_name)
                            }
                        }
                        choiceArray.push(`<< START OVER`)           // pushing one last option to array for allowing to exit to start screen
                        return choiceArray;
                    },
                    when: input => activeWord !== `delete`          // this prompt question is only available when in "update" mode
                },
                {
                    name: `updateFirstName`,
                    type: `input`,
                    message: input => {
                        return `What is the NEW first name for ` + input.employeeUpdate.split(` `)[2] + `?`
                    },
                    // this prompt question is only available when in "update" mode and user wants to change First name
                    when: input => activeWord !== `delete` && input.employeeUpdate.split(` `)[0] === `First`
                },
                {
                    name: `updateLastName`,
                    type: `input`,
                    message: input => {
                        return `What is the NEW last name for ` + input.employeeUpdate.split(` `)[2] + `?`
                    },
                    // this prompt question is only available when in "update" mode and user wants to change Last name
                    when: input => activeWord !== `delete` && input.employeeUpdate.split(` `)[0] === `Last`
                },
                {
                    name: `deleteConfirm`,
                    type: `confirm`,
                    message: input => {
                        return `Are you sure you want to delete the employee "` + input.choice + `" from the database?"`
                    },
                    default: false,
                    when: input => activeWord === `delete` && input.choice !== `<< Start Over`
                },
            ])
            .then(function (answer) {
                let updateThis, queryParams

                // if an employee name was given to update, build the appropriate query search/update
                if (answer.employeeUpdate) {
                    // determine if it's first or last name that needs updating
                    if (answer.employeeUpdate.split(` `)[0] === `First`) {
                        updateThis = { first_name: answer.updateFirstName }
                    } else if (answer.employeeUpdate.split(` `)[0] === `Last`) {
                        updateThis = { last_name: answer.updateLastName }
                    }
                    queryParams = [updateThis, { id: parseInt(employeeID) }]
                } else {
                    // if nothing to update, then simply pass id for query to use in DELETE mode
                    queryParams = { id: parseInt(employeeID) }
                }

                
                if (answer.choice !== `<< Start Over` && (answer.deleteConfirm === true || answer.updateFirstName || answer.updateLastName)) {
                    connection.query(queryStr, queryParams, function (err, res) {
                        if (err) throw err;
                        console.log(`${miniSeparator}\tEmployee ${answer.choice.toUpperCase()} has been ${activeWord.toUpperCase()}D!   ${miniSeparator}`)
                        start();
                    });
                } else {
                    start()
                }


            });
    });
}
const updateDepartmentRecord = (val) => {
    let activeWord = `update`
    let queryStr = `UPDATE departments SET ? WHERE ?`

    // if delete arg is passed, messages will read "delete" instead of "update" 
    // and the query string used after prompts is changed appropriately
    if (val === `delete`) {
        activeWord = val
        queryStr = `DELETE FROM departments WHERE ?`
    }
    connection.query(`SELECT * FROM departments`, function (err, results) {
        if (err) throw err;
        let deptID
        // once you have the employees data, prompt for what the user would like updated
        inquirer
            .prompt([
                {
                    name: `choice`,
                    type: `list`,
                    message: `Which department would you like to ${activeWord}?`,
                    choices: function () {
                        let choiceArray = [];
                        for (let i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].name);
                        }
                        choiceArray.push(`<< Start Over`)
                        return choiceArray;
                    },
                    filter: input => {
                        // let chosenID
                        for (let i = 0; i < results.length; i++) {
                            if (results[i].name === input) {
                                deptID = results[i].id
                            }
                        }
                        return input
                    }
                },
                {
                    name: `updateDeptName`,
                    type: `input`,
                    message: input => {
                        return `What is the NEW name for ` + input.choice.toUpperCase() + ` department?`
                    },
                    when: input => activeWord !== `delete` && input.choice !== `<< Start Over`
                },
                {
                    name: `deleteConfirm`,
                    type: `confirm`,
                    message: input => {
                        return `Are you sure you want to delete the ` + input.choice.toUpperCase() + ` department from the database?"`
                    },
                    default: false,
                    when: input => activeWord === `delete` && input.choice !== `<< Start Over`
                },
            ])
            .then(function (answer) {
                let updateThis = [
                    {
                        name: answer.updateDeptName
                    },
                    {
                        id: parseInt(deptID)
                    }
                ]
                if (val === `delete`) {
                    updateThis = [
                        {
                            id: parseInt(deptID)
                        }
                    ]
                }
                if (answer.choice !== `<< Start Over` && (answer.deleteConfirm === true || answer.updateDeptName)) {
                    connection.query(queryStr, updateThis,
                        function (err, res) {
                            if (err) throw err;
                            console.log(`\r\n${miniSeparator}\t${answer.choice.toUpperCase()} department has been ${activeWord.toUpperCase()}D!   ${miniSeparator}\r\n`)
                            start();

                        }
                    );

                } else {

                    start()
                }

            });
    });
}
const updateRolesRecord = (val) => {
    let activeWord = `update`
    let queryStr = `UPDATE roles SET ? WHERE ?`

    // if delete arg is passed, messages will read "delete" instead of "update" 
    // and the query string used after prompts is changed appropriately
    if (val === `delete`) {
        activeWord = val
        queryStr = `DELETE FROM roles WHERE ?`
    }
    connection.query(`SELECT * FROM roles`, function (err, results) {
        if (err) throw err;
        let rolesID
        // once you have the employees data, prompt for what the user would like updated
        inquirer
            .prompt([
                {
                    name: `choice`,
                    type: `list`,
                    message: `Which role title would you like to ${activeWord}?`,
                    choices: function () {
                        let choiceArray = [];
                        for (let i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].title);
                        }
                        choiceArray.push(`<< Start Over`)
                        return choiceArray;
                    },
                    filter: input => {
                        for (let i = 0; i < results.length; i++) {
                            if (results[i].title === input) {
                                rolesID = results[i].id
                            }
                        }
                        return input
                    }
                },
                {
                    name: `updateRoleName`,
                    type: `input`,
                    message: input => {
                        return `What is the NEW name for role "` + input.choice + `?"`
                    },
                    when: input => activeWord !== `delete` && input.choice !== `<< Start Over`
                },
                {
                    name: `deleteConfirm`,
                    type: `confirm`,
                    message: input => {
                        return `Are you sure you want to delete the ` + input.choice.toUpperCase() + ` role from the database?"`
                    },
                    default: false,
                    when: input => activeWord === `delete` && input.choice !== `<< Start Over`
                },
            ])
            .then(function (answer) {
                let updateThis = [
                    { title: answer.updateRoleName },
                    { id: parseInt(rolesID) }
                ]
                if (activeWord === `delete`) {
                    updateThis = [
                        { id: parseInt(rolesID) }
                    ]
                }
                if (answer.choice !== `<< Start Over` && (answer.deleteConfirm === true || answer.updateRoleName)) {
                    connection.query(queryStr, updateThis,
                        function (err, res) {
                            if (err) throw err;
                            console.log(`\r\n${miniSeparator}\tRole ${answer.choice.toUpperCase()} has been ${activeWord.toUpperCase()}D!   ${miniSeparator}\r\n`)
                            start();

                        }
                    );

                } else {

                    start()
                }

            });
    });
}