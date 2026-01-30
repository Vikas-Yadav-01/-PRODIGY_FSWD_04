import { Server } from "socket.io"

let io

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN,
      credentials: true
    }
  })

  io.on("connection", (socket) => {
    console.log(" User connected:", socket.id)

    socket.on("setup", (userData) => {
      socket.join(userData._id)
      socket.emit("connected")
    })

    socket.on("join chat", (chatId) => {
      socket.join(chatId)
      console.log("User joined chat:", chatId)
    })

    socket.on("new message", (message) => {
      const chat = message.chat

      if (!chat?.users) return

      chat.users.forEach((user) => {
        if (user._id === message.sender._id) return
        socket.to(user._id).emit("message received", message)
      })
    })

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id)
    })
  })
}

export { initSocket }