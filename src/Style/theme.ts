'use client'
import { createTheme } from '@mui/material/styles'
import GlobalColors from './GlobalColors'

const createAppTheme = (
  mode: 'light' | 'dark',
  isDashboardPage: boolean = false,
) =>
  createTheme({
    cssVariables: true,
    palette: {
      mode,
      primary: {
        main: GlobalColors.primary[500],
        light: GlobalColors.primary[300],
        dark: GlobalColors.primary[700],
        contrastText: GlobalColors.common.white,
      },
      secondary: {
        main: GlobalColors.secondary[500],
        light: GlobalColors.secondary[300],
        dark: GlobalColors.secondary[700],
        contrastText: GlobalColors.common.white,
      },
      error: {
        main: GlobalColors.error[500],
        light: GlobalColors.error[300],
        dark: GlobalColors.error[700],
        contrastText: GlobalColors.common.white,
      },
      warning: {
        main: GlobalColors.warning[500],
        light: GlobalColors.warning[300],
        dark: GlobalColors.warning[700],
        contrastText: GlobalColors.common.white,
      },
      info: {
        main: GlobalColors.info[500],
        light: GlobalColors.info[300],
        dark: GlobalColors.info[700],
        contrastText: GlobalColors.common.white,
      },
      success: {
        main: GlobalColors.success[500],
        light: GlobalColors.success[300],
        dark: GlobalColors.success[700],
        contrastText: GlobalColors.common.white,
      },
      background: {
        default: mode === 'dark' && isDashboardPage ? '#0f172a' : '#f9fafb',
        paper: mode === 'dark' && isDashboardPage ? '#1e293b' : '#ffffff',
      },
      text: {
        primary: mode === 'dark' && isDashboardPage ? '#f1f5f9' : '#111827',
        secondary: mode === 'dark' && isDashboardPage ? '#94a3b8' : '#6b7280',
      },
      grey: {
        50:
          mode === 'dark' && isDashboardPage
            ? '#1e293b'
            : GlobalColors.gray[50],
        100:
          mode === 'dark' && isDashboardPage
            ? '#334155'
            : GlobalColors.gray[100],
        200:
          mode === 'dark' && isDashboardPage
            ? '#475569'
            : GlobalColors.gray[200],
        300:
          mode === 'dark' && isDashboardPage
            ? '#64748b'
            : GlobalColors.gray[300],
        400:
          mode === 'dark' && isDashboardPage
            ? '#94a3b8'
            : GlobalColors.gray[400],
        500:
          mode === 'dark' && isDashboardPage
            ? '#cbd5e1'
            : GlobalColors.gray[500],
        600:
          mode === 'dark' && isDashboardPage
            ? '#e2e8f0'
            : GlobalColors.gray[600],
        700:
          mode === 'dark' && isDashboardPage
            ? '#f1f5f9'
            : GlobalColors.gray[700],
        800:
          mode === 'dark' && isDashboardPage
            ? '#f8fafc'
            : GlobalColors.gray[800],
        900:
          mode === 'dark' && isDashboardPage
            ? '#ffffff'
            : GlobalColors.gray[900],
        A100: GlobalColors.gray[100],
        A200: GlobalColors.gray[200],
        A400: GlobalColors.gray[400],
        A700: GlobalColors.gray[700],
      },
    },
    typography: {
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
      ].join(','),
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor:
              mode === 'dark' && isDashboardPage ? '#0f172a' : '#f9fafb',
            color: mode === 'dark' && isDashboardPage ? '#f1f5f9' : '#111827',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor:
              mode === 'dark' && isDashboardPage ? '#1e293b' : '#ffffff',
            color: mode === 'dark' && isDashboardPage ? '#f1f5f9' : '#111827',
            borderBottom: `1px solid ${mode === 'dark' && isDashboardPage ? '#334155' : '#e5e7eb'}`,
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: '#1e293b', // Always dark for sidebar
            borderRight: 'none',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor:
              mode === 'dark' && isDashboardPage ? '#1e293b' : '#ffffff',
            borderRadius: '8px',
            boxShadow:
              mode === 'dark' && isDashboardPage
                ? '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)'
                : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            border:
              mode === 'dark' && isDashboardPage ? '1px solid #334155' : 'none',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor:
              mode === 'dark' && isDashboardPage ? '#1e293b' : '#ffffff',
            borderRadius: '8px',
            border:
              mode === 'dark' && isDashboardPage ? '1px solid #334155' : 'none',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            // Dashboard-specific styling
            ...(isDashboardPage && {
              '& .MuiInputBase-input': {
                paddingLeft: '15px',
                color: mode === 'dark' ? '#f1f5f9' : '#111827',
                '&:-webkit-autofill': {
                  WebkitBoxShadow: `0 0 0 1000px ${mode === 'dark' ? '#334155' : '#ffffff'} inset`,
                  WebkitTextFillColor: mode === 'dark' ? '#f1f5f9' : '#111827',
                  transition: 'background-color 5000s ease-in-out 0s',
                },
                '&:-webkit-autofill:hover': {
                  WebkitBoxShadow: `0 0 0 1000px ${mode === 'dark' ? '#334155' : '#ffffff'} inset`,
                  WebkitTextFillColor: mode === 'dark' ? '#f1f5f9' : '#111827',
                },
                '&:-webkit-autofill:focus': {
                  WebkitBoxShadow: `0 0 0 1000px ${mode === 'dark' ? '#334155' : '#ffffff'} inset`,
                  WebkitTextFillColor: mode === 'dark' ? '#f1f5f9' : '#111827',
                },
              },
              '& .MuiInputLabel-root': {
                color: mode === 'dark' ? '#94a3b8' : '#6b7280',
              },
              '& .MuiOutlinedInput-root': {
                backgroundColor: mode === 'dark' ? '#334155' : '#ffffff',
                '& fieldset': {
                  borderColor: mode === 'dark' ? '#475569' : '#d1d5db',
                },
                '&:hover fieldset': {
                  borderColor: GlobalColors.primary[500],
                },
                '&.Mui-focused fieldset': {
                  borderColor: GlobalColors.primary[500],
                },
              },
            }),
            // Auth pages styling (always light)
            ...(!isDashboardPage && {
              '& .MuiInputBase-input': {
                paddingLeft: '15px',
                color: '#111827',
                backgroundColor: '#ffffff',
                '&:-webkit-autofill': {
                  WebkitBoxShadow: '0 0 0 1000px #ffffff inset',
                  WebkitTextFillColor: '#111827',
                  transition: 'background-color 5000s ease-in-out 0s',
                },
                '&:-webkit-autofill:hover': {
                  WebkitBoxShadow: '0 0 0 1000px #ffffff inset',
                  WebkitTextFillColor: '#111827',
                },
                '&:-webkit-autofill:focus': {
                  WebkitBoxShadow: '0 0 0 1000px #ffffff inset',
                  WebkitTextFillColor: '#111827',
                },
              },
              '& .MuiInputLabel-root': {
                color: '#6b7280',
              },
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#ffffff',
                '& fieldset': {
                  borderColor: '#d1d5db',
                },
                '&:hover fieldset': {
                  borderColor: GlobalColors.primary[500],
                },
                '&.Mui-focused fieldset': {
                  borderColor: GlobalColors.primary[500],
                },
              },
            }),
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '6px',
            textTransform: 'none',
            fontWeight: 500,
            padding: '8px 16px',
          },
          contained: {
            boxShadow: '0 2px 4px 0 rgb(0 0 0 / 0.1)',
            '&:hover': {
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            },
          },
          outlined: {
            borderColor:
              mode === 'dark' && isDashboardPage ? '#475569' : '#d1d5db',
            color: mode === 'dark' && isDashboardPage ? '#f1f5f9' : '#374151',
            '&:hover': {
              borderColor: GlobalColors.primary[500],
              backgroundColor:
                mode === 'dark' && isDashboardPage ? '#334155' : '#f3f4f6',
            },
          },
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            backgroundColor:
              mode === 'dark' && isDashboardPage ? '#1e293b' : '#ffffff',
            border: `1px solid ${mode === 'dark' && isDashboardPage ? '#334155' : '#e5e7eb'}`,
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            color: mode === 'dark' && isDashboardPage ? '#f1f5f9' : '#374151',
            '&:hover': {
              backgroundColor:
                mode === 'dark' && isDashboardPage ? '#334155' : '#f9fafb',
            },
          },
        },
      },
      MuiListItem: {
        styleOverrides: {
          root: {
            color: '#e2e8f0', // Always light for sidebar
          },
        },
      },
    },
  })

export default createAppTheme
