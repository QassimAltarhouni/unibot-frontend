'use client'

import React, { useEffect, useState } from 'react'
import {
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  CircularProgress,
  useTheme as useMuiTheme,
} from '@mui/material'
import {
  School as SchoolIcon,
  Add as AddIcon,
  TrendingUp as TrendingUpIcon,
  Chat as ChatIcon,
  People as PeopleIcon,
} from '@mui/icons-material'
import Link from 'next/link'
import useMutateApi from '@/Hooks/useMutateApi'

interface Institution {
  _id: string
  title: string
  description: string
  systemPrompt: string
  data: string
  url: string
  createdAt: string
  updatedAt: string
}

export default function DashboardPage() {
  const [institutions, setInstitutions] = useState<Institution[]>([])
  const [stats, setStats] = useState({
    totalCategories: 0,
    avgPromptLength: 0,
  })
  const theme = useMuiTheme() // Use MUI theme hook instead of custom

  // Create stable API function reference
  const [getInstitutions, institutionsLoading] = useMutateApi({
    apiPath: `/category/get-Categories`,
    method: 'GET',
  })

  // Fetch data only once on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const institutionsResponse = await getInstitutions({})

        if (institutionsResponse && institutionsResponse.error === null) {
          const institutionData = institutionsResponse.data || []
          setInstitutions(institutionData)

          const totalCategories = institutionData.length
          const totalPromptChars = institutionData.reduce(
            (acc: number, inst: Institution) =>
              acc + (inst.systemPrompt?.length || 0),
            0,
          )
          const avgPromptLength =
            totalCategories > 0
              ? Math.round(totalPromptChars / totalCategories)
              : 0

          setStats({
            totalCategories,
            avgPromptLength,
          })
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      }
    }

    fetchData()
  }, []) // Empty dependency array - only run once on mount

  // Generate recent activity from institutions data
  const getRecentActivity = () => {
    interface Activity {
      action: string
      item: string
      time: string
      status: 'success' | 'info' | 'warning'
      description: string
    }

    const activities: Activity[] = []

    const recentInstitutions = [...institutions]
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      )
      .slice(0, 5)

    recentInstitutions.forEach((institution, _index) => {
      const updatedDate = new Date(institution.updatedAt)
      const createdDate = new Date(institution.createdAt)
      const now = new Date()

      const isRecentlyCreated =
        updatedDate.getTime() - createdDate.getTime() < 60000

      const diffHours = Math.floor(
        (now.getTime() - updatedDate.getTime()) / (1000 * 60 * 60),
      )
      const diffDays = Math.floor(diffHours / 24)

      let timeAgo = ''
      if (diffDays > 0) {
        timeAgo = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
      } else if (diffHours > 0) {
        timeAgo = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
      } else {
        timeAgo = 'Just now'
      }

      activities.push({
        action: isRecentlyCreated ? 'Category created' : 'Category updated',
        item: institution.title,
        time: timeAgo,
        status: isRecentlyCreated ? 'success' : 'info',
        description: `${institution.description.slice(0, 50)}...`,
      })
    })

    return activities
  }

  const statsData = [
    {
      title: 'Total Categories',
      value: stats.totalCategories.toString(),
      icon: <SchoolIcon sx={{ color: 'primary.main' }} />,
      subtitle: 'Institution categories',
    },
    {
      title: 'Avg Prompt Length',
      value: stats.avgPromptLength.toString(),
      icon: <ChatIcon sx={{ color: 'success.main' }} />,
      subtitle: 'Characters per prompt',
    },
    {
      title: 'Active Categories',
      value: institutions
        .filter((inst) => inst.systemPrompt && inst.systemPrompt.length > 0)
        .length.toString(),
      icon: <TrendingUpIcon sx={{ color: 'info.main' }} />,
      subtitle: 'With system prompts',
    },
    {
      title: 'System Status',
      value: '99.9%',
      icon: <PeopleIcon sx={{ color: 'warning.main' }} />,
      subtitle: 'Uptime this month',
    },
  ]

  if (institutionsLoading) {
    return (
      <Box component="main" sx={{ p: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '256px',
          }}
        >
          <CircularProgress />
          <Typography variant="body1" sx={{ ml: 2, color: 'text.secondary' }}>
            Loading dashboard data...
          </Typography>
        </Box>
      </Box>
    )
  }

  return (
    <Box component="main" sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            color: 'text.primary',
            fontWeight: 'bold',
            mb: 1,
          }}
        >
          Dashboard Overview
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Real-time statistics and system monitoring for UniBot
        </Typography>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statsData.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                height: '100%',
                transition: 'box-shadow 0.2s',
                '&:hover': {
                  boxShadow: theme.shadows[8],
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ color: 'text.secondary', mb: 0.5 }}
                    >
                      {stat.title}
                    </Typography>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 'bold', color: 'text.primary' }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: 'text.secondary' }}
                    >
                      {stat.subtitle}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: '50%',
                      bgcolor: 'background.paper',
                      boxShadow: 1,
                    }}
                  >
                    {stat.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quick Actions */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography
          variant="h5"
          sx={{ color: 'text.primary', fontWeight: 'bold', mb: 2 }}
        >
          Quick Actions
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: '100%',
                transition: 'box-shadow 0.2s',
                borderLeft: 4,
                borderLeftColor: 'primary.main',
                '&:hover': {
                  boxShadow: theme.shadows[4],
                },
              }}
            >
              <CardContent sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ color: 'text.primary', mb: 1 }}>
                  Manage Categories
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', mb: 2 }}
                >
                  View, edit, and organize your institution categories
                </Typography>
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Link href="/dashboard/institutions" style={{ width: '100%' }}>
                  <Button variant="contained" fullWidth color="primary">
                    View Categories
                  </Button>
                </Link>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: '100%',
                transition: 'box-shadow 0.2s',
                borderLeft: 4,
                borderLeftColor: 'success.main',
                '&:hover': {
                  boxShadow: theme.shadows[4],
                },
              }}
            >
              <CardContent sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ color: 'text.primary', mb: 1 }}>
                  Add New Category
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', mb: 2 }}
                >
                  Create a new institution category for the chatbot
                </Typography>
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Link
                  href="/dashboard/add-institution"
                  style={{ width: '100%' }}
                >
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<AddIcon />}
                    color="success"
                  >
                    Add Category
                  </Button>
                </Link>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: '100%',
                transition: 'box-shadow 0.2s',
                borderLeft: 4,
                borderLeftColor: 'info.main',
                '&:hover': {
                  boxShadow: theme.shadows[4],
                },
              }}
            >
              <CardContent sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ color: 'text.primary', mb: 1 }}>
                  Test Chatbot
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', mb: 2 }}
                >
                  Interact with the UniBot to test functionality
                </Typography>
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Link href="/chatbot" style={{ width: '100%' }}>
                  <Button variant="outlined" fullWidth color="info">
                    Open Chatbot
                  </Button>
                </Link>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Recent Activity */}
      <Paper sx={{ p: 3 }}>
        <Typography
          variant="h5"
          sx={{ color: 'text.primary', fontWeight: 'bold', mb: 2 }}
        >
          Recent Activity
        </Typography>
        {institutions.length > 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {getRecentActivity().map((activity, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 2,
                  bgcolor: 'action.hover',
                  borderRadius: 1,
                  transition: 'background-color 0.2s',
                  '&:hover': {
                    bgcolor: 'action.selected',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Chip
                    label={activity.status === 'success' ? 'New' : 'Updated'}
                    size="small"
                    color={activity.status === 'success' ? 'success' : 'info'}
                    variant="outlined"
                  />
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ color: 'text.primary', fontWeight: 'medium' }}
                    >
                      {activity.action}: {activity.item}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: 'text.secondary' }}
                    >
                      {activity.description}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {activity.time}
                </Typography>
              </Box>
            ))}
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              No recent activity. Create your first category to see activity
              here.
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  )
}
