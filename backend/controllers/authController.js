import User from "../models/User.js";
import { generateToken } from "../lib/generateToken.js";
import cloudinary from "../lib/cloudinary.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const login = async(req,res) =>{
    const {email,password} = req.body;
    if(!email || !password){
        return res.status(400).json({message:"All fields are required"});
    }
    const user = await User.findOne({email});
    if(!user){
        return res.status(400).json({message:"Invalid credentials"});
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        return res.status(400).json({message:"Invalid credentials"});
    }
    generateToken(user._id,res);
    // console.log(user,'from login controller')
    return res.status(200).json({success:true,message:"Login successfull",user});
}

export const logout = async(req, res) => {
  const {myId} = req.body;
  const validUser = await User.findById(myId)
  if(validUser) 
  {
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production"
    });
    return res.status(200).json({success:true, message: "Logout successful" });
  }
  return res.status(400).json({ success: false, message: "Invalid user" });
};


export const signup = async (req, res) => {
    try {
      const { name, email, password } = req.body;
       
      if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }
      //  console.log(name,email,password)
      const userExist = await User.findOne({ email});

      if (userExist) {
        return res.status(400).json({ message: "User already exists" });
      }
      else if(password.length<6)
      {
        return res.status(400).json({ message: "password must be 6 character long" });
      }

       const salt = await bcrypt.genSalt(10);
       const hashedPassword  = await bcrypt.hash(password, salt);

      const user = new User({
        name,
        email,
        password : hashedPassword,
        profileImage:''
      });
  
      await user.save(); // Save the user before generating a token
      return res.status(200).json({ message: "User created successfully"});
  
    } catch (error) {
      console.error(error);
     return res.status(500).json({ error: "Internal Server Error" });
    }
  };

export const uiValidation = async(req,res)=>{
    const token = req.cookies.token;
    if(!token)
    {
     return res.status(400).json({message:'token is not provided'})

    }
    jwt.verify(token,process.env.JWT_SECRET,(err,decoded)=>{
      if(err)
      {
       return res.status(500).json({authorized:false,message:"Not Allowed to visit page"})
      }
     return res.status(200).json({authorized:true,userId:decoded.userId})
    })

}
