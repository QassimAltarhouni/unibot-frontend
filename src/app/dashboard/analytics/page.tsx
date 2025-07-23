'use client'

import React, { useState, useEffect } from 'react'
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Chip,
  LinearProgress,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  ToggleButton,
  ToggleButtonGroup,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  CircularProgress,
} from '@mui/material'
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Chat as ChatIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  Speed as SpeedIcon,
  AccessTime as AccessTimeIcon,
  ErrorOutline as ErrorIcon,
  CheckCircle as SuccessIcon,
  CheckCircle,
  MoreVert as MoreVertIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  ShowChart as LineChartIcon,
  Dashboard as DashboardIcon,
  Psychology as AIIcon,
  Language as LanguageIcon,
  Timer as TimerIcon,
} from '@mui/icons-material'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart,
  Treemap,
} from 'recharts'

// Mock data for analytics
const mockData = {
  overview: {
    totalConversations: 12547,
    conversationGrowth: 23.5,
    activeUsers: 3210,
    userGrowth: 18.2,
    avgResponseTime: 1.2,
    responseTimeChange: -15.3,
    satisfactionScore: 4.6,
    satisfactionChange: 12.1,
  },
  conversationTrends: [
    { date: '2024-01-01', conversations: 890, users: 245, satisfaction: 4.2 },
    { date: '2024-01-02', conversations: 1120, users: 287, satisfaction: 4.3 },
    { date: '2024-01-03', conversations: 980, users: 298, satisfaction: 4.4 },
    { date: '2024-01-04', conversations: 1340, users: 321, satisfaction: 4.5 },
    { date: '2024-01-05', conversations: 1180, users: 345, satisfaction: 4.6 },
    { date: '2024-01-06', conversations: 1560, users: 378, satisfaction: 4.7 },
    { date: '2024-01-07', conversations: 1420, users: 398, satisfaction: 4.8 },
  ],
  categoryDistribution: [
    {
      name: 'Computer Science',
      value: 35,
      conversations: 4391,
      color: '#3B82F6',
    },
    { name: 'Engineering', value: 28, conversations: 3513, color: '#10B981' },
    { name: 'Business', value: 18, conversations: 2258, color: '#F59E0B' },
    { name: 'Medicine', value: 12, conversations: 1506, color: '#EF4444' },
    { name: 'Arts', value: 7, conversations: 879, color: '#8B5CF6' },
  ],
  responseTimeAnalysis: [
    { hour: '00:00', avgTime: 2.1, volume: 45 },
    { hour: '04:00', avgTime: 1.8, volume: 23 },
    { hour: '08:00', avgTime: 0.9, volume: 234 },
    { hour: '12:00', avgTime: 1.2, volume: 456 },
    { hour: '16:00', avgTime: 1.4, volume: 378 },
    { hour: '20:00', avgTime: 1.1, volume: 298 },
  ],
  userSentimentAnalysis: {
    positive: 68,
    neutral: 24,
    negative: 8,
  },
  topQuestions: [
    {
      question: 'How to apply for admission?',
      count: 1256,
      category: 'Admissions',
    },
    {
      question: 'What are the course requirements?',
      count: 987,
      category: 'Academic',
    },
    {
      question: 'Campus facilities information',
      count: 743,
      category: 'Campus Life',
    },
    {
      question: 'Scholarship opportunities',
      count: 692,
      category: 'Financial',
    },
    {
      question: 'Course schedule and timetable',
      count: 578,
      category: 'Academic',
    },
  ],
  performanceMetrics: [
    { metric: 'Response Accuracy', current: 94.2, target: 95, trend: 2.1 },
    { metric: 'User Satisfaction', current: 4.6, target: 4.8, trend: 0.3 },
    { metric: 'Query Resolution Rate', current: 87.5, target: 90, trend: -1.2 },
    {
      metric: 'Average Session Duration',
      current: 4.2,
      target: 5.0,
      trend: 0.8,
    },
  ],
  aiInsights: [
    {
      type: 'trend',
      title: 'Peak Usage Hours',
      description: 'User activity peaks between 10 AM - 2 PM and 6 PM - 8 PM',
      impact: 'high',
      recommendation: 'Consider additional support during peak hours',
    },
    {
      type: 'opportunity',
      title: 'Knowledge Gap Detected',
      description: 'Frequent questions about new course offerings',
      impact: 'medium',
      recommendation: 'Update knowledge base with latest course information',
    },
    {
      type: 'alert',
      title: 'Response Time Increase',
      description: 'Average response time increased by 0.3s this week',
      impact: 'low',
      recommendation: 'Review system performance and optimize queries',
    },
  ],
}

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('7d')
  const [viewType, setViewType] = useState('overview')
  const [isLoading, setIsLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = async () => {
    setRefreshing(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setRefreshing(false)
  }

  const MetricCard = ({ title, value, change, icon, color = 'primary' }) => (
    <Card className="h-full hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl bg-${color}-100`}>{icon}</div>
          <div className="flex items-center gap-1">
            {change > 0 ? (
              <TrendingUpIcon className="text-green-500 w-4 h-4" />
            ) : (
              <TrendingDownIcon className="text-red-500 w-4 h-4" />
            )}
            <Typography
              variant="caption"
              className={change > 0 ? 'text-green-500' : 'text-red-500'}
              sx={{ fontWeight: 600 }}
            >
              {Math.abs(change)}%
            </Typography>
          </div>
        </div>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
      </CardContent>
    </Card>
  )

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Paper className="p-3 shadow-lg border">
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
            {label}
          </Typography>
          {payload.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <Typography variant="caption" color="text.secondary">
                {item.name}: {item.value}
              </Typography>
            </div>
          ))}
        </Paper>
      )
    }
    return null
  }

  return (
    <Box className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Analytics Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Real-time insights and performance metrics for UniBot AI Assistant
          </Typography>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              label="Time Range"
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <MenuItem value="24h">Last 24 Hours</MenuItem>
              <MenuItem value="7d">Last 7 Days</MenuItem>
              <MenuItem value="30d">Last 30 Days</MenuItem>
              <MenuItem value="90d">Last 3 Months</MenuItem>
            </Select>
          </FormControl>

          <ToggleButtonGroup
            value={viewType}
            exclusive
            onChange={(e, newView) => newView && setViewType(newView)}
            size="small"
          >
            <ToggleButton value="overview">
              <DashboardIcon className="w-4 h-4" />
            </ToggleButton>
            <ToggleButton value="detailed">
              <BarChartIcon className="w-4 h-4" />
            </ToggleButton>
          </ToggleButtonGroup>

          <Button variant="outlined" startIcon={<DownloadIcon />} size="small">
            Export
          </Button>

          <IconButton
            onClick={handleRefresh}
            disabled={refreshing}
            className="bg-primary-50 hover:bg-primary-100"
          >
            <RefreshIcon className={refreshing ? 'animate-spin' : ''} />
          </IconButton>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} lg={3}>
          <MetricCard
            title="Total Conversations"
            value={mockData.overview.totalConversations}
            change={mockData.overview.conversationGrowth}
            icon={<ChatIcon className="text-blue-600 w-6 h-6" />}
            color="blue"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <MetricCard
            title="Active Users"
            value={mockData.overview.activeUsers}
            change={mockData.overview.userGrowth}
            icon={<PeopleIcon className="text-green-600 w-6 h-6" />}
            color="green"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <MetricCard
            title="Avg Response Time"
            value={`${mockData.overview.avgResponseTime}s`}
            change={mockData.overview.responseTimeChange}
            icon={<SpeedIcon className="text-orange-600 w-6 h-6" />}
            color="orange"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <MetricCard
            title="Satisfaction Score"
            value={mockData.overview.satisfactionScore}
            change={mockData.overview.satisfactionChange}
            icon={<SuccessIcon className="text-purple-600 w-6 h-6" />}
            color="purple"
          />
        </Grid>
      </Grid>

      {/* Main Charts Section */}
      <Grid container spacing={3}>
        {/* Conversation Trends */}
        <Grid item xs={12} lg={8}>
          <Card className="h-full">
            <CardHeader
              title="Conversation Trends"
              subheader="Daily conversation volume and user engagement"
              action={
                <IconButton>
                  <MoreVertIcon />
                </IconButton>
              }
            />
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={mockData.conversationTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="conversations"
                      fill="#3B82F6"
                      stroke="#3B82F6"
                      fillOpacity={0.6}
                      name="Conversations"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="satisfaction"
                      stroke="#10B981"
                      strokeWidth={3}
                      name="Satisfaction"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </Grid>

        {/* Category Distribution */}
        <Grid item xs={12} lg={4}>
          <Card className="h-full">
            <CardHeader
              title="Category Distribution"
              subheader="Conversations by institution category"
            />
            <CardContent>
              <div className="h-64 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={mockData.categoryDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {mockData.categoryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                {mockData.categoryDistribution.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <Typography variant="body2">{item.name}</Typography>
                    </div>
                    <Typography variant="body2" color="text.secondary">
                      {item.value}%
                    </Typography>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Performance Metrics and AI Insights */}
      <Grid container spacing={3}>
        {/* Performance Metrics */}
        <Grid item xs={12} lg={6}>
          <Card className="h-full">
            <CardHeader
              title="Performance Metrics"
              subheader="Key performance indicators and targets"
            />
            <CardContent>
              <div className="space-y-4">
                {mockData.performanceMetrics.map((metric, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-2">
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {metric.metric}
                      </Typography>
                      <div className="flex items-center gap-2">
                        <Typography variant="body2" color="text.secondary">
                          {metric.current} / {metric.target}
                        </Typography>
                        <Chip
                          size="small"
                          label={`${metric.trend > 0 ? '+' : ''}${metric.trend}`}
                          color={metric.trend > 0 ? 'success' : 'error'}
                          variant="outlined"
                        />
                      </div>
                    </div>
                    <LinearProgress
                      variant="determinate"
                      value={(metric.current / metric.target) * 100}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: '#f3f4f6',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 4,
                          backgroundColor:
                            metric.current >= metric.target
                              ? '#10B981'
                              : '#F59E0B',
                        },
                      }}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </Grid>

        {/* AI Insights */}
        <Grid item xs={12} lg={6}>
          <Card className="h-full">
            <CardHeader
              title="AI-Powered Insights"
              subheader="Automated analysis and recommendations"
              avatar={<AIIcon className="text-purple-600" />}
            />
            <CardContent>
              <div className="space-y-3">
                {mockData.aiInsights.map((insight, index) => (
                  <Paper
                    key={index}
                    component="div"
                    className="p-4 border-l-4"
                    sx={{
                      borderLeftColor:
                        insight.impact === 'high'
                          ? '#EF4444'
                          : insight.impact === 'medium'
                            ? '#F59E0B'
                            : '#10B981',
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor:
                            insight.impact === 'high'
                              ? '#FEE2E2'
                              : insight.impact === 'medium'
                                ? '#FEF3C7'
                                : '#D1FAE5',
                        }}
                      >
                        {insight.type === 'trend' ? (
                          <TrendingUpIcon className="w-4 h-4 text-blue-600" />
                        ) : insight.type === 'opportunity' ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <ErrorIcon className="w-4 h-4 text-orange-600" />
                        )}
                      </Avatar>
                      <div className="flex-1">
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 600 }}
                        >
                          {insight.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1 }}
                        >
                          {insight.description}
                        </Typography>
                        <Typography variant="caption" className="text-blue-600">
                          💡 {insight.recommendation}
                        </Typography>
                      </div>
                    </div>
                  </Paper>
                ))}
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Additional Analytics */}
      <Grid container spacing={3}>
        {/* Response Time Analysis */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardHeader
              title="Response Time Analysis"
              subheader="Average response time throughout the day"
            />
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockData.responseTimeAnalysis}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="avgTime"
                      stroke="#8B5CF6"
                      fill="#8B5CF6"
                      fillOpacity={0.6}
                      name="Avg Response Time (s)"
                    />
                    <Bar
                      yAxisId="right"
                      dataKey="volume"
                      fill="#10B981"
                      name="Query Volume"
                      opacity={0.7}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Questions */}
        <Grid item xs={12} lg={4}>
          <Card className="h-full">
            <CardHeader
              title="Top Questions"
              subheader="Most frequently asked questions"
            />
            <CardContent>
              <List>
                {mockData.topQuestions.map((item, index) => (
                  <ListItem key={index} className="px-0">
                    <ListItemAvatar>
                      <Avatar className="bg-gray-100 text-gray-600">
                        {index + 1}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {item.question}
                        </Typography>
                      }
                      secondary={
                        <div className="flex items-center gap-2 mt-1">
                          <Chip
                            label={item.category}
                            size="small"
                            variant="outlined"
                          />
                          <Typography variant="caption" color="text.secondary">
                            {item.count} times
                          </Typography>
                        </div>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Sentiment Analysis */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={4}>
          <Card>
            <CardHeader
              title="User Sentiment Analysis"
              subheader="Overall user satisfaction trends"
            />
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <Typography variant="body2">Positive</Typography>
                  </div>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {mockData.userSentimentAnalysis.positive}%
                  </Typography>
                </div>
                <LinearProgress
                  variant="determinate"
                  value={mockData.userSentimentAnalysis.positive}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#10B981',
                    },
                  }}
                />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-400" />
                    <Typography variant="body2">Neutral</Typography>
                  </div>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {mockData.userSentimentAnalysis.neutral}%
                  </Typography>
                </div>
                <LinearProgress
                  variant="determinate"
                  value={mockData.userSentimentAnalysis.neutral}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#6B7280',
                    },
                  }}
                />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <Typography variant="body2">Negative</Typography>
                  </div>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {mockData.userSentimentAnalysis.negative}%
                  </Typography>
                </div>
                <LinearProgress
                  variant="determinate"
                  value={mockData.userSentimentAnalysis.negative}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#EF4444',
                    },
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </Grid>

        {/* Real-time Activity Feed */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardHeader
              title="Real-time Activity Feed"
              subheader="Live system events and user interactions"
              action={
                <Chip
                  label="Live"
                  color="success"
                  size="small"
                  variant="outlined"
                />
              }
            />
            <CardContent>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {[
                  {
                    type: 'conversation',
                    user: 'Student #1234',
                    action: 'Started new conversation about admissions',
                    time: '2 min ago',
                    icon: <ChatIcon className="w-4 h-4" />,
                  },
                  {
                    type: 'completion',
                    user: 'System',
                    action:
                      'Successfully resolved 15 queries in Computer Science category',
                    time: '5 min ago',
                    icon: <SuccessIcon className="w-4 h-4" />,
                  },
                  {
                    type: 'user',
                    user: 'Student #5678',
                    action: 'Provided 5-star feedback for response quality',
                    time: '8 min ago',
                    icon: <PeopleIcon className="w-4 h-4" />,
                  },
                  {
                    type: 'alert',
                    user: 'System',
                    action:
                      'Response time exceeded threshold for Engineering category',
                    time: '12 min ago',
                    icon: <ErrorIcon className="w-4 h-4" />,
                  },
                  {
                    type: 'conversation',
                    user: 'Student #9012',
                    action: 'Asked about scholarship opportunities',
                    time: '15 min ago',
                    icon: <ChatIcon className="w-4 h-4" />,
                  },
                ].map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg bg-gray-50"
                  >
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor:
                          activity.type === 'conversation'
                            ? '#E0F2FE'
                            : activity.type === 'completion'
                              ? '#ECFDF5'
                              : activity.type === 'user'
                                ? '#F3E8FF'
                                : '#FEF3C7',
                      }}
                    >
                      {activity.icon}
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {activity.user}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {activity.time}
                        </Typography>
                      </div>
                      <Typography variant="body2" color="text.secondary">
                        {activity.action}
                      </Typography>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Analytics
