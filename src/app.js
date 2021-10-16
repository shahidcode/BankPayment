const express = require('express');
const app = express();
const fs = require('fs');
const port = process.env.PORT || 7500;
const hbs = require('hbs');
const path = require('path');
const { exit } = require('process');
const { stringify } = require('querystring');
const db = require('./database');


const static_path = path.join(__dirname,"../public");
const partials_path = path.join(__dirname,"../partials");

app.use(express.static(static_path));
app.set("view engine","hbs");
hbs.registerPartials(partials_path);

app.use(express.json());                            
app.use(express.urlencoded({extended:false}));

app.get("/",(req,res)=>{
    res.render("bank");
})

app.get("/customers",(req,res)=>{
    res.render("customers");
})

app.get("/transfer",(req,res)=>{
    res.render("transfer");
})

app.get("/history",(req,res)=>{
    res.render("history");
})

app.post("/transfer", async(req,res)=>{
    try{
        const s_name = req.body.hidden1;
        const r_name = req.body.hidden2;
        const bal = parseInt(req.body.amount);

        const date = new Date();
        const curDate = date.getDate()+"-"+(date.getMonth()+1)+"-"+date.getFullYear();
        const curTime = date.getHours()+":"+date.getMinutes();
        const fullDate = curDate+" "+curTime;

        const findDb = async(i,r,s,f)=>{
            //for updating balance of reciever
            const findRecieverName = await db.findOne({name:r_name})
            const recieverBal = parseInt(findRecieverName.balance);
            const newBal1 = recieverBal+i;

            const updateDb1 = await db.updateMany(
                {name:{$eq:r}}, {$set:{balance:newBal1,recieverName:r}}        // (condition,value)
            )

            // for updating balance of sender
            const findSenderName = await db.findOne({name:s_name})
            const senderBal = parseInt(findSenderName.balance);
            const newBal2 = senderBal-i;

            // updating balance of sender,amount transacted,date
            const updateDb2= await db.updateMany(
                {name:{$eq:s}}, {$set:{balance:newBal2,transactAmt:i,date:f}}        
            )
        }
        findDb(bal,r_name,s_name,fullDate);
        res.render("transfer");

    }
    catch(err){
        console.log(err);
    }
})


app.post("/customers",async(req,res)=>{
    try{
        const showBal = async()=>{
            const getAmit = await db.findOne({name:"Amit"});
            const amitBal = parseInt(getAmit.balance);

            const getSneha = await db.findOne({name:"Sneha"});
            const snehaBal = parseInt(getSneha.balance);

            const getBhavesh = await db.findOne({name:"Bhavesh"});
            const bhaveshBal = parseInt(getBhavesh.balance);

            const getPrakash = await db.findOne({name:"Prakash"});
            const prakashBal = parseInt(getPrakash.balance);

            const getTejaswini = await db.findOne({name:"Tejaswini"});
            const tejaswiniBal = parseInt(getTejaswini.balance);

            const getShreya = await db.findOne({name:"Shreya"});
            const shreyaBal = parseInt(getShreya.balance);

            const getMayur = await db.findOne({name:"Mayur"});
            const mayurBal = parseInt(getMayur.balance);

            const getOmkar = await db.findOne({name:"Omkar"});
            const omkarBal = parseInt(getOmkar.balance);

            const getKunal = await db.findOne({name:"Kunal"});
            const kunalBal = parseInt(getKunal.balance);

            const getPayal = await db.findOne({name:"Payal"});
            const payalBal = parseInt(getPayal.balance);

            res.render("customers",
                {   
                    amitValue:amitBal,
                    snehaValue:snehaBal,
                    bhaveshValue:bhaveshBal,
                    prakashValue:prakashBal,
                    tejaswiniValue:tejaswiniBal,
                    shreyaValue:shreyaBal,
                    mayurValue:mayurBal,
                    omkarValue:omkarBal,
                    kunalValue:kunalBal,
                    payalValue:payalBal
                }
            )
        }
        showBal();
    }
    catch(err){
        console.log(err);
    }
})

app.post("/history",async(req,res)=>{

    try{
        const transactHist = await db.find().sort({date:-1});
        res.render("history",{value:transactHist})
    }
    catch(err){
        console.log(err);
    }
})


app.listen(port,() => {
    console.log(`listening to port ${port}`);
})