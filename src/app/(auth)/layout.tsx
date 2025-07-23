'use client'
import { Box } from '@mui/material'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f9fafb !important', // Force light background
        '& .MuiTextField-root': {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#ffffff !important',
            '& .MuiInputBase-input': {
              color: '#111827 !important',
            },
            '& fieldset': {
              borderColor: '#d1d5db !important',
            },
            '&:hover fieldset': {
              borderColor: '#3b82f6 !important',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#3b82f6 !important',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#6b7280 !important',
            '&.Mui-focused': {
              color: '#3b82f6 !important',
            },
          },
        },
      }}
    >
      {children}
    </Box>
  )
}
