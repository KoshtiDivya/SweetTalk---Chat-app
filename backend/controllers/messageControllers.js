const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const chat = require("../models/chatModel");
const Notification = require("../models/notifiationModel");

const sendMessage = asyncHandler ( async (req, res) => {
    const { content, chatId } = req.body;
    if (!content || !chatId) {
        console.log("Invalid data passed in to request");
        return res.sendStatus(400);
    }

    var newMessage = {
        sender: req.user._id,
        content: content,
        chat : chatId,
    }
    try {
        var message = await Message.create(newMessage);
        message = await message.populate("sender", "name pic")
        message = await message.populate("chat")
        message = await User.populate(message, {
            path: "chat.users",
            select : "name pic email"
        })

        await chat.findByIdAndUpdate(req.body.chatId, {
            latestMessage: message
        });
   
        //notification logic
        const chatUsers = message.chat.users;
        chatUsers.forEach( async (u) => {
            if (u._id.toString() !== req.user._id.toString) {
                await Notification.create({
                    sender : req.user._id,
                    receiver: u._id,
                    chat: chatId,
                    message: message._id,
                })
        
            }
        })
       
        res.json(message);

    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
})

const allMessages = asyncHandler( async (req, res) => {
   try {
       const messages = await Message.find({ chat: req.params.chatId }).populate('sender', "name pic email").populate("chat");
       res.json(messages);
       
   } catch (error) {
       res.status(400);
       throw new Error(error.message);
   }
})
module.exports = {sendMessage, allMessages}