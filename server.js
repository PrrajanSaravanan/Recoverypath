const express=require("express");
const bodyparse=require("body-parser");
const path = require("path");
const app=express();
const port =5173;
const webSocket=require("ws");
const wss=new webSocket.Server({port:8080});

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.get('/',(req,res)=>{
    res.sendFile(res.path(__dirname,'index.html'));
});


wss.on("connection", ws=>{
    console.log("Client connected");
    
    ws.send("Welcome to Recovery Path Chat");

    ws.on('message',(message)=>{
        console.log(`Received message=> ${message}`);
        //ws.send(`Server Response: You Sent=> ${message}`);
    }); 

    setInterval(()=>{
        ws.send(`Totally there are `+wss.clients.size +" clients connected");
    },20000);

    ws.on(`close`,()=>console.log(`Client Disconnected, Total No. of clients are: ${wss.clients.size}`));
})

app.listen(port,(req,res)=>
{
    console.log(`server is running at http://localhost:${port}`);
});

console.log(`WebSocket Running on ws://localhost:8080`);