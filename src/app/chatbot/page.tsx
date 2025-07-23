'use client'
import { useState, useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import PersonIcon from '@mui/icons-material/Person'
import SendIcon from '@mui/icons-material/Send'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import LanguageIcon from '@mui/icons-material/Language'
import CircularProgress from '@mui/material/CircularProgress'
import ReactMarkdown from 'react-markdown'
import Link from 'next/link'
import {
  Box,
  Container,
  Typography,
  Paper,
  Avatar,
  Chip,
  Button,
} from '@mui/material'

interface ChatMessage {
  userId: string
  text: string
  username: string
  timestamp: number
  type: 'user' | 'bot'
  messageId: string
  replyTo?: string
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
      "I'm your intelligent assistant for Wrocław University of Science and Technology. Ask me anything about university procedures, courses, or campus life!",
    connecting: 'Connecting to UniBot...',
    typing: 'UniBot is typing...',
    placeholder: 'Type your message...',
    backToHome: 'Back to Home',
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
    selectLanguage: 'Choose your preferred language:',
    languageSelected: 'Language changed to',
  },
  pl: {
    welcome: 'Witamy w UniBot! 👋',
    subtitle:
      'Jestem Twoim inteligentnym asystentem Politechniki Wrocławskiej. Zapytaj mnie o procedury uniwersyteckie, kursy lub życie kampusowe!',
    connecting: 'Łączenie z UniBot...',
    typing: 'UniBot pisze...',
    placeholder: 'Wpisz swoją wiadomość...',
    backToHome: 'Powrót do strony głównej',
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
    selectLanguage: 'Wybierz preferowany język:',
    languageSelected: 'Język zmieniony na',
  },
  es: {
    welcome: '¡Bienvenido a UniBot! 👋',
    subtitle:
      'Soy tu asistente inteligente para la Universidad de Ciencia y Tecnología de Wrocław. ¡Pregúntame sobre procedimientos universitarios, cursos o vida en el campus!',
    connecting: 'Conectando con UniBot...',
    typing: 'UniBot está escribiendo...',
    placeholder: 'Escribe tu mensaje...',
    backToHome: 'Volver al inicio',
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
    selectLanguage: 'Elige tu idioma preferido:',
    languageSelected: 'Idioma cambiado a',
  },
}

export default function ChatbotPage() {
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
  const userId = useRef(
    `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  )
  const username = useRef('Student')

  const currentTranslations =
    translations[currentLanguage as keyof typeof translations]

  // Auto-scroll to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [chatLog, isBotTyping])

  // Initialize socket connection after language is selected
  useEffect(() => {
    if (hasSelectedLanguage) {
      initializeSocket()
    }
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [hasSelectedLanguage])

  const handleLanguageSelect = (languageCode: string) => {
    setCurrentLanguage(languageCode)
    setShowLanguageSelection(false)
    setHasSelectedLanguage(true)
  }

  const handleLanguageChange = (languageCode: string) => {
    const oldLanguage = currentLanguage
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
    if (socketRef.current?.connected) return

    setIsConnecting(true)
    setConnectionError(null)

    socketRef.current = io(
      process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000',
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

    socket.on('chatbot_message', (messageData) => {
      setChatLog((prev) => [...prev, messageData])
      setIsBotTyping(false)
    })

    socket.on('message_sent', (messageData) => {
      setChatLog((prev) => [...prev, messageData])
    })

    socket.on('bot_typing', (data) => {
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
        className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
      >
        {msg.type === 'bot' && (
          <Avatar
            className="bg-gradient-to-br from-blue-500 to-purple-600 mr-3 flex-shrink-0"
            sx={{ width: 40, height: 40 }}
          >
            <SmartToyIcon style={{ fontSize: '20px', color: 'white' }} />
          </Avatar>
        )}

        <div className="max-w-[75%]">
          <Paper
            elevation={1}
            className={`p-4 ${
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
            <Typography
              variant="caption"
              className={`mt-2 block ${
                msg.type === 'user' ? 'text-white/70' : 'text-gray-500'
              }`}
            >
              {new Date(msg.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Typography>
          </Paper>

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
                  <Paper
                    key={category.id}
                    className="p-3 cursor-pointer hover:bg-blue-50 transition-colors duration-200 border border-blue-200"
                    onClick={() =>
                      handleCategoryClick(category.id, category.title)
                    }
                    elevation={0}
                  >
                    <Typography className="font-medium text-blue-800 text-sm">
                      📋 {category.title}
                    </Typography>
                    <Typography className="text-blue-600 text-xs mt-1">
                      {category.description}
                    </Typography>
                  </Paper>
                ))}
            </div>
          )}
        </div>

        {msg.type === 'user' && (
          <Avatar
            className="bg-gray-600 ml-3 flex-shrink-0"
            sx={{ width: 40, height: 40 }}
          >
            <PersonIcon style={{ fontSize: '20px', color: 'white' }} />
          </Avatar>
        )}
      </div>
    )
  }

  return (
    <Box className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <Paper
        elevation={0}
        className="bg-white/80 backdrop-blur-sm border-b border-gray-200"
      >
        <Container maxWidth="lg">
          <Box className="flex items-center justify-between py-4">
            <Box className="flex items-center gap-4">
              <Link href="/">
                <Box className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                  <ArrowBackIcon className="text-gray-600" />
                  <Typography variant="body2" className="text-gray-600">
                    {currentTranslations.backToHome}
                  </Typography>
                </Box>
              </Link>

              <Box className="flex items-center gap-3">
                <Avatar className="bg-gradient-to-br from-blue-500 to-purple-600">
                  <SmartToyIcon style={{ fontSize: '24px', color: 'white' }} />
                </Avatar>
                <Box>
                  <Typography variant="h6" className="font-bold">
                    UniBot
                  </Typography>
                  <Box className="flex items-center gap-2">
                    <Chip
                      label={
                        isConnecting
                          ? currentTranslations.connecting
                          : isConnected
                            ? currentTranslations.online
                            : currentTranslations.offline
                      }
                      size="small"
                      color={isConnected ? 'success' : 'default'}
                      variant="outlined"
                    />
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Language Switcher in Header */}
            {hasSelectedLanguage && (
              <Box className="flex items-center gap-2">
                {languages.map((lang) => (
                  <Button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    variant={
                      lang.code === currentLanguage ? 'contained' : 'outlined'
                    }
                    size="small"
                    className="min-w-0 px-2"
                    startIcon={<span>{lang.flag}</span>}
                  >
                    {lang.code.toUpperCase()}
                  </Button>
                ))}
              </Box>
            )}

            <Typography variant="body2" className="text-gray-600">
              WUST AI Assistant
            </Typography>
          </Box>
        </Container>
      </Paper>

      {/* Main Chat Area */}
      <Container maxWidth="lg" className="py-6">
        <Paper
          elevation={2}
          className="h-[calc(100vh-200px)] flex flex-col bg-white/90 backdrop-blur-sm"
        >
          {/* Connection Error */}
          {connectionError && (
            <Box className="bg-red-50 border-l-4 border-red-400 p-4 m-4">
              <Typography className="text-red-700 text-sm">
                {connectionError}
              </Typography>
              <button
                onClick={initializeSocket}
                className="text-red-600 underline text-sm mt-1"
              >
                {currentTranslations.retryConnection}
              </button>
            </Box>
          )}

          {/* Chat Messages */}
          <Box ref={chatContainerRef} className="flex-1 p-6 overflow-y-auto">
            {isConnecting && (
              <Box className="flex items-center justify-center p-8">
                <CircularProgress size={32} />
                <Typography className="ml-3 text-gray-600">
                  {currentTranslations.connecting}
                </Typography>
              </Box>
            )}

            {/* Language Selection Inside Chat */}
            {showLanguageSelection && !isConnecting && (
              <Box className="text-center py-8">
                <Avatar
                  className="bg-gradient-to-br from-blue-500 to-purple-600 mx-auto mb-4"
                  sx={{ width: 80, height: 80 }}
                >
                  <LanguageIcon style={{ fontSize: '40px', color: 'white' }} />
                </Avatar>
                <Typography variant="h5" className="font-bold mb-2">
                  Welcome to UniBot! 👋
                </Typography>
                <Typography className="text-gray-600 mb-6">
                  Choose your preferred language / Wybierz język / Elige tu
                  idioma
                </Typography>

                <Box className="flex flex-col gap-3 max-w-sm mx-auto">
                  {languages.map((lang) => (
                    <Button
                      key={lang.code}
                      onClick={() => handleLanguageSelect(lang.code)}
                      variant="outlined"
                      fullWidth
                      className="p-4 text-left justify-start hover:bg-blue-50"
                      startIcon={<span className="text-2xl">{lang.flag}</span>}
                    >
                      <Typography variant="h6">{lang.name}</Typography>
                    </Button>
                  ))}
                </Box>
              </Box>
            )}

            {/* Welcome Screen */}
            {chatLog.length === 0 &&
              !isConnecting &&
              hasSelectedLanguage &&
              !showLanguageSelection && (
                <Box className="text-center py-12">
                  <Avatar
                    className="bg-gradient-to-br from-blue-500 to-purple-600 mx-auto mb-4"
                    sx={{ width: 80, height: 80 }}
                  >
                    <SmartToyIcon
                      style={{ fontSize: '40px', color: 'white' }}
                    />
                  </Avatar>
                  <Typography variant="h5" className="font-bold mb-2">
                    {currentTranslations.welcome}
                  </Typography>
                  <Typography className="text-gray-600 mb-6 max-w-md mx-auto">
                    {currentTranslations.subtitle}
                  </Typography>
                  <Box className="flex flex-wrap justify-center gap-2">
                    {currentTranslations.suggestions.map((suggestion) => (
                      <Chip
                        key={suggestion}
                        label={suggestion}
                        onClick={() => setMessage(suggestion)}
                        className="cursor-pointer hover:bg-blue-50"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>
              )}

            {chatLog.map((msg, index) => renderMessage(msg, index))}

            {/* Bot Typing Indicator */}
            {isBotTyping && (
              <div className="flex justify-start mb-4">
                <Avatar
                  className="bg-gradient-to-br from-blue-500 to-purple-600 mr-3"
                  sx={{ width: 40, height: 40 }}
                >
                  <SmartToyIcon style={{ fontSize: '20px', color: 'white' }} />
                </Avatar>
                <Paper
                  elevation={1}
                  className="bg-white border border-gray-200 p-4"
                >
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                      style={{ animationDelay: '0.1s' }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                      style={{ animationDelay: '0.2s' }}
                    ></div>
                    <Typography
                      variant="caption"
                      className="ml-2 text-gray-500"
                    >
                      {currentTranslations.typing}
                    </Typography>
                  </div>
                </Paper>
              </div>
            )}
          </Box>

          {/* Input Area */}
          <Box className="p-6 border-t border-gray-200 bg-gray-50/50">
            <Box className="flex items-center gap-3">
              <input
                type="text"
                placeholder={currentTranslations.placeholder}
                className="flex-1 border border-gray-300 rounded-full py-3 px-4 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={!isConnected}
              />
              <button
                onClick={handleSendMessage}
                disabled={!isConnected || message.trim() === ''}
                className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                <SendIcon style={{ fontSize: '20px' }} />
              </button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}
