const express = require("express")
const path = require("path")
const bodyParser = require("body-parser")
const app = express()

const bcrypt = require("bcrypt")
const mongoose = require("mongoose")
const User = require("./model/user")

app.set("views", "./views")
app.set("view engine", "ejs")
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

app.use(express.static(path.join(__dirname, "public")))

const mongo_uri = "mongodb://127.0.0.1/sessions2"

mongoose.connect(mongo_uri, function(err){
    if (err) {
        throw err
    } else {
        console.log("Successfully connected to DB");
    }
})

app.post("/register", (req, res) => {
    const {username, password} = req.body
    const user = new User({username, password})
    user.save(err => {
        if(err){
            res.render("error")
        } else {
            res.render("user-registered")
        }
    })
})

app.post("/authenticate", (req, res) => {
    const {username, password} = req.body
    User.findOne({username}, (err, user) => {
        if(err){
            res.render("error")
        } else if(!user){
            res.render("error")
        } else {
            user.isCorrectPassword(password, (err, result) => {
                if (err){
                    res.render("error")
                } else if(result){
                    res.redirect("/user-login.html")
                } else {
                    res.render("error")
                }
            })
        }
    })
})

app.listen(8080, () => {
    console.log("Server listening...");
})