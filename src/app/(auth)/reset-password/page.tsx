'use client'
import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import {
  TextField,
  Button,
  Typography,
  Paper,
  InputAdornment,
  Alert,
  Divider,
} from '@mui/material'
import EmailIcon from '@mui/icons-material/Email'
import Link from 'next/link'
import useMutateApi from '@/Hooks/useMutateApi'

type TForgotPasswordForm = {
  email: string
}

const initialValues: TForgotPasswordForm = {
  email: '',
}

export default function ForgotPasswordPage() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: initialValues,
  })

  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const [forgotPasswordApi, forgotPasswordApiLoading] = useMutateApi({
    apiPath: `/users/forgotpassword`,
    method: 'POST',
  })

  const onSubmit = async (data: TForgotPasswordForm) => {
    setErrorMessage(null)

    try {
      const response = await forgotPasswordApi({
        email: data.email,
      })

      if (response.error === null) {
        setIsSubmitted(true)
      } else {
        setErrorMessage(response.error.message || 'Failed to process request')
      }
    } catch (error) {
      setErrorMessage('An unexpected error occurred')
      console.error(error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <Paper className="w-full max-w-md p-8 shadow-lg rounded-lg">
        <div className="text-center mb-8">
          <Typography variant="h4" className="text-primary-700 font-bold mb-2">
            Forgot Password
          </Typography>
          <Typography variant="body2" className="text-gray-600">
            Enter your email to reset your password
          </Typography>
        </div>

        {isSubmitted ? (
          <div className="text-center">
            <Alert severity="success" className="mb-6">
              Password reset link sent! Check your email for instructions.
            </Alert>
            <Link
              href="/login"
              className="text-primary-600 hover:text-primary-800 font-medium"
            >
              Back to login
            </Link>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-y-6"
          >
            {errorMessage && (
              <Alert severity="error" className="mb-4">
                {errorMessage}
              </Alert>
            )}

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

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              disabled={forgotPasswordApiLoading}
              className="bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-md shadow-md hover:shadow-lg transition-all duration-200 mt-2"
            >
              {forgotPasswordApiLoading ? 'Sending...' : 'Reset Password'}
            </Button>

            <Divider className="my-6">
              <Typography variant="body2" className="text-gray-500 px-2">
                OR
              </Typography>
            </Divider>

            <div className="text-center">
              <Link
                href="/login"
                className="text-primary-600 hover:text-primary-800 font-medium"
              >
                Back to login
              </Link>
            </div>
          </form>
        )}
      </Paper>
    </div>
  )
}
