module.exports = {
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
    ]

    // module
}