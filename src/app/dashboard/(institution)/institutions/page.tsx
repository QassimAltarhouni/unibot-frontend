'use client'
import useMutateApi from '@/Hooks/useMutateApi'
import { useEffect, useState } from 'react'
import { Grid } from '@mui/system'
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Tooltip,
  Snackbar,
  Alert,
  Menu,
  MenuItem,
  Box,
  useTheme,
} from '@mui/material'
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  Add as AddIcon,
} from '@mui/icons-material'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { getCookie } from 'cookies-next'

const Institutions = () => {
  const [institutions, setInstitutions] = useState<any[]>([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedInstitution, setSelectedInstitution] = useState<any>(null)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  })
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [menuInstitution, setMenuInstitution] = useState<any>(null)

  const router = useRouter()
  const theme = useTheme()

  const [getInstitutions, institutionsLoading] = useMutateApi({
    apiPath: `/category/get-Categories`,
    method: 'GET',
  })

  const [deleteInstitution, deleteLoading] = useMutateApi({
    apiPath: `/category/delete-Category-by-id`,
    method: 'DELETE',
  })

  const fetchData = async () => {
    const getInstitutionsResponse = await getInstitutions({})

    if (getInstitutionsResponse.error === null) {
      setInstitutions(getInstitutionsResponse.data)
    }
  }

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    institution: any,
  ) => {
    setAnchorEl(event.currentTarget)
    setMenuInstitution(institution)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setMenuInstitution(null)
  }

  const handleDeleteClick = (institution: any) => {
    setSelectedInstitution(institution)
    setDeleteDialogOpen(true)
    handleMenuClose()
  }

  const handleDeleteConfirm = async () => {
    if (!selectedInstitution) {
      return
    }

    try {
      const token = getCookie('accessToken')
      const apiUrl =
        process.env.NEXT_PUBLIC_REACT_APP_API_URL ||
        'http://localhost:5000/api/v1'

      const response = await axios.delete(
        `${apiUrl}/category/delete-Category-by-id/${selectedInstitution._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      )

      if (response.status === 200) {
        setSnackbar({
          open: true,
          message: 'Category deleted successfully!',
          severity: 'success',
        })
        await fetchData()
      } else {
        setSnackbar({
          open: true,
          message: 'Failed to delete category. Please try again.',
          severity: 'error',
        })
      }
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: 'An unexpected error occurred while deleting the category.',
        severity: 'error',
      })
    }

    setDeleteDialogOpen(false)
    setSelectedInstitution(null)
  }

  const handleEditClick = (institution: any) => {
    router.push(`/dashboard/edit-institution/${institution._id}`)
    handleMenuClose()
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              color: 'text.primary',
              fontWeight: 'bold',
              mb: 1,
            }}
          >
            Institution Categories
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Manage your UniBot institution categories and configurations
          </Typography>
        </Box>
        <Link href={'/dashboard/add-institution'}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              bgcolor: 'primary.main',
              '&:hover': { bgcolor: 'primary.dark' },
              boxShadow: theme.shadows[4],
            }}
          >
            Add Category
          </Button>
        </Link>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              borderLeft: 4,
              borderLeftColor: 'primary.main',
              bgcolor: 'background.paper',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                sx={{ color: 'primary.main', fontWeight: 'bold' }}
              >
                {institutions.length}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Total Categories
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              borderLeft: 4,
              borderLeftColor: 'success.main',
              bgcolor: 'background.paper',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                sx={{ color: 'success.main', fontWeight: 'bold' }}
              >
                {institutions.filter((inst) => inst.status === 'active')
                  .length || institutions.length}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Active Categories
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              borderLeft: 4,
              borderLeftColor: 'info.main',
              bgcolor: 'background.paper',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                sx={{ color: 'info.main', fontWeight: 'bold' }}
              >
                {institutions.reduce(
                  (acc, inst) => acc + (inst.systemPrompt?.length || 0),
                  0,
                )}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Total Prompt Characters
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {institutionsLoading && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 256,
          }}
        >
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Loading categories...
          </Typography>
        </Box>
      )}

      {!institutionsLoading && institutions.length === 0 && (
        <Card sx={{ bgcolor: 'background.paper' }}>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" sx={{ color: 'text.secondary', mb: 2 }}>
              No categories found
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
              Create your first institution category to get started
            </Typography>
            <Link href={'/dashboard/add-institution'}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                sx={{
                  bgcolor: 'primary.main',
                  '&:hover': { bgcolor: 'primary.dark' },
                }}
              >
                Add Your First Category
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      <Grid container spacing={3}>
        {institutions.map((institution) => (
          <Grid size={{ xs: 12, md: 6, lg: 4 }} key={institution._id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: 'background.paper',
                border: 1,
                borderColor: 'divider',
                transition: 'box-shadow 0.3s',
                '&:hover': {
                  boxShadow: theme.shadows[8],
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 'bold',
                      color: 'text.primary',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      flexGrow: 1,
                    }}
                  >
                    {institution.title}
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      ml: 2,
                    }}
                  >
                    <Chip
                      label="Active"
                      size="small"
                      sx={{
                        bgcolor: 'success.light',
                        color: 'success.contrastText',
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, institution)}
                      sx={{
                        color: 'text.secondary',
                        '&:hover': { color: 'text.primary' },
                      }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Box>
                </Box>

                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    mb: 3,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {institution.description}
                </Typography>

                <Box sx={{ space: 3 }}>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: 'action.hover',
                      borderRadius: 1,
                      mb: 2,
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'text.secondary',
                        fontWeight: 'medium',
                        textTransform: 'uppercase',
                        letterSpacing: 0.5,
                      }}
                    >
                      System Prompt
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.primary',
                        mt: 0.5,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {institution.systemPrompt}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'text.secondary',
                        textTransform: 'uppercase',
                        fontWeight: 'medium',
                      }}
                    >
                      Website:
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'primary.main',
                        cursor: 'pointer',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        '&:hover': { color: 'primary.dark' },
                      }}
                      onClick={() =>
                        window.open(
                          institution.url.startsWith('http')
                            ? institution.url
                            : `https://${institution.url}`,
                          '_blank',
                        )
                      }
                    >
                      {institution.url}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>

              <CardActions
                sx={{
                  p: 3,
                  pt: 0,
                  display: 'flex',
                  justifyContent: 'space-between',
                  bgcolor: 'action.hover',
                }}
              >
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<VisibilityIcon />}
                  onClick={() =>
                    window.open(
                      institution.url.startsWith('http')
                        ? institution.url
                        : `https://${institution.url}`,
                      '_blank',
                    )
                  }
                  sx={{
                    bgcolor: 'primary.main',
                    '&:hover': { bgcolor: 'primary.dark' },
                  }}
                >
                  Visit
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 3,
          sx: {
            minWidth: 140,
            bgcolor: 'background.paper',
            border: 1,
            borderColor: 'divider',
          },
        }}
      >
        <MenuItem
          onClick={() => handleEditClick(menuInstitution)}
          sx={{
            color: 'text.primary',
            '&:hover': { bgcolor: 'action.hover' },
          }}
        >
          <EditIcon fontSize="small" sx={{ mr: 2 }} />
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => handleDeleteClick(menuInstitution)}
          sx={{
            color: 'error.main',
            '&:hover': { bgcolor: 'action.hover' },
          }}
        >
          <DeleteIcon fontSize="small" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Menu>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: 'background.paper',
          },
        }}
      >
        <DialogTitle sx={{ color: 'error.main' }}>Delete Category</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'text.secondary' }}>
            Are you sure you want to delete &ldquo;{selectedInstitution?.title}
            &rdquo;? This action cannot be undone and will permanently remove
            the category and its associated configuration.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ color: 'text.secondary' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            disabled={deleteLoading}
            sx={{
              bgcolor: 'error.main',
              '&:hover': { bgcolor: 'error.dark' },
            }}
          >
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default Institutions
