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

    allEmployeesQuery = `SELECT CONCAT(employees.id, " - ",first_name, " ",last_name) as "ID & Name", title as "Title", salary as "Annual Salary",departments.name as "Department", managers_id as "Manager"
    FROM (employees 
    LEFT JOIN roles 
    ON (employees.roles_id = roles.id )) 
    LEFT JOIN departments 
    ON (roles.departments_id = departments.id)
    ORDER BY employees.id`

    employees = `SELECT * FROM employees`
    departments = `SELECT * FROM departments`
    roles = `SELECT * FROM roles`

    employeesAndRoles = `SELECT 'Employee' As Type, first_name, last_name, id
    FROM employees
    UNION ALL
    SELECT 'Role', title, title, id
    FROM roles`
}

module.exports = Workforce