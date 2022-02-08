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

// @route POST /users/register
// @desc Register user
// @access Public

router.post("/register", (req, res) => {
    
    const { email, uname} = req.body;
    //Form validation
    const {errors, isValid} = registerInputValidate(req.body);
    
    if(!isValid){
        return res.status(400).json(errors);
    }

    User.findOne(
    {$or:[
        {email:email},
        {uame: uname}
      ]}
      )
      .then(async (savedUser) => {
        if (savedUser) {
          return res
            .status(422)
            .json({ error: "User Already Exist with this email or username" });
        }
    
        else{
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

router.post("/update",(req,res) => {

    const { name } = req.body;
    if (!name) {
      return res.status(422).json({ error: "Please fill all the fields" });
    }
    User.findById(req.user._id, req.body)
      .then(async(result) => {
        res.status(200).json({ name:req.body.fullname });
      })
      .catch((error) => {
        res.status(422).json({ error });
      });
});

router.post("/psswrd",(req,res) => {
    const {password } = req.body;

    if (!password) {
      return res.status(422).json({ error: "Please fill all the fields" });
    }
    bcrypt.hash(password, 12).then(async (hashedPassword) => {
      const user = new User({      
        password: hashedPassword,
      });
  
    await User.findByIdAndUpdate(req.user.id,
      {
        password: hashedPassword,
      })
      .then((result) => {
        res.status(200).json({ result });
      })
      .catch((error) => {
        res.status(422).json({ error });
      });
  
    });
});

module.exports = router;

