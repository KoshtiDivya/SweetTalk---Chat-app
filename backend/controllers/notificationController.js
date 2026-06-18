const Notification = require("../models/notifiationModel");

const getNotification = async (req, res) => {
  try {
    const notifications = await Notification.find({
      receiver: req.user._id,
      isRead: false,
    })
      .populate("sender", "name pic")
      .populate({
        path: "chat",
        populate: {
          path: "users",
          select: "name pic email",
        },
      })
      .populate("message")
      .sort({ createdAt: -1 });

    const uniqueNotifications = [];
    const seenChats = new Set();

    notifications.forEach((n) => {
      const chatId = n.chat?._id?.toString();

      if (chatId && !seenChats.has(chatId)) {
        seenChats.add(chatId);
        uniqueNotifications.push(n);
      }
    });

    res.json(uniqueNotifications);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

const markChatNotificationsAsRead = async (req, res) => {
    try {
        const chatId = req.params.chatId;

        await Notification.updateMany(
            {
                chat: chatId,
                receiver: req.user._id,
                isRead: false,
            },
            {
                isRead: true,
            }
        );

        res.status(200).json({ message: "Notifications marked as read" });
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
};

module.exports = { getNotification, markChatNotificationsAsRead }