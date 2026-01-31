# 💬 Real-Time Chat Application (MERN + Socket.io)

A full‑stack **real‑time chat application** built using the **MERN stack** with **Socket.io** for instant messaging. The app supports user authentication, one‑to‑one chats, real‑time message delivery, and persistent chat history.

---

## 🚀 Features

* 🔐 User Authentication (Login / Signup)
* 👥 View all registered users
* 💬 One‑to‑One Chat System
* ⚡ Real‑Time Messaging using Socket.io
* 🟢 Instant message rendering without page reload
* 📦 Messages stored securely in MongoDB
* 🔄 Auto chat creation when starting a new conversation
* 🎯 Sender / Receiver message alignment
* 🚪 Logout functionality

---

## 🛠 Tech Stack

### Frontend

* React.js
* Tailwind CSS
* Axios
* Context API (Authentication)
* Socket.io Client

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* Socket.io
* JWT Authentication

---

## 🔄 How Real‑Time Messaging Works

1. User sends a message via REST API
2. Message is saved to MongoDB
3. Message is emitted via Socket.io
4. Receiver gets message instantly
5. Sender UI updates immediately (no reload)

This approach ensures **data consistency + real‑time UX**.
