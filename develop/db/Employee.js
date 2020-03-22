class Employee {
    constructor(name, role, manID) {
        this.name = name
        this.role = role
        this.manager_id = manID
    }

    printStats() {
        console.log(this.name, this.role, this.manager_id)
    }
}

module.exports = Employee