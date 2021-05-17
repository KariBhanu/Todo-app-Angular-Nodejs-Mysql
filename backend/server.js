const express = require("express");
const cors = require("cors");
const mysqlConnection = require("./connection");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
dotenv.config();
var app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/',function(req,res){
    res.send('Hello from server');
})
//create
app.post('/addTodo', (req, res) => {
   console.log(req.body);
   let todo = req.body;
   let addTodo = new Promise((resolve,reject)=>{
        mysqlConnection.query('INSERT INTO todolist VALUES (?,?,?)', [todo.ID,todo.Content,todo.Completed],
        (err, rows, fields) => {
                if (!err){resolve();}
                    // {setTimeout(()=>{
                    //     res.send({"message":"Data Added Successful"});
                    // },1000);}
                else{reject(err)}
                    //console.log(err);
            }); 
   });
   addTodo.then(()=>{
        res.send({"message":"Data Added Successful"});
   });
   addTodo.catch((err)=>{
        console.log(err);
   })
});
//read
app.get('/getTodos',(req,res)=>{
   let getTodos = new Promise((resolve,reject)=>{
        mysqlConnection.query('SELECT * FROM todolist', (err, rows, fields) => {
            if (!err){resolve(rows);}
                //res.send(rows);
            else{reject(err)}
                //console.log(err);
        });
   });
   getTodos.then((rows)=>{
    res.send(rows);
   })
   getTodos.catch((err)=>{
    console.log(err);
   })   
})

//update
app.put('/update', (req, res) => {
    let todo = req.body;
    var sql = "UPDATE todolist SET Content = ?, Completed = ? WHERE ID = ?;";
    let updateTodo = new Promise((resolve,reject)=>{
        mysqlConnection.query(sql, [todo.Content,todo.Completed,todo.ID], (err, rows, fields) => {
            if (!err){resolve()}
                // {setTimeout(()=>{
                //     res.send({"message":"Data Updated Successful"})
                // },1000);}
            else{reject(err)}
                //console.log(err);
        })
    });
    updateTodo.then(()=>{
        res.send({"message":"Data Updated Successful"});
       })
    updateTodo.catch((err)=>{
        console.log(err);
       }) 
    
    console.log(todo);
});

//delete
app.delete('/remove/:id',(req,res)=>{
    console.log(req.params.id);
    // let deleteTodo = new Promise((resolve,reject)=>{

    // });
    mysqlConnection.query('DELETE FROM todolist WHERE ID = ?', [req.params.id], (err, rows, fields) => {
                if (!err)
                   {
                    let updatingIds = new Promise((resolve,reject)=>{
                        mysqlConnection.query('UPDATE todolist SET ID = ID-1 WHERE ID > ?', [req.params.id], (err, rows, fields) => {
                            if (!err){resolve()}
                            // {setTimeout(()=>{
                            //         res.send({"message":"Data Deleted Successful"})
                            //     },1000);}
                            else{reject(err)}
                               // console.log(err);
                        });
                    });
                    updatingIds.then(()=>{
                        res.send({"message":"Data Deleted Successful"});
                       });
                    updatingIds.catch((err)=>{
                        console.log(err);
                       }); 
            }
                else
                    console.log(err);
            })
            
    
})


app.listen(process.env.PORT,()=>{
    console.log("Server is listening on - " + process.env.PORT);
});

