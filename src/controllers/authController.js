const AuthModel=require('../models/authModel')
const bcrypt = require('bcryptjs');
const login = async (req, res) => {
    try {

      let { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({
          data: null,
          message: "Username and password are required",
          success: false,
        });
      }

      username = username.trim();
      password = password.trim();

      // Find the user in DB
      const user = await AuthModel.findOne({ username });
      if (!user) {
        return res.status(200).json({
          data: null,
          message: "User does not exist",
          success: false,
        });
      }

      // Compare password using bcrypt
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(200).json({
          data: null,
          message: "Invalid Password",
          success: false,
        });
      }

      // Password matched
      return res.status(200).json({
        data: user,
        message: "Login successful",
        success: true,
      });
      } catch (ex) {
        console.log(ex)
        return res.status(200).json({data:null, message: `An error occurred :${ex.message}`,success:false });
      }
  };
 const getAllUser=async(req,res)=>{

  try {
    const users = await AuthModel.find({});
    if (!users) {
      return res.status(200).json({ data:null,message: "Empty user lists",success:false });
    }
    
     return  res.status(200).json({data:users,message:"User Lists",success:true});
  } catch (ex) {
    console.log(ex)
    return res.status(200).json({data:null, message: `An error occurred :${ex.message}`,success:false });
  }

 }
  module.exports={
    login,
    getAllUser
  }