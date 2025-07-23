'use client'
import { useState, useEffect, useRef } from 'react'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import PersonIcon from '@mui/icons-material/Person'
import CloseIcon from '@mui/icons-material/Close'
import SendIcon from '@mui/icons-material/Send'

// Define the structure for messages to align with Gemini's API
interface ChatMessage {
  role: 'user' | 'model' // 'user' for user messages, 'model' for bot messages (Gemini's convention)
  parts: Array<{ text: string }> // Content of the message (Gemini's convention)
  displaySender: 'user' | 'bot' // Your existing property for UI rendering
}

const Chatbot = () => {
  const [showChat, setShowChat] = useState(false)
  const [message, setMessage] = useState('')
  const [chatLog, setChatLog] = useState<ChatMessage[]>([
    {
      role: 'model',
      parts: [{ text: 'Hello! How can I help you?' }],
      displaySender: 'bot',
    },
  ])
  const [isBotTyping, setIsBotTyping] = useState(false)

  const chatContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [chatLog, isBotTyping])

  const handleSendMessage = async () => {
    if (message.trim() === '') return

    const userMsg: ChatMessage = {
      role: 'user',
      parts: [{ text: message }],
      displaySender: 'user',
    }
    setChatLog((prev) => [...prev, userMsg])
    setMessage('')
    setIsBotTyping(true)

    try {
      // --- CRITICAL FIX: Prepare history for Gemini correctly ---
      // Filter out the initial 'Hello! How can I help you?' bot message if it's the *only* one.
      // This ensures history sent to Gemini either starts with a user message or is empty.
      const historyForGemini = chatLog
        .filter((msg) => {
          // If the chatLog has only one message and it's the initial bot greeting,
          // then we should *not* send it as part of the history for the first user turn.
          const isInitialBotGreeting =
            chatLog.length === 1 &&
            msg.role === 'model' &&
            msg.parts[0].text === 'Hello! How can I help you?'
          return !isInitialBotGreeting
        })
        .map((msg) => ({ role: msg.role, parts: msg.parts }))

      // --- DEBUGGING: Log the history being sent ---
      console.log('History being sent to Gemini API:', historyForGemini)

      // --- END CRITICAL FIX ---

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMsg.parts[0].text, // The current user message text
          history: historyForGemini, // The cleaned conversation history for Gemini
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      const geminiReplyText = data.reply

      const botMsg: ChatMessage = {
        role: 'model',
        parts: [{ text: geminiReplyText }],
        displaySender: 'bot',
      }
      setChatLog((prev) => [...prev, botMsg])
    } catch (error) {
      console.error('Error communicating with Gemini API:', error)
      setChatLog((prev) => [
        ...prev,
        {
          role: 'model',
          parts: [
            {
              text: 'Sorry, I ran into an issue getting a response. Please try again.',
            },
          ],
          displaySender: 'bot',
        },
      ])
    } finally {
      setIsBotTyping(false)
    }
  }

  return (
    <>
      {/* Typing dots animation */}
      <style jsx>{`
        @keyframes typingDots {
          0% {
            content: 'Typing.';
          }
          33% {
            content: 'Typing..';
          }
          66% {
            content: 'Typing...';
          }
          100% {
            content: 'Typing.';
          }
        }

        .typing-dots::after {
          display: inline-block;
          content: 'Typing.';
          animation: typingDots 1.5s steps(3, end) infinite;
        }
      `}</style>

      {/* Chatbot trigger icon - NO CHANGES HERE */}
      <div
        onClick={() => setShowChat(!showChat)}
        className="fixed right-24 bottom-[1rem] w-12 h-12 flex items-center justify-center shadow-lg shadow-black hover:cursor-pointer bg-white rounded-full"
      >
        <SmartToyIcon style={{ fontSize: '36px' }} />
      </div>

      {showChat && (
        <div className="fixed right-24 bottom-[calc(4rem)] p-5 shadow-2xl shadow-black/50 h-[450px] w-[400px] bg-white rounded-md">
          <div className="flex flex-col h-full">
            {/* CLOSE BUTTON - NO CHANGES HERE */}
            <button
              onClick={() => setShowChat(false)}
              className="absolute top-9 right-8 text-white shadow-2xl hover:text-black"
            >
              <CloseIcon />
            </button>

            {/* CHAT HEADER - NO CHANGES HERE */}
            <div>
              <h2 className="font-semibold text-lg tracking-wide bg-black border px-3.5 py-3.5 rounded-lg text-white">
                Chat with Unibot
              </h2>
            </div>

            {/* CHAT MESSAGES */}
            <div
              ref={chatContainerRef}
              className="flex flex-col flex-1 p-2 mt-5 overflow-y-auto gap-3"
            >
              {chatLog.map((msg, index) =>
                msg.displaySender === 'bot' ? (
                  <div key={index} className="flex w-full items-start gap-2">
                    <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-black text-white rounded-full">
                      <SmartToyIcon style={{ fontSize: '20px' }} />
                    </div>
                    <div className="bg-gray-100 p-2 rounded-lg max-w-xs">
                      <p>{msg.parts[0].text}</p>
                    </div>
                  </div>
                ) : (
                  <div
                    key={index}
                    className="flex items-start justify-end w-full gap-2"
                  >
                    <div className="bg-blue-100 p-2 rounded-lg max-w-xs">
                      <p className="break-words whitespace-pre-wrap">
                        {msg.parts[0].text}
                      </p>
                    </div>
                    <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center border bg-black text-white rounded-full">
                      <PersonIcon style={{ fontSize: '20px' }} />
                    </div>
                  </div>
                ),
              )}

              {/* BOT TYPING ANIMATION - NO CHANGES HERE (but controlled by isBotTyping) */}
              {isBotTyping && (
                <div className="flex w-full items-start gap-2">
                  <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-black text-white rounded-full">
                    <SmartToyIcon style={{ fontSize: '20px' }} />
                  </div>
                  <div className="bg-gray-100 p-2 rounded-lg max-w-xs">
                    <p className="text-gray-500 typing-dots"></p>
                  </div>
                </div>
              )}
            </div>

            {/* CHAT INPUT */}
            <div className="flex items-center gap-2 mt-2">
              <input
                type="text"
                placeholder="Type your message here..."
                className="border border-gray-300 rounded-lg py-2 px-4 w-full text-gray-800"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) =>
                  e.key === 'Enter' && !isBotTyping && handleSendMessage()
                }
                disabled={isBotTyping}
              />
              <button onClick={handleSendMessage} disabled={isBotTyping}>
                <SendIcon className="text-black" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Chatbot
