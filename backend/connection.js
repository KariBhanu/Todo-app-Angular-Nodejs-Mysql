const mysql = require("mysql2");
const dotenv = require("dotenv");
dotenv.config();

var connection = mysql.createConnection({
    host : process.env.HOST,
    user : process.env.NAME,
    password : process.env.PASSWORD,
    database : process.env.DATABASE,
    multipleStatements : true
});

connection.connect((err)=>{
    if(!err){
        console.log("Connected");
    }
    else{
        console.log(err);
        console.log("Connection Failed");
    }
})


module.exports = connection;