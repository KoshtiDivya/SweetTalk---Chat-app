const express = require('express');
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const notificationRoute = require("./routes/notificationRoute");
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');


dotenv.config();
connectDB();
const PORT = process.env.PORT || 3000;

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://sweettalk-chatapp.netlify.app/",
    ],
    credentials: true,
  })
);

app.use(express.json()); // to accept json data

app.get("/", (req, res) => {
    res.send("Hello from SweetTalk backend!");  
})



app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/notification', notificationRoute);

app.use(notFound)
app.use(errorHandler)

const server = app.listen(PORT, () => {
    console.log('Server is running on Port:' + PORT);
})

const io = require('socket.io')(server, {
    pingTimeOut : 60000,  //time for deactivate request here 60 sec
    cors: {
        origin : "*", //frontend
    },
})

io.on('connection', (socket) => {
    console.log("connected to socket.io");

    socket.on("setup", (userData) => {
        socket.userId = userData._id;
        socket.join(userData._id);
        socket.emit("connected");
    })

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User joined Room", room);
    })

    socket.on("typing", (room) => socket.in(room).emit("typing", room));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing", room));

    socket.on("new message", (newMessageReceived) => {
        var chat = newMessageReceived.chat;

        if (!chat.users) return console.log("chat.users not defined");
        
        chat.users.forEach(user => {
            if (user._id === newMessageReceived.sender._id) return;

            //normal message
            socket.in(user._id).emit("message received", newMessageReceived);

            //notification event (bell icon)
            socket.in(user._id).emit("notification received", {
                _id: newMessageReceived._id,
                chat: chat,
                sender : newMessageReceived.sender,
            })
        })
        
    })

    socket.off("setup", () => {
        console.log("USER DISCONNECCTED");
        socket.leave(userData._id)
    })
})