const UserModel = require('../models/userModel')
const expressAsyncHandler = require('express-async-handler');
const generateToken = require('../Config/generateToken');
const { default: mongoose } = require('mongoose');
const User = require('../models/userModel');
const ChatModel = require('../models/chatModel');



//  for finding users in a particular group 
const fetchGroupUsers = expressAsyncHandler(async(req,res)=>{
    try
    {
        const { _id } = req.body;
        const objectIdArray = _id.map((id) => new mongoose.Types.ObjectId(id));
    const users = await UserModel.find({
        _id:{
            $in:objectIdArray
        }},
        "name email" //for only sending email and name as response
    )
    res.send(users)
    }catch(err){
        res.status(404)
        res.send(err.message)
    }

})

const fetchAllUsers = expressAsyncHandler(async(req,res)=>{
    const keyword = req.query.search
    ?{
        $or:[
            {name:{$regex:req.query.search,$options:"i" }},
            {email:{$regex:req.query.search,$options:"i" }},
        ]
    }
    :{}

    // res.send(connectedUserIds)
    const users = await UserModel.find(keyword).find({
              _id: {
                $ne: req.user._id
              },
    })
    res.send(users)
})

// for finding all users who are not connected in the database
const fetchUsersController = expressAsyncHandler(async(req,res)=>{
    const keyword =req.query.search
    ?{
        $or:[
            {name:{$regex:req.query.search,$options:"i" }},
            {email:{$regex:req.query.search,$options:"i" }},
        ]
    }
    :{}

    const connectedUsers = await ChatModel.find({ users: { $in: req.user._id } }).where("isGroupChat").equals(false);
    const connectedUserIds = connectedUsers
  .map(user => user.users)
  .filter(item => item.includes(req.user._id))
  .flat()

    // res.send(connectedUserIds)
    const users = await UserModel.find(keyword).find({
              _id: {
                $ne: req.user._id,
                $nin: connectedUserIds// Using map to extract _id values from connectedUsers
              },
    })
    res.send(users)
})
// login controller
const loginController = expressAsyncHandler(async(req,res)=>{
    const {name,password} = req.body
     // Update isOnline status
    const setOnline =  await UserModel.findOneAndUpdate({ name }, { isOnline: true })
    if(setOnline){

        const user = await UserModel.findOne({name});
        // console.log(await user.matchPassword(password));
    if(user && (await user.matchPassword(password))){
        const response = {
            _id:user._id,
            name:user.name,
            email:user.email,
            isAdmin:user.isAdmin,
            token:generateToken(user._id),
            pfp:user.pfp,
            isOnline:user.isOnline,
            createdAt:user.createdAt,
            updatedAt:user.updatedAt,
        };
        res.status(200).json(response)
    }
    else{
        res.status(401)
        throw new Error('Invalid user name or password')
    }
}
})

// registration or sign up controller
const registerController = expressAsyncHandler(async(req,res)=>{
   const {name,email,password,pfp} = req.body;

    //check for all fields
   if(!name || !email || !password){
    res.status(400)
    throw Error("All necessary input fields have not been filled")
   }

    //pre-existing user :email 
    const userExist = await UserModel.findOne({email})
    if(userExist){
        return res.status(405).json({ message: "User already exists" });
    }
    
    // userName already exists
    const userNameExist = await UserModel.findOne({name})
    if(userNameExist){
        return res.status(406).json({ message: "Username already taken" });
    }

    // create an entry into database for this user
    let isOnline = true
    const user = await UserModel.create({name,email,password,pfp,isOnline});
    if(user){
        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            isAdmin:user.isAdmin,
            token:generateToken(user._id),
            pfp:user.pfp,
            isOnline:user.isOnline,
            createdAt:user.createdAt,
            updatedAt:user.updatedAt,
        })
    }
    else{
        return res.status(500).json({ message: "Registration Error" });
    }
})

// edit user details
const editUserDetails = expressAsyncHandler(async (req, res) => {
    const {userId,email,username} = req.body;
    if(!userId){
        return res.status(400).json("Bad Request");
    }else{
        const existingUserDetails = await User.findOne({$or:[
            {email:email},
            {name:username}
            ],
            _id:{$ne:userId}
        })
        if(existingUserDetails){
            return res.status(409).json('username or email is already taken.')
        }
    }
    try{
        const userData = await User.findOne({_id:userId},"name email")
        if(userData.name !== username || userData.email !== email){
            const edited = await User.findByIdAndUpdate(userId,
                {name:username,email:email},
                {new:true}
                )
            const updated = await User.findOne({_id:userId},"name email updatedAt createdAt")
                res.status(200).json(updated)
        }else{
            res.status(304).json("Not Modified")
        }
    }catch(err){
        console.log(err.message);
        res.status(500).json('Internal Server Error')
    }
})


// update user profile pic only

const updateUserProfilePic = expressAsyncHandler(async(req, res)=>{
    const userId =  req.user.id;
    const {pfp} = req.body
    if(!pfp){
        return res.status(404).json("no profile pic!")
    }
    try {
        const updated = await User.findByIdAndUpdate(userId,{
            $set:{pfp:pfp}
        },
        {new:true}
        )
        if(updated){
            res.status(200).json(updated)
        }else{
            res.status(404).json("Error in updation")
        }
    } catch (error) {
        res.status(500).json('Internal Server Error')
    }
})


// const fetch user profile picture
const fetchUserPFP = expressAsyncHandler(async(req,res)=>{
    const {userId} = req.params
    try {
        const user = await UserModel.findOne({_id:userId})
        if(!user){
            return res.status(404).json("No user found")
        }
        if(user.pfp){
          return res.status(200).json(user.pfp)
        }else{
            return res.status(200).json(null);
        }
    } catch (error) {
        res.status(500).json({'Internal Server Error': error.message})
    }
})

// set isOnline false on logout
const setOffline = expressAsyncHandler(async(req,res)=>{
    const userId = req.params.id
    res.send(userId)
    try {
        
        const isOffline = await UserModel.findByIdAndUpdate(userId,{
            $set:{isOnline: false}
        },{
            new:true
        })
        if(isOffline){
           return res.status(200).json('Offline')
        }
    } catch (error) {
        res.status(500).json({'Internal Server Error': error.message})
    }
})


// remove account
const removeAccount = expressAsyncHandler(async(req,res)=>{
    const userId = req.params.id
    try {
        const removed = await UserModel.findByIdAndDelete(userId)
        if(!removed){
            return res.status(404).json("Cannot remove account")
        }
        res.status(200).json("Acccount removed")
    } catch (error) {
        res.status(500).json({'Internal Server Error': error.message})
    }
})


module.exports = {
  registerController,
  loginController,
  fetchUsersController,
  fetchGroupUsers,
  editUserDetails,
  fetchAllUsers,
  updateUserProfilePic,
  fetchUserPFP,
  setOffline,
  removeAccount
};