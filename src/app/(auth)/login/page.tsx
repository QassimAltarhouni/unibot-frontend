'use client'
import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  TextField,
  Button,
  Typography,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  IconButton,
  Divider,
  Card,
  CardContent,
  Alert,
  Avatar,
  Chip,
} from '@mui/material'
import EmailIcon from '@mui/icons-material/Email'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import LockIcon from '@mui/icons-material/Lock'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import SecurityIcon from '@mui/icons-material/Security'
import Link from 'next/link'
import useMutateApi from '@/Hooks/useMutateApi'
import { deleteCookie, setCookie } from 'cookies-next'
import { useAuth } from '@/context/AuthContext'

type TLoginForm = {
  email: string
  password: string
  rememberMe: boolean
}

const initialValues: TLoginForm = {
  email: '',
  password: '',
  rememberMe: false,
}

const LoginPage = () => {
  const { setUserData } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const message = searchParams?.get('message') || null

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: initialValues,
  })

  const [showPassword, setShowPassword] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [animationStage, setAnimationStage] = useState(0)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    // Add longer delay to ensure DOM is ready
    const mountTimer = setTimeout(() => {
      setIsMounted(true)
    }, 100)

    const timer1 = setTimeout(() => setIsVisible(true), 500)
    const timer2 = setTimeout(() => setAnimationStage(1), 1000)
    const timer3 = setTimeout(() => setAnimationStage(2), 1500)
    const timer4 = setTimeout(() => setAnimationStage(3), 2000)

    return () => {
      clearTimeout(mountTimer)
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      clearTimeout(timer4)
    }
  }, [])

  const [loginApi, loginApiLoading] = useMutateApi({
    apiPath: `/sessions/login`,
    method: 'POST',
  })

  const onSubmit = async (data: TLoginForm) => {
    deleteCookie('accessToken')
    deleteCookie('refreshToken')
    const loginApiResponse = await loginApi(data)
    if (loginApiResponse.error === null) {
      setCookie('accessToken', loginApiResponse.data.accessToken)
      setCookie('refreshToken', loginApiResponse.data.refreshToken)
      setUserData(loginApiResponse.data.user)
      router.push('/dashboard')
    }
  }

  // Don't render anything until mounted
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="auth-page min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Simplified Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-pulse"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-pulse"></div>
      </div>

      {/* Simplified Floating Elements */}
      {isVisible && (
        <div className="absolute inset-0 pointer-events-none">
          {animationStage >= 1 && (
            <div className="absolute top-1/4 left-1/4 transition-opacity duration-1000 ease-in-out">
              <AutoAwesomeIcon className="text-yellow-400 text-3xl opacity-70 animate-pulse" />
            </div>
          )}
          {animationStage >= 2 && (
            <div className="absolute top-1/3 right-1/3 transition-opacity duration-1000 ease-in-out">
              <SecurityIcon className="text-blue-400 text-2xl opacity-50 animate-bounce" />
            </div>
          )}
          {animationStage >= 3 && (
            <div className="absolute bottom-1/4 right-1/4 transition-opacity duration-1000 ease-in-out">
              <TrendingUpIcon className="text-purple-400 text-xl opacity-60 animate-pulse" />
            </div>
          )}
        </div>
      )}

      <div className="relative z-10 min-h-screen flex">
        {/* Enhanced Left Branding Column */}
        <div className="hidden lg:flex lg:w-1/2 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800" />

          <div className="relative z-10 flex flex-col justify-between p-12 text-white">
            {/* Top Section */}
            <div>
              {isVisible && (
                <div className="flex items-center gap-4 mb-12 transition-all duration-1000 ease-in-out transform translate-y-0 opacity-100">
                  <Avatar className="bg-white/20 backdrop-blur-sm w-14 h-14 shadow-lg">
                    <SmartToyIcon className="text-white text-3xl" />
                  </Avatar>
                  <div>
                    <Typography variant="h4" className="font-bold">
                      UniBot
                    </Typography>
                    <Typography variant="body1" className="opacity-80">
                      WUST AI Assistant
                    </Typography>
                  </div>
                </div>
              )}
            </div>

            {/* Main Content */}
            {isVisible && (
              <div className="max-w-lg space-y-8 transition-all duration-1200 ease-in-out transform translate-x-0 opacity-100">
                <div className="space-y-6">
                  <Typography
                    variant="h2"
                    className="font-bold leading-tight"
                    sx={{ fontSize: { lg: '3rem', xl: '3.5rem' } }}
                  >
                    Welcome back to your
                    <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent mt-2">
                      AI University Assistant
                    </span>
                  </Typography>
                  <Typography
                    variant="h6"
                    className="opacity-90 leading-relaxed"
                    sx={{ fontSize: '1.25rem', lineHeight: 1.6 }}
                  >
                    Sign in to continue your journey with the most intelligent
                    university assistant. Let UniBot help you achieve academic
                    excellence.
                  </Typography>
                </div>

                {/* Enhanced Stats Cards */}
                <div className="grid grid-cols-2 gap-4">
                  {animationStage >= 1 && (
                    <Card className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 transition-all duration-800 ease-in-out transform scale-100 opacity-100">
                      <Typography className="text-2xl font-bold">
                        24/7
                      </Typography>
                      <Typography variant="caption" className="opacity-70">
                        AI Support
                      </Typography>
                    </Card>
                  )}
                  {animationStage >= 2 && (
                    <Card className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 transition-all duration-800 ease-in-out transform scale-100 opacity-100">
                      <Typography className="text-2xl font-bold">
                        10K+
                      </Typography>
                      <Typography variant="caption" className="opacity-70">
                        Active Students
                      </Typography>
                    </Card>
                  )}
                </div>

                {/* Enhanced Testimonial Card */}
                {animationStage >= 3 && (
                  <Card className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl overflow-hidden transform hover:scale-105 transition-all duration-1000 ease-in-out scale-100 opacity-100">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <Avatar className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg">
                          👩‍🎓
                        </Avatar>
                        <div>
                          <Typography className="font-semibold text-lg">
                            Sarah Chen
                          </Typography>
                          <Typography variant="body2" className="opacity-70">
                            Computer Science Student
                          </Typography>
                        </div>
                      </div>
                      <Typography className="italic leading-relaxed">
                        &ldquo;UniBot has transformed how I manage my university
                        workload. The personalized support and intelligent
                        features have made a real difference!&rdquo;
                      </Typography>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Bottom Section */}
            {isVisible && (
              <div className="flex items-center gap-4 transition-all duration-1500 ease-in-out transform translate-y-0 opacity-100">
                <div className="flex gap-2">
                  <div className="h-2 w-8 rounded-full bg-white"></div>
                  <div className="h-2 w-2 rounded-full bg-white/30"></div>
                  <div className="h-2 w-2 rounded-full bg-white/30"></div>
                </div>
                <Typography variant="body1" className="opacity-70">
                  Trusted by 10,000+ students
                </Typography>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Right Form Column */}
        <div className="flex-1 flex items-center justify-center p-8 lg:p-16">
          {isVisible && (
            <Card className="w-full max-w-lg bg-white/95 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden">
              <CardContent className="p-10 lg:p-12">
                {/* Show message if present */}
                {message && (
                  <Alert
                    severity={message.includes('success') ? 'success' : 'info'}
                    className="mb-6"
                  >
                    {message}
                  </Alert>
                )}

                {/* Form Header */}
                <div className="text-center mb-10">
                  {animationStage >= 1 && (
                    <div className="mb-6 transition-all duration-600 ease-in-out transform scale-100 opacity-100">
                      <Chip
                        label="🔐 Secure Login"
                        className="bg-blue-50 text-blue-600 border-blue-200 px-4 py-2 text-sm font-medium"
                        variant="outlined"
                        sx={{ borderRadius: '20px' }}
                      />
                    </div>
                  )}
                  {animationStage >= 2 && (
                    <div className="transition-all duration-800 ease-in-out transform translate-y-0 opacity-100">
                      <Typography
                        variant="h3"
                        className="text-gray-900 font-bold mb-4"
                        sx={{ fontSize: '2.5rem' }}
                      >
                        Welcome Back
                      </Typography>
                      <Typography
                        variant="h6"
                        className="text-gray-600"
                        sx={{ fontSize: '1.1rem' }}
                      >
                        Enter your credentials to access your account
                      </Typography>
                    </div>
                  )}
                </div>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-8"
                  noValidate
                >
                  {/* Enhanced Email Field */}
                  {animationStage >= 3 && (
                    <div className="transition-all duration-600 ease-in-out transform translate-y-0 opacity-100">
                      <Controller
                        name="email"
                        control={control}
                        rules={{
                          required: 'Email is required',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address format',
                          },
                        }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            id="email-input"
                            label="Email Address"
                            variant="outlined"
                            fullWidth
                            autoComplete="email"
                            error={!!errors.email}
                            helperText={errors.email?.message}
                            className="bg-white"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <EmailIcon className="text-blue-500" />
                                </InputAdornment>
                              ),
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: '16px',
                                fontSize: '1.1rem',
                                padding: '4px',
                                '& input': {
                                  padding: '18px 14px',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                  borderColor: '#3b82f6',
                                  borderWidth: '2px',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline':
                                  {
                                    borderColor: '#3b82f6',
                                    borderWidth: '2px',
                                  },
                              },
                              '& .MuiInputLabel-root': {
                                fontSize: '1.1rem',
                              },
                            }}
                          />
                        )}
                      />
                    </div>
                  )}

                  {/* Enhanced Password Field */}
                  {animationStage >= 3 && (
                    <div className="transition-all duration-800 ease-in-out transform translate-y-0 opacity-100">
                      <Controller
                        name="password"
                        control={control}
                        rules={{
                          required: 'Password is required',
                        }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            id="password-input"
                            label="Password"
                            variant="outlined"
                            fullWidth
                            type={showPassword ? 'text' : 'password'}
                            error={!!errors.password}
                            helperText={errors.password?.message}
                            className="bg-white"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <LockIcon className="text-blue-500" />
                                </InputAdornment>
                              ),
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    onClick={() =>
                                      setShowPassword(!showPassword)
                                    }
                                    edge="end"
                                    className="text-gray-600 hover:text-blue-500 transition-colors duration-200"
                                    type="button"
                                  >
                                    {showPassword ? (
                                      <VisibilityOffIcon />
                                    ) : (
                                      <VisibilityIcon />
                                    )}
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: '16px',
                                fontSize: '1.1rem',
                                padding: '4px',
                                '& input': {
                                  padding: '18px 14px',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                  borderColor: '#3b82f6',
                                  borderWidth: '2px',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline':
                                  {
                                    borderColor: '#3b82f6',
                                    borderWidth: '2px',
                                  },
                              },
                              '& .MuiInputLabel-root': {
                                fontSize: '1.1rem',
                              },
                            }}
                          />
                        )}
                      />
                    </div>
                  )}

                  {/* Enhanced Options Row */}
                  {animationStage >= 3 && (
                    <div className="flex justify-between items-center py-2 transition-all duration-1000 ease-in-out transform scale-100 opacity-100">
                      <Controller
                        name="rememberMe"
                        control={control}
                        render={({ field }) => (
                          <FormControlLabel
                            control={
                              <Checkbox
                                {...field}
                                id="remember-me-checkbox"
                                checked={field.value}
                                className="text-blue-600"
                                sx={{
                                  '& .MuiSvgIcon-root': {
                                    fontSize: '1.5rem',
                                  },
                                }}
                              />
                            }
                            label={
                              <Typography
                                variant="body1"
                                className="text-gray-700 font-medium"
                              >
                                Remember me
                              </Typography>
                            }
                          />
                        )}
                      />

                      <Link
                        href="/reset-password"
                        className="text-blue-600 hover:text-blue-800 text-base font-medium transition-colors duration-200 hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                  )}

                  {/* Enhanced Submit Button */}
                  {animationStage >= 3 && (
                    <div className="transition-all duration-1200 ease-in-out transform scale-100 opacity-100">
                      <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        size="large"
                        disabled={loginApiLoading}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300"
                        endIcon={<ArrowForwardIcon />}
                        sx={{
                          padding: '16px 32px',
                          fontSize: '1.1rem',
                          textTransform: 'none',
                        }}
                      >
                        {loginApiLoading ? 'Signing In...' : 'Sign In'}
                      </Button>
                    </div>
                  )}

                  {/* Enhanced Divider */}
                  {animationStage >= 3 && (
                    <div className="my-8 transition-all duration-1400 ease-in-out opacity-100">
                      <Divider>
                        <Typography
                          variant="body1"
                          className="text-gray-500 px-6 font-medium"
                        >
                          New to UniBot?
                        </Typography>
                      </Divider>
                    </div>
                  )}

                  {/* Enhanced Register Link */}
                  {animationStage >= 3 && (
                    <div className="text-center transition-all duration-1600 ease-in-out transform translate-y-0 opacity-100">
                      <Link href="/register">
                        <Button
                          variant="outlined"
                          fullWidth
                          size="large"
                          className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-blue-300 font-medium rounded-2xl transition-all duration-300 hover:transform hover:scale-[1.02]"
                          sx={{
                            padding: '14px 32px',
                            fontSize: '1.1rem',
                            textTransform: 'none',
                          }}
                        >
                          Create New Account
                        </Button>
                      </Link>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default LoginPage
