const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser= require('../middleware/fetchuser');
const Admin = require('../models/Admin');
const JWT_SECRET='jwtSecret';

//POST request to /api/auth/createuser
router.post('/createuser', [
    body('name').isLength({ min: 3 }),
    // username must be an email
    body('email').isEmail(),
    // password must be at least 5 chars long
    body('password').isLength({ min: 5 }),
], async (req, res) => {
  let success=false;
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try{
        let user=await User.findOne({email:req.body.email});
    if(user){
        return res.status(400).json({success, error:'Sorry! User with this email already exists!'})
    }

    const salt = bcrypt.genSaltSync(10);

    const saltedPwd=await bcrypt.hash(req.body.password,salt);
    user=await User.create({
      name: req.body.name,
      email: req.body.email,
      password: saltedPwd,
      age:req.body.age,
      phone:req.body.phone
    })
    const data={
        user:{
            id: user._id
        }
    }
const authToken = jwt.sign(data, JWT_SECRET);
success=true;
    res.json({success, authToken});
    } catch(error){
        console.error(error.message);
        res.status(500).send('Internal Server Error')
    }
  },
);

// Authenticate a User using: POST "/api/auth/login". No login required
router.post('/login', [ 
    body('email', 'Enter a valid email').isEmail(), 
    body('password', 'Password cannot be blank').exists(), 
  ], async (req, res) => {
  let success=false;
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const {email, password} = req.body;
    try {
      let user = await User.findOne({email});
      if(!user){
        return res.status(400).json({success, error: "Please try to login with correct credentials"});
      }
  
      const passwordCompare = await bcrypt.compare(password, user.password);
      if(!passwordCompare){
        return res.status(400).json({success, error: "Please try to login with correct credentials"});
      }
  
      const data = {
        user:{
          id: user.id
        }
      }
      const authtoken = jwt.sign(data, JWT_SECRET);
      success=true
      res.json({success, authtoken})
  
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
})
// route to get details of a loggedin user
router.post('/getuser', fetchuser, async (req, res) => {

 
  try {
   const userId=req.user.id;
   const user=await User.findById(userId).select("-password");
   res.send(user);

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})



router.post('/adminLogin', [ 
  body('email', 'Enter a valid email').isEmail(), 
  body('password', 'Password cannot be blank').exists(), 
], async (req, res) => {
let success=false;
  // If there are errors, return Bad request and the errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {email, password} = req.body;
  try {
    let admin = await Admin.findOne({email});
    if(!admin){
      return res.status(400).json({success, error: "Please try to login with correct admin credentials"});
    }

    const passwordCompare = await bcrypt.compare(password, admin.password);
    if(!passwordCompare){
      return res.status(400).json({success, error: "Please try to login with correct admin credentials"});
    }

    const data = {
      admin:{
        id: admin.id
      }
    }
    const admin_authtoken = jwt.sign(data, JWT_SECRET);
    success=true
    res.json({success, admin_authtoken})

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})


module.exports = router