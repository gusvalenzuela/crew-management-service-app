const inquirer = require("inquirer");
const cTable = require(`console.table`)
const Workforce = require(`./develop/db/Workforce`)
const Questions = require(`./develop/db/Questions`)

const workforce = new Workforce()
const separator = `*`.repeat(69)
const miniSeparator = `*`.repeat(21)
const splash = `\r\n${separator}\r\n${separator}\r\n\r\n\tC R E W\r\n\tM A N A G E M E N T\r\n\tS E R V I C E\r\n\r\n${separator}\r\n${separator}\r\n`
const alphabetically = (a, b) => {
    if (a.toLowerCase() < b.toLowerCase()) { return -1 }
    if (a.toLowerCase() > b.toLowerCase()) { return 1 }
    return 0
}


// create the connection information for the sql database
var connection = require(`./config/connection.js`);

const init = () => {
    console.log(splash)
    start()
}
init()

// function which prompts the user for what action they should take
function start() {

    inquirer
        .prompt(
            {
                name: `selection`,
                type: `list`,
                message: `What would you like to do?`,
                choices: [
                    new inquirer.Separator(`-----------------`),
                    `View All Employees`,
                    new inquirer.Separator(`-----------------`),
                    `- View Record(s) by table`,
                    // new inquirer.Separator(`-----------------`),
                    `- Add Record(s) to database`,
                    // new inquirer.Separator(`-----------------`),
                    `- Update Record(s) in database`,
                    // new inquirer.Separator(`-----------------`),
                    `- Delete Record(s) from database`,
                    new inquirer.Separator(`-----------------`),
                    `Exit`,
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
                case `- View Record(s) by table`:
                    viewRecord()
                    break
                case `- Add Record(s) to database`:
                    addRecord()
                    break
                case `- Update Record(s) in database`:
                    updateRecord()
                    break
                case `- Delete Record(s) from database`:
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
            .prompt([
                {
                    name: `table`,
                    type: `list`,
                    message: `What would you like to add?`,
                    choices: [`New Employee`, `New Department`, `New Role`, `<< GO BACK`]
                },
                {
                    name: `employeeName`,
                    type: `input`,
                    message: `(type 'exit' to cancel & start over)\r\nWhat is the employee's name?`,
                    validate: input => {
                        if (input === `exit`) {
                            return true
                        } else if (!input || input === ` `) {
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
                            if (results[i].Type === `Role`) {
                                choiceArray.push(results[i].first_name);
                            }
                        }
                        choiceArray.push(`<< START OVER`)
                        return choiceArray;
                    },
                    // switching from name of title to title (roles) id
                    filter: input => {
                        if (input !== `<< START OVER`) {
                            let chosenID
                            for (let i = 0; i < results.length; i++) {
                                if (results[i].Type === `Role` && results[i].first_name === input) {
                                    chosenID = results[i].id
                                }
                            }
                            return chosenID
                        } else {
                            return input
                        }
                    },
                    when: input => input.table === `New Employee` && input.employeeName !== `exit`
                },
                {
                    name: `employeeMgr`,
                    type: `list`,
                    message: `Who is their manager?`,
                    choices: function () {
                        let choiceArray = [];
                        for (let i = 0; i < results.length; i++) {
                            if (results[i].Type === `Employee`) {
                                choiceArray.push(results[i].first_name + ` ` + results[i].last_name);
                            }
                        }
                        choiceArray.push(`<< START OVER`)
                        return choiceArray;
                    },
                    // again, switching from name of manager to manager id
                    filter: input => {
                        if (input !== `<< START OVER`) {
                            let chosenID
                            for (let i = 0; i < results.length; i++) {
                                if (results[i].Type === `Employee` && results[i].first_name === input.split(` `)[0] && results[i].last_name === input.split(` `)[1]) {
                                    chosenID = results[i].id
                                }
                            }
                            return chosenID
                        } else {
                            return input
                        }
                    },
                    when: input => input.table === `New Employee` && input.employeeName !== `exit` && input.employeeRole !== `<< START OVER`
                },
                {
                    name: `deptName`,
                    type: `input`,
                    message: `(type 'exit' to cancel & start over)\r\nWhat is the new Department's name?`,
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
                    message: `(type 'exit' to cancel & start over)\r\nWhat is the new Role's title name?`,
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
                        return `(type 'exit' to cancel & start over)\r\nWhat is the starting salary for "` + input.roleTitle + `"?`
                    },
                    validate: async input => {
                        if (input === `exit`) {
                            return true
                        } else if (!input || input === null) {
                            return `A valid number is required.`
                        } else if (isNaN(input) || input === NaN) {
                            return `Please enter a valid number.`
                        }
                        return true
                    },
                    when: input => input.table === `New Role` && input.roleTitle !== `exit`
                },
                {
                    name: `roleDept`,
                    type: `list`,
                    message: input => {
                        return `Which department does "` + input.roleTitle + `" belong in?`
                    },
                    choices: () => {
                        let choiceArray = [];
                        for (let i = 0; i < results.length; i++) {
                            if (results[i].Type === `Dept`) {
                                choiceArray.push(results[i].first_name);
                            }
                        }

                        choiceArray.push(`<< START OVER`)
                        return choiceArray;
                    },
                    filter: input => {
                        if (input !== `<< START OVER`) {
                            let chosenID
                            for (let i = 0; i < results.length; i++) {
                                if (results[i].Type === `Dept` && input === results[i].first_name) {
                                    chosenID = results[i].id
                                }
                            }
                            return chosenID
                        } else {
                            return input
                        }
                    },
                    when: input => input.table === `New Role` && input.roleTitle !== `exit` && input.roleSalary !== `exit`
                },
            ])
            .then(function (ans) {
                let queryStr, addingItem, addingTable

                if (ans.employeeName !== `exit`) {
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
                            queryStr = `INSERT INTO roles SET title = "${ans.roleTitle.trim()}", salary = ${ans.roleSalary}, departments_id = ${ans.roleDept}`
                            addingItem = ans.roleTitle
                            addingTable = `roles`
                            break
                        case `<< GO BACK`:
                            queryStr = `SELECT id FROM employees`
                            break
                    }
                }

                if (ans.table !== `<< GO BACK` && ans.employeeRole !== `<< START OVER` && ans.employeeMgr !== `<< START OVER` && ans.roleTitle !== `exit` && ans.roleDept !== `<< START OVER` && ans.roleSalary !== `exit` && ans.deptName !== `exit` && ans.employeeName !== `exit`) {
                    connection.query(queryStr, err => {
                        if (err) throw err;
                        console.log(`\r\n${miniSeparator}\t${addingItem} has been ADDED into ${addingTable}!   ${miniSeparator}\r\n`)
                        // re-prompt the user 
                        start()
                    })
                } else {
                    start()
                }

            })
    })
}
const updateRecord = val => {
    if (!val) {
        val = `update`
    }

    inquirer.prompt([{
        name: `table`,
        type: `list`,
        message: `Which records would you like to ${val}?`,
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
    let queryStr = `UPDATE employees SET ? WHERE ?`
    let employeeID, employeeRolesID

    // if delete arg is passed, messages will read "delete" instead of "update" 
    // and the query string used after prompts is changed appropriately
    if (!val) {
        val = `update`
        queryStr = `DELETE FROM employees WHERE ?`
    }

    connection.query(`SELECT  employees.id as "eID", first_name, last_name, roles.id as "rID", title, salary FROM employees LEFT OUTER JOIN roles ON employees.roles_id = roles.id
    UNION
    SELECT  employees.id as "eID", first_name, last_name, roles.id as "rID", title, salary FROM employees RIGHT OUTER JOIN roles ON employees.roles_id = roles.id ORDER BY eID`, function (err, results) {
        if (err) throw err;
        // once you have the employees data, prompt for what the user would like updated
        inquirer.prompt([
            {
                name: `choice`,
                type: `list`,
                message: `Which employee would you like to ${val}?`,
                choices: function () {
                    let choiceArray = [];
                    for (let i = 0; i < results.length; i++) {
                        if (results[i].eID !== null) {
                            choiceArray.push(results[i].eID + `  ` + results[i].first_name + ` ` + results[i].last_name);

                        }
                    }
                    // choiceArray.push(`<< START OVER`)
                    return choiceArray;
                },
                // filtering out only the "id" portion of input to use in promise later
                filter: input => {
                    if (input !== `<< START OVER`) {
                        for (let i = 0; i < results.length; i++) {
                            if (results[i].eID === parseInt(input.split(` `)[0])) {
                                employeeID = results[i].eID
                                return results[i].first_name + ` ` + results[i].last_name
                            }
                        }
                    } else {
                        return input
                    }
                },
            },
            {
                name: `employeeUpdate`,
                type: `list`,
                message: `Which record would you like to update?`,
                choices: input => {
                    let choiceArray = []
                    for (let i = 0; i < results.length; i++) {
                        // find selected "employee" from the query results to display to user
                        if (parseInt(employeeID) === results[i].eID) {
                            choiceArray.push(`First Name: ` + results[i].first_name)
                            choiceArray.push(`Last Name: ` + results[i].last_name)
                            choiceArray.push(`Title: ` + results[i].title)
                            // choiceArray.push(`Salary: ` + results[i].salary)
                        }
                    }
                    choiceArray.push(`<< START OVER`)           // pushing one last option to array for allowing to exit to start screen
                    return choiceArray;
                },
                when: input => val !== `delete` && input.choice !== `<< START OVER`       // this prompt question is only available when in "update" mode
            },
            {
                name: `updateFirstName`,
                type: `input`,
                message: input => {
                    return `What is the new FIRST NAME for ` + input.employeeUpdate.split(` `)[2] + `?`
                },
                // this prompt question is only available when in "update" mode and user wants to change First name
                when: input => val !== `delete` && input.employeeUpdate.split(`:`)[0] === `First Name`
            },
            {
                name: `updateLastName`,
                type: `input`,
                message: input => {
                    return `What is the new LAST NAME for ` + input.employeeUpdate.split(` `)[2] + `?`
                },
                // this prompt question is only available when in "update" mode and user wants to change Last name
                when: input => val !== `delete` && input.employeeUpdate.split(`:`)[0] === `Last Name`
            },
            {
                name: `updateEmployeeTitle`,
                type: `list`,
                choices: () => {
                    let choiceArray = []
                    for (let i = 0; i < results.length; i++) {
                        if(results[i].title !== null){

                            choiceArray.push(results[i].title)
                        }
                    }
                    choiceArray.push(`<< START OVER`)           // pushing one last option to array for allowing to exit to start screen
                    let choicez = [...new Set(choiceArray)]     // handy new object native in ES6
                    choicez.sort(alphabetically)
                    return choicez
                },
                message: input => {
                    let title = input.employeeUpdate.split(`: `)[1].toUpperCase()
                    // if (input.employeeUpdate.split(`: `)[1] !== null){

                    // } else {
                    //     title = input.employeeUpdate.split(`: `)[1]
                    // }
                    // title.shift()
                    return `Change TITLE for ${input.choice} from ${title} to:`
                },
                filter: input => {
                    if (input !== `<< START OVER`) {
                        let titleID
                        for (let i = 0; i < results.length; i++) {
                            if (input === results[i].title) {
                                titleID = results[i].rID
                            }
                        }
                        return titleID
                    } else {
                        return input
                    }
                },
                // this prompt question is only available when in "update" mode and user wants to change 
                when: input => val !== `delete` && input.employeeUpdate.split(`:`)[0] === `Title`
            },
            // {
            //     name: `updateEmployeeSalary`,
            //     type: `input`,
            //     message: input => {
            //         return `What is the new SALARY for ` + input.employeeUpdate.split(` `)[2] + `?`
            //     },
            //     // this prompt question is only available when in "update" mode and user wants to change 
            //     when: input => val !== `delete` && input.employeeUpdate.split(`:`)[0] === `Salary`
            // },
            {
                name: `deleteConfirm`,
                type: `confirm`,
                message: input => {
                    return `Are you sure you want to delete the employee "` + input.choice + `" from the database?"`
                },
                default: false,
                when: input => val === `delete` && input.choice !== `<< Start Over`
            },
        ]).then( answer => {
            let updateThis, queryParams

            // if an employee name was given to update, build the appropriate query search/update
            if (answer.employeeUpdate) {
                // determine if it's first, last name, title, or salary that needs updating
                switch (answer.employeeUpdate.split(`:`)[0]) {
                    case `First`:
                        updateThis = { first_name: answer.updateFirstName }
                        break;
                    case `Last`:
                        updateThis = { last_name: answer.updateLastName }
                        break;
                    case `Title`:
                        updateThis = { roles_id: answer.updateEmployeeTitle }
                        break;
                    // this is currently tied to roles
                    //
                    // case `Salary`:
                    //     updateThis = { salary: answer.updateEmployeeSalary }
                    //     break;
                    default:
                        break;
                }
                // if (answer.employeeUpdate.split(`:`)[0] === `First`) {
                //     updateThis = { first_name: answer.updateFirstName }
                // } else if (answer.employeeUpdate.split(` `)[0] === `Last`) {
                //     updateThis = { last_name: answer.updateLastName }
                // }

                queryParams = [updateThis, { id: parseInt(employeeID) }]
            } else {
                // if nothing to update, then simply pass id for query to use in DELETE mode
                queryParams = { id: parseInt(employeeID) }
            }


            if (answer.choice !== `<< Start Over` && answer.employeeUpdate !== `<< START OVER` && answer.updateFirstName !== `exit` && answer.updateLastName !== `exit` && answer.updateEmployeeTitle !== `<< START OVER` || answer.deleteConfirm === true) {
                connection.query(queryStr, queryParams, function (err, res) {
                    if (err) throw err;
                    console.log(`\r\n${miniSeparator}\tEmployee ${answer.choice.toUpperCase()} has been ${val.toUpperCase()}D!   ${miniSeparator}\r\n`)
                    start();
                });
            } else {
                start()
            }


        }).catch(err => {
            if (err) throw err
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
        // once you have the departments data, prompt for what the user would like updated
        inquirer.prompt([
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
        ]).then(function (answer) {
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
                        if (err) {
                            console.log(`\r\n${miniSeparator}\tERROR\t${miniSeparator}\r\n-- ${answer.choice} department was not ${val}d because of an error --\r\n${err.sqlMessage}\r\n${miniSeparator}\t     \t${miniSeparator}`)
                            start()
                            return
                        }
                        console.log(`\r\n${miniSeparator}\t${answer.choice.toUpperCase()} department has been ${activeWord.toUpperCase()}D!   ${miniSeparator}\r\n`)
                        start()
                    }
                );

            } else {

                start()
            }

        });
    });
}
const updateRolesRecord = (val) => {
    let queryStr = `UPDATE roles SET ? WHERE ?`

    // if delete arg is passed, messages will read "delete" instead of "update" 
    // and the query string used after prompts is changed appropriately
    if (!val) {
        val = `update`
        queryStr = `DELETE FROM roles WHERE ?`
    }
    connection.query(`SELECT * FROM roles`, function (err, results) {
        if (err) throw err;
        let rolesID
        // once you have the roles data, prompt for what the user would like updated
        inquirer.prompt([
            {
                name: `choice`,
                type: `list`,
                message: `Which role title would you like to ${val}?`,
                choices: function () {
                    let choiceArray = [];
                    for (let i = 0; i < results.length; i++) {
                        choiceArray.push(results[i].title);
                    }
                    choiceArray.push(`<< Start Over`)
                    choiceArray.sort(alphabetically)
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
                when: input => val !== `delete` && input.choice !== `<< Start Over`
            },
            {
                name: `deleteConfirm`,
                type: `confirm`,
                message: input => {
                    return `Are you sure you want to delete the ` + input.choice.toUpperCase() + ` role from the database?"`
                },
                default: false,
                when: input => val === `delete` && input.choice !== `<< Start Over`
            },
        ]).then(function (answer) {
            let updateThis = [
                { title: answer.updateRoleName },
                { id: parseInt(rolesID) }
            ]
            if (val === `delete`) {
                updateThis = [
                    { id: parseInt(rolesID) }
                ]
            }
            if (answer.choice !== `<< Start Over` && (answer.deleteConfirm === true || answer.updateRoleName)) {
                connection.query(queryStr, updateThis,
                    function (err, res) {
                        if (err) {
                            console.log(`\r\n${miniSeparator}\tERROR\t${miniSeparator}\r\n-- ${answer.choice} department was not ${val}d because of an error --\r\n${err.sqlMessage}\r\n${miniSeparator}\t     \t${miniSeparator}`)
                            start()
                            return
                        }
                        console.log(`\r\n${miniSeparator}\t${answer.choice.toUpperCase()} department has been ${val.toUpperCase()}D!   ${miniSeparator}\r\n`)
                        start()

                    }
                );

            } else {

                start()
            }

        });
    });
}

// const testFunction = () => {
//     connection.query(`SELECT * FROM departments`, function (err, results) {
//         if (err) throw err;
//         console.log(results)
//     })
// },