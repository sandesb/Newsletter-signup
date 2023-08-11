const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const app = express();

    app.use(express.static("public"));
    app.use(bodyParser.urlencoded({extended: true}));

    app.get("/", (req,res)=>{
        res.sendFile(__dirname + "/signup.html");
    });

    app.post("/", (req,res)=>{
        var firstName = req.body.fname;
        var lastName = req.body.lname;
        var email = req.body.email;

        console.log(firstName, lastName, email);
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

        const options = {
            method: "POST",
            auth: "new:f72d50a0ceab3b644ec376279bef66fb-us21"
        }

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

   