const route  = require("express").Router();
const User   = require("../model/User");
const bcrypt = require("bcrypt");


// REGISTER USER //
route.get("/register",async(req,res)=>{
  try
  {
    const salt = await bcrypt.genSalt(10);
    const pass = await bcrypt.hash(req.body.password, salt);
    const user = await new User({
        username: req.body.username,
        email: req.body.email,
        password: pass
    });
    
    await user.save({ timeout: 20000 }).then(() => {
      console.log('User saved successfully');
    })
    .catch((error) => {
      console.error('Error saving user', error);
    });
    res.send("User: "+user);
  }catch(err)
  {
    console.log(err);
  }
});

route.post("/login", async (req, res) => {
  try
  {
    const user = await User.findOne({email: req.body.email});

    !user && res.status(404).json("User not found!");

    const validatePass = await bcrypt.compare(req.body.password, user.password);
    !validatePass && res.status(400).json("Password not matched.");

    res.status(200).json(user);
  }catch(err){
    res.status(500).json(err);
  }
    
})

module.exports = route;