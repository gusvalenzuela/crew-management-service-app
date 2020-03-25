const addRecord = () => {
    // prompt for info about the record being altered
    connection.query(workforce.allEmployeesQuery, function (err, results) {
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
                            if(results[i].Title){
                                choiceArray.push(results[i].Title);
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
                            choiceArray.push(results[i].first_name + ` ` + results[i].last_name);
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