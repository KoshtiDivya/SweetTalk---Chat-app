const Notification = require("../models/notifiationModel");

const getNotification = async (req, res) => {
    try {
        const notification = await Notification.find({
            receiver: req.user._id,
            isRead: false
        }).populate("sender", "name");

        res.json(notification);

    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
}

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