const express = require("express")
const path = require("path")
const app = express()
const port = 3001
require("./config/database")

var userRouter = require('./routes/users')
var contasRouter = require('./routes/conta')


app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, "public")))

app.use((req,res, next)=> {
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','*');
    res.setHeader('Access-Control-Allow-Headers','*');

    next()
})

app.use("/user" , userRouter)
app.use("/contas" , contasRouter)

app.get("/",(req,res)=>{
    res.send("servidor 12")
})



app.listen(port , ()=>{
    console.log("Servidor iniciado com sucesso1")
})