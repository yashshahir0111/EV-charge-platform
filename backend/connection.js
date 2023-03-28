require("dotenv").config();
const mysql = require("mysql2");

var mysqlConnection = mysql.createConnection(process.env.DATABASE_URL);

mysqlConnection.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Connected");
    }
});

module.exports = mysqlConnection;
// export default mysqlConnection;
