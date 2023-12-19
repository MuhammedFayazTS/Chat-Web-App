const expressAsyncHandler = require('express-async-handler');
const Message = require('../models/messageModel')
const Chat = require('../models/chatModel')
const User = require('../models/userModel')


const allMessages = expressAsyncHandler(async (req, res) => {
    try {
      const messages = await Message.find({ chat: req.params.chatId })
        .populate("sender", "name email")
        .populate("reciever")
        .populate("chat")
      res.json(messages);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  });

  const sendMessages = expressAsyncHandler(async (req, res) => {
    const { content, chatId } = req.body;
  
    if (!content || !chatId) {
      console.log("Invalid data passed into request");
      return res.sendStatus(400);
    }
  
    var newMessage = {
      sender: req.user._id,
      content: content,
      chat: chatId,
    };
  
    try {
      var message = await Message.create(newMessage);
  
      message = await message.populate("sender", "name pic");
      message = await message.populate("chat");
      message = await message.populate("reciever");
      message = await User.populate(message, {
        path: "chat.users",
        select: "name email",
      });
  
      await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
      res.json(message);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  });

  // react to message
  const messageReaction = expressAsyncHandler(async(req,res)=>{
    const messageId = req.params.id
    const {reactionEmoji} = req.body
    try {
      const reacted = await Message.findByIdAndUpdate(
        messageId,
        { $set: { reaction: reactionEmoji} },
        { new: true }
      );
      if(reacted){
        return res.status(200).json({ reacted });
      }else{
        return res.status(404).json({ message: 'Message not found' });
      }
      
    } catch (error) {
      res.status(500).json({
        'error':error.message
      })
    }
  })
  
  // .fetch reactions
  const fetchReaction = expressAsyncHandler(async(req,res)=>{
    const msgID = req.params.id
    try {
      const reacted = await Message.findOne({_id:msgID})
      res.status(200).json({"reaction":reacted?.reaction})
    } catch (error) {
      res.status(500).json({"Internal Server Error":+error.message})
    }
    
  })
  
  // remove message reactions
  const removeMessageReaction = expressAsyncHandler(async(req,res)=>{
    const messageId = req.params.id
    try {
      const reacted = await Message.findByIdAndUpdate(
        messageId,
        { $unset: { reaction: "" } }, 
        { new: true }
      );
      if(reacted){
        return res.status(200).json({ reacted});
      }else{
        return res.status(404).json({ message: 'Message not found' });
      }
      
    } catch (error) {
      res.status(500).json({
        'error':error.message
      })
    }
  })
  
  
  
  module.exports = {allMessages,sendMessages,messageReaction,fetchReaction,removeMessageReaction}