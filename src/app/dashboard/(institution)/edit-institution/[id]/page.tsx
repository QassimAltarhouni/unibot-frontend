'use client'
import { useForm, Controller } from 'react-hook-form'
import { useEffect, useState } from 'react'
import {
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  InputAdornment,
  Skeleton,
} from '@mui/material'
import SchoolIcon from '@mui/icons-material/School'
import DescriptionIcon from '@mui/icons-material/Description'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import LanguageIcon from '@mui/icons-material/Language'
import DataObjectIcon from '@mui/icons-material/DataObject'
import SaveIcon from '@mui/icons-material/Save'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import useMutateApi from '@/Hooks/useMutateApi'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

type TEditInstitutionForm = {
  title: string
  description: string
  systemPrompt: string
  data: string
  url: string
}

const EditInstitution = () => {
  const router = useRouter()
  const params = useParams()
  const institutionId = params?.id as string

  const [isLoading, setIsLoading] = useState(true)
  const [updateSuccess, setUpdateSuccess] = useState(false)

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TEditInstitutionForm>({
    defaultValues: {
      title: '',
      description: '',
      systemPrompt: '',
      data: '',
      url: '',
    },
  })

  const [getInstitution, getInstitutionLoading] = useMutateApi({
    apiPath: `/category/get-category-by-id/${institutionId}`,
    method: 'GET',
  })

  const [updateInstitution, updateInstitutionLoading] = useMutateApi({
    apiPath: `/category/edit-category-by-id/${institutionId}`,
    method: 'PUT',
  })

  useEffect(() => {
    const fetchInstitution = async () => {
      if (!institutionId) {
        setIsLoading(false)
        return
      }

      try {
        const response = await getInstitution({})

        if (response && response.error === null && response.data) {
          const institution = response.data

          setValue('title', institution.title || '')
          setValue('description', institution.description || '')
          setValue('systemPrompt', institution.systemPrompt || '')
          setValue('data', institution.data || '')
          setValue('url', institution.url || '')
        }
      } catch (error) {
        console.error('Error fetching institution:', error)
      }

      setIsLoading(false)
    }

    fetchInstitution()
  }, [institutionId, setValue])

  const onSubmit = async (data: TEditInstitutionForm) => {
    try {
      const updatePayload = {
        title: data.title,
        description: data.description,
        systemPrompt: data.systemPrompt,
        data: data.data,
        url: data.url,
      }

      const updateResponse = await updateInstitution(updatePayload)

      if (updateResponse && updateResponse.error === null) {
        setUpdateSuccess(true)
        setTimeout(() => {
          router.push('/dashboard/institutions')
        }, 1500)
      }
    } catch (error) {
      console.error('Update exception:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <Paper className="w-full max-w-md p-8 shadow-lg rounded-lg">
          <Skeleton variant="text" height={40} className="mb-4" />
          <Skeleton variant="text" height={20} className="mb-8" />
          <Skeleton variant="rectangular" height={56} className="mb-6" />
          <Skeleton variant="rectangular" height={120} className="mb-6" />
          <Skeleton variant="rectangular" height={160} className="mb-6" />
          <Skeleton variant="rectangular" height={120} className="mb-6" />
          <Skeleton variant="rectangular" height={56} className="mb-6" />
          <Skeleton variant="rectangular" height={48} />
        </Paper>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <Paper className="w-full max-w-md p-8 shadow-lg rounded-lg">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/dashboard/institutions">
            <Button
              variant="outlined"
              size="small"
              startIcon={<ArrowBackIcon />}
              className="border-gray-300 text-gray-600 hover:bg-gray-50"
            >
              Back
            </Button>
          </Link>
        </div>

        <div className="text-center mb-8">
          <Typography variant="h4" className="text-primary-700 font-bold mb-2">
            Edit Category
          </Typography>
          <Typography variant="body2" className="text-gray-600">
            Update the category information and settings
          </Typography>
        </div>

        {updateSuccess && (
          <Alert severity="success" className="mb-6">
            Category updated successfully! Redirecting...
          </Alert>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-y-6"
        >
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
                className="bg-white"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SchoolIcon className="text-gray-500" />
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
                className="bg-white"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <DescriptionIcon className="text-gray-500" />
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
                className="bg-white"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SmartToyIcon className="text-gray-500" />
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
                className="bg-white"
                placeholder="Enter additional category data or content..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <DataObjectIcon className="text-gray-500" />
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
                className="bg-white"
                placeholder="https://example.com"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LanguageIcon className="text-gray-500" />
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
            disabled={updateInstitutionLoading}
            startIcon={<SaveIcon />}
            className="bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-md shadow-md hover:shadow-lg transition-all duration-200"
          >
            {updateInstitutionLoading
              ? 'Updating Category...'
              : 'Update Category'}
          </Button>
        </form>
      </Paper>
    </div>
  )
}

export default EditInstitution
