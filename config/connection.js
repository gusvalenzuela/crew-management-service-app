// Set up MySQL connection.
var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",
  
  // Your port; if not 3306
  port: 3306,
  
  // Your username
  user: "root",
  
  // Your password
  password:
  "nala",
  // "nJxMNT2wvAHA",
  database: "workforceDB"
});

// Make connection.
connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  // console.log("connected to: ", connection.config.database);
});

// Export connection for our ORM to use.
module.exports = connection;
