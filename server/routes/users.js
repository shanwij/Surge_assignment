const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Load input validation
const registerInputValidate = require("../validation/registrationVal");
const loginInputValidate = require("../validation/loginVal");

// Load User model
const User = require("../models/User");
const keys = require("../auth_config/keys");

// @route POST api/users/register
// @desc Register user
// @access Public

router.post("/register", (req, res) => {
    
    //Form validation
    const {errors, isValid} = registerInputValidate(req.body);
    
    if(!isValid){
        return res.status(400).json(errors);
    }

    User.findOne({email:req.body.email}).then(user=>{

        if(user){
            return res.status(400).json({email:"Email already exists"});
        } else{
            const newUser = new User({
                name:req.body.name,
                uname:req.body.uname,
                password:req.body.password,
                email:req.body.email
            });

            // hash passwords
            const rounds  = 10;
            bcrypt.genSalt(rounds, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;
                newUser
                    .save()
                    .then(user => res.json(user))
                    .catch(err => console.log(err));
                });
            });
        }

    });

});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public

router.post("/login",(req,res) => {

    //validation
    const {errors, isValid} = loginInputValidate(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    const uname = req.body.uname;
    const email = req.body.email;
    const password = req.body.password;
   
    let conditions = !!uname ? {uname: uname} : {email: email};
    //find user by e mail
    User.findOne(conditions).then(user=>{
        if(!user){
            return res.status(404).json({ emailnotfound: "Email or Username not found" });
        }
    
    // password check
    bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
            // Create JWT Payload
            const payload = {
                id: user.id,
                name: user.name
            };

            // Sign token
            jwt.sign(
                payload,
                keys.secretOrKey,
                {
                 expiresIn: 31556926 
                },
                (err, token) => {
                res.json({
                    success: true,
                    token: "Bearer " + token
                });
                }
            );
        } else {
          return res
            .status(400)
            .json({ passwordincorrect: "Password incorrect" });
        }
      });
    });
});

module.exports = router;

