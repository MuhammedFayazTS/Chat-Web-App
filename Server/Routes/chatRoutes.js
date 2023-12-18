const express = require('express');
const {protect} = require('../middleware/authMiddleware');
const { accessChats, fetchChats, fetchGroups, createGroupChat, joinGroupChat, removeSingleChat, groupExit, clearAllMessages, editGroup, addUsersToGroup, removeUsersFromGroup, setGroupAdmin, fetchUsersNotInGroup, fetchUserInGroup, getGroupAdmin } = require('../Controllers/chatController');
const router = express.Router();

router.route("/").post(protect,accessChats)
router.route("/").get(protect,fetchChats)
router.route("/createGroup").post(protect,createGroupChat)
router.route("/fetchGroups").get(protect,fetchGroups)
router.route("/joinGroup").post(protect,joinGroupChat)
router.route("/removeChat").delete(protect,removeSingleChat)
router.route('/exitgroup').post(protect,groupExit)
router.route('/editgroup').put(protect,editGroup)
router.route('/addUserToGroup').put(protect,addUsersToGroup)
router.route('/removeUserFromGroup').put(protect,removeUsersFromGroup)
router.route('/setGroupAdmin').put(protect,setGroupAdmin)
router.route('/clearChat').post(protect,clearAllMessages)
router.route('/fetchUsersNotInGroup').post(protect,fetchUsersNotInGroup)
router.route('/fetchUserInGroup').post(protect,fetchUserInGroup)
router.route('/getGroupAdmin/:chatId').get(protect, getGroupAdmin);



module.exports = router;