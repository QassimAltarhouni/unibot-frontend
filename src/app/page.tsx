'use client'

import { Inter } from 'next/font/google'
import { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Avatar,
  Divider,
  Fade,
  Slide,
  Zoom,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import {
  SmartToy as BotIcon,
  School as SchoolIcon,
  AccessTime as TimeIcon,
  Psychology as AIIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Groups as CommunityIcon,
  ExpandMore as ExpandMoreIcon,
  Star as StarIcon,
  PlayArrow as PlayIcon,
  AutoAwesome as SparkleIcon,
  RocketLaunch as RocketIcon,
} from '@mui/icons-material'
import Link from 'next/link'
import { ChatBot } from '@/UI'

const inter = Inter({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
})

const features = [
  {
    icon: <TimeIcon />,
    title: '24/7 Availability',
    description:
      'Never wait for help. Get instant responses anytime, anywhere with our AI that never sleeps.',
    color: '#667eea',
    bgColor: '#f1f5ff',
  },
  {
    icon: <AIIcon />,
    title: 'AI-Powered Intelligence',
    description:
      'Advanced GPT technology provides accurate, contextual responses tailored to WUST.',
    color: '#f093fb',
    bgColor: '#fef7ff',
  },
  {
    icon: <SchoolIcon />,
    title: 'University Expertise',
    description:
      'Deep knowledge of WUST procedures, policies, and campus life at your fingertips.',
    color: '#4facfe',
    bgColor: '#f0f9ff',
  },
  {
    icon: <SpeedIcon />,
    title: 'Lightning Fast',
    description:
      'Get immediate answers without waiting in queues or office hours.',
    color: '#43e97b',
    bgColor: '#f0fff4',
  },
  {
    icon: <SecurityIcon />,
    title: 'Secure & Private',
    description:
      'Enterprise-grade security ensures your conversations remain confidential.',
    color: '#fa709a',
    bgColor: '#fff5f8',
  },
  {
    icon: <CommunityIcon />,
    title: 'Student Community',
    description:
      'Connect with peers and access collective student knowledge and experiences.',
    color: '#fee140',
    bgColor: '#fffbeb',
  },
]

const faqs = [
  {
    question: 'What is UniBot and how can it help me?',
    answer:
      'UniBot is an intelligent AI assistant specifically designed for WUST students. It can help you with enrollment procedures, course selection, campus navigation, student services, deadlines, and general university policies. Think of it as your personal university guide available 24/7.',
  },
  {
    question: 'How accurate and up-to-date is the information provided?',
    answer:
      'UniBot is continuously updated with the latest university information, policies, and procedures. Our AI is trained on official WUST documentation and is regularly reviewed by university staff to ensure accuracy.',
  },
  {
    question: 'Can UniBot help with course registration and academic planning?',
    answer:
      'Yes! UniBot can guide you through course registration, explain prerequisites, help you understand your degree requirements, and provide information about academic calendars and important deadlines.',
  },
  {
    question: 'Is my conversation with UniBot private and secure?',
    answer:
      'Absolutely. All conversations are encrypted and follow strict privacy protocols. We do not store personal information unless necessary for providing better assistance, and all data handling complies with university privacy policies.',
  },
  {
    question: 'What should I do if UniBot cannot answer my question?',
    answer:
      'If UniBot cannot provide the information you need, it will direct you to the appropriate university department or staff member. You can also use the escalation feature to connect with human support.',
  },
  {
    question: 'Can I access UniBot from my mobile device?',
    answer:
      'Yes, UniBot is fully responsive and works seamlessly on all devices - desktop, tablet, and mobile. You can access it through any web browser without needing to download additional apps.',
  },
]

const testimonials = [
  {
    name: 'Anna Kowalski',
    role: 'Computer Science Student',
    content:
      'UniBot helped me navigate the enrollment process seamlessly. I got answers to all my questions instantly!',
    rating: 5,
    avatar: '👩‍💻',
  },
  {
    name: 'Marco Silva',
    role: 'International Student',
    content:
      'As an international student, UniBot was invaluable for understanding university procedures and campus life.',
    rating: 5,
    avatar: '🌍',
  },
  {
    name: 'Sarah Johnson',
    role: 'Engineering Student',
    content:
      'Quick, accurate, and available anytime. UniBot made my first semester so much easier to manage.',
    rating: 5,
    avatar: '⚡',
  },
]

const stats = [
  { number: '10,000+', label: 'Active Students', icon: '👥' },
  { number: '50,000+', label: 'Questions Answered', icon: '💬' },
  { number: '99.9%', label: 'Uptime', icon: '⚡' },
  { number: '4.9/5', label: 'User Rating', icon: '⭐' },
]

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  useEffect(() => {
    setIsVisible(true)
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`${inter.className} min-h-screen overflow-x-hidden`}>
      <Box className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <Container maxWidth="xl">
          <Box className="flex items-center justify-between h-16">
            <Box className="flex items-center gap-3">
              <Box className="relative">
                <Avatar className="bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg w-10 h-10">
                  <BotIcon className="text-xl" />
                </Avatar>
                <Box className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse" />
              </Box>
              <Box>
                <Typography
                  variant="h6"
                  className="text-gray-900 font-bold text-lg"
                >
                  UniBot
                </Typography>
                <Typography variant="caption" className="text-gray-500 text-xs">
                  WUST AI Assistant
                </Typography>
              </Box>
            </Box>

            <Box className="flex items-center gap-3">
              <Link href="/login">
                <Button
                  variant="outlined"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium"
                  size={isMobile ? 'small' : 'medium'}
                >
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  variant="contained"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg font-medium shadow-lg"
                  size={isMobile ? 'small' : 'medium'}
                >
                  Register
                </Button>
              </Link>
            </Box>
          </Box>
        </Container>
      </Box>

      <Box className="relative min-h-screen flex items-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 pt-16">
        <Box className="absolute inset-0 overflow-hidden">
          <Box className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob" />
          <Box className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-2000" />
          <Box className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-4000" />
        </Box>

        <Container maxWidth="lg" className="relative z-10 py-20">
          <Box className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            <Box>
              <Fade in={isVisible} timeout={1000}>
                <Box className="text-center lg:text-left">
                  <Box className="mb-6">
                    <Chip
                      label="🤖 Powered by Advanced AI"
                      className="bg-white/90 backdrop-blur-sm text-gray-700 border-gray-300 font-medium shadow-sm"
                      variant="outlined"
                      size="medium"
                    />
                  </Box>

                  <Typography
                    variant="h1"
                    className="text-gray-900 font-bold mb-6 leading-tight"
                    sx={{
                      fontSize: {
                        xs: '2.5rem',
                        sm: '3rem',
                        md: '3.5rem',
                        lg: '4rem',
                      },
                    }}
                  >
                    Meet Your{' '}
                    <Box
                      component="span"
                      className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
                      sx={{ display: 'block' }}
                    >
                      Smart University
                    </Box>
                    Assistant
                  </Typography>

                  <Typography
                    variant="h6"
                    className="text-gray-600 mb-8 leading-relaxed max-w-xl"
                    sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
                  >
                    Navigate your WUST journey with confidence. Get instant
                    answers, personalized guidance, and 24/7 support from our
                    intelligent AI assistant.
                  </Typography>

                  <Box className="flex flex-col sm:flex-row gap-4 mb-10 justify-center lg:justify-start">
                    <Link href="/chatbot">
                      <Button
                        variant="contained"
                        size="large"
                        startIcon={<RocketIcon />}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                      >
                        Start Chatting Now
                      </Button>
                    </Link>
                    <Button
                      variant="outlined"
                      size="large"
                      startIcon={<PlayIcon />}
                      className="border-2 border-gray-400 text-gray-700 hover:bg-gray-50 py-3 px-8 rounded-lg font-semibold transition-all duration-300"
                      onClick={() =>
                        document
                          .getElementById('features')
                          ?.scrollIntoView({ behavior: 'smooth' })
                      }
                    >
                      Watch Demo
                    </Button>
                  </Box>

                  <Box className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-lg mx-auto lg:mx-0">
                    {stats.slice(0, isMobile ? 2 : 4).map((stat, index) => (
                      <Box key={index} className="text-center lg:text-left">
                        <Typography className="text-2xl mb-1">
                          {stat.icon}
                        </Typography>
                        <Typography
                          variant="h6"
                          className="font-bold text-gray-900"
                        >
                          {stat.number}
                        </Typography>
                        <Typography variant="body2" className="text-gray-600">
                          {stat.label}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Fade>
            </Box>

            <Box>
              <Slide direction="left" in={isVisible} timeout={1200}>
                <Box className="flex justify-center lg:justify-end">
                  <Card className="bg-white/90 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden max-w-md w-full">
                    <CardContent className="p-8">
                      <Box className="text-center mb-6">
                        <Box className="relative inline-block">
                          <Avatar className="w-24 h-24 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 shadow-2xl mx-auto">
                            <BotIcon className="text-4xl text-white" />
                          </Avatar>
                          <Box className="absolute -top-2 -right-2">
                            <SparkleIcon className="text-yellow-400 animate-bounce text-lg" />
                          </Box>
                        </Box>
                      </Box>

                      <Box className="text-center mb-6">
                        <Typography
                          variant="h5"
                          className="font-bold text-gray-900 mb-2"
                        >
                          Hi! I&apos;m UniBot 👋
                        </Typography>
                        <Typography className="text-gray-600 leading-relaxed">
                          Your personal AI assistant for everything
                          WUST-related. Ask me anything!
                        </Typography>
                      </Box>

                      <Box className="bg-gray-50 rounded-2xl p-4 mb-6">
                        <Box className="space-y-3">
                          <Box className="bg-white rounded-lg p-3 shadow-sm text-right">
                            <Typography
                              variant="body2"
                              className="text-gray-700"
                            >
                              &quot;How do I register for courses?&quot;
                            </Typography>
                          </Box>
                          <Box className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-3">
                            <Typography variant="body2">
                              I&apos;ll guide you through the course
                              registration process step by step! 🎓
                            </Typography>
                          </Box>
                        </Box>
                      </Box>

                      <Box className="flex flex-wrap justify-center gap-2">
                        {[
                          'Course Help',
                          'Campus Info',
                          'Quick Answers',
                          'Study Tips',
                        ].map((tag, index) => (
                          <Chip
                            key={index}
                            label={tag}
                            size="small"
                            className="bg-gradient-to-r from-blue-50 to-purple-50 text-gray-700 border-gray-200"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              </Slide>
            </Box>
          </Box>
        </Container>
      </Box>

      <Box id="features" className="py-20 bg-white">
        <Container maxWidth="lg">
          <Box className="text-center mb-16">
            <Chip
              label="✨ Features"
              className="bg-blue-50 text-blue-600 border-blue-200 mb-6"
              variant="outlined"
            />
            <Typography
              variant="h2"
              className="text-gray-900 font-bold mb-4"
              sx={{ fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }}
            >
              Why Students Love UniBot
            </Typography>
            <Typography
              variant="h6"
              className="text-gray-600 max-w-2xl mx-auto leading-relaxed"
            >
              Discover how our AI-powered assistant transforms the university
              experience with intelligent, personalized support
            </Typography>
          </Box>

          <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Zoom key={index} in={isVisible} timeout={1000 + index * 200}>
                <Card className="h-full bg-white hover:bg-gray-50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-0 shadow-lg rounded-2xl overflow-hidden group">
                  <CardContent className="p-6 text-center">
                    <Box
                      className="w-16 h-16 rounded-2xl mb-6 flex items-center justify-center text-2xl transition-all duration-300 group-hover:scale-110 mx-auto"
                      sx={{
                        backgroundColor: feature.bgColor,
                        color: feature.color,
                      }}
                    >
                      {feature.icon}
                    </Box>

                    <Typography
                      variant="h6"
                      className="font-bold text-gray-900 mb-3"
                    >
                      {feature.title}
                    </Typography>

                    <Typography className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Zoom>
            ))}
          </Box>
        </Container>
      </Box>

      <Box className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <Container maxWidth="lg">
          <Box className="text-center mb-16">
            <Chip
              label="💬 Testimonials"
              className="bg-white text-gray-700 border-gray-200 mb-6 shadow-sm"
              variant="outlined"
            />
            <Typography
              variant="h2"
              className="text-gray-900 font-bold mb-4"
              sx={{ fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }}
            >
              Loved by WUST Students
            </Typography>
            <Typography variant="h6" className="text-gray-600">
              Join thousands of satisfied students across campus
            </Typography>
          </Box>

          <Box className="relative max-w-3xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Fade
                key={index}
                in={currentTestimonial === index}
                timeout={500}
                style={{
                  position:
                    currentTestimonial === index ? 'relative' : 'absolute',
                  width: '100%',
                }}
              >
                <Card className="bg-white shadow-xl border-0 rounded-3xl overflow-hidden">
                  <CardContent className="p-8 sm:p-12 text-center">
                    <Box className="text-5xl mb-6">{testimonial.avatar}</Box>

                    <Box className="flex justify-center gap-1 mb-6">
                      {Array.from({ length: testimonial.rating }).map(
                        (_, i) => (
                          <StarIcon
                            key={i}
                            className="text-yellow-400 text-xl"
                          />
                        ),
                      )}
                    </Box>

                    <Typography
                      variant="h6"
                      className="text-gray-800 mb-6 font-light italic leading-relaxed"
                    >
                      &ldquo;{testimonial.content}&rdquo;
                    </Typography>

                    <Typography
                      variant="h6"
                      className="font-bold text-gray-900 mb-1"
                    >
                      {testimonial.name}
                    </Typography>
                    <Typography className="text-gray-600">
                      {testimonial.role}
                    </Typography>
                  </CardContent>
                </Card>
              </Fade>
            ))}

            <Box className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <Box
                  key={index}
                  className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${
                    currentTestimonial === index
                      ? 'bg-blue-500 w-8'
                      : 'bg-gray-300'
                  }`}
                  onClick={() => setCurrentTestimonial(index)}
                />
              ))}
            </Box>
          </Box>
        </Container>
      </Box>

      <Box className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <Container maxWidth="md">
          <Box className="text-center text-white">
            <Box className="text-5xl mb-6">🚀</Box>
            <Typography
              variant="h2"
              className="font-bold mb-6"
              sx={{ fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }}
            >
              Ready to Transform Your University Experience?
            </Typography>
            <Typography
              variant="h6"
              className="mb-8 opacity-90 max-w-xl mx-auto leading-relaxed"
            >
              Join the thousands of WUST students who are already using UniBot
              to succeed in their academic journey
            </Typography>

            <Box className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/chatbot">
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<BotIcon />}
                  className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  Start Chatting Now
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  variant="outlined"
                  size="large"
                  className="border-2 border-white text-white hover:bg-white/10 py-4 px-8 rounded-lg font-semibold transition-all duration-300"
                >
                  Create Free Account
                </Button>
              </Link>
            </Box>
          </Box>
        </Container>
      </Box>

      <Box id="faq" className="py-20 bg-white">
        <Container maxWidth="md">
          <Box className="text-center mb-16">
            <Chip
              label="❓ FAQ"
              className="bg-gray-50 text-gray-700 border-gray-200 mb-6"
              variant="outlined"
            />
            <Typography
              variant="h2"
              className="text-gray-900 font-bold mb-4"
              sx={{ fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }}
            >
              Frequently Asked Questions
            </Typography>
            <Typography variant="h6" className="text-gray-600">
              Everything you need to know about UniBot
            </Typography>
          </Box>

          <Box className="space-y-4">
            {faqs.map((faq, index) => (
              <Accordion
                key={index}
                className="shadow-sm hover:shadow-md transition-all duration-300 border-0 rounded-2xl overflow-hidden"
                elevation={0}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon className="text-gray-500" />}
                  className="bg-gray-50 hover:bg-gray-100 transition-colors duration-300 px-6 py-4"
                >
                  <Typography className="font-semibold text-gray-900 text-lg">
                    {faq.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails className="bg-white border-t border-gray-100 px-6 py-4">
                  <Typography className="text-gray-700 leading-relaxed">
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Container>
      </Box>

      <Box className="bg-gray-900 text-white py-16">
        <Container maxWidth="lg">
          <Box className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <Box>
              <Box className="flex items-center gap-4 mb-6">
                <Avatar className="bg-gradient-to-br from-blue-500 to-purple-600 w-12 h-12">
                  <BotIcon />
                </Avatar>
                <Box>
                  <Typography variant="h5" className="font-bold">
                    UniBot
                  </Typography>
                  <Typography className="text-gray-400">
                    WUST AI Assistant
                  </Typography>
                </Box>
              </Box>

              <Typography className="text-gray-400 mb-8 max-w-md leading-relaxed">
                Empowering students at Wrocław University of Science and
                Technology with intelligent assistance, personalized guidance,
                and 24/7 support.
              </Typography>

              <Box className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-md">
                {stats.map((stat, index) => (
                  <Box key={index} className="text-center">
                    <Typography className="text-xl mb-1">
                      {stat.icon}
                    </Typography>
                    <Typography className="font-bold text-white text-sm">
                      {stat.number}
                    </Typography>
                    <Typography variant="caption" className="text-gray-400">
                      {stat.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            <Box>
              <Box className="grid grid-cols-3 gap-12">
                <Box>
                  <Typography variant="h6" className="font-bold mb-4">
                    Product
                  </Typography>
                  <Box className="space-y-3">
                    <Link
                      href="/chatbot"
                      className="block text-gray-400 hover:text-white transition-colors"
                    >
                      Chat with UniBot
                    </Link>
                    <Link
                      href="/features"
                      className="block text-gray-400 hover:text-white transition-colors"
                    >
                      Features
                    </Link>
                    <Link
                      href="/pricing"
                      className="block text-gray-400 hover:text-white transition-colors"
                    >
                      Pricing
                    </Link>
                  </Box>
                </Box>

                <Box>
                  <Typography variant="h6" className="font-bold mb-4">
                    Support
                  </Typography>
                  <Box className="space-y-3">
                    <Typography className="text-gray-400">
                      Available 24/7
                    </Typography>
                    <Typography className="text-gray-400">
                      AI-Powered Help
                    </Typography>
                    <Typography className="text-gray-400">
                      University Expert
                    </Typography>
                  </Box>
                </Box>

                <Box>
                  <Typography variant="h6" className="font-bold mb-4">
                    Account
                  </Typography>
                  <Box className="space-y-3">
                    <Link
                      href="/login"
                      className="block text-gray-400 hover:text-white transition-colors"
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="block text-gray-400 hover:text-white transition-colors"
                    >
                      Register
                    </Link>
                    <Link
                      href="/dashboard"
                      className="block text-gray-400 hover:text-white transition-colors"
                    >
                      Dashboard
                    </Link>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>

          <Divider className="my-8 bg-gray-700" />

          <Box className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <Typography className="text-gray-400 text-center sm:text-left">
              © {new Date().getFullYear()} UniBot - Wrocław University of
              Science and Technology. All rights reserved.
            </Typography>
            <Box className="flex gap-6">
              <Link
                href="/privacy"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Terms of Service
              </Link>
            </Box>
          </Box>
        </Container>
      </Box>

      <ChatBot />

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}
