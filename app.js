const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const app = express();
require('dotenv').config();

console.log(process.env);

    app.use(express.static("public"));
    app.use(bodyParser.urlencoded({extended: true}));

    app.get("/", (req,res)=>{
        res.sendFile(__dirname + "/signup.html");
    });

    app.post("/", (req,res)=>{
        var firstName = req.body.fname;
        var lastName = req.body.lname;
        var email = req.body.email;
        const api_key1 = process.env.API_KEY;
        console.log(firstName, lastName, email);
        console.log(api_key1);
        var data = {
            members: [
                {
                    email_address: email,
                    status: "subscribed",
                    merge_fields:{
                        FNAME: firstName,
                        LNAME: lastName
                    }
                }
            ]
        };

        const jsonData = JSON.stringify(data);

        const url = "https://us21.api.mailchimp.com/3.0/lists/9dacd66e16";
        console.log(api_key1)
        const options = {
            method: "POST",
            auth: "new_key:"+api_key1
        }
        console.log(options);

        const request = https.request(url, options, function(response){
            if (response.statusCode ===200) {
                 res.sendFile(__dirname + "/success.html");

            } else {
                 res.sendFile(__dirname + "/failure.html");

            }
            response.on("data", function(data){
                console.log(JSON.parse(data));
            });
        });


        request.write(jsonData);
        request.end();

    });

    app.post("/failure", (req,res)=>{
        res.redirect("/")
    })

    app.listen(process.env.PORT || 3001, function() {
        console.log("Server is running on port 3000.");
    }); 

   