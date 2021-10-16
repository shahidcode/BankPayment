const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/bankcustomers",{ 
    useUnifiedTopology:true,
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:true
}).then( ()=> {
    console.log("Database connected");
}).catch( (err)=>{
    console.log("err");
});

const mySchema = new mongoose.Schema({
    name: String ,
    recieverName: String,
    email: String,
    balance: Number,
    transactAmt: Number,
    date: String
})

const registerCollection = new mongoose.model("Customerdata",mySchema)

module.exports = registerCollection;