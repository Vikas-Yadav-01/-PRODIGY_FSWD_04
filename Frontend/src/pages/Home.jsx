import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import { getAllUsers } from "../services/userApi"
import api from "../services/api"
import { getSocket } from "../socket"

const Home = () => {
  const { user, logout } = useAuth()

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedChat, setSelectedChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers()
        setUsers(data.users.filter(u => u._id !== user._id))
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [user])

  const handleUserClick = async (userId) => {
    try {
      const res = await api.post("/chats/access-chat", { userId })
      const chat = res.data.chat || res.data.fullChat
      setSelectedChat(chat)
      setMessages([])
    } catch (err) {
      console.error("Failed to access chat", err)
    }
  }

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedChat) return
      try {
        const res = await api.get(`/messages/fetch-message/${selectedChat._id}`)
        const msgs = Array.isArray(res.data) ? res.data : res.data.messages || []
        setMessages(msgs)
        const socket = getSocket()
        socket.emit("join chat", selectedChat._id)
      } catch (err) {
        console.error(err)
      }
    }
    fetchMessages()
  }, [selectedChat])

  useEffect(() => {
    const socket = getSocket()
    if (!socket) return
    socket.on("message received", (msg) => {
      if (selectedChat && msg.chat._id === selectedChat._id) {
        setMessages(prev => [...prev, msg])
      }
    })
    return () => socket.off("message received")
  }, [selectedChat])

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return
    const tempMessage = {
      _id: Date.now(),
      content: newMessage,
      sender: user._id,
      chat: selectedChat._id,
    }

    await api.post("/messages/send-message", { content: newMessage, chatId: selectedChat._id })
    setMessages(prev => [...prev, tempMessage])
    setNewMessage("")

    const socket = getSocket()
    socket.emit("new message", { content: tempMessage.content, chatId: selectedChat._id, })
  }

  const chatUserName = selectedChat? selectedChat.users.find(u => u._id !== user._id)?.userName: null

  return (
    <div className="h-screen flex">
      <div className="w-1/4 border-r p-4">
        <h2 className="text-xl font-semibold mb-4">Chats</h2>

        {loading && <p>Loading users...</p>}
        {!loading && users.length === 0 && (<p className="text-gray-500 text-sm">No users found</p>)}

        <div className="space-y-2">
          {users.map(u => (
            <div
              key={u._id}
              onClick={() => handleUserClick(u._id)}
              className={`p-2 rounded cursor-pointer hover:bg-gray-100 ${selectedChat?.users?.some(us => us._id === u._id)
                  ? "bg-gray-200"
                  : ""
                }`}
            >
              {u.userName}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {/* HEADER */}
        <div className="border-b p-4 flex justify-between items-center">
          <h2 className="font-semibold">
            {!selectedChat? `Welcome, ${user?.userName}`: `${chatUserName}`}
          </h2>

          <button
            onClick={logout}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-2">
          {!selectedChat && (
            <div className="h-full flex items-center justify-center text-gray-400">
              Select a user to start chatting
            </div>
          )}

          {selectedChat && messages.length === 0 && (
            <div className="h-full flex items-center justify-center text-gray-400">
              No messages yet. Say hi 👋
            </div>
          )}

          {messages.map(msg => {
            if (!msg?.content) return null
            const isOwn =(msg.sender?._id || msg.sender) === user._id

            return (
              <div
                key={msg._id}
                className={`max-w-xs px-3 py-2 rounded text-sm ${isOwn
                    ? "bg-blue-500 text-white ml-auto"
                    : "bg-gray-200 text-black"
                  }`}
              >
                {msg.content}
              </div>
            )
          })}
        </div>

        {selectedChat && (
          <div className="border-t p-4 flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 border rounded px-3 py-2"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSendMessage()
              }}
            />

            <button
              onClick={handleSendMessage}
              className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600"
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home