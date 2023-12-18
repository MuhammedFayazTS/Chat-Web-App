const express = require('express');
const { loginController, registerController, fetchUsersController, fetchAUserController, fetchGroupUsers, editUserDetails, setOnline, fetchAllUsers, updateUserProfilePic, fetchUserPFP, setOffline, removeAccount } = require('../Controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const Router = express.Router();

Router.post('/login',loginController)
Router.post('/register',registerController)
Router.get('/fetchusers',protect,fetchAllUsers)
Router.get('/fetchuserpfp/:userId',protect,fetchUserPFP)
Router.get('/fetch-other-users',protect,fetchUsersController)
Router.post('/fetchgroupusers',protect,fetchGroupUsers)
Router.post('/edituser',protect,editUserDetails)
Router.put('/edituser/pfp',protect,updateUserProfilePic)
Router.put('/setOffline/:id',protect,setOffline)
Router.delete('/removeAccount/:id',protect,removeAccount)

module.exports = Router;