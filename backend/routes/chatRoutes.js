const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const { accessChat,
    fetchChats,
    createGroupChat,
    renameGroup,
    removeFromGroup,
    addToGroup } = require('../controllers/chatControllers');

const router = express.Router();

router.route("/")
    .post(protect, accessChat)
    .get(protect, fetchChats);


router.post("/group", protect, createGroupChat);
router.put("/rename", protect, renameGroup);
router.put("/group-remove", protect, removeFromGroup);
router.put("/group-add", protect, addToGroup);

module.exports = router;