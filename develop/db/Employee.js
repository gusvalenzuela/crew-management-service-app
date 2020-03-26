class Employee {
    constructor(name) {
        this.name = name
        if (name !== undefined) {

            this.first_name = name.split(` `)[0].trim()
            this.last_name = name.split(` `)[1].trim()
        }
        // this.role = role
        // this.manager_id = manID
    }

    displayAll = `SELECT id as "Employee ID", first_name as "First Name", last_name as "Last Name" FROM employees ORDER BY id`

    add = `INSERT INTO employees SET ?`

    update = `ALTER TABLE employees SET ? WHERE id = ?`

    
}

module.exports = Employee