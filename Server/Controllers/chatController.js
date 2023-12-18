const asyncHandler = require('express-async-handler');

const Chat = require('../models/chatModel')
const User = require('../models/userModel');
const Message = require('../models/messageModel');

const accessChats =  asyncHandler(async(req,res)=>{
    const { userId } = req.body;

  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
})

// fetch users
const fetchChats = asyncHandler(async (req, res) => {
  try {
    // console.log("Fetch Chats aPI : ", req);
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name email",
        });
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
// fetch groups
const fetchGroups = asyncHandler(async (req, res) => {
  try {
    const allGroups = await Chat.where("isGroupChat").equals(true);
    res.status(200).send(allGroups);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
// create a new group
const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Data is insufficient" });
  }

  var users = JSON.parse(req.body.users);
  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
// exit from the group chat
const groupExit = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  // check if the requester is admin
  const chatDetails = await Chat.findOne({_id:chatId})
  const isAdmin = chatDetails.groupAdmin.equals(userId)
  try{
  if(isAdmin){
    await Chat.findOneAndDelete({_id:chatId})
    return;
  }

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.status(200).json(removed);
  }
  }catch(error){
    res.status(500).json("Internal Server Error")
  }
});

// FETCH USERS IN GROUP
const fetchUserInGroup = asyncHandler(async(req,res)=>{
  const {chatId} = req.body
  try {
    const existingChat = await Chat.findOne({_id:chatId})
  const chatUsers = await User.find({
    _id:{
      $in: existingChat.users
    }
  })

  if(!chatId){
    return res.status(404).json("No Chat found")
  }
  if(!chatUsers){
   return res.status(404).json("No Users found")
  }

  res.status(200).json(chatUsers)
  } catch (error) {
    res.status(500).json("Internal Server Error")
  }
  
})
// fetch users not in group
const fetchUsersNotInGroup = asyncHandler(async(req,res)=>{
  const {chatId} = req.body
  try {
    const existingChat = await Chat.findOne({_id:chatId})
  const chatUsers = await User.find({
    _id:{
      $nin: existingChat.users
    }
  })

  if(!chatId){
    return res.status(404).json("No Chat found")
  }
  if(!chatUsers){
   return res.status(404).json("No Users found")
  }

  res.status(200).json(chatUsers)
  } catch (error) {
    res.status(500).json("Internal Server Error")
  }
  
})

// const get group Admin 
const getGroupAdmin = asyncHandler(async(req,res)=>{
  const {chatId} = req.params
  const existingChat = await Chat.findOne({_id:chatId})
  if(!existingChat) return res.status(404).json("Chat not found")

  try {
    const adminId = existingChat.groupAdmin
    const groupAdmin = await User.findOne({_id:adminId})
    if(!groupAdmin) return res.status(404).json("Group admin not found")
    res.status(200).json(groupAdmin)
  } catch (error) {
    res.status(500).json("Internal Server Error")
  }

})

// join groups
const joinGroupChat = asyncHandler(async(req, res)=>{
  try{
    const {chatId,userId} = req.body
  // check if the chatId and userId are valid
  if(!chatId || !userId) {
    return res.status(400).json("Bad Request");
  }
  // check if the chat exist
  const chatDetails = await Chat.findOne({_id:chatId})
  if(!chatDetails){
    return res.status(404).json("Chat Not Found");
  }
  if (chatDetails.users.some(user => user == userId) || chatDetails.groupAdmin == userId) {
    return res.status(409).json("User Already Exists in the group");
  }
  
  // add user to the chat
  const joined = await Chat.findByIdAndUpdate(chatId,{
    $push: {users:userId}
  },
  {
    new:true
  }
  )
  .populate("users","-password")

  if(!joined){
    return res.status(400).json("Failed to join chat")
  }
    res.status(200).json(joined)
  }catch(err){
    res.status(500).json("Internal Server Error")
  }
})

// remove one to one chat 
const removeSingleChat = asyncHandler(async(req,res)=>{
    const {chatId} = req.body;
    try {
      const removed = await Chat.findOneAndDelete({_id:chatId})
      if(removed){
        res.status(200).json("Removing chat successfully")
      } else{
        res.status(404).json("CHAT not found")
      } 
    } catch (error) {
      res.status(500).json({"Failed to remove chat": +error})
    }
})

// clear all messages
const clearAllMessages = asyncHandler(async(req,res)=>{
  const {chatId} = req.body;
  try {
    const messages = await Message.deleteMany({chat:chatId})
    const latestMessageRemoved = await Chat.findByIdAndUpdate(chatId,
      {$unset:{latestMessage:1}},
      {new:true})
    res.status(200).json("Chat cleared successfully")
  } catch (error) {
    res.status(500).json({"Failed to delete chat successfully":+error})
  }
})

const editGroup = asyncHandler(async(req,res)=>{
  const {chatId,groupName} = req.body;
  const userId = req.user._id;

  let updatedDetails = {
    chatName:groupName
  }

  const existingChat = await Chat.findOne({_id:chatId}) 
  // res.send({"User id":userId,"groupAdminId":existingChat.groupAdmin});
  if(userId){   
    
    if(groupName === ""){
    return res.status(400).json("Bad request")
  }
  const isAdmin = existingChat.groupAdmin.equals(userId)
  if(!isAdmin){
    return res.status(403).json("Only admin can change group name.")
  }

  try {
    const updated = await Chat.findByIdAndUpdate(chatId,
    {
      $set:updatedDetails,
    },
    {
      new:true
    }
    )
  if(updated){
    res.send(updated)
  }else{
    res.status(403).json("Cannot Edit Group details.")
  }
} catch (error) {
  res.status(500).json("Internal Server Error") 
  }
}
})

const addUsersToGroup = asyncHandler(async(req,res)=>{
  const {chatId,userId} = req.body
  try {
    const existingChat = await Chat.findOne({_id:chatId})
    if(existingChat.groupAdmin == userId || existingChat.users.some(user => user.equals(userId))) {
      return res.status(400).json("User already exists")
    }
    if(!chatId && !userId){
      res.status(400).json("Bad Request")
    }else{
      const added = await Chat.findByIdAndUpdate(chatId,{
        $push:{users:userId},
      },
      {new:true}
      )

        res.status(200).json(added)
    }
  } catch (error) {
  res.status(500).json("Internal Server Error"+error)    
  }
})

const removeUsersFromGroup = asyncHandler(async(req,res)=>{
  const {chatId,userId} = req.body
  const loggeUserId = req.user._id
  try {
    const existingChat =  await Chat.findOne({_id:chatId})
    const equals = existingChat.groupAdmin.equals(loggeUserId)
    if(!equals){
      return res.status(403).json("Only admins can remove users from groups.")
    }

    const existingUser = existingChat.users.some(user=>user.equals(userId))
    
    if(!existingUser){
      return res.status(404).json("User does not exist in this group.")
    }


    if(!chatId && !userId){
      res.status(400).json("Bad Request")
    }else{
      const removed = await Chat.findByIdAndUpdate(chatId,{
        $pull:{users:userId},
      },
      {new:true}
      )
      
        res.status(200).json("user removed successfully")
    }
  } catch (error) {
  res.status(500).json("Internal Server Error"+error)    
  }
})


const setGroupAdmin = asyncHandler(async (req,res)=>{
  const loggeUserId = req.user._id
  const {chatId, userId} = req.body

  const existingChat = await Chat.findOne({_id:chatId})
  // check if logged in user is admin
  try{
    if(existingChat.groupAdmin.equals(loggeUserId)){
      const setAdmin = await Chat.findByIdAndUpdate(chatId,{
        $set:{groupAdmin:userId}
      },
      {new:true}
      )
      
      if(!setAdmin){
      return res.status(404).json("Cannot set admin")
    }
   res.status(200).json(setAdmin)
    }else{
      res.status(403).json("Only admin have the permission for this.")
    }
  }catch(error){
    return res.status(500).json("Internal Server Error")
  }
  

})

module.exports= {
    accessChats,
    fetchChats,
    fetchGroups,
    createGroupChat,
    groupExit,
    joinGroupChat,
    removeSingleChat,
    clearAllMessages,
    editGroup,
    addUsersToGroup,
    removeUsersFromGroup,
    setGroupAdmin,
    fetchUsersNotInGroup,
    fetchUserInGroup,
    getGroupAdmin
}