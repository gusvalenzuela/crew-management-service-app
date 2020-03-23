class Employee {
    constructor(name) {
        this.name = name
        // this.role = role
        // this.manager_id = manID
    }

    displayAll = `SELECT last_name as "Last Name", first_name as "First Name", id as "Employee ID" FROM employees ORDER BY last_name`
}

module.exports = Employee