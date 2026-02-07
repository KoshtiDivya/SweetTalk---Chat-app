const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const { getNotification, markChatNotificationsAsRead } = require('../controllers/notificationController');

const router = express.Router();

router.get("/", protect, getNotification);
router.post("/read-chat/:chatId", protect, markChatNotificationsAsRead);
module.exports = router;