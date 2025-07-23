'use client'
import { useState, useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import PersonIcon from '@mui/icons-material/Person'
import CloseIcon from '@mui/icons-material/Close'
import SendIcon from '@mui/icons-material/Send'
import LanguageIcon from '@mui/icons-material/Language'
import CircularProgress from '@mui/material/CircularProgress'
import ReactMarkdown from 'react-markdown'

interface ChatMessage {
  userId: string
  text: string
  username: string
  timestamp: number
  type: 'user' | 'bot' | 'system'
  messageId: string
  botId?: string
  replyTo?: string
  categories?: Array<{
    id: string
    title: string
    description: string
  }>
}

interface Language {
  code: string
  name: string
  flag: string
}

const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
]

const translations = {
  en: {
    welcome: 'Welcome to UniBot! 👋',
    subtitle:
      "I'm your intelligent assistant for Wrocław University of Science and Technology.",
    connecting: 'Connecting to UniBot...',
    typing: 'UniBot is typing...',
    placeholder: 'Type your message...',
    online: 'Online',
    offline: 'Offline',
    retryConnection: 'Retry Connection',
    connectionError: 'Failed to connect to chatbot. Please try again.',
    suggestions: [
      'Student ID Help',
      'Course Information',
      'Campus Services',
      'Academic Support',
    ],
    selectLanguage: 'Choose your language:',
    languageSelected: 'Language changed to',
  },
  pl: {
    welcome: 'Witamy w UniBot! 👋',
    subtitle:
      'Jestem Twoim inteligentnym asystentem Politechniki Wrocławskiej.',
    connecting: 'Łączenie z UniBot...',
    typing: 'UniBot pisze...',
    placeholder: 'Wpisz swoją wiadomość...',
    online: 'Online',
    offline: 'Offline',
    retryConnection: 'Ponów połączenie',
    connectionError: 'Nie udało się połączyć z chatbotem. Spróbuj ponownie.',
    suggestions: [
      'Pomoc z legitymacją',
      'Informacje o kursach',
      'Usługi kampusowe',
      'Wsparcie akademickie',
    ],
    selectLanguage: 'Wybierz język:',
    languageSelected: 'Język zmieniony na',
  },
  es: {
    welcome: '¡Bienvenido a UniBot! 👋',
    subtitle:
      'Soy tu asistente inteligente para la Universidad de Ciencia y Tecnología de Wrocław.',
    connecting: 'Conectando con UniBot...',
    typing: 'UniBot está escribiendo...',
    placeholder: 'Escribe tu mensaje...',
    online: 'En línea',
    offline: 'Desconectado',
    retryConnection: 'Reintentar conexión',
    connectionError: 'Error al conectar con el chatbot. Inténtalo de nuevo.',
    suggestions: [
      'Ayuda con ID estudiantil',
      'Información de cursos',
      'Servicios del campus',
      'Apoyo académico',
    ],
    selectLanguage: 'Elige tu idioma:',
    languageSelected: 'Idioma cambiado a',
  },
}

const Chatbot = () => {
  const [showChat, setShowChat] = useState(false)
  const [message, setMessage] = useState('')
  const [chatLog, setChatLog] = useState<ChatMessage[]>([])
  const [isBotTyping, setIsBotTyping] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [currentLanguage, setCurrentLanguage] = useState<string>('en')
  const [hasSelectedLanguage, setHasSelectedLanguage] = useState(false)
  const [showLanguageSelection, setShowLanguageSelection] = useState(true)

  const socketRef = useRef<Socket | null>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const userId = useRef<string>(
    `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  )
  const username = useRef<string>('Student')

  const currentTranslations =
    translations[currentLanguage as keyof typeof translations]

  // Auto-scroll to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [chatLog, isBotTyping])

  // Initialize socket connection
  useEffect(() => {
    if (showChat && hasSelectedLanguage && !socketRef.current) {
      initializeSocket()
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
      }
    }
  }, [showChat, hasSelectedLanguage])

  const handleLanguageSelect = (languageCode: string) => {
    setCurrentLanguage(languageCode)
    setShowLanguageSelection(false)
    setHasSelectedLanguage(true)
  }

  const handleLanguageChange = (languageCode: string) => {
    setCurrentLanguage(languageCode)

    // Send language change message to backend
    if (socketRef.current && isConnected) {
      socketRef.current.emit('language_changed', {
        userId: userId.current,
        language: languageCode,
      })
    }

    // Add language change message to chat
    const newTranslations =
      translations[languageCode as keyof typeof translations]
    const languageChangeMessage: ChatMessage = {
      userId: userId.current,
      text: `${newTranslations.languageSelected} ${languages.find((l) => l.code === languageCode)?.name}`,
      username: username.current,
      timestamp: Date.now(),
      type: 'user',
      messageId: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    }
    setChatLog((prev) => [...prev, languageChangeMessage])
    setIsBotTyping(true)
  }

  const initializeSocket = () => {
    setIsConnecting(true)
    setConnectionError(null)

    socketRef.current = io(
      process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000',
      {
        transports: ['websocket', 'polling'],
      },
    )

    const socket = socketRef.current

    socket.on('connect', () => {
      console.log('🔌 Connected to chatbot server')
      setIsConnected(true)
      setIsConnecting(false)

      socket.emit('join_chatbot', {
        userId: userId.current,
        username: username.current,
        language: currentLanguage,
      })
    })

    socket.on('chatbot_connected', (data) => {
      console.log('🤖 Chatbot session established:', data)
    })

    socket.on('chatbot_message', (messageData: ChatMessage) => {
      setChatLog((prev) => [...prev, messageData])
      setIsBotTyping(false)
    })

    socket.on('message_sent', (messageData: ChatMessage) => {
      setChatLog((prev) => [...prev, messageData])
    })

    socket.on('bot_typing', (data: { typing: boolean }) => {
      setIsBotTyping(data.typing)
    })

    socket.on('chatbot_error', (error) => {
      console.error('Chatbot error:', error)
      setConnectionError(error.message)
      setIsBotTyping(false)
    })

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error)
      setIsConnected(false)
      setIsConnecting(false)
      setConnectionError(currentTranslations.connectionError)
    })

    socket.on('disconnect', (reason) => {
      console.log('🔌 Disconnected from chatbot:', reason)
      setIsConnected(false)
      setIsConnecting(false)
    })
  }

  const handleSendMessage = () => {
    if (message.trim() === '' || !socketRef.current || !isConnected) return

    socketRef.current.emit('user_message', {
      message: message.trim(),
      userId: userId.current,
      language: currentLanguage,
    })

    setMessage('')
    setIsBotTyping(true)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleCategoryClick = (categoryId: string, categoryTitle: string) => {
    if (!socketRef.current || !isConnected) return

    setSelectedCategory(categoryId)

    socketRef.current.emit('category_selected', {
      categoryId,
      categoryTitle,
      userId: userId.current,
      username: username.current,
      language: currentLanguage,
    })

    const userMessage: ChatMessage = {
      userId: userId.current,
      text: `Tell me about: ${categoryTitle}`,
      username: username.current,
      timestamp: Date.now(),
      type: 'user',
      messageId: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    }

    setChatLog((prev) => [...prev, userMessage])
    setIsBotTyping(true)
  }

  const renderMessage = (msg: ChatMessage, index: number) => {
    let messageContent = msg.text
    let categories = null

    try {
      const parsed = JSON.parse(msg.text)

      if (parsed.text && typeof parsed.text === 'string') {
        messageContent = parsed.text

        if (parsed.type === 'category_suggestions' && parsed.categories) {
          categories = parsed.categories
        }
      } else {
        messageContent = msg.text
      }
    } catch (parseError) {
      messageContent = msg.text
    }

    return (
      <div
        key={msg.messageId || index}
        className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
      >
        {msg.type === 'bot' && (
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
            <SmartToyIcon style={{ fontSize: '16px', color: 'white' }} />
          </div>
        )}

        <div className="max-w-[80%]">
          <div
            className={`p-3 rounded-2xl ${
              msg.type === 'user'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-sm'
                : 'bg-white border border-gray-200 rounded-bl-sm'
            }`}
          >
            <div className="text-sm break-words">
              {msg.type === 'bot' ? (
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-lg font-bold mb-2">{children}</h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-base font-bold mb-2">{children}</h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-sm font-bold mb-1">{children}</h3>
                    ),
                    p: ({ children }) => (
                      <p className="mb-2 last:mb-0">{children}</p>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc pl-4 mb-2">{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal pl-4 mb-2">{children}</ol>
                    ),
                    li: ({ children }) => <li className="mb-1">{children}</li>,
                    strong: ({ children }) => (
                      <strong className="font-semibold">{children}</strong>
                    ),
                    em: ({ children }) => (
                      <em className="italic">{children}</em>
                    ),
                    a: ({ href, children }) => (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        {children}
                      </a>
                    ),
                    code: ({ children }) => (
                      <code className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono">
                        {children}
                      </code>
                    ),
                    table: ({ children }) => (
                      <div className="overflow-x-auto my-4">
                        <table className="min-w-full border-collapse border border-gray-300 text-xs">
                          {children}
                        </table>
                      </div>
                    ),
                    thead: ({ children }) => (
                      <thead className="bg-gray-50">{children}</thead>
                    ),
                    tbody: ({ children }) => <tbody>{children}</tbody>,
                    tr: ({ children }) => (
                      <tr className="border-b border-gray-200">{children}</tr>
                    ),
                    th: ({ children }) => (
                      <th className="border border-gray-300 px-2 py-1 text-left font-semibold text-gray-900">
                        {children}
                      </th>
                    ),
                    td: ({ children }) => (
                      <td className="border border-gray-300 px-2 py-1 text-gray-700">
                        {children}
                      </td>
                    ),
                  }}
                >
                  {messageContent}
                </ReactMarkdown>
              ) : (
                <p className="whitespace-pre-wrap">{messageContent}</p>
              )}
            </div>
            <p
              className={`text-xs mt-1 ${
                msg.type === 'user' ? 'text-white/70' : 'text-gray-500'
              }`}
            >
              {new Date(msg.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>

          {/* Category Buttons */}
          {categories && categories.length > 0 && (
            <div className="mt-3 space-y-2">
              {categories
                .filter(
                  (category: any) =>
                    category.title &&
                    category.title !== 'HI HI' &&
                    !category.title.match(/^[A-Z\s]+$/) &&
                    category.description &&
                    category.description.length > 10,
                )
                .map((category: any) => (
                  <button
                    key={category.id}
                    onClick={() =>
                      handleCategoryClick(category.id, category.title)
                    }
                    className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors duration-200 hover:shadow-md"
                    disabled={selectedCategory === category.id}
                  >
                    <div className="font-medium text-blue-800 text-sm">
                      📋 {category.title}
                    </div>
                    <div className="text-blue-600 text-xs mt-1">
                      {category.description}
                    </div>
                  </button>
                ))}
            </div>
          )}
        </div>

        {msg.type === 'user' && (
          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center ml-2 flex-shrink-0">
            <PersonIcon style={{ fontSize: '16px', color: 'white' }} />
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      {/* Chatbot trigger icon */}
      <div
        onClick={() => setShowChat(!showChat)}
        className="fixed right-6 bottom-6 w-14 h-14 flex items-center justify-center shadow-lg hover:cursor-pointer bg-gradient-to-br from-blue-500 to-purple-600 rounded-full hover:shadow-xl transition-all duration-300 hover:scale-105 z-50"
      >
        <SmartToyIcon style={{ fontSize: '28px', color: 'white' }} />
        {!isConnected && showChat && hasSelectedLanguage && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
        )}
        {isConnected && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
        )}
      </div>

      {showChat && (
        <div className="fixed right-6 bottom-24 shadow-2xl h-[500px] w-[400px] bg-white rounded-2xl border border-gray-200 overflow-hidden z-50">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <SmartToyIcon style={{ fontSize: '20px' }} />
                </div>
                <div>
                  <h3 className="font-semibold">UniBot</h3>
                  <p className="text-xs opacity-90">
                    {isConnecting
                      ? currentTranslations.connecting
                      : isConnected
                        ? currentTranslations.online
                        : currentTranslations.offline}
                  </p>
                </div>
              </div>

              {/* Language Switcher in Header */}
              {hasSelectedLanguage && (
                <div className="flex items-center gap-1 mr-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`px-2 py-1 rounded text-xs ${
                        lang.code === currentLanguage
                          ? 'bg-white/30 text-white'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }`}
                    >
                      {lang.flag}
                    </button>
                  ))}
                </div>
              )}

              <button
                onClick={() => {
                  setShowChat(false)
                  setChatLog([])
                  setShowLanguageSelection(true)
                  setHasSelectedLanguage(false)
                  if (socketRef.current) {
                    socketRef.current.disconnect()
                    socketRef.current = null
                  }
                }}
                className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
              >
                <CloseIcon style={{ fontSize: '20px' }} />
              </button>
            </div>

            {/* Connection Status */}
            {connectionError && (
              <div className="bg-red-50 border-l-4 border-red-400 p-3">
                <p className="text-red-700 text-sm">{connectionError}</p>
                <button
                  onClick={initializeSocket}
                  className="text-red-600 underline text-sm mt-1"
                >
                  {currentTranslations.retryConnection}
                </button>
              </div>
            )}

            {/* Chat Messages */}
            <div
              ref={chatContainerRef}
              className="flex flex-col flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50"
            >
              {isConnecting && hasSelectedLanguage && (
                <div className="flex items-center justify-center p-4">
                  <CircularProgress size={24} />
                  <span className="ml-2 text-gray-600">
                    {currentTranslations.connecting}
                  </span>
                </div>
              )}

              {/* Language Selection Inside Chat */}
              {showLanguageSelection && !isConnecting && (
                <div className="text-center py-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <LanguageIcon
                      style={{ fontSize: '24px', color: 'white' }}
                    />
                  </div>
                  <h3 className="font-semibold mb-2">
                    {currentTranslations.welcome}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {currentTranslations.selectLanguage}
                  </p>

                  <div className="space-y-2">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageSelect(lang.code)}
                        className="w-full flex items-center justify-start gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        <span className="text-xl">{lang.flag}</span>
                        <span className="font-medium">{lang.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Welcome Screen */}
              {chatLog.length === 0 &&
                !isConnecting &&
                hasSelectedLanguage &&
                !showLanguageSelection && (
                  <div className="text-center py-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <SmartToyIcon
                        style={{ fontSize: '24px', color: 'white' }}
                      />
                    </div>
                    <h3 className="font-semibold mb-2">
                      {currentTranslations.welcome}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {currentTranslations.subtitle}
                    </p>

                    <div className="flex flex-wrap gap-2 justify-center">
                      {currentTranslations.suggestions.map((suggestion) => (
                        <button
                          key={suggestion}
                          onClick={() => setMessage(suggestion)}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs hover:bg-blue-200 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

              {chatLog.map((msg, index) => renderMessage(msg, index))}

              {/* Bot typing indicator */}
              {isBotTyping && (
                <div className="flex justify-start">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-2">
                    <SmartToyIcon
                      style={{ fontSize: '16px', color: 'white' }}
                    />
                  </div>
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm p-3">
                    <p className="text-gray-500 text-sm">
                      {currentTranslations.typing}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            {hasSelectedLanguage && !showLanguageSelection && (
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder={currentTranslations.placeholder}
                    className="flex-1 border border-gray-300 rounded-full py-2 px-4 text-sm focus:outline-none focus:border-blue-500"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={!isConnected}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!isConnected || message.trim() === ''}
                    className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-200"
                  >
                    <SendIcon style={{ fontSize: '16px' }} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default Chatbot
