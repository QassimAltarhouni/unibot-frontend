'use client'
import React, { useState, useEffect, useCallback } from 'react'
import {
  Box,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  CircularProgress,
  Divider,
  Chip,
  Badge,
  Menu,
  MenuItem,
  Button,
  Card,
  CardContent,
  useMediaQuery,
  Collapse,
  useTheme as useMuiTheme,
  TextField,
} from '@mui/material'
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  School as SchoolIcon,
  Add as AddIcon,
  Chat as ChatIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  NotificationsOutlined as NotificationsIcon,
  Person as PersonIcon,
  ExpandLess,
  ExpandMore,
  Analytics as AnalyticsIcon,
  Help as HelpIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  ChevronLeft as ChevronLeftIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  Circle as CircleIcon,
} from '@mui/icons-material'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import useMutateApi from '@/Hooks/useMutateApi'

const drawerWidth = 280
const miniDrawerWidth = 64

const menuItems = [
  {
    text: 'Dashboard',
    href: '/dashboard',
    icon: <DashboardIcon />,
  },
  {
    text: 'Institution Management',
    icon: <SchoolIcon />,
    children: [
      {
        text: 'View Categories',
        href: '/dashboard/institutions',
        icon: <SchoolIcon />,
      },
      {
        text: 'Add Category',
        href: '/dashboard/add-institution',
        icon: <AddIcon />,
      },
    ],
  },
  {
    text: 'Chatbot',
    href: '/chatbot',
    icon: <ChatIcon />,
    badge: 'New',
  },
  {
    text: 'Analytics',
    href: '/dashboard/analytics',
    icon: <AnalyticsIcon />,
  },
  {
    text: 'Settings',
    href: '/dashboard/settings',
    icon: <SettingsIcon />,
  },
]

interface Notification {
  _id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  isRead: boolean
  createdAt: string
  category?: string
  action?: {
    type: 'view' | 'edit' | 'delete'
    url?: string
  }
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [desktopOpen, setDesktopOpen] = useState(true)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [notificationAnchor, setNotificationAnchor] =
    useState<null | HTMLElement>(null)
  const [expandedItems, setExpandedItems] = useState<{
    [key: string]: boolean
  }>({
    'Institution Management': true,
  })
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const { darkMode, toggleDarkMode } = useTheme()
  const muiTheme = useMuiTheme()
  const router = useRouter()

  // Add API hooks for notifications
  const [getNotifications, notificationsLoading] = useMutateApi({
    apiPath: '/notifications/get-notifications',
    method: 'GET',
  })
  const [markAsRead] = useMutateApi({
    apiPath: '/notifications/mark-as-read',
    method: 'PATCH',
  })
  const [markAllAsRead, markAllAsReadLoading] = useMutateApi({
    apiPath: '/notifications/mark-all-as-read',
    method: 'PATCH',
  })

  // Mock notifications fallback
  const getMockNotifications = (): Notification[] => [
    {
      _id: '1',
      type: 'success',
      title: 'New category created',
      message:
        'Computer Science Department category has been successfully created',
      isRead: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      category: 'Institution Management',
    },
    {
      _id: '2',
      title: 'System update completed',
      message: 'All services are running normally and performing optimally',
      type: 'info',
      isRead: false,
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      category: 'System',
    },
    {
      _id: '3',
      title: 'New user registered',
      message: 'A new student has registered and been granted portal access',
      type: 'info',
      isRead: false,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      category: 'User Management',
    },
    {
      _id: '4',
      title: 'Backup completed successfully',
      message: 'Weekly data backup has been completed without any issues',
      type: 'success',
      isRead: true,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      category: 'System',
    },
    {
      _id: '5',
      title: 'High response time detected',
      message: 'Some queries are taking longer than usual to process',
      type: 'warning',
      isRead: true,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      category: 'Performance',
    },
  ]

  // Initialize notifications with mock data and load from API
  useEffect(() => {
    if (!isAuthenticated) return

    // Set mock data first
    const mockNotifications = getMockNotifications()
    setNotifications(mockNotifications)
    setUnreadCount(mockNotifications.filter((notif) => !notif.isRead).length)

    // Then try to load from API
    const loadNotifications = async () => {
      try {
        const response = await getNotifications({})
        if (response.error === null && response.data) {
          setNotifications(response.data)
          const unread = response.data.filter(
            (notif: Notification) => !notif.isRead,
          ).length
          setUnreadCount(unread)
        }
      } catch (error) {
        console.error('Failed to fetch notifications:', error)
        // Keep mock data on error
      }
    }

    loadNotifications()

    // Set up polling for new notifications every 30 seconds
    const interval = setInterval(loadNotifications, 30000)
    return () => clearInterval(interval)
  }, [isAuthenticated]) // Remove getNotifications from dependencies

  // Format time ago
  const getTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInMs = now.getTime() - date.getTime()
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInHours / 24)

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
      return `${diffInMinutes} ${
        diffInMinutes === 1 ? 'minute' : 'minutes'
      } ago`
    } else if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`
    } else if (diffInDays < 7) {
      return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`
    } else {
      const diffInWeeks = Math.floor(diffInDays / 7)
      return `${diffInWeeks} ${diffInWeeks === 1 ? 'week' : 'weeks'} ago`
    }
  }

  // Get notification icon
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <SuccessIcon sx={{ color: '#10b981', fontSize: 20 }} />
      case 'error':
        return <ErrorIcon sx={{ color: '#ef4444', fontSize: 20 }} />
      case 'warning':
        return <WarningIcon sx={{ color: '#f59e0b', fontSize: 20 }} />
      case 'info':
      default:
        return <InfoIcon sx={{ color: '#3b82f6', fontSize: 20 }} />
    }
  }

  // Mark notification as read
  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      try {
        await markAsRead({ notificationId: notification._id })
        setNotifications((prev) =>
          prev.map((notif) =>
            notif._id === notification._id ? { ...notif, isRead: true } : notif,
          ),
        )
        setUnreadCount((prev) => Math.max(0, prev - 1))
      } catch (error) {
        console.error('Failed to mark notification as read:', error)
      }
    }

    // Handle action if present
    if (notification.action?.url) {
      router.push(notification.action.url)
    }
  }

  // Mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead({})
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, isRead: true })),
      )
      setUnreadCount(0)
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error)
    }
  }

  // Add authentication check
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login?message=Please log in to access the dashboard')
    }
  }, [isAuthenticated, isLoading, router])

  // Add logout handler
  const handleLogout = async () => {
    try {
      console.log('🚪 Logging out user...')
      await logout()
      setAnchorEl(null)
      router.push('/login?message=You have been logged out successfully')
    } catch (error) {
      console.error('❌ Logout error:', error)
      router.push('/login')
    }
  }

  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'))
  const pathname = usePathname()
  const isDashboardPage = pathname?.startsWith('/dashboard')

  const getUserInitials = (firstName?: string, lastName?: string) => {
    if (!firstName || !lastName) return 'AU'
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  const getFullName = (firstName?: string, lastName?: string) => {
    if (!firstName || !lastName) return 'Admin User'
    return `${firstName} ${lastName}`
  }

  const getUserRole = (role?: string) => {
    return role || 'Administrator'
  }

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          bgcolor: muiTheme.palette.background.default,
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <CircularProgress sx={{ mb: 2 }} />
          <Typography
            variant="body2"
            sx={{ color: muiTheme.palette.text.secondary }}
          >
            Authenticating...
          </Typography>
        </div>
      </Box>
    )
  }

  // Don't render dashboard if not authenticated
  if (!isAuthenticated) {
    return null
  }

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen)
    } else {
      setDesktopOpen(!desktopOpen)
    }
  }

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleNotificationMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchor(event.currentTarget)
  }

  const handleExpandClick = (itemText: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemText]: !prev[itemText],
    }))
  }

  const isItemActive = (href: string) => {
    if (!pathname) return false
    return (
      pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
    )
  }

  const currentDrawerWidth = isMobile
    ? drawerWidth
    : desktopOpen
      ? drawerWidth
      : miniDrawerWidth

  const SidebarContent = ({ isMinified = false }: { isMinified?: boolean }) => (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: darkMode ? '#1e293b' : '#1e293b', // Keep sidebar dark in both modes
      }}
    >
      {/* Logo/Brand Section */}
      <Box
        sx={{
          p: isMinified ? 1 : 3,
          borderBottom: '1px solid #334155',
          minHeight: 80,
        }}
      >
        {isMinified ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <SchoolIcon sx={{ color: 'white', fontSize: 16 }} />
            </div>
          </Box>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <SchoolIcon sx={{ color: 'white', fontSize: 20 }} />
            </div>
            <div>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                UniBot
              </Typography>
              <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                Admin Dashboard
              </Typography>
            </div>
          </div>
        )}
      </Box>

      {/* User Profile Section */}
      {!isMinified && (
        <Box sx={{ p: 2 }}>
          <Card sx={{ bgcolor: '#334155', border: '1px solid #475569' }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <div className="flex items-center gap-3">
                <Avatar sx={{ width: 40, height: 40, bgcolor: '#3b82f6' }}>
                  {getUserInitials(user?.firstName, user?.lastName)}
                </Avatar>
                <div className="flex-1 min-w-0">
                  <Typography
                    variant="subtitle2"
                    sx={{ color: 'white', fontWeight: 500 }}
                    title={getFullName(user?.firstName, user?.lastName)}
                  >
                    {getFullName(user?.firstName, user?.lastName)}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                    {getUserRole(user?.role)}
                  </Typography>
                </div>
                <Chip
                  label="Online"
                  size="small"
                  sx={{
                    bgcolor: '#10b981',
                    color: 'white',
                    fontSize: '0.7rem',
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Navigation Menu - Scrollable */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: isMinified ? 1 : 2, pb: 2 }}>
        {!isMinified && (
          <Typography
            variant="overline"
            sx={{
              color: '#64748b',
              px: 1,
              mb: 1,
              display: 'block',
              fontSize: '0.7rem',
            }}
          >
            NAVIGATION
          </Typography>
        )}
        <List sx={{ py: 0 }}>
          {menuItems.map((item) => (
            <React.Fragment key={item.text}>
              {item.children && !isMinified ? (
                <>
                  <ListItem
                    sx={{
                      borderRadius: 2,
                      mb: 0.5,
                      cursor: 'pointer',
                      bgcolor: expandedItems[item.text]
                        ? '#475569'
                        : 'transparent',
                      '&:hover': { bgcolor: '#475569' },
                      transition: 'all 0.2s ease-in-out',
                    }}
                    onClick={() => handleExpandClick(item.text)}
                  >
                    <ListItemIcon sx={{ color: '#cbd5e1', minWidth: 40 }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      sx={{
                        '& .MuiTypography-root': {
                          color: '#e2e8f0',
                          fontSize: '0.875rem',
                          fontWeight: 500,
                        },
                      }}
                    />
                    {expandedItems[item.text] ? (
                      <ExpandLess sx={{ color: '#cbd5e1' }} />
                    ) : (
                      <ExpandMore sx={{ color: '#cbd5e1' }} />
                    )}
                  </ListItem>
                  <Collapse
                    in={expandedItems[item.text]}
                    timeout="auto"
                    unmountOnExit
                  >
                    <List sx={{ pl: 2, py: 0 }}>
                      {item.children.map((child) => (
                        <Link
                          href={child.href}
                          key={child.text}
                          style={{ textDecoration: 'none' }}
                        >
                          <ListItem
                            sx={{
                              borderRadius: 1.5,
                              mb: 0.5,
                              bgcolor: isItemActive(child.href)
                                ? '#3b82f6'
                                : 'transparent',
                              '&:hover': {
                                bgcolor: isItemActive(child.href)
                                  ? '#3b82f6'
                                  : '#475569',
                              },
                              transition: 'all 0.2s ease-in-out',
                            }}
                          >
                            <ListItemIcon
                              sx={{
                                color: isItemActive(child.href)
                                  ? 'white'
                                  : '#94a3b8',
                                minWidth: 36,
                              }}
                            >
                              {child.icon}
                            </ListItemIcon>
                            <ListItemText
                              primary={child.text}
                              sx={{
                                '& .MuiTypography-root': {
                                  color: isItemActive(child.href)
                                    ? 'white'
                                    : '#cbd5e1',
                                  fontSize: '0.8rem',
                                  fontWeight: isItemActive(child.href)
                                    ? 600
                                    : 400,
                                },
                              }}
                            />
                          </ListItem>
                        </Link>
                      ))}
                    </List>
                  </Collapse>
                </>
              ) : (
                <Link
                  href={item.href || '#'}
                  key={item.text}
                  style={{ textDecoration: 'none' }}
                >
                  <ListItem
                    sx={{
                      borderRadius: 2,
                      mb: 0.5,
                      bgcolor: isItemActive(item.href || '')
                        ? '#3b82f6'
                        : 'transparent',
                      '&:hover': {
                        bgcolor: isItemActive(item.href || '')
                          ? '#3b82f6'
                          : '#475569',
                      },
                      transition: 'all 0.2s ease-in-out',
                      justifyContent: isMinified ? 'center' : 'flex-start',
                      px: isMinified ? 1 : 2,
                    }}
                    title={isMinified ? item.text : undefined}
                  >
                    <ListItemIcon
                      sx={{
                        color: isItemActive(item.href || '')
                          ? 'white'
                          : '#cbd5e1',
                        minWidth: isMinified ? 'auto' : 40,
                        justifyContent: 'center',
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    {!isMinified && (
                      <>
                        <ListItemText
                          primary={item.text}
                          sx={{
                            '& .MuiTypography-root': {
                              color: isItemActive(item.href || '')
                                ? 'white'
                                : '#e2e8f0',
                              fontSize: '0.875rem',
                              fontWeight: isItemActive(item.href || '')
                                ? 600
                                : 500,
                            },
                          }}
                        />
                        {item.badge && (
                          <Chip
                            label={item.badge}
                            size="small"
                            sx={{
                              bgcolor: '#f59e0b',
                              color: 'white',
                              fontSize: '0.7rem',
                            }}
                          />
                        )}
                      </>
                    )}
                  </ListItem>
                </Link>
              )}
            </React.Fragment>
          ))}
        </List>
      </Box>

      {/* Bottom Section - Fixed */}
      {!isMinified && (
        <Box sx={{ borderTop: '1px solid #475569', p: 2 }}>
          <Button
            fullWidth
            startIcon={<HelpIcon />}
            sx={{
              color: '#cbd5e1',
              justifyContent: 'flex-start',
              textTransform: 'none',
              mb: 1,
              '&:hover': { bgcolor: '#475569' },
            }}
          >
            Help & Support
          </Button>
          <Button
            fullWidth
            startIcon={<LogoutIcon />}
            onClick={handleLogout} // Add onClick handler
            sx={{
              color: '#f87171',
              justifyContent: 'flex-start',
              textTransform: 'none',
              '&:hover': { bgcolor: '#dc2626', color: 'white' },
            }}
          >
            Logout
          </Button>
        </Box>
      )}
    </Box>
  )

  return (
    <Box
      sx={{ display: 'flex', minHeight: '100vh' }}
      className={darkMode ? 'dashboard-dark' : 'dashboard-light'}
    >
      <CssBaseline />

      {/* Top App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: {
            xs: '100%',
            md: desktopOpen
              ? `calc(100% - ${drawerWidth}px)`
              : `calc(100% - ${miniDrawerWidth}px)`,
          },
          ml: {
            xs: 0,
            md: desktopOpen ? `${drawerWidth}px` : `${miniDrawerWidth}px`,
          },
          bgcolor: muiTheme.palette.background.paper,
          boxShadow: darkMode
            ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
            : '0 1px 3px 0 rgb(0 0 0 / 0.1)',
          borderBottom: `1px solid ${muiTheme.palette.divider}`,
          transition: muiTheme.transitions.create(['width', 'margin'], {
            easing: muiTheme.transitions.easing.sharp,
            duration: muiTheme.transitions.duration.enteringScreen,
          }),
        }}
        elevation={0}
      >
        <Toolbar>
          <IconButton
            color="default"
            aria-label="toggle drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, color: muiTheme.palette.text.primary }}
          >
            {isMobile ? (
              <MenuIcon />
            ) : desktopOpen ? (
              <ChevronLeftIcon />
            ) : (
              <MenuIcon />
            )}
          </IconButton>

          {/* Page Title */}
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              color: muiTheme.palette.text.primary,
              fontWeight: 600,
            }}
          >
            {pathname === '/dashboard' && 'Dashboard Overview'}
            {pathname === '/dashboard/institutions' && 'Institution Categories'}
            {pathname === '/dashboard/add-institution' && 'Add New Category'}
            {pathname &&
              pathname.includes('/dashboard/edit-institution') &&
              'Edit Category'}
            {pathname === '/chatbot' && 'Chatbot Interface'}
          </Typography>

          {/* Top Bar Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Theme Toggle - Only show on dashboard pages */}
            {isDashboardPage && (
              <IconButton
                onClick={toggleDarkMode}
                sx={{
                  color: muiTheme.palette.text.secondary,
                  '&:hover': { bgcolor: muiTheme.palette.action.hover },
                }}
              >
                {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            )}

            {/* Dynamic Notifications */}
            <IconButton
              onClick={handleNotificationMenuOpen}
              sx={{
                color: muiTheme.palette.text.secondary,
                '&:hover': { bgcolor: muiTheme.palette.action.hover },
              }}
            >
              <Badge badgeContent={unreadCount} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            {/* Profile Avatar */}
            <IconButton onClick={handleProfileClick} sx={{ ml: 1 }}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: '#3b82f6' }}>
                {getUserInitials(user?.firstName, user?.lastName)}
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            border: 'none',
          },
        }}
      >
        <SidebarContent />
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: currentDrawerWidth,
            border: 'none',
            transition: muiTheme.transitions.create('width', {
              easing: muiTheme.transitions.easing.sharp,
              duration: muiTheme.transitions.duration.enteringScreen,
            }),
            overflowX: 'hidden',
          },
        }}
        open
      >
        <SidebarContent isMinified={!desktopOpen} />
      </Drawer>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: {
            xs: '100%',
            md: desktopOpen
              ? `calc(100% - ${drawerWidth}px)`
              : `calc(100% - ${miniDrawerWidth}px)`,
          },
          ml: {
            xs: 0,
            md: desktopOpen ? `${drawerWidth}px` : `${miniDrawerWidth}px`,
          },
          bgcolor: muiTheme.palette.background.default,
          minHeight: '100vh',
          transition: muiTheme.transitions.create(['width', 'margin'], {
            easing: muiTheme.transitions.easing.sharp,
            duration: muiTheme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Toolbar />
        <Box sx={{ p: 3 }}>{children}</Box>
      </Box>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          sx: {
            mt: 1,
            boxShadow: darkMode
              ? '0 20px 25px -5px rgba(0, 0, 0, 0.4)'
              : '0 20px 25px -5px rgb(0 0 0 / 0.1)',
            border: `1px solid ${muiTheme.palette.divider}`,
            minWidth: 200,
            bgcolor: muiTheme.palette.background.paper,
          },
        }}
      >
        <MenuItem
          sx={{ '&:hover': { bgcolor: muiTheme.palette.action.hover } }}
        >
          <PersonIcon sx={{ mr: 2, color: muiTheme.palette.text.secondary }} />
          <Typography sx={{ color: muiTheme.palette.text.primary }}>
            Profile Settings
          </Typography>
        </MenuItem>
        <MenuItem
          sx={{ '&:hover': { bgcolor: muiTheme.palette.action.hover } }}
        >
          <SettingsIcon
            sx={{ mr: 2, color: muiTheme.palette.text.secondary }}
          />
          <Typography sx={{ color: muiTheme.palette.text.primary }}>
            Account Settings
          </Typography>
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={handleLogout}
          sx={{ '&:hover': { bgcolor: '#fef2f2' }, color: '#dc2626' }}
        >
          <LogoutIcon sx={{ mr: 2 }} />
          Sign Out
        </MenuItem>
      </Menu>

      {/* Dynamic Notifications Menu */}
      <Menu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={() => setNotificationAnchor(null)}
        PaperProps={{
          sx: {
            mt: 1,
            boxShadow: darkMode
              ? '0 20px 25px -5px rgba(0, 0, 0, 0.4)'
              : '0 20px 25px -5px rgb(0 0 0 / 0.1)',
            border: `1px solid ${muiTheme.palette.divider}`,
            minWidth: 380,
            maxHeight: 500,
            maxWidth: 400,
            bgcolor: muiTheme.palette.background.paper,
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{ p: 2, borderBottom: `1px solid ${muiTheme.palette.divider}` }}
        >
          <div className="flex items-center justify-between">
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, color: muiTheme.palette.text.primary }}
            >
              Notifications
            </Typography>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Chip
                  label={`${unreadCount} new`}
                  size="small"
                  color="primary"
                  sx={{ fontSize: '0.75rem' }}
                />
              )}
              {unreadCount > 0 && (
                <Button
                  size="small"
                  onClick={handleMarkAllAsRead}
                  disabled={markAllAsReadLoading}
                  sx={{ fontSize: '0.75rem' }}
                >
                  Mark all read
                </Button>
              )}
            </div>
          </div>
        </Box>

        {/* Notifications List */}
        {notificationsLoading ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <CircularProgress size={24} />
            <Typography
              variant="body2"
              sx={{ mt: 1, color: muiTheme.palette.text.secondary }}
            >
              Loading notifications...
            </Typography>
          </Box>
        ) : notifications.length > 0 ? (
          <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
            {notifications.slice(0, 10).map((notification) => (
              <MenuItem
                key={notification._id}
                onClick={() => handleNotificationClick(notification)}
                sx={{
                  '&:hover': { bgcolor: muiTheme.palette.action.hover },
                  py: 2,
                  px: 2,
                  borderLeft: notification.isRead
                    ? 'none'
                    : '3px solid #3b82f6',
                  bgcolor: notification.isRead
                    ? 'transparent'
                    : darkMode
                      ? 'rgba(59, 130, 246, 0.1)'
                      : '#f0f9ff',
                }}
              >
                <div className="flex items-start gap-3 w-full">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: notification.isRead ? 400 : 600,
                          color: notification.isRead
                            ? muiTheme.palette.text.secondary
                            : muiTheme.palette.text.primary,
                        }}
                      >
                        {notification.title}
                      </Typography>
                      {!notification.isRead && (
                        <CircleIcon
                          sx={{ color: '#3b82f6', fontSize: 8, ml: 1 }}
                        />
                      )}
                    </div>
                    <Typography
                      variant="caption"
                      sx={{
                        color: muiTheme.palette.text.secondary,
                        display: 'block',
                        mb: 1,
                      }}
                    >
                      {notification.message}
                    </Typography>
                    <div className="flex items-center justify-between">
                      <Typography
                        variant="caption"
                        sx={{ color: muiTheme.palette.text.disabled }}
                      >
                        {getTimeAgo(notification.createdAt)}
                      </Typography>
                      {notification.category && (
                        <Chip
                          label={notification.category}
                          size="small"
                          variant="outlined"
                          sx={{
                            fontSize: '0.65rem',
                            height: 20,
                            '& .MuiChip-label': { px: 1 },
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </MenuItem>
            ))}
          </Box>
        ) : (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <NotificationsIcon
              sx={{
                fontSize: 48,
                color: muiTheme.palette.text.disabled,
                mb: 2,
              }}
            />
            <Typography
              variant="body2"
              sx={{ color: muiTheme.palette.text.secondary }}
            >
              No notifications yet
            </Typography>
          </Box>
        )}

        {/* Footer */}
        {notifications.length > 10 && (
          <Box
            sx={{
              borderTop: `1px solid ${muiTheme.palette.divider}`,
              p: 2,
              textAlign: 'center',
            }}
          >
            <Button
              size="small"
              onClick={() => {
                setNotificationAnchor(null)
                router.push('/dashboard/notifications')
              }}
            >
              View all notifications
            </Button>
          </Box>
        )}
      </Menu>
    </Box>
  )
}
