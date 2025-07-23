'use client'
import { useForm, Controller } from 'react-hook-form'
import {
  TextField,
  Button,
  Typography,
  Paper,
  InputAdornment,
  Box,
} from '@mui/material'
import SchoolIcon from '@mui/icons-material/School'
import DescriptionIcon from '@mui/icons-material/Description'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import LanguageIcon from '@mui/icons-material/Language'
import DataObjectIcon from '@mui/icons-material/DataObject'
import useMutateApi from '@/Hooks/useMutateApi'
import { useRouter } from 'next/navigation'

type TAddInstitutionForm = {
  title: string
  description: string
  systemPrompt: string
  data: string
  url: string
}

const initialValues: TAddInstitutionForm = {
  title: '',
  description: '',
  systemPrompt: '',
  data: '',
  url: '',
}

const AddInstitution = () => {
  const router = useRouter()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: initialValues,
  })

  const [addInstitutions, institutionsLoading] = useMutateApi({
    apiPath: `/category/add-category`,
    method: 'POST',
  })

  const onSubmit = async (data: TAddInstitutionForm) => {
    const addInstitutionResponse = await addInstitutions(data)

    if (addInstitutionResponse.error === null) {
      router.push('/dashboard/institutions')
    }
  }
  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        py: 6,
        px: { xs: 2, sm: 3, lg: 4 },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Paper
        sx={{
          width: '100%',
          maxWidth: 400,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              color: 'primary.main',
              fontWeight: 'bold',
              mb: 1,
            }}
          >
            Add Category
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Create a new category for chatbot
          </Typography>
        </Box>

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
        >
          {' '}
          <Controller
            name="title"
            control={control}
            rules={{
              required: 'Title is required',
              minLength: {
                value: 2,
                message: 'Title must be at least 2 characters',
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Institution Title"
                variant="outlined"
                fullWidth
                error={!!errors.title}
                helperText={errors.title?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SchoolIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
          <Controller
            name="description"
            control={control}
            rules={{
              required: 'Description is required',
              minLength: {
                value: 10,
                message: 'Description must be at least 10 characters',
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Description"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                error={!!errors.description}
                helperText={errors.description?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <DescriptionIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
          <Controller
            name="systemPrompt"
            control={control}
            rules={{
              required: 'System prompt is required',
              minLength: {
                value: 20,
                message: 'System prompt must be at least 20 characters',
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="System Prompt"
                variant="outlined"
                fullWidth
                multiline
                rows={6}
                error={!!errors.systemPrompt}
                helperText={errors.systemPrompt?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SmartToyIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
          <Controller
            name="data"
            control={control}
            rules={{
              required: 'Data is required',
              minLength: {
                value: 10,
                message: 'Data must be at least 10 characters',
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Category Data"
                variant="outlined"
                fullWidth
                multiline
                rows={5}
                error={!!errors.data}
                helperText={errors.data?.message}
                placeholder="Enter additional category data or content..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <DataObjectIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
          <Controller
            name="url"
            control={control}
            rules={{
              required: 'URL is required',
              pattern: {
                value:
                  /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                message: 'Please enter a valid URL',
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Website URL"
                variant="outlined"
                fullWidth
                error={!!errors.url}
                helperText={errors.url?.message}
                placeholder="https://example.com"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LanguageIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />{' '}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            disabled={institutionsLoading}
            sx={{
              py: 1.5,
              mt: 2,
              fontWeight: 'bold',
              textTransform: 'none',
              fontSize: '1rem',
            }}
          >
            {institutionsLoading ? 'Adding Institution...' : 'Add Institution'}
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}

export default AddInstitution
