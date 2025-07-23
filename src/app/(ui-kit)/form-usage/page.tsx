'use client'
import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  Paper,
  FormHelperText,
  IconButton,
  InputAdornment,
  Alert,
  Divider,
} from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import EmailIcon from '@mui/icons-material/Email'
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
  const [isRegistered, setIsRegistered] = useState(false)

  const [registerApi, registerApiLoading] = useMutateApi({
    apiPath: `/users/create`,
    method: 'POST',
  })

  const password = watch('password')

  const onSubmit = async (data: TRegisterForm) => {
    const registerApiResponse = await registerApi(data)

    if (registerApiResponse.error === null) {
      console.log('Form submitted:', registerApiResponse)
      setIsRegistered(true)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <Paper className="w-full max-w-md p-8 shadow-lg rounded-lg">
        <div className="text-center mb-8">
          <Typography variant="h4" className="text-primary-700 font-bold mb-2">
            Create Account
          </Typography>
          <Typography variant="body2" className="text-gray-600">
            Join us today and start exploring
          </Typography>
        </div>

        {isRegistered ? (
          <Alert severity="success" className="mb-4">
            Registration successful! Check your email to verify your account.
          </Alert>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-y-6"
          >
            {/* First Name Field */}
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
                        <PersonOutlineIcon className="text-gray-500" />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />

            {/* Last Name Field */}
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
                        <PersonOutlineIcon className="text-gray-500" />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />

            {/* Email Field */}
            <Controller
              name="email"
              control={control}
              rules={{
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email Address"
                  variant="outlined"
                  fullWidth
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  className="bg-white"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon className="text-gray-500" />
                      </InputAdornment>
                    ),
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
                  value: 8,
                  message: 'Password must be at least 8 characters',
                },
                pattern: {
                  value:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                  message:
                    'Password must include uppercase, lowercase, number and special character',
                },
              }}
              render={({ field }) => (
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
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          className="text-gray-600"
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
                />
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
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          edge="end"
                          className="text-gray-600"
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
                />
              )}
            />

            {/* Terms and Conditions Checkbox */}
            <Controller
              name="agreeToTerms"
              control={control}
              rules={{ required: 'You must agree to terms and conditions' }}
              render={({ field }) => (
                <div>
                  <FormControlLabel
                    control={
                      <Checkbox
                        {...field}
                        checked={field.value}
                        className="text-primary-600"
                      />
                    }
                    label={
                      <Typography variant="body2" className="text-gray-700">
                        I agree to the Terms of Service and Privacy Policy
                      </Typography>
                    }
                  />
                  {errors.agreeToTerms && (
                    <FormHelperText error>
                      {errors.agreeToTerms.message}
                    </FormHelperText>
                  )}
                </div>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              className="bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-md shadow-md hover:shadow-lg transition-all duration-200"
            >
              Create Account
            </Button>

            <Divider className="my-6">
              <Typography variant="body2" className="text-gray-500 px-2">
                OR
              </Typography>
            </Divider>

            {/* Login Link */}
            <div className="text-center mt-4">
              <Typography variant="body2" className="text-gray-600">
                Already have an account?{' '}
                <a
                  href="#"
                  className="text-primary-600 hover:text-primary-800 font-medium"
                >
                  Sign in
                </a>
              </Typography>
            </div>
          </form>
        )}
      </Paper>
    </div>
  )
}
