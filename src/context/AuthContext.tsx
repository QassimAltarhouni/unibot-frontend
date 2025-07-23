'use client'
import React, { createContext, useContext, useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { hasCookie, getCookie, deleteCookie, setCookie } from 'cookies-next'
import useMutateApi from '@/Hooks/useMutateApi'

interface User {
  _id: string
  id: string
  email: string
  firstName: string
  lastName: string
  verified: boolean
  role?: string
  isAuthenticated: boolean
}

interface AuthContextType {
  user: User | null
  setUserData: (user: User) => void
  isLoading: boolean
  isAuthenticated: boolean
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  const [checkAccessToken, accessTokenLoading] = useMutateApi({
    apiPath: '/sessions/checkAccessToken',
    method: 'POST',
  })

  const [refreshTokenApi, refreshTokenLoading] = useMutateApi({
    apiPath: '/sessions/refresh',
    header: { 'x-refresh': getCookie('refreshToken') },
  })

  const logout = async () => {
    try {
      // Clear all user data and tokens
      setUser(null)
      deleteCookie('accessToken')
      deleteCookie('refreshToken')

      // Redirect to login
      router.push('/login')
    } catch (error) {
      // Force redirect even if there's an error
      router.push('/login')
    }
  }

  const checkAuthorize = async () => {
    setIsLoading(true)

    // Check if we have the required tokens
    const hasRefreshToken = hasCookie('refreshToken')
    const hasAccessToken = hasCookie('accessToken')

    if (!hasRefreshToken) {
      setUser(null)
      setIsLoading(false)

      // Only redirect if trying to access protected route
      if (pathname && pathname.startsWith('/dashboard')) {
        router.push('/login?message=Please log in to access this page')
      }
      return
    }

    try {
      // First, try to verify the access token if it exists
      if (hasAccessToken) {
        const authResponse = await checkAccessToken({})

        if (!authResponse.error && authResponse.data?.user) {
          const userData = {
            ...authResponse.data.user,
            id: authResponse.data.user._id,
            isAuthenticated: true,
          }
          setUser(userData)
          setIsLoading(false)
          return
        }

        // Access token is invalid, remove it
        deleteCookie('accessToken')
      }

      // Try to refresh the token
      const refreshResponse = await refreshTokenApi({})

      if (
        !refreshResponse.error &&
        refreshResponse.data?.user &&
        refreshResponse.data?.accessToken
      ) {
        const userData = {
          ...refreshResponse.data.user,
          id: refreshResponse.data.user._id,
          isAuthenticated: true,
        }
        setUser(userData)
        setCookie('accessToken', refreshResponse.data.accessToken)
        setIsLoading(false)
        return
      }

      // Both access token check and refresh failed
      setUser(null)
      deleteCookie('accessToken')
      deleteCookie('refreshToken')
      setIsLoading(false)

      // Only redirect if trying to access protected route
      if (pathname && pathname.startsWith('/dashboard')) {
        router.push('/login?message=Session expired, please log in again')
      }
    } catch (error) {
      setUser(null)
      setIsLoading(false)

      // Only redirect if trying to access protected route
      if (pathname && pathname.startsWith('/dashboard')) {
        router.push('/login?message=Authentication error, please log in again')
      }
    }
  }

  // Only run auth check when pathname changes or on mount
  useEffect(() => {
    checkAuthorize()
  }, [pathname])

  const setUserData = (userData: User) => {
    setUser(userData)
    setIsLoading(false)
  }

  // Computed loading state
  const computedIsLoading =
    isLoading || accessTokenLoading || refreshTokenLoading

  return (
    <AuthContext.Provider
      value={{
        user,
        setUserData,
        isLoading: computedIsLoading,
        isAuthenticated: !!user,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
