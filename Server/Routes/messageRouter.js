const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { allMessages, sendMessages, messageReaction, fetchReaction, removeMessageReaction } = require('../Controllers/messageController');


const router = express.Router();

router.route("/:chatId").get(protect,allMessages);
router.route("/").post(protect,sendMessages);
router.route("/reaction/:id").put(protect,messageReaction);
router.route("/reaction/:id").get(protect,fetchReaction);
router.route("/removeReaction/:id").put(protect,removeMessageReaction);

module.exports = router;