import type { Metadata } from 'next'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter'
import { Roboto } from 'next/font/google'
import { AuthProvider } from '@/context/AuthContext'
import { AppThemeProvider } from '@/context/ThemeContext'
import '../Style/globals.css'

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
})

export const metadata: Metadata = {
  title: 'UniBot',
  description: 'UniBot Application',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <AppRouterCacheProvider>
          <AppThemeProvider>
            <AuthProvider>{children}</AuthProvider>
          </AppThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}
