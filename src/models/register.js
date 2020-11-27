const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const employeeShema = new mongoose.Schema({
    firstname:{
        type : String,
        required:true
    },
    lastname : {
        type : String,
        required:true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    gender : {
        type : String,
        required : true,
    },
    phone : {
        type : Number,
        required : true,
        unique : true
    },
    age : {
        type : Number,
        required : true
    },
    password : {
        type : String,
        required : true,
    },
    confirmpassword : {
        type : String,
        required : true
    },
    tokens :[{
        token :{
            type : String,
            required : true
        }
    }]
});

employeeShema.methods.generateAuthToken = async function(){
    try{
        const token = jwt.sign({_id:this._id.toString()}, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token : token});
        await this.save();
        return token;
    }catch(err){
        res.send("the error is " + err);
        console.log(err);
    }
}

employeeShema.pre("save", async function(next){
    // const passwordHash = await bcrypt.hash(password, 10)
    if(this.isModified("password")){
    // console.log(`the current password is ${this.password}`);
    this.password = await bcrypt.hash(this.password, 10);
    // console.log(this.password);
    this.confirmpassword = await bcrypt.hash(this.password, 10);
    }
    next();
})

// now we need to create a collection

const Register = new mongoose.model("Register",employeeShema);

module.exports = Register;