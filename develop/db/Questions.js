module.exports = {
    activeWord: activeWord = ``,
    results: results = [],
    // module
    forAddingRecord: [
        {
            name: `table`,
            type: `list`,
            message: `What would you like to add?`,
            choices: [`New Employee`, `New Department`, `New Role`, `<< GO BACK`]
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
                    if (results[i].Type === `Role`) {
                        choiceArray.push(results[i].first_name);
                    }
                }
                return choiceArray;
            },
            // switching from name of title to title (roles) id
            filter: input => {
                let chosenID
                for (let i = 0; i < results.length; i++) {
                    if (results[i].Type === `Role` && results[i].first_name === input) {
                        chosenID = results[i].id
                    }
                }
                return chosenID
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
                    if (results[i].Type === `Employee`) {
                        choiceArray.push(results[i].first_name + ` ` + results[i].last_name);
                    }
                }
                return choiceArray;
            },
            // again, switching from name of manager to manager id
            filter: input => {
                let chosenID
                for (let i = 0; i < results.length; i++) {
                    if (results[i].Type === `Employee` && results[i].first_name === input.split(` `)[0] && results[i].last_name === input.split(` `)[1]) {
                        chosenID = results[i].id
                    }
                }
                return chosenID
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
    ],

    testFunction: ``,
    // module
    forUpdatingEmployeeRecord: [
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
    ],

    // module
    forUpdatingDepartmentRecord: [
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
    ],

    // module
    forUpdatingRoleRecord: [
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
    ],
}