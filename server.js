const express=require("express");
const bodyparse=require("body-parser");
const path = require("path");
const app=express();
const port =3000;
const webSocket=require("ws");
const wss=new webSocket.Server({port:8080});
const bcrypt = require('bcrypt');
const collection = require("./config");

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'index.html'));
});

app.use(express.static("public"));

app.use(express.urlencoded({ extended: false }));


app.get("/signup", (req, res) => {
    res.render("signup");
});


app.post("/signup", async (req, res) => {
try {
    const data = {
        name: req.body.username,
        password: req.body.pass,
        gmail:req.body.email
    }
    const existingUser = await collection.findOne({ name: data.name });
    // const existmail= await collection.findOne({gmail: data.gmail});
    if (existingUser) {
        console.log('exiting user');
        return res.send({status:'un',name:' '});
    }
    const existmail= await collection.findOne({gmail: data.gmail});
    if(existmail)
    {
        console.log('existing mail');
        return res.send({status:'ug',name:' '});
    }
    else {
        
        const saltRounds = 10; 
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);

        data.password = hashedPassword;

        const userdata = await collection.insertOne(data);
        return res.send({status:'s',name:`${data.name}`});
    }
   
}
    catch {
        console.log('error');
        res.send({status:false,name:' '});
    }
});

app.post("/login", async (req, res) => {
    try {
       const echeck=await collection.findOne({gmail :req.body.email});
       if (!echeck) {
        return res.send({status:false , name :' '});
        }
        const pmatch=await bcrypt.compare(req.body.pass,echeck.password);
        if(!pmatch)
        {
            return res.send({status:false , name: ' '});
        }
        const lastdate=echeck.lastdate;
        const cdate=new Date().toISOString().split('T')[0];
        const t=(cdate-lastdate)/(1000 * 60 * 60 * 24);
        if(t==1)
        {
            echeck.XP=echeck.XP+10;
            echeck.streak=echeck.streak+1;
            echeck.lastlogin=new Date().toISOString().split('T')[0];
            await collection.deleteOne({gmail:echeck.gmail});
            await collection.insertOne(echeck);
        }
        else
        {
            echeck.streak=0;
            echeck.lastlogin=new Date().toISOString().split('T')[0];
            await collection.deleteOne({gmail:echeck.gmail});
            await collection.insertOne(echeck);
        }
        return res.send({status:true,name:`${echeck.name}`})
    }
    catch {
        res.send({status:false,name:' '});
    }
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
