class Workforce {
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

    allEmployeesQuery = `SELECT CONCAT(employeesA.id, " - ", employeesA.first_name, " ",employeesA.last_name) as "ID & Name", roles.salary as "Annual Salary", roles.title as "Title",departments.name as "Department", concat(employeesB.first_name, " ", employeesB.last_name) as "Manager"
    FROM (employees as employeesA 
    JOIN employees as employeesB 
    ON employeesA.managers_id = employeesB.id)
    LEFT JOIN roles
    on (employeesA.roles_id = roles.id)
    LEFT JOIN departments
    on (roles.departments_id = departments.id)`

    employees = `SELECT * FROM employees`
    departments = `SELECT * FROM departments`
    roles = `SELECT * FROM roles`

    employeesAndRoles = `SELECT 'Employee' As Type, first_name, last_name, id
    FROM employees
    UNION ALL
    SELECT 'Role', title, id, id
    FROM roles
    UNION ALL
    SELECT 'Dept' As Type, name, id, id
    FROM departments;`
}

module.exports = Workforce