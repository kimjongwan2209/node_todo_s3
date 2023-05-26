require("dotenv").config();

const host_add = process.env.HOST_ADD;
const user_id = process.env.USER_ID;
const pass = process.env.PASSWORD;
const db_name = process.env.DATABASE;

const mysql = require("mysql");
const connection = mysql.createConnection({
  host: host_add,
  user: user_id,
  password: pass,
  database: db_name,
});

connection.connect();

module.exports = connection;
