require("dotenv").config();
const express = require("express");
require("./db/connect");
const Register = require("./models/register");
const path = require("path");
const hbs = require("hbs");
const bcrypt = require("bcryptjs");
const port = process.env.PORT || 3000;
const app = express();
const jwt = require("jsonwebtoken")

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partial_path = path.join(__dirname, "../templates/partials");

app.use(express.json());
app.use(express.urlencoded({extended: false}))

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partial_path);

// console.log(process.env.SECRET_KEY)

app.get("/", (req,res) =>{  
    res.render("index");
});

app.get("/index",(req,res) => {
    res.render("index");
})

app.get("/register",(req,res) => {
    res.render("register");
})

//create a new user in our database
app.post("/register", async (req,res) => {
    try{
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;
        if(password === cpassword){
            const registerEmployee = new Register({
                firstname: req.body.firstname,
                lastname : req.body.lastname,
                email : req.body.email,
                gender : req.body.gender,
                phone : req.body.phone,
                age : req.body.age,
                password : req.body.password,
                confirmpassword : req.body.confirmpassword
            });
        console.log("the success part is " + registerEmployee);

        const token = await registerEmployee.generateAuthToken();
        console.log("the toke part is :- " +token);
        
        const registered = await registerEmployee.save();
        console.log(registered);
        
        res.status(200).render("index");
 

        }else{
            res.send("password are not matching")
        }
    }catch(err){
        res.status(400).send(err);
    }
})

app.get("/login",(req,res) => {
    res.render("login");
})

// login check
app.post ("/login", async(req,res) =>{
    try{
        const email = req.body.email;
        const password = req.body.password;
        const useremail = await Register.findOne({email : email});
        const ismatch = await bcrypt.compare(password, useremail.password);

        const token = await useremail.generateAuthToken();
        console.log("the toke part is :- " +token);

        if (ismatch){
            res.status(201).render("index");
        }else{
            res.send("Invalid login Details");
        }
    }catch(err){
        res.status(400).send(`Invalid login Details`)
    }
})




app.listen(port,() =>{
    console.log(`server is running at port no :- ${port}`);
})