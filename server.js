const express=require("express");
const bodyparse=require("body-parser");
const path = require("path");
const app=express();
const port =5173;


app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.get('/',(req,res)=>{
    res.sendFile(res.path(__dirname,'index.html'));
});



app.listen(port,(req,res)=>
{
    console.log(`server is running at http://localhost:${port}`);
});