import { io } from "socket.io-client"

const SOCKET_URL = import.meta.env.VITE_API_URL

let socket

export const connectSocket = (user) => {
  socket = io(SOCKET_URL, {
    withCredentials: true
  })

  socket.emit("setup", user)

  socket.on("connected", () => {
    console.log("Socket connected")
  })

  return socket
}

export const getSocket = () => socket