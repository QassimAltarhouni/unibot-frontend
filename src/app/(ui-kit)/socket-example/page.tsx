'use client'
import React, { useEffect, useState, useRef } from 'react'
import { io, Socket } from 'socket.io-client'

const SocketChatExample = () => {
  // State for connection and messages
  const [connected, setConnected] = useState(false)
  const [messages, setMessages] = useState<any[]>([])
  const [message, setMessage] = useState('')
  const [username, setUsername] = useState(
    'Guest-' + Math.floor(Math.random() * 1000),
  )
  const [room, setRoom] = useState('')
  const [currentRoom, setCurrentRoom] = useState('')
  const [usersInRoom, setUsersInRoom] = useState(0)

  // Use a ref for the socket to maintain the same reference across renders
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    // Initialize socket connection
    const socket = io('http://localhost:5000', {
      transports: ['websocket'], // Force WebSocket transport
      reconnection: true, // Enable reconnection
      reconnectionAttempts: 5, // Maximum reconnection attempts
      reconnectionDelay: 1000, // Initial delay between reconnections (ms)
      timeout: 20000, // Connection timeout
      query: { username }, // Pass username as a query parameter
    })
    socketRef.current = socket

    // Connection event handlers
    socket.on('connect', () => {
      console.log('Connected to server with ID:', socket.id)
      setConnected(true)
    })

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error)
      setConnected(false)
    })

    // Welcome message
    socket.on('welcome', (data) => {
      console.log('Welcome received:', data)
    })

    // Pong response
    socket.on('pong', (data) => {
      console.log('Pong received:', data)
      const latency = Date.now() - data.echo.clientTime
      console.log(`Latency: ${latency}ms`)
    })

    socket.on('disconnect', (reason) => {
      console.log('Disconnected from server. Reason:', reason)
      setConnected(false)
      setCurrentRoom('')
      setUsersInRoom(0)
    })

    // Handle incoming messages
    socket.on('message', (data) => {
      setMessages((prev) => [...prev, data])
    })

    // Handle user joining notification
    socket.on('user_joined', (data) => {
      console.log('User joined:', data)
      setMessages((prev) => [
        ...prev,
        {
          type: 'system',
          text: `A new user has joined the room`,
          timestamp: data.timestamp,
        },
      ])
    })

    // Handle user leaving notification
    socket.on('user_left', (data) => {
      console.log('User left:', data)
      setMessages((prev) => [
        ...prev,
        {
          type: 'system',
          text: `A user has left the room`,
          timestamp: data.timestamp,
        },
      ])
    })

    // Handle room users count updates
    socket.on('room_users', (data) => {
      console.log('Room users update:', data)
      setUsersInRoom(data.count)
    })

    // Cleanup on component unmount
    return () => {
      if (currentRoom && socket.connected) {
        socket.emit('leave_room', currentRoom)
      }
      socket.disconnect()
    }
  }, [username]) // Only re-run if username changes

  // Join a room
  const joinRoom = (e: React.FormEvent) => {
    e.preventDefault()
    if (room.trim() && socketRef.current) {
      // Leave current room if in one
      if (currentRoom) {
        socketRef.current.emit('leave_room', currentRoom)
        setMessages([])
      }

      // Join new room
      socketRef.current.emit('join_room', room)
      setCurrentRoom(room)

      // Add system message
      setMessages([
        {
          type: 'system',
          text: `You joined room: ${room}`,
          timestamp: Date.now(),
        },
      ])

      // Clear room input
      setRoom('')
    }
  }

  // Leave the current room
  const leaveRoom = () => {
    if (currentRoom && socketRef.current) {
      socketRef.current.emit('leave_room', currentRoom)
      setCurrentRoom('')
      setMessages([])
      setUsersInRoom(0)
    }
  }

  // Send a ping to test connection
  const sendPing = () => {
    if (socketRef.current) {
      socketRef.current.emit('ping', { clientTime: Date.now() })
    }
  }

  // Send a message to the room
  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && socketRef.current && currentRoom) {
      const messageData = {
        roomId: currentRoom,
        text: message,
        username: username,
      }

      socketRef.current.emit('room_message', messageData)
      setMessage('')
    }
  }

  // Ask the chatbot a question
  const askChatbot = () => {
    if (socketRef.current && currentRoom) {
      const botPrompt = prompt('Ask the chatbot something:')

      if (botPrompt && botPrompt.trim()) {
        const messageData = {
          roomId: currentRoom,
          text: `@chatbot ${botPrompt.trim()}`,
          username: username,
        }

        socketRef.current.emit('room_message', messageData)
      }
    }
  }

  return (
    <div className="socket-container p-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Socket.io Chat</h2>

      {/* Connection status and controls */}
      <div
        className={`mb-4 p-3 rounded ${connected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
      >
        <div className="flex justify-between items-center">
          <span>Status: {connected ? 'Connected' : 'Disconnected'}</span>
          <button
            onClick={sendPing}
            className="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={!connected}
          >
            Ping Server
          </button>
        </div>
      </div>

      {/* Username */}
      <div className="mb-4">
        <label htmlFor="username" className="block mb-1 font-medium">
          Your Name:
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Room actions */}
      <div className="mb-4">
        {!currentRoom ? (
          <form onSubmit={joinRoom} className="flex">
            <input
              type="text"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              placeholder="Enter room name..."
              className="flex-1 p-2 border rounded-l"
            />
            <button
              type="submit"
              disabled={!connected}
              className={`px-4 py-2 rounded-r font-medium ${connected ? 'bg-green-500 text-white' : 'bg-gray-400 text-gray-700'}`}
            >
              Join Room
            </button>
          </form>
        ) : (
          <div className="flex justify-between items-center bg-gray-100 p-3 rounded">
            <div>
              <span className="font-medium">Room:</span> {currentRoom}
              <span className="ml-2 text-sm text-gray-600">
                ({usersInRoom} {usersInRoom === 1 ? 'user' : 'users'})
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={askChatbot}
                className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 flex items-center gap-1"
              >
                <span>🤖</span> Ask Bot
              </button>
              <button
                onClick={leaveRoom}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Leave
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Messages list */}
      <div className="h-80 mb-4 border rounded overflow-y-auto p-3 bg-white">
        {!currentRoom ? (
          <p className="text-gray-500 text-center">
            Join a room to start chatting
          </p>
        ) : messages.length === 0 ? (
          <p className="text-gray-500 text-center">No messages yet</p>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 p-2 rounded ${
                msg.type === 'system'
                  ? 'bg-gray-100 text-gray-700'
                  : msg.type === 'bot'
                    ? 'bg-yellow-50'
                    : msg.username === username
                      ? 'bg-blue-50'
                      : 'bg-gray-50'
              }`}
            >
              {msg.type === 'system' ? (
                <div className="italic text-gray-600 text-center text-sm">
                  {msg.text}
                </div>
              ) : (
                <>
                  <div
                    className={`font-bold ${msg.type === 'bot' ? 'text-yellow-600 flex items-center' : ''}`}
                  >
                    {msg.type === 'bot' && <span className="mr-1">🤖</span>}
                    {msg.username}
                  </div>
                  <div className="mb-1">{msg.text}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>

      {/* Message input */}
      <form onSubmit={sendMessage} className="flex">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={currentRoom ? 'Type a message...' : 'Join a room first'}
          disabled={!currentRoom}
          className={`flex-1 p-2 border rounded-l ${!currentRoom ? 'bg-gray-100' : 'bg-white'}`}
        />
        <button
          type="submit"
          disabled={!connected || !currentRoom}
          className={`px-4 py-2 rounded-r font-medium ${
            connected && currentRoom
              ? 'bg-blue-500 text-white'
              : 'bg-gray-400 text-gray-700'
          }`}
        >
          Send
        </button>
      </form>
    </div>
  )
}

export default SocketChatExample
