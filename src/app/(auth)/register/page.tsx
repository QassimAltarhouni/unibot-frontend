'use client'
import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import {
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  FormControlLabel,
  Checkbox,
  Divider,
  FormHelperText,
  Card,
  CardContent,
  Avatar,
  Chip,
  LinearProgress,
} from '@mui/material'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import EmailIcon from '@mui/icons-material/Email'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import StarIcon from '@mui/icons-material/Star'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import Link from 'next/link'
import useMutateApi from '@/Hooks/useMutateApi'

type TRegisterForm = {
  firstName: string
  lastName: string
  email: string
  password: string
  passwordConfirmation: string
  agreeToTerms: boolean
}

const initialValues: TRegisterForm = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  passwordConfirmation: '',
  agreeToTerms: false,
}

export default function RegisterPage() {
  const router = useRouter()

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: initialValues,
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    setTimeout(() => setIsVisible(true), 100)
  }, [])

  const [registerApi, registerApiLoading] = useMutateApi({
    apiPath: `/users/create`,
    method: 'POST',
  })

  const password = watch('password')

  const getPasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength += 20
    if (password.match(/[a-z]/)) strength += 20
    if (password.match(/[A-Z]/)) strength += 20
    if (password.match(/[0-9]/)) strength += 20
    if (password.match(/[^a-zA-Z0-9]/)) strength += 20
    return strength
  }

  const passwordStrength = getPasswordStrength(password || '')

  const getStrengthColor = (strength: number) => {
    if (strength < 40) return 'error'
    if (strength < 80) return 'warning'
    return 'success'
  }

  const getStrengthText = (strength: number) => {
    if (strength < 40) return 'Weak'
    if (strength < 80) return 'Medium'
    return 'Strong'
  }

  const onSubmit = async (data: TRegisterForm) => {
    const registerApiResponse = await registerApi(data)
    if (registerApiResponse.error === null) {
      router.push('/login')
    }
  }

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="auth-page min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-pulse" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-pulse" />
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-pulse" />
      </div>

      {/* Floating Elements */}
      {isVisible && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 animate-bounce">
            <StarIcon className="text-green-400 text-2xl opacity-60" />
          </div>
          <div className="absolute top-1/3 right-1/3 animate-pulse">
            <StarIcon className="text-blue-400 text-xl opacity-40" />
          </div>
          <div className="absolute bottom-1/4 right-1/4 animate-bounce">
            <StarIcon className="text-purple-400 text-lg opacity-50" />
          </div>
        </div>
      )}

      <div className="relative z-10 min-h-screen flex">
        {/* Left Branding Column */}
        <div className="hidden lg:flex lg:w-1/2 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-blue-600 to-purple-700" />

          <div className="relative z-10 flex flex-col justify-between p-12 text-white">
            {/* Top Section */}
            <div>
              {isVisible && (
                <div className="flex items-center gap-4 mb-12">
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
              <div className="max-w-lg space-y-8">
                <div className="space-y-6">
                  <Typography
                    variant="h2"
                    className="font-bold leading-tight"
                    sx={{ fontSize: { lg: '3rem', xl: '3.5rem' } }}
                  >
                    Join the
                    <span className="block bg-gradient-to-r from-yellow-300 to-green-300 bg-clip-text text-transparent mt-2">
                      Intelligent University Assistant
                    </span>
                  </Typography>
                  <Typography
                    variant="h6"
                    className="opacity-90 leading-relaxed"
                    sx={{ fontSize: '1.25rem', lineHeight: 1.6 }}
                  >
                    Create an account to get access to the most helpful AI
                    assistant for university students. Get answers, manage your
                    schedule, and excel in your studies.
                  </Typography>
                </div>

                {/* Feature Cards */}
                <div className="grid grid-cols-1 gap-4">
                  <Card className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-400 rounded-lg flex items-center justify-center">
                        <CheckCircleIcon className="text-white" />
                      </div>
                      <div>
                        <Typography className="font-semibold text-lg">
                          24/7 AI Support
                        </Typography>
                        <Typography variant="body2" className="opacity-70">
                          Get instant answers anytime
                        </Typography>
                      </div>
                    </div>
                  </Card>

                  <Card className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-400 rounded-lg flex items-center justify-center">
                        <CheckCircleIcon className="text-white" />
                      </div>
                      <div>
                        <Typography className="font-semibold text-lg">
                          University Expert
                        </Typography>
                        <Typography variant="body2" className="opacity-70">
                          WUST-specific knowledge base
                        </Typography>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Testimonial */}
                <Card className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar className="w-14 h-14 bg-gradient-to-br from-green-400 to-blue-500 shadow-lg">
                        👨‍💻
                      </Avatar>
                      <div>
                        <Typography className="font-semibold text-lg">
                          Alex Johnson
                        </Typography>
                        <Typography variant="body2" className="opacity-70">
                          Computer Science Student
                        </Typography>
                      </div>
                    </div>
                    <Typography className="italic leading-relaxed">
                      &ldquo;UniBot has completely transformed my university
                      experience. It helps me stay organized and get answers to
                      complex questions instantly!&rdquo;
                    </Typography>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Bottom Section */}
            {isVisible && (
              <div className="flex items-center gap-4">
                <div className="flex gap-2">
                  <div className="h-2 w-8 rounded-full bg-white"></div>
                  <div className="h-2 w-2 rounded-full bg-white/30"></div>
                  <div className="h-2 w-2 rounded-full bg-white/30"></div>
                </div>
                <Typography variant="body1" className="opacity-70">
                  Join 10,000+ students
                </Typography>
              </div>
            )}
          </div>
        </div>

        {/* Right Form Column */}
        <div className="flex-1 flex items-center justify-center p-8 lg:p-16">
          {isVisible && (
            <Card className="w-full max-w-lg bg-white/95 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden">
              <CardContent className="p-10 lg:p-12">
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="mb-6">
                    <Chip
                      label="🚀 Join UniBot"
                      className="bg-green-50 text-green-600 border-green-200 px-4 py-2 text-sm font-medium"
                      variant="outlined"
                      sx={{ borderRadius: '20px' }}
                    />
                  </div>
                  <Typography
                    variant="h3"
                    className="text-gray-900 font-bold mb-4"
                    sx={{ fontSize: '2.5rem' }}
                  >
                    Create Account
                  </Typography>
                  <Typography
                    variant="h6"
                    className="text-gray-600"
                    sx={{ fontSize: '1.1rem' }}
                  >
                    Join UniBot to enhance your university experience
                  </Typography>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Name Fields Row */}
                  <div className="grid grid-cols-2 gap-4">
                    <Controller
                      name="firstName"
                      control={control}
                      rules={{
                        required: 'First name is required',
                        minLength: {
                          value: 2,
                          message: 'First name must be at least 2 characters',
                        },
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="First Name"
                          variant="outlined"
                          fullWidth
                          error={!!errors.firstName}
                          helperText={errors.firstName?.message}
                          className="bg-white"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <PersonOutlineIcon className="text-green-500" />
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '16px',
                              fontSize: '1.1rem',
                              '& input': {
                                padding: '16px 14px',
                              },
                              '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#10b981',
                                borderWidth: '2px',
                              },
                              '&.Mui-focused .MuiOutlinedInput-notchedOutline':
                                {
                                  borderColor: '#10b981',
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

                    <Controller
                      name="lastName"
                      control={control}
                      rules={{
                        required: 'Last name is required',
                        minLength: {
                          value: 2,
                          message: 'Last name must be at least 2 characters',
                        },
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Last Name"
                          variant="outlined"
                          fullWidth
                          error={!!errors.lastName}
                          helperText={errors.lastName?.message}
                          className="bg-white"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <PersonOutlineIcon className="text-green-500" />
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '16px',
                              fontSize: '1.1rem',
                              '& input': {
                                padding: '16px 14px',
                              },
                              '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#10b981',
                                borderWidth: '2px',
                              },
                              '&.Mui-focused .MuiOutlinedInput-notchedOutline':
                                {
                                  borderColor: '#10b981',
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

                  {/* Email Field */}
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
                        label="Email Address"
                        variant="outlined"
                        fullWidth
                        autoComplete="email"
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        className="bg-white mb-4"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailIcon className="text-green-500" />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '16px',
                            fontSize: '1.1rem',
                            marginBottom: '1rem',
                            '& input': {
                              padding: '16px 14px',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#10b981',
                              borderWidth: '2px',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#10b981',
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

                  {/* Password Field */}
                  <Controller
                    name="password"
                    control={control}
                    rules={{
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters',
                      },
                    }}
                    render={({ field }) => (
                      <div>
                        <TextField
                          {...field}
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
                                <div className="text-green-500">🔒</div>
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => setShowPassword(!showPassword)}
                                  edge="end"
                                  className="text-gray-600 hover:text-green-500 transition-colors duration-200"
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
                              '& input': {
                                padding: '16px 14px',
                              },
                              '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#10b981',
                                borderWidth: '2px',
                              },
                              '&.Mui-focused .MuiOutlinedInput-notchedOutline':
                                {
                                  borderColor: '#10b981',
                                  borderWidth: '2px',
                                },
                            },
                            '& .MuiInputLabel-root': {
                              fontSize: '1.1rem',
                            },
                          }}
                        />
                        {password && (
                          <div className="mt-2 px-1">
                            <div className="flex justify-between items-center mb-2">
                              <Typography
                                variant="caption"
                                className="text-gray-600 font-medium"
                              >
                                Password Strength
                              </Typography>
                              <Typography
                                variant="caption"
                                className={`font-semibold ${
                                  passwordStrength < 40
                                    ? 'text-red-500'
                                    : passwordStrength < 80
                                      ? 'text-yellow-500'
                                      : 'text-green-500'
                                }`}
                              >
                                {getStrengthText(passwordStrength)}
                              </Typography>
                            </div>
                            <LinearProgress
                              variant="determinate"
                              value={passwordStrength}
                              color={getStrengthColor(passwordStrength)}
                              className="h-2 rounded-full"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  />

                  {/* Confirm Password Field */}
                  <Controller
                    name="passwordConfirmation"
                    control={control}
                    rules={{
                      required: 'Please confirm your password',
                      validate: (value) =>
                        value === password || 'Passwords do not match',
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Confirm Password"
                        variant="outlined"
                        fullWidth
                        type={showConfirmPassword ? 'text' : 'password'}
                        error={!!errors.passwordConfirmation}
                        helperText={errors.passwordConfirmation?.message}
                        className="bg-white"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <div className="text-green-500">🔒</div>
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() =>
                                  setShowConfirmPassword(!showConfirmPassword)
                                }
                                edge="end"
                                className="text-gray-600 hover:text-green-500 transition-colors duration-200"
                                type="button"
                              >
                                {showConfirmPassword ? (
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
                            '& input': {
                              padding: '16px 14px',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#10b981',
                              borderWidth: '2px',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#10b981',
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

                  {/* Terms and Conditions */}
                  <Controller
                    name="agreeToTerms"
                    control={control}
                    rules={{
                      required: 'You must agree to terms and conditions',
                    }}
                    render={({ field }) => (
                      <div className="py-2">
                        <FormControlLabel
                          control={
                            <Checkbox
                              {...field}
                              checked={field.value}
                              className="text-green-600"
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
                              I agree to the{' '}
                              <Link
                                href="/terms"
                                className="text-green-600 hover:text-green-800 underline"
                              >
                                Terms of Service
                              </Link>{' '}
                              and{' '}
                              <Link
                                href="/privacy"
                                className="text-green-600 hover:text-green-800 underline"
                              >
                                Privacy Policy
                              </Link>
                            </Typography>
                          }
                        />
                        {errors.agreeToTerms && (
                          <FormHelperText error className="ml-8">
                            {errors.agreeToTerms.message}
                          </FormHelperText>
                        )}
                      </div>
                    )}
                  />

                  {/* Submit Button */}
                  <div className="pt-4">
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      size="large"
                      disabled={registerApiLoading}
                      className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300"
                      endIcon={<ArrowForwardIcon />}
                      sx={{
                        padding: '16px 32px',
                        fontSize: '1.1rem',
                        textTransform: 'none',
                      }}
                    >
                      {registerApiLoading
                        ? 'Creating Account...'
                        : 'Create Account'}
                    </Button>
                  </div>

                  {/* Divider */}
                  <div className="my-8">
                    <Divider>
                      <Typography
                        variant="body1"
                        className="text-gray-500 px-6 font-medium"
                      >
                        Already have an account?
                      </Typography>
                    </Divider>
                  </div>

                  {/* Login Link */}
                  <div className="text-center">
                    <Link href="/login">
                      <Button
                        variant="outlined"
                        fullWidth
                        size="large"
                        className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-green-300 font-medium rounded-2xl transition-all duration-300 hover:transform hover:scale-[1.02]"
                        sx={{
                          padding: '14px 32px',
                          fontSize: '1.1rem',
                          textTransform: 'none',
                        }}
                      >
                        Sign In Instead
                      </Button>
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
